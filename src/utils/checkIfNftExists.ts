import { ethers } from 'ethers';
import { Request, Response } from 'express';
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');

const erc721Abi = ['function ownerOf(uint256 tokenId) public view returns (address)'];

const nftUrlPattern = /^https:\/\/sepolia-blockscout\.lisk\.com\/token\/0x[a-fA-F0-9]{40}\/instance\/\d+$/;

export default async function checkNFTExists(deployedContractAddress: string, url: string): Promise<boolean | string> {
    try {
        // Validate the URL against the regex pattern
        if (!nftUrlPattern.test(url)) {
            throw new Error('Invalid URL format');
        }

        // Extract contract address and token ID from the URL
        const urlParts = url.split('/');
        const contractAddress = urlParts[4]; // Contract address

        const tokenId = urlParts[6]; // Token ID (e.g., 13)

        // Compare the extracted contract address with the expected contract address
        if (contractAddress !== deployedContractAddress) {
            console.log(1);
            throw new Error('NFT does not belong to the expected contract');
        }

        // Create a contract instance
        const nftContract = new ethers.Contract(contractAddress, erc721Abi, provider);

        // Call ownerOf to check if the token exists (throws if it doesn't exist)
        const owner = await nftContract.ownerOf(tokenId);

        // If ownerOf returns an address, the NFT exists
        console.log(`NFT exists, owned by: ${owner}`);
        return true;
    } catch (error) {
        // If an error is thrown, the token doesn't exist
        return false;
        throw new Error('NFT does not exists.');
    }
}
