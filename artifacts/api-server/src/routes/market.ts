import { Router, type IRouter } from "express";
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

const assets = [
  { symbol: "BTC", name: "Bitcoin", price: 113240.18, change24h: 3.82, volume24h: "$48.6B", marketCap: "$2.24T", high24h: 114120, low24h: 108940, accent: "#C9F64A", sparkline: [52, 48, 51, 47, 56, 54, 63, 59, 68, 72, 70, 81] },
  { symbol: "SOL", name: "Solana", price: 201.42, change24h: 4.21, volume24h: "$6.2B", marketCap: "$97.1B", high24h: 205.12, low24h: 190.84, accent: "#70E1D2", sparkline: [45, 53, 48, 57, 55, 61, 58, 68, 65, 75, 71, 82] },
  { symbol: "ETH", name: "Ethereum", price: 4182.64, change24h: 2.14, volume24h: "$25.8B", marketCap: "$504.2B", high24h: 4228, low24h: 4031, accent: "#A7B1FF", sparkline: [63, 60, 64, 58, 62, 69, 67, 71, 68, 75, 73, 78] },
  { symbol: "XRP", name: "XRP", price: 2.91, change24h: -0.72, volume24h: "$4.1B", marketCap: "$169.4B", high24h: 3.08, low24h: 2.84, accent: "#FFB86B", sparkline: [74, 78, 71, 75, 68, 70, 64, 69, 61, 66, 59, 57] },
  { symbol: "DOGE", name: "Dogecoin", price: 0.2841, change24h: 5.12, volume24h: "$3.4B", marketCap: "$42.1B", high24h: 0.291, low24h: 0.262, accent: "#D7C17A", sparkline: [41, 44, 48, 45, 54, 52, 61, 59, 70, 66, 76, 84] },
  { symbol: "ADA", name: "Cardano", price: 0.84, change24h: -1.83, volume24h: "$1.1B", marketCap: "$29.8B", high24h: 0.87, low24h: 0.81, accent: "#7DB5FF", sparkline: [71, 68, 72, 64, 67, 62, 65, 58, 60, 54, 56, 51] },
];

const news = [
  { id: "btc-etf-inflows", title: "Bitcoin breaks $113K as ETF inflows accelerate", content: "Spot Bitcoin ETFs posted their strongest inflow streak in three weeks as institutional demand returned to the market.", source: "Coinness Wire", publishedAt: "2026-08-24T09:57:00Z", relativeTime: "3 min ago", categories: ["MARKET", "ETF"], relatedSymbols: ["BTC"], importance: "breaking" as const, priceChange: 3.82, impactScore: 92, volumeChange: 126 },
  { id: "sol-network-growth", title: "Solana activity climbs as on-chain volume hits quarterly high", content: "Solana daily active addresses and DEX volume both moved higher this week as traders rotated into high-beta assets.", source: "Blockwire", publishedAt: "2026-08-24T09:34:00Z", relativeTime: "26 min ago", categories: ["MARKET", "ALTCOIN"], relatedSymbols: ["SOL"], importance: "high" as const, priceChange: 4.21, impactScore: 78, volumeChange: 84 },
  { id: "fed-liquidity-watch", title: "Markets watch Fed liquidity signal ahead of Jackson Hole remarks", content: "Crypto traders are tracking the latest liquidity language from policymakers as risk assets hold near monthly highs.", source: "Macro Desk", publishedAt: "2026-08-24T08:51:00Z", relativeTime: "1 hr ago", categories: ["MACRO", "MARKET"], relatedSymbols: ["BTC", "ETH"], importance: "high" as const, priceChange: 1.64, impactScore: 71, volumeChange: 42 },
  { id: "eth-staking-record", title: "Ethereum staking deposits reach a new all-time high", content: "The amount of ETH locked in staking contracts expanded again this month, tightening liquid supply.", source: "Chain Signal", publishedAt: "2026-08-24T07:42:00Z", relativeTime: "2 hr ago", categories: ["MARKET", "DEFI"], relatedSymbols: ["ETH"], importance: "standard" as const, priceChange: 2.14, impactScore: 64, volumeChange: 37 },
];

router.get("/news", (_req, res) => {
  res.json(GetNewsResponse.parse(news));
});

router.get("/news/breaking", (_req, res) => {
  res.json(GetBreakingNewsResponse.parse(news.filter((item) => item.importance === "breaking")));
});

router.get("/news/coin/:symbol", (req, res) => {
  const { symbol } = GetNewsByCoinParams.parse(req.params);
  res.json(GetNewsByCoinResponse.parse(news.filter((item) => item.relatedSymbols.includes(symbol.toUpperCase()))));
});

router.get("/news/:id/impact", (req, res) => {
  const { id } = GetNewsImpactParams.parse(req.params);
  const item = news.find((newsItem) => newsItem.id === id);
  if (!item) return res.status(404).json({ message: "News item not found" });
  return res.json(GetNewsImpactResponse.parse({ newsId: item.id, score: item.impactScore, priceChange: item.priceChange, volumeChange: item.volumeChange }));
});

router.get("/news/:id", (req, res) => {
  const { id } = GetNewsByIdParams.parse(req.params);
  const item = news.find((newsItem) => newsItem.id === id);
  if (!item) return res.status(404).json({ message: "News item not found" });
  return res.json(GetNewsByIdResponse.parse(item));
});

router.get("/market/overview", (_req, res) => {
  res.json(GetMarketOverviewResponse.parse({
    assets,
    sentiment: { score: 78, label: "GREED", change: 6.4 },
    totalMarketCap: "$3.18T",
    totalVolume: "$118.4B",
    btcDominance: "58.7%",
    updatedAt: "Just now",
  }));
});

router.get("/market/movers", (_req, res) => {
  res.json(GetMarketMoversResponse.parse({
    gainers: [...assets].sort((first, second) => second.change24h - first.change24h).slice(0, 3),
    losers: [...assets].sort((first, second) => first.change24h - second.change24h).slice(0, 3),
  }));
});

router.get("/market/sentiment", (_req, res) => {
  res.json(GetMarketSentimentResponse.parse({ score: 78, label: "GREED", change: 6.4 }));
});

router.get("/market/:symbol", (req, res) => {
  const { symbol } = GetMarketAssetParams.parse(req.params);
  const asset = assets.find((marketAsset) => marketAsset.symbol === symbol.toUpperCase());
  if (!asset) return res.status(404).json({ message: "Market asset not found" });
  return res.json(GetMarketAssetResponse.parse(asset));
});

export default router;