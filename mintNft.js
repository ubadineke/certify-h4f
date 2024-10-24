require('dotenv').config();
const { ethers, JsonRpcProvider } = require('ethers');

// Define Provider
const provider = new JsonRpcProvider('https://rpc.sepolia-api.lisk.com');

const contract = require('./artifacts/contracts/myNFT.sol/MyNFT.json');
// console.log(JSON.stringify(contract.abi));

const privateKey = process.env.WALLET_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
const abi = contract.abi;
// new 0xc454D708fF7d5AFba56BfE050Fef0AA5B1daf6bD
// old 0xba469a04f52f63C259ADFFFc22276b4d992D0e64
const contractAddress = '0x574CFDD4109eB6b95Ab14124107E5c2dc1541965';

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Get the NFT Metadata IPFS URL
const tokenUri = 'https://gateway.pinata.cloud/ipfs/QmRetBMUomyTw1aNsiMbHdFMZEkZ2kMxGAkriJWyvjjGQv';

// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
    const receipt = await nftTxn.wait();

    // Parse the logs to find our event
    const iface = new ethers.Interface(contract.abi);
    const mintEvent = receipt.logs.find((log) => {
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

    console.log(`NFT Minted! Check it out at: https://sepolia-blockscout.lisk.com/tx/${nftTxn.hash}`);
    console.log(
        `NFT URL! See it at: https://sepolia-blockscout.lisk.com/token/${receipt.to}/instance/${tokenId.toString()}`
    );
};

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
