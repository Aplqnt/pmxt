import axios from 'axios';
import { MarketFilterParams } from '../../BaseExchange';
import { UnifiedMarket } from '../../types';
import { OpinionMarket, OpinionResponse } from './types';
import { normalizeMarket } from './utils';

const BASE_URL = 'https://proxy.opinion.trade:8443';

export async function fetchMarkets(params?: MarketFilterParams): Promise<UnifiedMarket[]> {
    const response = await axios.get<OpinionResponse<OpinionMarket[]>>(`${BASE_URL}/v1/markets`, {
        params: {
            limit: params?.limit || 100,
            offset: params?.offset || 0
        }
    });

    if (response.data.code !== 200) {
        throw new Error(`Opinion API Error: ${response.data.msg}`);
    }

    return response.data.result.map(normalizeMarket);
}
