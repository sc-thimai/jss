
const spawn = require('child_process').spawn;
const seleniumHub = spawn('jss start', [''], { shell: true , detached: true });
console.log("$$$");
console.log(seleniumHub.pid);
seleniumHub.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

seleniumHub.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

seleniumHub.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

setTimeout(function () {
    spawn("taskkill", ["/pid", seleniumHub.pid, '/f', '/t']);
}, 50000);

