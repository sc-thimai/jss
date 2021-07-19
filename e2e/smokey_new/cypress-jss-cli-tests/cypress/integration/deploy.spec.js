const Common = require('../support/common');

describe('Jss Deploy', function() {
  [
    {
      testname:
        'Should deploy nextjs app includeContent, includeDictionary, acceptCertificate flag',
      framework: 'nextjs',
    },
    {
      testname:
        'Should deploy react app with includeContent, includeDictionary, acceptCertificate flag',
      framework: 'react',
    },
    {
      testname:
        'Should deploy angular app with includeContent, includeDictionary, acceptCertificate flag',
      framework: 'angular',
    },
    {
      testname:
        'Should deploy vue app with includeContent, includeDictionary, acceptCertificate flag',
      framework: 'vue',
    },
  ].forEach((scenario) => {
    it(`${scenario.testname}`, function() {
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
