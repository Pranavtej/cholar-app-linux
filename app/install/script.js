const installButton = document.getElementById('installButton');
const progressBar = document.getElementById('progressBar');

installButton.addEventListener('click', () => {
    // Simulate installation progress
    
    document.getElementById('installButton').innerHTML = 'Installing...';
    document.getElementById('installButton').disabled = true;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        if (progress <= 100) {
            progressBar.style.width = progress + '%';
        } else {
            clearInterval(interval);
        }
    }, 500);
});
