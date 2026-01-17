import { PredictionMarketExchange, MarketFilterParams, ExchangeCredentials } from '../BaseExchange';
import { UnifiedMarket, OrderBook } from '../types';
import { fetchMarkets } from './fetchMarkets';
import { searchMarkets } from './searchMarkets';
import { fetchOrderBook } from './fetchOrderBook';

export class OpinionTradeExchange extends PredictionMarketExchange {
    constructor(credentials?: ExchangeCredentials) {
        super(credentials);
    }

    get name(): string {
        return 'Opinion.trade';
    }

    async fetchMarkets(params?: MarketFilterParams): Promise<UnifiedMarket[]> {
        return fetchMarkets(params);
    }

    async searchMarkets(query: string, params?: MarketFilterParams): Promise<UnifiedMarket[]> {
        return searchMarkets(query, params);
    }

    async fetchOrderBook(id: string): Promise<OrderBook> {
        return fetchOrderBook(id);
    }
}
