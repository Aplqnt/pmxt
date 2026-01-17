import { Wallet } from 'ethers';
import { ExchangeCredentials } from '../BaseExchange';

const OPINION_CHAIN_ID = 56; 

export class OpinionAuth {
    private signer: Wallet;

    constructor(credentials: ExchangeCredentials) {
        if (!credentials.privateKey) {
            throw new Error('Opinion.trade requires a privateKey for trading operations.');
        }
        this.signer = new Wallet(credentials.privateKey);
    }

    getAddress(): string {
        return this.signer.address;
    }

    async signOrder(order: any): Promise<string> {
        const domain = {
            name: "OpinionTrade",
            version: "1",
            chainId: OPINION_CHAIN_ID,
            verifyingContract: "0x0000000000000000000000000000000000000000" // Update with real contract
        };

        const types = {
            Order: [
                { name: 'user', type: 'address' },
                { name: 'tokenId', type: 'uint256' },
                { name: 'price', type: 'uint256' },
                { name: 'amount', type: 'uint256' },
                { name: 'side', type: 'uint8' }, 
                { name: 'salt', type: 'uint256' }
            ]
        };

        return this.signer._signTypedData(domain, types, order);
    }
}
