const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const shell =  require('electron').shell;
const os = require('os');
const Store = require('electron-store');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const sudo = require('sudo-prompt');
const HOME = os.homedir(); 
let mainWindow;
const store = new Store();
var files = [];

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    const isFirstRun = !store.get('hasRunBefore',false);
    const startUrl = isFirstRun ? 'app/install/index.html' : 'app/install/index.html';

    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, startUrl),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    if (isFirstRun) {
        store.set('hasRunBefore', true);
      }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

//-----------------------install-----------------------


ipcMain.on('install', (event) => {

    const command = 'bash $PWD/configure.sh'

    sudo.exec(command, { name: 'Cholar' },(error, stdout, stderr) => {
        if(error){
            console.log(error)
        }
        console.log(stdout)
        console.log(stderr)
    })



});

async function executeCommand(command,delay) {
   
        await sudo.exec(
            command,
            { name: 'Your App Name' },
            (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error: ${error}`);
                } else {
                    console.log(`Command executed: ${command}`);
                    //resolve();
                }
            }
        );
}
async function installAll() {
    try {
          
           // await executeCommand(wgetcurl,10000);
           async function wgetcurl(){
            var wget = require('node-wget');
            
                var url ="https://github.com/curl/curl/releases/download/curl-7_55_0/curl-7.55.0.tar.gz"
                var destination_folder_or_filename=HOME+"/C_files/application/curl-7.55.0.tar.gz"
                wget({
                  url: url,
                  dest: destination_folder_or_filename,      // destination path or path with filenname, default is ./
                  timeout: 10000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
              },
              function (error, response, body) {
                  if (error) {
                      console.log('--- error:');
                      console.log(error);            // error encountered
                  } else {
                      console.log('--- headers:');
                      console.log(response.headers); // response headers
                      console.log('--- body:');
                        // content of package
                  }
              }
            );
            }
            await wgetcurl();
            await executeCommand('tar -xvf $HOME/C_files/application/curl-7.55.0.tar.gz -C  $HOME/C_files/application/',30000);
            await executeCommand('$HOME/C_files/application/curl-7.55.0/configure && make && make install',35000);
            await executeCommand('curl -O https://repo.anaconda.com/miniconda/Miniconda3-py39_4.11.0-Linux-x86_64.sh',40000);
            await executeCommand('bash $PWD/Miniconda3-py39_4.11.0-Linux-x86_64.sh -u',45000)
            await executeCommand('conda install -q -y -c bioconda fastqc multiqc hisat2 samtools stringtie gffcompare gffread htseq ',65000);
            await executeCommand('curl -O http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.39.zip',85000);
            await executeCommand('mv Trimmomatic-0.39.zip $HOME/C_files/application',95000)
            await executeCommand('unzip $HOME/C_files/application/Trimmomatic-0.39.zip  $HOME/C_files/application/',100000)
            await executeCommand('pip3 install CPAT',110000)
            await executeCommand('mkdir -p $HOME/C_files/genome/human/hg38/annotation && curl -OL https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_40/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz',150000)
            await executeCommand('mv $PWD/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz $HOME/C_files/genome/human/hg38/annotation   &&  gzip -d $HOME/C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz',175000)
            await executeCommand('mkdir -p $HOME/C_files/genome/human/hg38/ref_gen && curl -OL http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen',190000)
            await executeCommand('gzip -d $HOME/C_files/genome/human/hg38/ref_gen/hg38.fa.gz',205000)
            await executeCommand('hisat2_extract_splice_sites.py $HOME/C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf \
            > gencode.v40.splicesite.annotation.ss',220000)
            await executeCommand('mkdir -p $HOME/C_files/genome/human/hg38/ref_gen && curl -OL http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen',230000)
            await executeCommand('gzip -d $HOME/C_files/genome/human/hg38/ref_gen/hg38.fa.gz',240000)
            await executeCommand('hisat2-build hg38.fa hg38.fa',260000)
            await executeCommand('Rscript $PWD/source/conf.R',275000)
        // ... and so on for other commands
        console.log('All commands executed successfully');
    } catch (error) {
        console.error(`Error during installation: ${error.message}`);
    }
}

ipcMain.on('install-packages', (event) => {
    const packagesToInstall = ['zenity', 'curl', 'parallel','python3-pip','git']; // Add the names of the packages you want to install

    const command = `apt-get install -y zenity curl parallel python3-pip git openssl libssl-dev libmagick++-dev libmariadbclient-dev libssl-dev`;

    
    sudo.exec(command, { name: 'Cholar' },(error, stdout, stderr) => {
        
        const exec = require("child_process").exec;
        exec("mkdir -p $HOME/C_files/application", createscript);
        function createscript(error, stdout, stderr) {
            console.log(error, stdout)
        }
   
    });
    installAll();
});





//-------------after install-----------------
ipcMain.on('open-file-dialog-for-file', function (event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile','multiSelections']
    }).then(result => {
        if (!result.canceled) {
            event.reply('selected-file', result.filePaths);
            files.push(result.filePaths);
        }
    });

});

ipcMain.on('open-splice-file-dialog-for-file', function (event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            event.reply('selected-splice-file', result.filePaths);
            files.push(result.filePaths);
        }
    });
});

ipcMain.on('open-reference-file-dialog-for-file', function (event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            event.reply('selected-reference-file', result.filePaths);
            files.push(result.filePaths);
        }
    });
});

ipcMain.on('open-annotation-file-dialog-for-file', function (event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            event.reply('selected-annotation-file', result.filePaths);
            files.push(result.filePaths);
        }
    });
});

ipcMain.on('run', function (event) {
    console.log(files);
//     arg 1 ->   Factqc ,
// arg2 -> threads

// arg3 -> Spliceset file

// arg4 -> reference file

// arg5 -> annotation file 

// arg6 -> output folder
        SPLICESET_PATH = `${HOME}/C_files/genome/human/hg38/annotation/gencode.v40.splicesite.annotation.ss`
        ANNOTATION_PATH = `${HOME}C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf`
        REF_PATH = `${HOME}/C_files/genome/human/hg38/ref_gen/hg38.fa`

        const numThreads = os.cpus().length ;
        Fastqc = files[0];
        if (files[1] && files[1][0] != null) {
            SPLICESET_PATH = files[1][0];
        }
        if (files[2] && files[2][0] != null) {
            REF_PATH = files[2][0];
        }
        if (files[3] && files[3][0] != null) {
            ANNOTATION_PATH = files[3][0];
        }

        // child process to exec the command with threse arguments 
    
    const outputParentFolder = path.dirname(files[0][0]);
    let args = [
        Fastqc,
        numThreads-2, // Threads
        SPLICESET_PATH,
        REF_PATH,
        ANNOTATION_PATH,
        outputParentFolder // Modify this with your actual output folder
    ];

    console.log(args);
    const scriptPath = path.join(__dirname, 'app', 'scripts', 'master_script.sh');

    const cmd = `sh ${scriptPath} ${args.join(' ')}`;

    console.log(cmd);

    // exec(`bash ${scriptPath} arg1 arg2 arg3 arg4 arg5 arg6`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error executing shell script: ${error.message}`);
    //     return;
    //   }
    //   console.log(`Shell script output: ${stdout}`);
    //   console.error(`Shell script error: ${stderr}`);
    // });

    const scriptProcess = spawn('bash', [scriptPath, ...args]);
    let result ;
    scriptProcess.stdout.on('data', (data) => {
      console.log(`Shell script output: ${data}`);
         //const result = data.toString();
            result = data.toString();
    });
  
    scriptProcess.stderr.on('data', (data) => {
      console.error(`Shell script error: ${data}`);
    });
  
    scriptProcess.on('close', (code) => {
      console.log(`Shell script exited with code ${code}`);
    });

    event.reply('run', result);
    shell.openPath(outputParentFolder);
});



