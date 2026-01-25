// Script de prueba rápida del servidor
const http = require('http');

const testHealth = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📦 Response:', JSON.parse(data));
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en el puerto 3001');
  });

  req.end();
};

console.log('🔍 Probando servidor backend...');
testHealth();
