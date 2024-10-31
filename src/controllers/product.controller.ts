import { Controller } from '../decorators';
import { pinFileToIPFS } from '../utils/uploadFileToPinata';
import { Request, Response } from 'express';
import { createMetadataJson } from '../utils/createMetadataJson';
import fs from 'fs';
import uploadOnchain from '../utils/uploadOnchain';
import qr from 'qrcode';
import Qr from '../models/qr.model';
import checkNFTExists from '../utils/checkIfNftExists';

export default class Product {
    @Controller()
    public static async register(req: Request, res: Response) {
        // console.log(11);
        // console.log(req.files);
        // console.log(req.user);
        if (!req.files) return res.status(400).json('No picture attached');
        const { name, description, sn } = req.fields;
        const picture = req.files.image;
        if (!picture) return res.status(400).json('Image not attached');
        if (picture.type === null || picture.type == '') return res.status(400).json('Picture not attached');

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
        const qrCodeDataURI = await qr.toDataURL(JSON.stringify(result.nftUrl));
        console.log(qrCodeDataURI);

        await Qr.create({
            manufacturer: req.user,
            link: qrCodeDataURI,
        });

        res.status(201).json({
            transaction: `NFT Minted! Check it out at: ${result.transactionUrl}`,
            nft: `NFT URL! See it at: ${result.nftUrl}`,
            qrCodeDataURI,
        });
    }

    @Controller()
    public static async verify(req: Request, res: Response) {
        const { url } = req.body;
        console.log(1, req.body);
        if (!url) return res.status(400).json('URL not provided');
        console.log(url);

        const contractAddress = '0x574CFDD4109eB6b95Ab14124107E5c2dc1541965';

        //check if the contract is correct
        //check if there is a link to the blockchain explorer
        const result = await checkNFTExists(contractAddress, url);

        console.log(3, result);
        if (!result) {
            return res.status(404).json({ message: 'Invalid QR Code' });
        }

        res.status(200).json({
            message: 'Verified',
            nftUrl: url,
        });
    }
}
