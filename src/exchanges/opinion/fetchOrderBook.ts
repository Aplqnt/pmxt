import axios from 'axios';
import { OrderBook } from '../types';
import { OpinionOrderBook, OpinionResponse } from './types';

const BASE_URL = 'https://proxy.opinion.trade:8443';

export async function fetchOrderBook(id: string): Promise<OrderBook> {
    const response = await axios.get<OpinionResponse<OpinionOrderBook>>(`${BASE_URL}/v1/orderbook`, {
        params: { token_id: id }
    });

    const data = response.data.result;
    return {
        bids: data.bids.map(([price, size]) => ({ price: parseFloat(price), size: parseFloat(size) })),
        asks: data.asks.map(([price, size]) => ({ price: parseFloat(price), size: parseFloat(size) })),
        timestamp: data.timestamp
    };
}
