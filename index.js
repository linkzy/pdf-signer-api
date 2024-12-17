require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { plainAddPlaceholder } = require('@signpdf/placeholder-plain');
const { default: signpdf } = require('@signpdf/signpdf');
const { P12Signer } = require('@signpdf/signer-p12');

const app = express();
const port = process.env.PORT || 3000;
const secretToken = process.env.API_SECRET_TOKEN;

if (!secretToken) {
    throw new Error('API_SECRET_TOKEN environment variable is not set. Please configure it before starting the application.');
}

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for token validation
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${secretToken}`) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing token.' });
    }
    next();
});

// Multer setup for file uploads
const upload = multer({
    limits: { fileSize: Infinity }, // No file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf' && file.mimetype !== 'application/x-pkcs12') {
            return cb(new Error('Invalid file type. Only PDF and P12 files are allowed.'));
        }
        cb(null, true);
    },
});

// API endpoint to sign a PDF
app.post('/sign', upload.fields([{ name: 'pdf' }, { name: 'certificate' }]), async (req, res) => {
    try {
        const pdfBuffer = req.files['pdf'][0].buffer;
        const certificateBuffer = req.files['certificate'][0].buffer;

        const {
            reason = 'The user is declaring consent.',
            contactInfo = 'default@example.com',
            name = 'John Doe',
            location = 'Default Location',
            widgetRectX1 = 50,
            widgetRectY1 = 200,
            widgetRectX2 = 150,
            widgetRectY2 = 250,
        } = req.body;

        // Combine widgetRect values into an array
        const widgetRect = [Number(widgetRectX1), Number(widgetRectY1), Number(widgetRectX2), Number(widgetRectY2)];

        const signer = new P12Signer(certificateBuffer);

        const pdfWithPlaceholder = plainAddPlaceholder({
            pdfBuffer,
            reason,
            contactInfo,
            name,
            location,
            widgetRect,
        });

        const signedPdf = await signpdf.sign(pdfWithPlaceholder, signer);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=signed.pdf');
        return res.send(signedPdf);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to sign the PDF.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`PDF Signer API running at http://localhost:${port}`);
});