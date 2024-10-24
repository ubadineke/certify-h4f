import { ethers, JsonRpcProvider, Log } from 'ethers';

const provider = new JsonRpcProvider('https://rpc.sepolia-api.lisk.com');

const contract = require('../../artifacts/contracts/myNFT.sol/MyNFT.json');

const privateKey: string = process.env.WALLET_KEY as string;
const signer = new ethers.Wallet(privateKey, provider);

const abi = contract.abi;

const contractAddress = '0x574CFDD4109eB6b95Ab14124107E5c2dc1541965';

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

export default async function uploadOnchain(tokenUri: string) {
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
    const receipt = await nftTxn.wait();

    // Parse the logs to find our event
    const iface = new ethers.Interface(contract.abi);
    const mintEvent = receipt.logs.find((log: Log) => {
        try {
            const parsed = iface.parseLog(log);
            return parsed.name === 'TokenMinted';
        } catch {
            return false;
        }
    });

    // Get the token ID from the event
    const parsedEvent = iface.parseLog(mintEvent);
    const tokenId = parsedEvent.args[0]; // tokenId is the first argument in our event

    const transactionUrl = `https://sepolia-blockscout.lisk.com/tx/${nftTxn.hash}`;
    const nftUrl = `https://sepolia-blockscout.lisk.com/token/${receipt.to}/instance/${tokenId.toString()}`;

    return { transactionUrl, nftUrl };
}
