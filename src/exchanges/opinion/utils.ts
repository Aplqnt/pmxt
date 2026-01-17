import { UnifiedMarket, MarketOutcome } from '../types';
import { OpinionMarket } from './types';

export function normalizeMarket(m: OpinionMarket): UnifiedMarket {
    const outcomes: MarketOutcome[] = [
        {
            id: m.tokens.yes.id,
            label: 'Yes',
            price: parseFloat(m.tokens.yes.price)
        },
        {
            id: m.tokens.no.id,
            label: 'No',
            price: parseFloat(m.tokens.no.price)
        }
    ];

    return {
        id: m.id,
        title: m.title,
        description: m.description,
        outcomes,
        resolutionDate: new Date(m.resolution_time * 1000),
        volume24h: parseFloat(m.volume_24h),
        liquidity: parseFloat(m.liquidity),
        url: `https://opinion.trade/markets/${m.id}`,
        image: m.image_url,
        category: m.category
    };
}
