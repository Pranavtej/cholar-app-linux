const { ipcRenderer } = require('electron');

const installButton = document.getElementById('installButton');
const progressBar = document.getElementById('progressBar');
installButton.addEventListener('click', () => {
    ipcRenderer.send('install');

    document.getElementById('installButton').innerHTML = 'Installing...';
    document.getElementById('installButton').disabled = true;
    let progress = 0;
    const interval = setInterval(() => {
        progress += 0.5;
        if (progress <= 100.0) {
            progressBar.style.width = progress + '%';
        } else {
            clearInterval(interval);
        }
    }, 500);
});

// Listen for messages from the main process
ipcRenderer.on('install-result', (event, result) => {
    console.log(result);
});
