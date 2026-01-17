// src/exchanges/opiniontrade/index.ts
import axios from 'axios';
import { PredictionMarketExchange, MarketFilterParams, ExchangeCredentials } from '../../BaseExchange';
import { UnifiedMarket, OrderBook } from '../../types';
import { OpinionMarket, OpinionResponse, OpinionOrderBook } from './types';
import { normalizeMarket } from './utils';

export class OpinionTradeExchange extends PredictionMarketExchange {
    private readonly baseUrl = 'https://proxy.opinion.trade:8443';

    constructor(credentials?: ExchangeCredentials) {
        super(credentials);
    }

    get name(): string {
        return 'Opinion.trade';
    }

    /**
     * Maps to GET /v1/markets
     */
    async fetchMarkets(params?: MarketFilterParams): Promise<UnifiedMarket[]> {
        const response = await axios.get<OpinionResponse<OpinionMarket[]>>(`${this.baseUrl}/v1/markets`, {
            params: {
                limit: params?.limit || 100,
                offset: params?.offset || 0
            }
        });

        if (response.data.code !== 200) throw new Error(`Opinion API Error: ${response.data.msg}`);
        
        return response.data.result.map(normalizeMarket);
    }

    async searchMarkets(query: string, params?: MarketFilterParams): Promise<UnifiedMarket[]> {
        // Opinion uses a title search query parameter on the markets endpoint
        const response = await axios.get<OpinionResponse<OpinionMarket[]>>(`${this.baseUrl}/v1/markets`, {
            params: {
                search: query,
                limit: params?.limit
            }
        });
        return response.data.result.map(normalizeMarket);
    }

    /**
     * Maps to GET /v1/orderbook
     */
    async fetchOrderBook(id: string): Promise<OrderBook> {
        const response = await axios.get<OpinionResponse<OpinionOrderBook>>(`${this.baseUrl}/v1/orderbook`, {
            params: { token_id: id }
        });

        const data = response.data.result;
        return {
            bids: data.bids.map(([price, size]) => ({ price: parseFloat(price), size: parseFloat(size) })),
            asks: data.asks.map(([price, size]) => ({ price: parseFloat(price), size: parseFloat(size) })),
            timestamp: data.timestamp
        };
    }
}
