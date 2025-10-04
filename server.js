const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Key generation and storage
const KEYS_DIR = path.join(__dirname, 'keys');

// Ensure keys directory exists
if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR);
}

// Generate RSA key pair if not exists
function generateKeys() {
    const privateKeyPath = path.join(KEYS_DIR, 'private.pem');
    const publicKeyPath = path.join(KEYS_DIR, 'public.pem');
    
    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
        console.log('Generating new RSA key pair...');
        
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        
        fs.writeFileSync(privateKeyPath, privateKey);
        fs.writeFileSync(publicKeyPath, publicKey);
        
        console.log('RSA key pair generated successfully!');
    }
}

// Load keys from files
function loadKeys() {
    const privateKeyPath = path.join(KEYS_DIR, 'private.pem');
    const publicKeyPath = path.join(KEYS_DIR, 'public.pem');
    
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    
    return { privateKey, publicKey };
}

// Initialize keys on startup
// generateKeys();
const { privateKey, publicKey } = loadKeys();

// API Routes

// 1. Encrypt token using private key
app.post('/api/encrypt', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ 
                error: 'Token is required' 
            });
        }
        
        // Encrypt the token using private key (signing)
        const encrypted = crypto.privateEncrypt(privateKey, Buffer.from(token, 'utf8'));
        const encryptedHash = encrypted.toString('base64');
        
        res.json({
            success: true,
            originalToken: token,
            encryptedHash: encryptedHash,
            message: 'Token encrypted successfully using private key'
        });
        
    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({ 
            error: 'Failed to encrypt token',
            details: error.message 
        });
    }
});

// 2. Decrypt hash using public key
app.post('/api/decrypt', (req, res) => {
    try {
        const { encryptedHash } = req.body;
        
        if (!encryptedHash) {
            return res.status(400).json({ 
                error: 'Encrypted hash is required' 
            });
        }
        
        // Decrypt the hash using public key (verification)
        const buffer = Buffer.from(encryptedHash, 'base64');
        const decrypted = crypto.publicDecrypt(publicKey, buffer);
        const decryptedToken = decrypted.toString('utf8');
        
        res.json({
            success: true,
            encryptedHash: encryptedHash,
            decryptedToken: decryptedToken,
            message: 'Hash decrypted successfully using public key'
        });
        
    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ 
            error: 'Failed to decrypt hash',
            details: error.message 
        });
    }
});

// 3. Get public key for frontend use
app.get('/api/public-key', (req, res) => {
    try {
        res.json({
            success: true,
            publicKey: publicKey,
            message: 'Public key retrieved successfully'
        });
    } catch (error) {
        console.error('Error retrieving public key:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve public key',
            details: error.message 
        });
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        details: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
