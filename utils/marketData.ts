// utils/marketData.ts
import axios from 'axios';

export async function fetchCoinGeckoPrices(symbols: string[]): Promise<Record<string, number>> {
  // Map symbols to CoinGecko IDs
  const symbolToId: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    SOL: 'solana',
    USD: 'usd',
    EUR: 'eur',
    // Add more as needed
  };
  const ids = symbols.map(s => symbolToId[s]).filter(Boolean).join(',');
  if (!ids) return {};
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,eur`;
  const res = await axios.get(url);
  // Map back to symbol: priceUSD
  const prices: Record<string, number> = {};
  for (const symbol of symbols) {
    const id = symbolToId[symbol];
    if (res.data[id]) {
      prices[symbol] = res.data[id].usd;
    }
  }
  return prices;
}
