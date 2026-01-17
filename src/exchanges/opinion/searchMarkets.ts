import axios from 'axios';
import { MarketFilterParams } from '../BaseExchange';
import { UnifiedMarket } from '../types';
import { OpinionMarket, OpinionResponse } from './types';
import { normalizeMarket } from './utils';

const BASE_URL = 'https://proxy.opinion.trade:8443';

export async function searchMarkets(query: string, params?: MarketFilterParams): Promise<UnifiedMarket[]> {
    const response = await axios.get<OpinionResponse<OpinionMarket[]>>(`${BASE_URL}/v1/markets`, {
        params: {
            search: query,
            limit: params?.limit
        }
    });
    return response.data.result.map(normalizeMarket);
}
