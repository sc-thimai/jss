class Common {
  getSamplesAppRelativeFilePath() {
    return '..\\..\\..\\samples';
  }

  getDifferenceBetweenLists(list1, list2) {
    return list1.filter((x) => !list2.includes(x));
  }

  formatJssCmd({ baseCmd, cmdArgs, excludeArgs = [] } = {}) {
    let argKeys = Object.keys(cmdArgs[0]);
    if (excludeArgs) {
      argKeys = this.getDifferenceBetweenLists(argKeys, excludeArgs);
    }
    for (let i = 0; i < argKeys.length; i++) {
      baseCmd += ` --${argKeys[i]} ${cmdArgs[0][argKeys[i]]}`;
    }
    return baseCmd;
  }

  setupScjssconfig({
    samplesDirAppName,
    instancePath,
    deployUrl,
    layoutServiceHost,
    apiKey,
    deploySecret,
    nonInteractive,
    outputFile,
    skipValidation,
  } = {}) {
    let setupCmd = this.formatJssCmd({
      baseCmd: 'jss setup',
      cmdArgs: arguments,
      excludeArgs: ['samplesDirAppName'],
    });
    cy.log(setupCmd);
    cy.exec(`cd ${Cypress.env('SAMPLEAPPRELPATH')}\\${samplesDirAppName} && ${setupCmd}`, {
      timeout: 10000,
    }).then(function(result) {
      cy.log(`Stdout from '${setupCmd}' \n\n${result.stdout}`);
      cy.task('log', result.stdout);
      expect(result.code, 'Expect stdout code from jss setup to equal 0').to.equal(0);
    });
  }

  deployConfig({ samplesDirAppName, source, destination, config } = {}) {
    const args = arguments;
    cy.task(
      'getFilesFromDir',
      `${Cypress.env('SAMPLEAPPRELPATH')}\\${samplesDirAppName}\\sitecore\\config\\`
    ).then(function(files) {
      const webConfigFilePath = `${Cypress.env(
        'SAMPLEAPPRELPATH'
      )}\\${samplesDirAppName}\\sitecore\\config\\${files[0]}`;
      cy.task('log', webConfigFilePath);
      cy.readFile(webConfigFilePath).then((str) => {
        const hostName = str.match(/(?<=hostName=")(.*)(?=")/g);
        const scHostName = Cypress.config().baseUrl.match(/(?<=https:\/\/)(.*)(?=)/g);
        str = str.replace('hostName="' + hostName, 'hostName="' + scHostName);
        cy.writeFile(webConfigFilePath, str);
      });
    });

    let deployCmd = this.formatJssCmd({
      baseCmd: 'jss deploy config',
      cmdArgs: args,
      excludeArgs: ['samplesDirAppName'],
    });
    cy.exec(`cd ${Cypress.env('SAMPLEAPPRELPATH')}\\${samplesDirAppName} && ${deployCmd}`, {
      timeout: 10000,
    }).then(function(result) {
      cy.log(`Stdout from '${deployCmd}' \n\n${result.stdout}`);
      cy.task('log', result.stdout);
      expect(result.code, 'Expect stdout code from jss deploy config to equal 0').to.equal(0);
    });
  }

  deployApp({
    samplesDirAppName,
    deployUrl,
    deploySecret,
    debugSecurity,
    skipPackage,
    config,
    proxy,
    acceptCertificate,
    packageOutputPath,
    skipManifest,
    appName,
    manifestSourceFiles,
    require,
    manifestOutputPath,
    includeContent,
    includeDictionary,
    language,
    rootPlaceholders,
    wipe,
    pipelinePatchFiles,
    debug,
    allowConflictingPlaceholderNames,
    source,
    destination,
    exclude,
    skipBuild,
    buildTaskName,
    clean,
    options = { timeout: 90000, failOnNonZeroExit: true },
  } = {}) {
    cy.log(options);
    let deployCmd = this.formatJssCmd({
      baseCmd: 'jss deploy app',
      cmdArgs: arguments,
      excludeArgs: ['samplesDirAppName', 'options'],
    });
    return cy
      .exec(`cd ${Cypress.env('SAMPLEAPPRELPATH')}\\${samplesDirAppName} && ${deployCmd}`, options)
      .then(function(result) {
        cy.log(`Stdout from '${deployCmd}' \n\n${result.stdout}`);
        cy.task('log', result.stdout);
        cy.task('log', result.stderr);
        if (options.failOnNonZeroExit) {
          expect(result.code, 'Expect stdout code from jss deploy app to equal 0').to.equal(0);
        }
        if (acceptCertificate === 'test') {
          let acceptCert = result.stderr.match(/(?<=but got )(.*)(?= from server)/g)[0];
          return cy.wrap(acceptCert);
        }
      });
  }
}
const common = new Common();
module.exports = {
  Common: common,
};
