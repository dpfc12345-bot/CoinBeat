import { Router, type IRouter } from "express";
import { createHash } from "node:crypto";
import { fetchExternal } from "../lib/externalFetch";
import { logger } from "../lib/logger";
import {
  GetBreakingNewsResponse,
  GetMarketAssetParams,
  GetMarketAssetResponse,
  GetMarketMoversResponse,
  GetMarketOverviewResponse,
  GetMarketSentimentResponse,
  GetNewsByCoinParams,
  GetNewsByCoinResponse,
  GetNewsByIdParams,
  GetNewsByIdResponse,
  GetNewsImpactParams,
  GetNewsImpactResponse,
  GetNewsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const assetMetadata = [
  { symbol: "BTC", name: "비트코인", market: "KRW-BTC", accent: "#C9F64A" },
  { symbol: "ETH", name: "이더리움", market: "KRW-ETH", accent: "#A7B1FF" },
  { symbol: "SOL", name: "솔라나", market: "KRW-SOL", accent: "#70E1D2" },
  { symbol: "XRP", name: "XRP", market: "KRW-XRP", accent: "#FFB86B" },
  { symbol: "DOGE", name: "도지코인", market: "KRW-DOGE", accent: "#D7C17A" },
  { symbol: "ADA", name: "에이다", market: "KRW-ADA", accent: "#7DB5FF" },
] as const;

const fallbackAccents = ["#C9F64A", "#A7B1FF", "#70E1D2", "#FFB86B", "#D7C17A", "#7DB5FF", "#E8A8FF", "#85D4FF"];

type UpbitMarket = {
  market: string;
  korean_name: string;
  english_name: string;
};

type UpbitTicker = {
  market: string;
  trade_price: number;
  signed_change_rate: number;
  acc_trade_price_24h: number;
  high_price: number;
  low_price: number;
};

type LiveAsset = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  sparkline: number[];
  accent: string;
};

type LiveNewsItem = {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  relativeTime: string;
  categories: string[];
  relatedSymbols: string[];
  importance: "breaking" | "high" | "standard";
  priceChange: number;
  impactScore: number;
  volumeChange: number;
};

let cachedAssets: { expiresAt: number; value: LiveAsset[] } | undefined;
let assetRequestInFlight: Promise<LiveAsset[]> | undefined;
let cachedMarkets: { expiresAt: number; value: UpbitMarket[] } | undefined;
let cachedNews: { expiresAt: number; value: LiveNewsItem[] } | undefined;

