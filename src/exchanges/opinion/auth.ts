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
            // Replace with actual contract address from Opinion docs
            verifyingContract: "0x25aB3Efd52e6470681CE037cD546Dc60726948D3" 
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

        // Use _signTypedData for EIP-712 support in Ethers v5
        return this.signer._signTypedData(domain, types, order);
    }
}
