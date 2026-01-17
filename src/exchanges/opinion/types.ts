// src/exchanges/opiniontrade/types.ts

export interface OpinionMarket {
    id: string;
    title: string;
    description: string;
    category: string;
    resolution_time: number;
    volume_24h: string;
    liquidity: string;
    image_url: string;
    tokens: {
        yes: { id: string; symbol: string; price: string };
        no: { id: string; symbol: string; price: string };
    };
}

export interface OpinionOrderBook {
    bids: [string, string][]; // [price, size]
    asks: [string, string][]; // [price, size]
    timestamp: number;
}

export interface OpinionResponse<T> {
    code: number;
    msg: string;
    result: T;
}