function formatKrw(value: number) {
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function relativeTime(publishedAt: string) {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(publishedAt).getTime()) / 60_000));
  if (elapsedMinutes < 1) return "방금 전";
  if (elapsedMinutes < 60) return `${elapsedMinutes}분 전`;
  const hours = Math.floor(elapsedMinutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

async function getLiveAssets(): Promise<LiveAsset[]> {
  if (cachedAssets && cachedAssets.expiresAt > Date.now()) return cachedAssets.value;
  if (!assetRequestInFlight) {
    assetRequestInFlight = loadLiveAssets().finally(() => {
      assetRequestInFlight = undefined;
    });
  }
  return assetRequestInFlight;
}

async function loadLiveAssets(): Promise<LiveAsset[]> {
  const marketResponse = cachedMarkets && cachedMarkets.expiresAt > Date.now()
    ? undefined
    : await fetchExternal("https://api.upbit.com/v1/market/all?isDetails=false");
  if (marketResponse && !marketResponse.ok) {
    throw new Error(`Upbit 마켓 목록을 불러오지 못했습니다 (${marketResponse.status}).`);
  }
  const markets = cachedMarkets && cachedMarkets.expiresAt > Date.now()
    ? cachedMarkets.value
    : (await marketResponse!.json() as UpbitMarket[]).filter((market) => market.market.startsWith("KRW-"));
  if (markets.length === 0) throw new Error("Upbit KRW 마켓이 없습니다.");
  cachedMarkets = { value: markets, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };

  const marketChunks = Array.from({ length: Math.ceil(markets.length / 100) }, (_, index) => markets.slice(index * 100, (index + 1) * 100));
  const tickerChunks = await Promise.all(marketChunks.map(async (marketChunk) => {
    const marketList = marketChunk.map((market) => market.market).join(",");
    const tickerResponse = await fetchExternal(`https://api.upbit.com/v1/ticker?markets=${encodeURIComponent(marketList)}`);
    if (!tickerResponse.ok) throw new Error(`Upbit 시세를 불러오지 못했습니다 (${tickerResponse.status}).`);
    return tickerResponse.json() as Promise<UpbitTicker[]>;
  }));
  const tickers = tickerChunks.flat();

  const tickersByMarket = new Map(tickers.map((ticker) => [ticker.market, ticker]));
  const knownAccents: Record<string, string> = Object.fromEntries(assetMetadata.map((asset) => [asset.symbol, asset.accent]));
  const accentFor = (symbol: string) => {
    const knownAccent = knownAccents[symbol];
    if (knownAccent) return knownAccent;
    const hash = [...symbol].reduce((total, character) => total + character.charCodeAt(0), 0);
    return fallbackAccents[hash % fallbackAccents.length];
  };

  const value = markets
    .map((market) => {
      const ticker = tickersByMarket.get(market.market);
      if (!ticker) return null;
      const symbol = market.market.slice(4);
      const name = market.korean_name || market.english_name || symbol;
      return {
        symbol,
        name,
        price: ticker.trade_price,
        change24h: Number((ticker.signed_change_rate * 100).toFixed(2)),
        volume24h: formatKrw(ticker.acc_trade_price_24h),
        marketCap: "Upbit 미제공",
        high24h: ticker.high_price,
        low24h: ticker.low_price,
        // The ticker endpoint is enough for the fast overview. A two-point
        // sparkline keeps existing cards valid without one candle request per coin.
        sparkline: [ticker.trade_price, ticker.trade_price],
        accent: accentFor(symbol),
        volume: ticker.acc_trade_price_24h,
      };
    })
    .filter((asset): asset is LiveAsset & { volume: number } => Boolean(asset))
    .sort((first, second) => second.volume - first.volume)
    .map(({ volume: _volume, ...asset }) => asset);
  cachedAssets = { value, expiresAt: Date.now() + 15_000 };
  return value;
}

async function getLiveNews(): Promise<LiveNewsItem[]> {
  if (cachedNews && cachedNews.expiresAt > Date.now()) return cachedNews.value;

  const response = await fetchExternal("https://www.blockmedia.co.kr/feed", {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });
  if (!response.ok) throw new Error(`블록미디어 뉴스를 불러오지 못했습니다 (${response.status}).`);
  const xml = await response.text();
  const itemBlocks = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
  if (itemBlocks.length === 0) throw new Error("블록미디어 RSS 응답에 뉴스가 없습니다.");

  const extractTag = (block: string, tag: string) => {
    const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
    return decodeXml(match?.[1] ?? "");
  };
  const decodeXml = (value: string) => value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/\s+/g, " ")
    .trim();
  const relatedSymbols = (text: string) => {
    const symbols = [
      ["비트코인", "BTC"], ["bitcoin", "BTC"], ["이더리움", "ETH"], ["ethereum", "ETH"],
      ["솔라나", "SOL"], ["solana", "SOL"], ["리플", "XRP"], ["xrp", "XRP"],
      ["도지코인", "DOGE"], ["dogecoin", "DOGE"], ["에이다", "ADA"], ["cardano", "ADA"],
    ];
    return [...new Set(symbols.filter(([keyword]) => text.toLowerCase().includes(keyword)).map(([, symbol]) => symbol))];
  };

  const value: LiveNewsItem[] = itemBlocks.slice(0, 20).map((block, index) => {
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    if (!link) throw new Error("블록미디어 RSS 기사 링크가 없습니다.");
    const publishedAt = extractTag(block, "pubDate") || new Date().toISOString();
    const description = extractTag(block, "description") || title;
    const symbols = relatedSymbols(`${title} ${description}`);
    return {
      id: `blockmedia-${createHash("sha256").update(link).digest("base64url").slice(0, 20)}`,
      title,
      content: description,
      source: "블록미디어",
      sourceUrl: link,
      publishedAt: new Date(publishedAt).toISOString(),
      relativeTime: relativeTime(publishedAt),
      categories: [title.includes("시장") || title.includes("가격") ? "MARKET" : "NEWS"],
      relatedSymbols: symbols,
      importance: (index === 0 ? "breaking" : index < 4 ? "high" : "standard") as LiveNewsItem["importance"],
      priceChange: 0,
      impactScore: 0,
      volumeChange: 0,
    };
  });
  cachedNews = { value, expiresAt: Date.now() + 300_000 };
  return value;
}

