import { PredictionMarketExchange, MarketFilterParams, ExchangeCredentials } from '../BaseExchange';
import { UnifiedMarket, OrderBook, Order, Balance, CreateOrderParams } from '../types';
import { fetchMarkets } from './fetchMarkets';
import { searchMarkets } from './searchMarkets';
import { fetchOrderBook } from './fetchOrderBook';
import { OpinionAuth } from './auth';
import axios from 'axios';

const BASE_URL = 'https://proxy.opinion.trade:8443';

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
    } // <-- Added missing closing brace here

    async createOrder(params: CreateOrderParams): Promise<Order> {
        if (!this.auth) throw new Error("Credentials required for createOrder");

        const salt = Math.floor(Math.random() * 1000000);
        
        // 1. Prepare the raw order for signing
        const orderData = {
            user: this.auth.getAddress(),
            tokenId: params.marketId, 
            price: (params.price! * 1e6).toString(), // Assuming 6 decimals like USDC
            amount: (params.amount * 1e6).toString(),
            side: params.side === 'buy' ? 0 : 1,
            salt: salt
        };

        // 2. Sign using EIP-712
        const signature = await this.auth.signOrder(orderData);

        // 3. Post to Opinion API
        const response = await axios.post(`${BASE_URL}/v1/order`, {
            ...orderData,
            signature
        });

        return {
            id: response.data.result.order_id,
            marketId: params.marketId,
            outcomeId: params.outcomeId,
            side: params.side,
            type: 'limit',
            price: params.price,
            amount: params.amount,
            status: 'open',
            filled: 0,
            remaining: params.amount,
            timestamp: Date.now()
        };
    }

    async fetchBalance(): Promise<Balance[]> {
        if (!this.auth) throw new Error("Credentials required for fetchBalance");
        
        const address = this.auth.getAddress();
        const response = await axios.get(`${BASE_URL}/v1/balance`, {
            params: { address }
        });

        // Mapping to Unified Balance type
        return [{
            currency: 'USDC',
            total: parseFloat(response.data.result.total),
            available: parseFloat(response.data.result.available),
            locked: parseFloat(response.data.result.locked)
        }];
    }
}
