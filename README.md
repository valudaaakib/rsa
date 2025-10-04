A Node.js API for token encryption and decryption using RSA public/private key cryptography.

## Features

- 🔐 Generate RSA public/private key pairs
- 🔒 Encrypt tokens using private key
- 🔓 Decrypt hashes using public key
- ✅ Validate public key functionality
- 🌐 RESTful API endpoints
- 📝 Comprehensive error handling

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Server will run on:** `http://69.62.78.40/demo-api`

## API Endpoints

### 1. Encrypt Token
**POST** `/api/encrypt`

Encrypts a token using the private key.

**Request Body:**
```json
{
  "token": "LJSLD234LAFJL324DLFA3"
}
```

**Response:**
```json
{
  "success": true,
  "originalToken": "LJSLD234LAFJL324DLFA3",
  "encryptedHash": "base64EncryptedString...",
  "message": "Token encrypted successfully using private key"
}
```

### 2. Decrypt Hash
**POST** `/api/decrypt`

Decrypts an encrypted hash using the public key.

**Request Body:**
```json
{
  "encryptedHash": "base64EncryptedString..."
}
```

**Response:**
```json
{
  "success": true,
  "encryptedHash": "base64EncryptedString...",
  "decryptedToken": "LJSLD234LAFJL324DLFA3",
  "message": "Hash decrypted successfully using public key"
}
```

### 3. Get Public Key
**GET** `/api/public-key`

Retrieves the public key for frontend use.

**Response:**
```json
{
  "success": true,
  "publicKey": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----",
  "message": "Public key retrieved successfully"
}
```


## Testing

Run the test script to verify all endpoints:

```bash
node test-api.js
```

## Usage Example

### Frontend (React) Integration

```javascript
// Get public key from API
const getPublicKey = async () => {
  const response = await fetch('http://69.62.78.40/demo-api/api/public-key');
  const data = await response.json();
  return data.publicKey;
};

// Decrypt hash using public key
const decryptHash = async (encryptedHash) => {
  const response = await fetch('http://69.62.78.40/demo-api/api/decrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ encryptedHash })
  });
  const data = await response.json();
  return data.decryptedToken;
};

// Validate decryption
const validateDecryption = async (encryptedHash, expectedToken) => {
  const response = await fetch('http://69.62.78.40/demo-api/api/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ encryptedHash, expectedToken })
  });
  const data = await response.json();
  return data.isValid;
};
```

## Security Notes

- 🔐 Private keys are stored locally and never exposed via API
- 🔒 RSA 2048-bit encryption provides strong security
- ✅ All inputs are validated and sanitized
- 🌐 CORS enabled for cross-origin requests

## File Structure

```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── test-api.js        # API testing script
├── README.md          # This file
└── keys/              # Generated RSA keys (auto-created)
    ├── private.pem    # Private key (never expose)
    └── public.pem     # Public key (safe to share)
```

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes and descriptive error messages.