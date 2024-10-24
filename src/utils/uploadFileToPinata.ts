import axios from 'axios';
import FormData from 'form-data';
import fetch from 'node-fetch';
const fs = require('fs');
require('dotenv').config();

// const pinataApiKey = process.env.PINATA_API_KEY;
// const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

// async function uploadImageToPinata(imagePath) {
//     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//     const form_data = new FormData();
//     const fileStream = fs.createReadStream(imagePath);
//     form_data.append('file', fileStream);

//     const metadata = JSON.stringify({
//         name: 'My NFT Image',
//     });
//     form_data.append('pinataMetadata', metadata);

//     try {
//         const response = await axios.post(url, form_data, {
//             maxBodyLength: 'Infinity', // This is needed to prevent axios from erroring out
//             headers: {
//                 'Content-Type': `multipart/form-data; boundary=${form_data._boundary}`,
//                 pinata_api_key: pinataApiKey,
//                 pinata_secret_api_key: pinataSecretApiKey,
//             },
//         });
//         console.log('Image uploaded to IPFS:', response.data);
//         return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         throw error;
//     }
// }

// // Call the function to upload image (replace 'path/to/image.png' with your actual image path)
// uploadImageToPinata('./path/to/image.png').then((imageURL) => {
//     console.log('Image URL:', imageURL);
// });

// const JWT = "YOUR_PINATA_JWT";
export default async function uploadFileToPinata() {
    try {
        const formData = new FormData();

        const file = new File(['hello'], 'Testing.txt', { type: 'text/plain' });
        formData.append('file', file);
        const request = await axios.post('https://uploads.pinata.cloud/v3/files', {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: formData,
        });
        const response = await request.json();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

// const JWT = 'YOUR_PINATA_JWT';

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

async function pinFileToIPFS2(file) {
    try {
        const formData = new FormData();

        // Append the image file to the form data (from formidable's parsed file)
        formData.append('file', file.path, file.name);

        const pinataMetadata = JSON.stringify({
            name: file.name || 'Uploaded File',
        });
        formData.append('pinataMetadata', pinataMetadata);

        const pinataOptions = JSON.stringify({
            cidVersion: 1,
        });
        formData.append('pinataOptions', pinataOptions);

        // Send the request to Pinata using axios
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: Infinity, // Allow large file uploads
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        });

        console.log('Pinata Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading to Pinata:', error.response ? error.response.data : error.message);
        throw error;
    }
}
