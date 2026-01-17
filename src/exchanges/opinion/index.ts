import { PredictionMarketExchange, MarketFilterParams, ExchangeCredentials } from '../../BaseExchange';
import { UnifiedMarket, OrderBook } from '../../types';
import { fetchMarkets } from './fetchMarkets';
import { searchMarkets } from './searchMarkets';
import { fetchOrderBook } from './fetchOrderBook';
import { OpinionAuth } from './auth';

export class OpinionTradeExchange extends PredictionMarketExchange {
    private auth?: OpinionAuth;

    constructor(credentials?: ExchangeCredentials) {
        super(credentials);
        if (credentials?.privateKey) {
            this.auth = new OpinionAuth(credentials);
        }
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