function sendExternalDataError(res: Parameters<Parameters<IRouter["get"]>[1]>[1], error: unknown) {
  // Log full detail server-side only. Never forward it to the client: upstream
  // error text can include request URLs, hostnames, or (for API-key-protected
  // providers) query strings that must not leak to callers of this API.
  logger.error({ err: error }, "Failed to serve market data");
  const message = error instanceof Error ? error.message : "외부 시장 데이터를 불러오지 못했습니다.";
  const safeMessage = /^https?:\/\//i.test(message) || message.includes("key") || message.includes("token")
    ? "외부 시장 데이터를 불러오지 못했습니다."
    : message;
  res.status(502).json({ message: safeMessage });
}

router.get("/news", async (_req, res): Promise<void> => {
  try {
    res.json(GetNewsResponse.parse(await getLiveNews()));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/news/breaking", async (_req, res): Promise<void> => {
  try {
    res.json(GetBreakingNewsResponse.parse((await getLiveNews()).filter((item) => item.importance === "breaking")));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/news/coin/:symbol", async (req, res): Promise<void> => {
  try {
    const { symbol } = GetNewsByCoinParams.parse(req.params);
    res.json(GetNewsByCoinResponse.parse((await getLiveNews()).filter((item) => item.relatedSymbols.includes(symbol.toUpperCase()))));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/news/:id/impact", async (req, res): Promise<void> => {
  try {
    const { id } = GetNewsImpactParams.parse(req.params);
    const item = (await getLiveNews()).find((newsItem) => newsItem.id === id);
    if (!item) {
      res.status(404).json({ message: "News item not found" });
      return;
    }
    res.json(GetNewsImpactResponse.parse({ newsId: item.id, score: item.impactScore, priceChange: item.priceChange, volumeChange: item.volumeChange }));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/news/:id", async (req, res): Promise<void> => {
  try {
    const { id } = GetNewsByIdParams.parse(req.params);
    const item = (await getLiveNews()).find((newsItem) => newsItem.id === id);
    if (!item) {
      res.status(404).json({ message: "News item not found" });
      return;
    }
    res.json(GetNewsByIdResponse.parse(item));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/market/overview", async (_req, res): Promise<void> => {
  try {
    const assets = await getLiveAssets();
    res.json(GetMarketOverviewResponse.parse({
      assets,
      sentiment: { score: 50, label: "NEUTRAL", change: 0 },
      totalMarketCap: "Upbit 미제공",
      totalVolume: formatKrw(assets.reduce((total, asset) => total + Number(asset.volume24h.replace(/[^\d]/g, "")), 0)),
      btcDominance: "Upbit 미제공",
      updatedAt: "실시간",
    }));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/market/movers", async (_req, res): Promise<void> => {
  try {
    const assets = await getLiveAssets();
    res.json(GetMarketMoversResponse.parse({
      gainers: [...assets].sort((first, second) => second.change24h - first.change24h).slice(0, 3),
      losers: [...assets].sort((first, second) => first.change24h - second.change24h).slice(0, 3),
    }));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

router.get("/market/sentiment", (_req, res): void => {
  res.json(GetMarketSentimentResponse.parse({ score: 50, label: "NEUTRAL", change: 0 }));
});

router.get("/market/:symbol", async (req, res): Promise<void> => {
  try {
    const { symbol } = GetMarketAssetParams.parse(req.params);
    const asset = (await getLiveAssets()).find((marketAsset) => marketAsset.symbol === symbol.toUpperCase());
    if (!asset) {
      res.status(404).json({ message: "Market asset not found" });
      return;
    }
    res.json(GetMarketAssetResponse.parse(asset));
  } catch (error) {
    sendExternalDataError(res, error);
  }
});

export default router;