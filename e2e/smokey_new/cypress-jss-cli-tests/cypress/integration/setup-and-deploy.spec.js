const Common = require('../support/common');
let appFilePath;

describe('Jss Create', function() {
  [
    {
      testname: 'Should create nextjs app with hostName flag',
      framework: 'nextjs',
    },
    {
      testname: 'Should create react app with hostName flag',
      framework: 'react',
    },
    {
      testname: 'Should create angular app with hostName flag',
      framework: 'angular',
    },
    {
      testname: 'Should create vue app with hostName flag',
      framework: 'vue',
    },
  ].forEach((scenario) => {
    it(`${scenario.testname}, create`, function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      cy.getRandomString(10).then(function(randStr) {
        let appName = `app-from-automation-for-${scenario.framework}-${randStr}`;
        appFilePath = `${__dirname}\\..\\..\\..\\..\\..\\samples\\${appName}`;
        cy.log(`Creating jss app at ${appFilePath}`);

        Common.Common.create({
          appName: appName,
          framework: scenario.framework,
          hostName: `${Cypress.config().baseUrl}`,
          repository: 'Sitecore/jss',
          branch: `${Cypress.env('BRANCH')}`,
        });
        Common.Common.assertJSSCreate({ appName: appName, framework: scenario.framework });

        var secret = require('crypto')
          .randomBytes(48)
          .toString('hex');
        Common.Common.setupScjssconfig({
          samplesDirAppName: scenario.framework,
          instancePath: Cypress.env('INSTANCE_PATH'),
          deployUrl: `${Cypress.config().baseUrl}/sitecore/api/jss/import`,
          layoutServiceHost: Cypress.config().baseUrl,
          deploySecret: secret,
          apiKey: Cypress.env('APIKEY'),
          nonInteractive: true,
        });
        Common.Common.deployConfig({ samplesDirAppName: scenario.framework });
        Common.Common.deployApp({
          samplesDirAppName: scenario.framework,
          includeContent: true,
          includeDictionary: true,
          acceptCertificate: 'test',
          options: { timeout: 90000, failOnNonZeroExit: false },
        }).then((cert) => {
          Common.Common.deployApp({
            samplesDirAppName: scenario.framework,
            includeContent: true,
            includeDictionary: true,
            acceptCertificate: cert,
            options: { timeout: 160000, failOnNonZeroExit: true },
          });
        });
      });
    });
  });
});
