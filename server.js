import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static('public')); // Serve public files if needed

// Configure Multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get category and album from body
        // Note: req.body is available AFTER multer processes fields, 
        // but standard multer processes file first? 
        // We'll use a trick or trust the client sends fields first (FormData usually does if appended correctly)
        // OR we just assume a temp folder and move it?
        // Actually, standard FormData order matters.
        // Let's implement a dynamic Destination.

        // However, req.body might not be populated yet.
        // Easiest approach: Upload to 'temp', then move.
        cb(null, 'public/images/temp_uploads/');
    },
    filename: function (req, file, cb) {
        // sanitize filename
        const safeName = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        cb(null, Date.now() + '-' + safeName);
    }
});

// Ensure temp, but we will actually define destination in the handler for safety?
// No, let's just make the temp folder.
if (!fs.existsSync('public/images/temp_uploads')) {
    fs.mkdirSync('public/images/temp_uploads', { recursive: true });
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post('/api/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { category, albumName } = req.body;

    if (!category || !albumName) {
        return res.status(400).send('Category and Album Name required.');
    }

    // Define target directory
    const targetDir = path.join(__dirname, 'public', 'images', 'photos', category, albumName);

    // Create recursively
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Move file
    const targetPath = path.join(targetDir, req.file.filename);

    fs.rename(req.file.path, targetPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file.');
        }

        // Return the public URL
        // URL format: /images/photos/{category}/{album}/{filename}
        const publicUrl = `/images/photos/${category}/${albumName}/${req.file.filename}`;

        // Return consistent JSON
        res.json({
            success: true,
            filePath: publicUrl
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Upload endpoint: http://localhost:${PORT}/api/upload`);
});
