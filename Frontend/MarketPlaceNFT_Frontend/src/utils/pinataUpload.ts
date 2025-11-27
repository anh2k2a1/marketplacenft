import type { ChangeEvent } from 'react'; 

export const uploadToPinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const pinataApiKey = process.env.PINATA_API_KEY ; 
    const pinataSecretApiKey = process.env.NPINATA_SECRET_API_KEY ;

    if (!pinataApiKey || !pinataSecretApiKey) {
        throw new Error('Pinata API keys không được thiết lập!');
    }

    try {
        const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Lỗi upload đến Pinata: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        if (data.IpfsHash) {
            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        } else {
            throw new Error('Không nhận được IpfsHash từ Pinata');
        }
    } catch (error) {
        console.error('Lỗi upload đến Pinata:', error);
        throw error;
    }
};