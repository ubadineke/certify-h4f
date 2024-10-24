import FormData from 'form-data';
import fetch from 'node-fetch';
const fs = require('fs');
require('dotenv').config();

export async function pinFileToIPFS(file) {
    try {
        const formData = new FormData();

        // Append the image file to the form data (from formidable's parsed file)
        formData.append('file', fs.createReadStream(file.path), file.name);

        const pinataMetadata = JSON.stringify({
            name: file.name || 'Uploaded File',
        });
        formData.append('pinataMetadata', pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        formData.append('pinataOptions', pinataOptions);

        const request = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: formData,
        });
        const response = await request.json();
        return response;
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
