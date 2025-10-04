const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAPIs() {
    console.log('🧪 Testing Token Encryption APIs\n');
    
    try {
        // Test token
        const testToken = 'LJSLD234LAFJL324DLFA3';
        
        // 1. Test encryption
        console.log('1. Testing token encryption...');
        const encryptResponse = await axios.post(`${BASE_URL}/encrypt`, {
            token: testToken
        });
        
        console.log('✅ Encryption successful:');
        console.log(`   Original Token: ${encryptResponse.data.originalToken}`);
        console.log(`   Encrypted Hash: ${encryptResponse.data.encryptedHash}\n`);
        
        const encryptedHash = encryptResponse.data.encryptedHash;
        
        // 2. Test decryption
        console.log('2. Testing hash decryption...');
        const decryptResponse = await axios.post(`${BASE_URL}/decrypt`, {
            encryptedHash: encryptedHash
        });
        
        console.log('✅ Decryption successful:');
        console.log(`   Encrypted Hash: ${decryptResponse.data.encryptedHash}`);
        console.log(`   Decrypted Token: ${decryptResponse.data.decryptedToken}\n`);
        
                    
        // 3. Get public key
        console.log('3. Getting public key...');
        const publicKeyResponse = await axios.get(`${BASE_URL}/public-key`);
        
        console.log('✅ Public key retrieved:');
        console.log(`   Public Key (first 100 chars): ${publicKeyResponse.data.publicKey.substring(0, 100)}...\n`)
        
        console.log('🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Run tests
testAPIs();
