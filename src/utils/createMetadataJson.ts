import fs from 'fs';
import path from 'path';

interface nftData {
    name: string;
    description: string;
    sn: string;
}

export async function createMetadataJson(data: nftData, ipfsHash: string) {
    const { name, description, sn } = data;
    const metadata = {
        attributes: [
            {
                trait_type: 'S/N',
                value: `${sn}`,
            },
        ],
        description: `${description}`,
        image: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        name: `${name}`,
    };

    // Create a temporary JSON file for metadata (async version)
    const metadataPath = path.join(__dirname, 'metadata.json');
    await fs.promises.writeFile(metadataPath, JSON.stringify(metadata));

    return {
        path: metadataPath,
        name: 'metadata.json',
    };
}
