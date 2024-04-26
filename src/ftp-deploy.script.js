const Ftp = require('ftp');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
// FTP server configuration
const ftpConfig = {
  host: process.env.ftp_host,
  user: process.env.ftp_user,
  password: process.env.ftp_password,
};

const localBuildPath = './dist.zip';

const ftpProjDirectory = '/api.mfuatnuroglu.com.tr/';

const systemFileFolders = ['.','..','.htaccess','.well-known','cgi-bin','stderr.log','public','tmp'];

// Initialize FTP client
const client = new Ftp();

// Connect to FTP server
client.connect(ftpConfig);

client.on('ready', () => {
  console.log('Connected to FTP server');
client.list(ftpProjDirectory,async (e,buildFiles)=>{
  // remove all files/folders (system files/folders excluded).
 await Promise.all(buildFiles.filter(v=> !systemFileFolders.includes(v.name)).map(f=> {
  const filePath = ftpProjDirectory + f.name;
  if (f.type === 'd') {
        // Remove the directory after all its contents are removed
       return client.rmdir(filePath, true, err => {
            if (err) {
                console.error('Error removing directory:', filePath, err);
            }else{
              console.log(`directory ${filePath} successfully removed.`);
            }
        });
    
} else {
    // File, delete
   return client.delete(filePath, err => {
        if (err) {
            console.error('Error removing file:', filePath, err);
        }else{
          console.log(`File ${filePath} successfully removed.`);
        }
    });
}
  }));
  
  
          // Upload the dist.zip to the remote directory
        const fileStream = fs.createReadStream(localBuildPath);
        client.put(fileStream, ftpProjDirectory + localBuildPath, err => {
          if (err) {
            console.error('Error uploading build.zip:', err);
          } else {
            console.log('build.zip uploaded successfully');
            console.log("-------------------------------------------WARN-------------------------------------------------")
            console.warn("Don't forget to navigate to the following link to extract the zip file and restart the node instance. https://musteri.isimkaydet.com/login");
            console.log("-------------------------------------------WARN-------------------------------------------------")
            client.end(); // Close FTP connection
          }
        });

});
  
});

client.on('error', err => {
  console.error('FTP connection error:', err);
});
