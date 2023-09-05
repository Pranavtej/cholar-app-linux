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
        },
        autoHideMenuBar: true,
    });

    const isFirstRun = !store.get('hasRunBefore',false);
    const startUrl = isFirstRun ? 'app/install/index.html' : 'app/index.html';

    
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

    const command = 'bash  $PWD/test.sh'

    exec('chmod +x $PWD/test.sh' , (error, stdout, stderr) => {
        if (error) {
            console.error(`Error installing packages: ${error.message}`);
           
        }
        else{
            console.log(`Packages installed:`);
        }
      });

  sudo.exec(command,(error, stdout, stderr) => {
        if(error){
            console.log(error)
        }
        console.log(stdout)
        console.log(stderr)
    })

    event.reply('install-result', 'Packages installed successfully');

    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Installation Result',
      message: result,
      buttons: ['OK']
  }).then(() => {
      // Relaunch the app
      app.relaunch();
      app.quit();
  });

});

ipcMain.on('install-packages', (event) => {
    const packagesToInstall = ['zenity', 'curl', 'parallel','python3-pip','git']; // Add the names of the packages you want to install

    const command = `apt-get install -y zenity curl parallel python3-pip git openssl libssl-dev libmagick++-dev libmariadbclient-dev libssl-dev`;

    sudo.exec(command, { name: 'Cholar' },(error, stdout, stderr) => {
        //if (error) {
          //  console.error(`Error installing packages: ${error.message}`);
            //event.reply('install-result', 'Installation failed');
            //return;
       // }

        //console.log(`Packages installed: ${packagesToInstall.join(', ')}`);
        

        const exec = require("child_process").exec;
        exec("mkdir -p $HOME/C_files/application", createscript);
        function createscript(error, stdout, stderr) {
            console.log(error, stdout)
        }

      
            setTimeout(wgetcurl,10000);
            setTimeout(tar,20000);
            setTimeout(tarconfig,25000);
            setTimeout(minicondacurl,35000);
            setTimeout(cpakgs,45000)
            setTimeout(condainstall,65000);
            setTimeout(tricurl,85000);
            setTimeout(mvtri,95000)
            setTimeout(unziptri,100000)
            setTimeout(installcpat,110000)
            setTimeout(annotation,150000)
            setTimeout(mvann,175000)
            setTimeout(refgen,190000)
            setTimeout(gziprefgz,205000)
            setTimeout(hitsat2build,220000)
            setTimeout(makecurlref,230000)
            setTimeout(gzipreference,240000)
            setTimeout(hitsat2build2,260000)
            setTimeout(Rscript,275000)

        function wgetcurl(){
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
            
            function tar(){
              var sudo = require('sudo-prompt');
              var options = {
                name: 'Cholar',
                //cns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
              };
            sudo.exec('tar -xvf $HOME/C_files/application/curl-7.55.0.tar.gz -C  $HOME/C_files/application/', options,
                  function(error, stdout, stderr) {
                    if (error) throw error;
                    console.log('Tar extracted succcesfully ' );
                  }
                );
            }
            
            function tarconfig()
            {
              var sudo = require('sudo-prompt');
                var options = {
                  name: 'Cholar',
                  //cns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
                };
                sudo.exec('$HOME/C_files/application/curl-7.55.0/configure && make && make install', options,
                  function(error, stdout, stderr) {
                    if (error) throw error;
                    console.log('Configure run succesfully' );
                  }
                );
            }
            
            function minicondacurl()
            {
              const exec = require("child_process").exec;
            exec("curl -O https://repo.anaconda.com/miniconda/Miniconda3-py39_4.11.0-Linux-x86_64.sh ", curlminiconda);
             
            // Callback
            function curlminiconda(error, stdout, stderr) {
               console.log("curl done")
            }
            
            }
            
            function cpakgs()
            {
              var sudo = require('sudo-prompt');
                var options = {
                  name: 'Cholar',
                  //cns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
                };
                sudo.exec('bash $PWD/Miniconda3-py39_4.11.0-Linux-x86_64.sh -u  ', options,
                  
                function(error, stdout, stderr) {
                    if (error) throw error;
                    console.log('Miniconda  run succesfully' );
                  }
                );
            
            }
            
           function condainstall()
            {
              var sudo = require('sudo-prompt');
                var options = {
                  name: 'Cholar',
                  //cns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
                };
                sudo.exec('conda install -q -y -c bioconda fastqc multiqc hisat2 samtools stringtie gffcompare gffread htseq ', options,
                //&&  conda install -q -y -c conda-forge r-base
                function(error, stdout, stderr) {
                  if (error) throw error;
                  console.log('Conda run succesfully' );
                }
              );
              sudo.exec('conda install -q -y -c conda-forge r-base', options,
                //&&  conda install -q -y -c conda-forge r-base
                function(error, stdout, stderr) {
                  if (error) throw error;
                  console.log('Conda run succesfully' );
                }
              );
            }
            
            function tricurl()
            {
              const exec = require("child_process").exec;
                exec("curl -O http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.39.zip", curltrimmomatic);
                // Callback
                function curltrimmomatic(error, stdout, stderr) {
                   console.log("curl trimmomatic done")
                }
                
            }
            function mvtri()
            {
              const exec = require("child_process").exec;
          
                exec("mv Trimmomatic-0.39.zip $HOME/C_files/application ", movetri);
            function movetri(error, stdout, stderr) {
               console.log("curl trimmomatic move done")
            }
            }
            
            function unziptri()
            {
                exec("unzip $HOME/C_files/application/Trimmomatic-0.39.zip  $HOME/C_files/application/", unziptrimm);
            function unziptrimm(error, stdout, stderr) {
               console.log("curl trimmomatic unzip done")
            }
            }
            
            function installcpat()
            {const exec = require("child_process").exec;
                exec("pip3 install CPAT ", pipcpat);
            function pipcpat(error, stdout, stderr) {
               console.log("pip3 install cpat")
            }
            }
            
            function annotation()
            {
              const exec = require("child_process").exec;
                exec("mkdir -p $HOME/C_files/genome/human/hg38/annotation", annotation);
            function annotation(error, stdout, stderr) {
               console.log("curl and make dir ")
            }
             exec("curl -OL https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_human/release_40/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz", annotation2);
            function annotation2(error, stdout, stderr) {
                console.log("curl and make dir-2 ")
            }

            }
            
            function mvann()
            {
              var sudo = require('sudo-prompt');
                var options = {
                  name: 'Cholar',
                  //cns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
                };
                sudo.exec('mv $PWD/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz $HOME/C_files/genome/human/hg38/annotation   &&  gzip -d $HOME/C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf.gz', options,
                  function(error, stdout, stderr) {
                    if (error) throw error;
                    console.log('move anf gzip gwencode' );
                  }
                );
            
            }
            
            function refgen()
            {
              const exec = require("child_process").exec;
                exec("mkdir -p $HOME/C_files/genome/human/hg38/ref_gen && curl -OL http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen", refmv);
            function refmv(error, stdout, stderr) {
               console.log("curl and make dir ")
            }
            }
            
            function gziprefgz()
            {const exec = require("child_process").exec;
                exec("gzip -d $HOME/C_files/genome/human/hg38/ref_gen/hg38.fa.gz", gzipref);
            function gzipref(error, stdout, stderr) {
               console.log("curl and make dir ")
            }
            }
            
            function hitsat2build()
            {
              const exec = require("child_process").exec;
                exec("hisat2_extract_splice_sites.py $HOME/C_files/genome/human/hg38/annotation/gencode.v40.chr_patch_hapl_scaff.annotation.gtf \
            > gencode.v40.splicesite.annotation.ss", splicest);
            function splicest(error, stdout, stderr) {
               console.log("splice set file installed")
            }
            }
            
            function makecurlref()
            {
                exec("mkdir -p $HOME/C_files/genome/human/hg38/ref_gen && curl -OL http://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && mv hg38.fa.gz $HOME/C_files/genome/human/hg38/ref_gen", mkcurlref);
            function mkcurlref(error, stdout, stderr) {
               console.log("curl and make dir ")
            }
            }
            
            function gzipreference()
            { const exec = require("child_process").exec;
                exec("gzip -d $HOME/C_files/genome/human/hg38/ref_gen/hg38.fa.gz", gzipreferencegz);
            function gzipreferencegz(error, stdout, stderr) {
               console.log("move comple gzip ")
            }
            }
            
            function hitsat2build2() {
                exec("hisat2-build hg38.fa hg38.fa", hitsatbuild);
            function hitsatbuild(error, stdout, stderr) {
               console.log("hitsat2 ")
            }
            }
            
            function Rscript() {
              const exec = require("child_process").exec;
                exec("Rscript $PWD/source/conf.R", Rscript);
            function Rscript(error, stdout, stderr) {
               console.log("Rscript")
            }
        }
        
    });
    event.reply('install-result', 'Packages installed successfully');
    console.log("install done")
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
        ANNOTATION_PATH ,
        SPLICESET_PATH,
        outputParentFolder,
        REF_PATH,
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



