const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// 1. The Bouncers: Allow frontend to talk to us, and understand JSON data
app.use(cors({
    origin: 'https://certifysync.vercel.app' // YOUR NEW REBRANDED LINK!
}));
app.use(express.json());

// 2. The Vault: Load your secret Cloudinary keys
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. The API Endpoint: The specific web address that deletes images
app.delete('/api/delete-image', async (req, res) => {
    try {
        // Grab the image's unique ID sent from your frontend
        const { publicId } = req.body; 
        
        if (!publicId) {
            return res.status(400).json({ error: 'No image ID provided!' });
        }

        console.log(`🗑️ Deleting image: ${publicId}`);

        // Send the secure kill command to Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        
        // Tell the frontend it was a success
        res.json({ message: 'Image permanently deleted!', result });

    } catch (error) {
        console.error("🚨 Server Error during deletion:", error);
        res.status(500).json({ error: 'Failed to delete image from vault.' });
    }
});

// 4. Start the Engine
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Certisync Backend is alive and running on http://localhost:${PORT}`);
});