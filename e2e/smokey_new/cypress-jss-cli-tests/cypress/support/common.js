const samplesAppAbsFilePath = `${__dirname}\\..\\..\\..\\..\\..\\samples`;

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

  create({
    appName,
    framework,
    hostName,
    repository,
    branch,
    source,
    proxy,
    prerender,
    fetchWith,
  } = {}) {
    let createCmd = this.formatJssCmd({
      baseCmd: `jss create ${appName} ${framework}`,
      cmdArgs: arguments,
      excludeArgs: ['appName'],
    });
    cy.log(createCmd);
    cy.exec(`cd ${Cypress.env('SAMPLEAPPRELPATH')} && ${createCmd}`, {
      timeout: 200000,
    }).then(function(result) {
      cy.log(`Stdout from '${createCmd}' \n\n${result.stdout}`);
      cy.task('log', result.stdout);
      expect(result.code, 'Expect stdo\n' +
        '  }ut code from jss create to equal 0').to.equal(0);
    });

  assertJSSCreate({ appName, framework } = {}) {
    cy.task('getFilesFromDir', `${samplesAppAbsFilePath}\\${appName}`).then(function(res) {
      cy.task('getFilesFromDir', `${samplesAppAbsFilePath}\\${framework}`).then(function(res1) {
        cy.log(`Actual app files - ${res}`);
        cy.log(`Expected app files from samples dir - ${res1}`);
        const difference = res1.filter((x) => !res.includes(x));
        cy.log(`Files from expected samples app that are not in the actual app - ${difference}`);
        const filesOKToIgnore = [
          '.eslintcache',
          'build',
          'jss-create.js',
          'scjssconfig.json',
          '.generated',
          '.next',
          '.vscode',
          'next.config.base.js',
          'package.json.lerna_backup',
        ];
        const ignoredFilesdifference = difference.filter((x) => !filesOKToIgnore.includes(x));
        cy.log('######');
        cy.log(ignoredFilesdifference);
        // eslint-disable-next-line no-unused-expressions
        expect(
          ignoredFilesdifference,
          'Expect files in top level dir of app equals files in top level dir of sample app'
        ).to.be.empty;
        for (let i = 0; i < res.length; i++) {
          cy.task('isDir', `${samplesAppAbsFilePath}\\${appName}\\${res[i]}`).then(function(res1) {
            if (!res1) {
              cy.task('getFileSize', `${samplesAppAbsFilePath}\\${appName}\\${res[i]}`).then(
                function(res1) {
                  cy.log(
                    `Check filesize for '${samplesAppAbsFilePath}\\${appName}\\${res[i]}' is non zero, filesize = ${res1}`
                  );
                  expect(
                    res1,
                    'Expect filesize of files in top level dir of app is not equal to 0'
                  ).to.not.equal(0);
                }
              );
            }
          });
        }
      });
    });
  }

  assertNextjsWithPrerenderOrFetchWithFlags({
    appName = '',
    prerender = 'ssg',
    fetchWith = 'graphql',
  } = {}) {
    let flags = Object.keys(arguments[0]);
    flags.shift();
    let args = arguments;
    args[0].prerender = args[0].prerender || prerender;
    args[0].fetchWith = args[0].fetchWith || fetchWith;

    let appFilePath = `${samplesAppAbsFilePath}\\${appName}`;
    const expectedFilesToAssertInActual = {
      ssr: {
        confirmExists: [
          [
            `${samplesAppAbsFilePath}\\nextjs\\src\\pages\\[[...path]].SSR.tsx`,
            `${appFilePath}\\src\\pages\\[[...path]].tsx`,
          ],
        ],
        confirmNotExists: `${appFilePath}\\src\\lib\\sitemap-fetcher.ts`,
      },
      ssg: {
        confirmExists: [
          [
            `${samplesAppAbsFilePath}\\nextjs\\src\\pages\\[[...path]].tsx`,
            `${appFilePath}\\src\\pages\\[[...path]].tsx`,
          ],
        ],
        confirmNotExists: '',
      },
      rest: {
        confirmExists: [
          [
            `${samplesAppAbsFilePath}\\nextjs\\src\\lib\\dictionary-service-factory.rest.ts`,
            `${appFilePath}\\src\\lib\\dictionary-service-factory.ts`,
          ],
          [
            `${samplesAppAbsFilePath}\\nextjs\\src\\lib\\layout-service-factory.rest.ts`,
            `${appFilePath}\\src\\lib\\layout-service-factory.ts`,
          ],
        ],
        confirmNotExists: '',
      },
      graphql: {
        confirmExists: [
          [
            `${samplesAppAbsFilePath}\\nextjs\\src\\lib\\dictionary-service-factory.ts`,
            `${appFilePath}\\src\\lib\\dictionary-service-factory.ts`,
          ],
          [
            `${samplesAppAbsFilePath}\\nextjs\\src\\lib\\layout-service-factory.ts`,
            `${appFilePath}\\src\\lib\\layout-service-factory.ts`,
          ],
        ],
        confirmNotExists: '',
      },
    };

    for (let i = 0; i < flags.length; i++) {
      let filesToConfirmExist = expectedFilesToAssertInActual[args[0][flags[i]]].confirmExists;
      let fileToNotConfirmExist = expectedFilesToAssertInActual[args[0][flags[i]]].confirmNotExists;
      for (let i = 0; i < filesToConfirmExist.length; i++) {
        let filePairToAssert = filesToConfirmExist[i];
        let contents = [];
        cy.wrap(filePairToAssert)
          .each((file) => {
            cy.readFile(file).then((data) => {
              contents.push(data);
            });
          })
          .then(() => {
            cy.log(contents);
            expect(contents[0], `Expect file contents of ${filesToConfirmExist} to equal`).to.equal(
              contents[1]
            );
          });
      }

      if (fileToNotConfirmExist) {
        cy.readFile(fileToNotConfirmExist).should('not.exist');
      }
    }
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
      baseCmd: 'jss setup config',
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
