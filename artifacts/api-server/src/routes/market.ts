import { Router, type IRouter } from "express";
import { createHash } from "node:crypto";
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

type UpbitTicker = {
  market: string;
  trade_price: number;
  signed_change_rate: number;
  acc_trade_price_24h: number;
  high_price: number;
  low_price: number;
};

type UpbitCandle = { trade_price: number };

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

  const markets = assetMetadata.map((asset) => asset.market).join(",");
  const tickerResponse = await fetch(`https://api.upbit.com/v1/ticker?markets=${encodeURIComponent(markets)}`);
  if (!tickerResponse.ok) throw new Error(`Upbit 시세를 불러오지 못했습니다 (${tickerResponse.status}).`);
  const tickers = await tickerResponse.json() as UpbitTicker[];

  const tickersByMarket = new Map(tickers.map((ticker) => [ticker.market, ticker]));
  const candleData = await Promise.all(assetMetadata.map(async (asset) => {
    const response = await fetch(`https://api.upbit.com/v1/candles/minutes/60?market=${asset.market}&count=12`);
    if (!response.ok) throw new Error(`Upbit 차트 데이터를 불러오지 못했습니다 (${response.status}).`);
    const candles = await response.json() as UpbitCandle[];
    return [asset.market, candles.reverse().map((candle) => candle.trade_price)] as const;
  }));
  const candleByMarket = new Map(candleData);

  const value = assetMetadata.map((metadata) => {
    const ticker = tickersByMarket.get(metadata.market);
    if (!ticker) throw new Error(`${metadata.symbol} 시세가 Upbit 응답에 없습니다.`);
    return {
      symbol: metadata.symbol,
      name: metadata.name,
      price: ticker.trade_price,
      change24h: Number((ticker.signed_change_rate * 100).toFixed(2)),
      volume24h: formatKrw(ticker.acc_trade_price_24h),
      marketCap: "Upbit 미제공",
      high24h: ticker.high_price,
      low24h: ticker.low_price,
      sparkline: candleByMarket.get(metadata.market) ?? [ticker.trade_price],
      accent: metadata.accent,
    };
  });
  cachedAssets = { value, expiresAt: Date.now() + 15_000 };
  return value;
}

async function getLiveNews(): Promise<LiveNewsItem[]> {
  if (cachedNews && cachedNews.expiresAt > Date.now()) return cachedNews.value;

  const response = await fetch("https://www.blockmedia.co.kr/feed", {
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
  const message = error instanceof Error ? error.message : "외부 시장 데이터를 불러오지 못했습니다.";
  res.status(502).json({ message });
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