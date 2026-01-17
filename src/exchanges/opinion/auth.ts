import { Wallet } from 'ethers';
import { ExchangeCredentials } from '../../BaseExchange';

const OPINION_CHAIN_ID = 56; // BNB Mainnet

export class OpinionAuth {
    private signer: Wallet;

    constructor(credentials: ExchangeCredentials) {
        if (!credentials.privateKey) {
            throw new Error('Opinion.trade requires a privateKey for trading operations.');
        }
        this.signer = new Wallet(credentials.privateKey);
    }

    /**
     * Get the signer's address.
     */
    getAddress(): string {
        return this.signer.address;
    }

    /**
     * Signs an order using EIP-712.
     * Note: You will need to fill in the exact contract address and types 
     * from the Opinion.trade API documentation.
     */
    async signOrder(order: any): Promise<string> {
        const domain = {
            name: "OpinionTrade",
            version: "1",
            chainId: OPINION_CHAIN_ID,
            verifyingContract: "0x..." // Replace with the actual Exchange contract address
        };

        const types = {
            Order: [
                { name: 'user', type: 'address' },
                { name: 'tokenId', type: 'uint256' },
                { name: 'price', type: 'uint256' },
                { name: 'amount', type: 'uint256' },
                { name: 'side', type: 'uint8' }, // 0 for Buy, 1 for Sell
                { name: 'salt', type: 'uint256' }
            ]
        };

        return this.signer._signTypedData(domain, types, order);
    }
}
