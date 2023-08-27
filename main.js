const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');

const os = require('os');
const { spawn } = require('child_process');

const HOME = os.homedir(); 
let mainWindow;

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
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
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
    const result = "";
    scriptProcess.stdout.on('data', (data) => {
      console.log(`Shell script output: ${data}`);
      result = data.toString();
    });
  
    scriptProcess.stderr.on('data', (data) => {
      console.error(`Shell script error: ${data}`);
    });
  
    scriptProcess.on('close', (code) => {
      console.log(`Shell script exited with code ${code}`);
    });

    event.reply('run', result);
});



