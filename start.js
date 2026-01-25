const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando EduStream System...');

// Helper to spawn processes
function startProcess(name, command, args, cwd) {
    const proc = spawn(command, args, {
        cwd: cwd,
        shell: true,
        stdio: 'inherit' // Pipe output directly to console
    });

    proc.on('error', (err) => {
        console.error(`❌ Error al iniciar ${name}:`, err);
    });

    return proc;
}

// 1. Start Backend
console.log('📡 Arrancando Servidor (Backend)...');
const backend = startProcess('Backend', 'npm', ['run', 'dev'], path.join(__dirname, 'server'));

// 2. Start Frontend
console.log('🎨 Arrancando Interfaz (Frontend)...');
const frontend = startProcess('Frontend', 'npm', ['run', 'dev'], __dirname);

// Handle exit
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando todo...');
    backend.kill();
    frontend.kill();
    process.exit();
});
