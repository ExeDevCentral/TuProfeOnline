const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups');
  const backupFile = path.join(backupDir, `backup-${timestamp}.db`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  exec(`cp dev.db ${backupFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`);
      return;
    }
    console.log(`Database backed up to ${backupFile}`);
  });
};

if (require.main === module) {
  backupDatabase();
}

module.exports = { backupDatabase };