import { Controller } from '../decorators';
import { pinFileToIPFS } from '../utils/uploadFileToPinata';
import { Request, Response } from 'express';
import { createMetadataJson } from '../utils/createMetadataJson';
import fs from 'fs';
import { ethers } from 'ethers';
import uploadOnchain from '../utils/uploadOnchain';

export default class Product {
    @Controller()
    public static async register(req: Request, res: Response) {
        if (!req.files) return res.status(400).json('No picture attached');
        const { name, description, sn } = req.fields;
        const picture = req.files.image;

        //upload/pin image and retrieve ipfs hash
        const uploadedImage = await pinFileToIPFS(picture);
        const imageIpfsHash = uploadedImage.IpfsHash;

        //create metadata in json
        const nftData = { name, description, sn };
        const jsonFile = await createMetadataJson(nftData, imageIpfsHash);

        const uploadedMetadata = await pinFileToIPFS(jsonFile);
        const nftMetadata = `https://gateway.pinata.cloud/ipfs/${uploadedMetadata.IpfsHash}`;

        await fs.promises.unlink(jsonFile.path);

        //upload to the blockchain.
        const result = await uploadOnchain(nftMetadata);

        res.status(201).json({
            transaction: `NFT Minted! Check it out at: ${result.transactionUrl}`,
            nft: `NFT URL! See it at: ${result.nftUrl}`,
        });
    }

    @Controller()
    public static async verify(req: Request, res: Response) {}
}
