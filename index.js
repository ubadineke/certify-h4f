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
const contractAddress = '0xba469a04f52f63C259ADFFFc22276b4d992D0e64';

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Get the NFT Metadata IPFS URL
const tokenUri = 'https://gateway.pinata.cloud/ipfs/QmWutWsvEhZnLK1rcyG9i3r232kPnYz2sE1TYR8eAFr8pL';

// Call mintNFT function
const mintNFT = async () => {
    let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
};

mintNFT()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
