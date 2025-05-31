import Client from 'ssh2-sftp-client';
import dotenv from 'dotenv';

dotenv.config({path: '.env.production'});
// FTP server configuration
const sftpConfig = {
  host: process.env.droplet_sftp_host,
  user: process.env.droplet_sftp_user,
  password: process.env.droplet_sftp_password,
};

const localBuildPath = './dist';

const projDirectory = '/home/nodejs/order-bot-backend/';

// Initialize SFTP client
const client = new Client();

try {
  // Connect to SFTP server
  await client.connect(sftpConfig);
} catch (error) {
  console.error('SFTP connection error:', error);
}

console.log('Connected to SFTP server');
const directoryExists = await client.exists(projDirectory);
if (!directoryExists) {
  await client.mkdir(projDirectory, true);
} else {
  // remove the contents of the directory except node_modules
  const buildFiles = await client.list(projDirectory);
  const directoryContent = buildFiles.filter(
    v => !'node_modules'.includes(v.name),
  );

  // remove all files/folders (node_modules excluded).
  for await (const f of directoryContent) {
    const filePath = projDirectory + f.name;

    if (f.type === 'd') {
      // Remove the directory after all its contents are removed
      try {
        await client.rmdir(filePath, true);
        console.log(`directory ${filePath} successfully removed.`);
      } catch (error) {
        console.error('Error while removing directory:', filePath, error);
      }
    } else {
      // File, delete
      try {
        await client.delete(filePath);
        console.log(`file ${filePath} successfully removed.`);
      } catch (error) {
        console.error('Error while removing file:', filePath, error);
      }
    }
  }
  // await client.rmdir(projDirectory, true);
  // await client.mkdir(projDirectory, true);
}

// Upload the dist content to the remote directory
try {
  await client.uploadDir(localBuildPath, projDirectory);
  console.log('build uploaded successfully');
  console.log(
    '-------------------------------------------WARN-------------------------------------------------',
  );
  console.warn(
    "Don't forget to re-run the docker-compose command to start the containers.",
  );
  console.log(
    '-------------------------------------------WARN-------------------------------------------------',
  );
} catch (error) {
  console.error('Error uploading build.zip:', error);
} finally {
  console.log('SFTP connection closed.');
  client.end();
}
