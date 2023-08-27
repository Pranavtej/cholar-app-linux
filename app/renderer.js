const { ipcRenderer } = require('electron');
const os = require('os');
const files = [];
const buttonCreated = document.getElementById('file-upload');

buttonCreated.addEventListener('click', function () {
    ipcRenderer.send('open-file-dialog-for-file');
});

ipcRenderer.on('selected-file', function (event, path) {
    // document.getElementById('selected-files').textContent = `You selected: ${path}`;
    document.getElementById('selected-files').textContent = `Number of selected files: ${path.length}`;
    console.log(path);
   
    const numThreads = os.cpus().length;
    document.getElementById('threads').value = numThreads-2;
    document.getElementById('msg').textContent = `No of threads in your system are ${numThreads} you can use upto ${numThreads-2}`;

});


const spliceupload = document.getElementById('splice-upload');

spliceupload.addEventListener('click', function () {
    ipcRenderer.send('open-splice-file-dialog-for-file');
    const numThreads = os.cpus().length;
    document.getElementById('threads').value = numThreads-2;
    // document.getElementById('msg').textContent = `No of threads in your system are ${numThreads} you can use upto ${numThreads-2}`;

}
);

ipcRenderer.on('selected-splice-file', function (event, path) {
    document.getElementById('selected-splice-files').textContent = `You selected: ${path}`;
    console.log(path);
});


const referenceupload = document.getElementById('ref-upload');

referenceupload.addEventListener('click', function () {
    ipcRenderer.send('open-reference-file-dialog-for-file');
});

ipcRenderer.on('selected-reference-file', function (event, path) {
    document.getElementById('selected-reference-file').textContent = `You selected: ${path}`;
    console.log(path);
});

const annotationupload = document.getElementById('annotation-upload');

annotationupload.addEventListener('click', function () {
    ipcRenderer.send('open-annotation-file-dialog-for-file');
});

ipcRenderer.on('selected-annotation-file', function (event, path) {
    document.getElementById('selected-annotation-file').textContent = `You selected: ${path}`;
    console.log(path);
}
);

const submit = document.getElementById('run');
submit.addEventListener('click', function () {
    ipcRenderer.send('run');
});

ipcRenderer.on('run', function (event, path) {
    document.getElementById('run_msg').textContent = `Running...`;
}
);