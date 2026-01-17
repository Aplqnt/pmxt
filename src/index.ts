// src/exchanges/index.ts
export * from './BaseExchange';
export * from './types';
export * from './polymarket';
export * from './kalshi';
export * from './opinion'; // Export the new folder

import { PolymarketExchange } from './polymarket';
import { KalshiExchange } from './kalshi';
import { OpinionTradeExchange } from './opinion';

const pmxt = {
    polymarket: PolymarketExchange,
    kalshi: KalshiExchange,
    opiniontrade: OpinionTradeExchange,
    Polymarket: PolymarketExchange,
    Kalshi: KalshiExchange,
    OpinionTrade: OpinionTradeExchange
};

export const polymarket = PolymarketExchange;
export const kalshi = KalshiExchange;
export const opiniontrade = OpinionTradeExchange;

export default pmxt;
