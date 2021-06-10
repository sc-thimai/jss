// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const fs = require('fs');
const exec = require('child_process').exec;

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    getFileSize(filename) {
      if (fs.existsSync(filename)) {
        return fs.statSync(filename).size;
      }

      return null;
    },
    getFilesFromDir(dir) {
      if (fs.existsSync(dir)) {
        return fs.readdirSync(dir);
      }

      return null;
    },
    checkDirExists(dir) {
      if (fs.existsSync(dir)) {
        return fs.existsSync(dir);
      }

      return null;
    },
    removeDir(dir) {
      if (fs.existsSync(dir)) {
        fs.rmdirSync(dir, { recursive: true });
        return true;
      }

      return null;
    },
    isDir(dir) {
      const stats = fs.statSync(dir);
      return stats.isDirectory();
    },
    readFile(filepath) {
      return fs.readFileSync(filepath, { encoding: 'utf8' });
    },
    log(message) {
      console.log(message);
      return null;
    },
    exec(cmd) {
      exec(cmd, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      });
      return null;
    },
  });
};
