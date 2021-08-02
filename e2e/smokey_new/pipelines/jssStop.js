const spawn = require('child_process').spawn;
spawn("taskkill", ["/pid", 5224, '/f', '/t']);