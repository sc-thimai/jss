const Common = require('../support/common');

describe('Jss Deploy', function() {
  it('Should deploy nextjs app', function() {
    cy.log(Cypress.env('INSTANCE_PATH'));
    var secret = require('crypto')
      .randomBytes(48)
      .toString('hex');
    Common.Common.setupScjssconfig({
      samplesDirAppName: 'nextjs',
      instancePath: Cypress.env('INSTANCE_PATH'),
      deployUrl: `${Cypress.config().baseUrl}/sitecore/api/jss/import`,
      layoutServiceHost: Cypress.config().baseUrl,
      deploySecret: secret,
      apiKey: Cypress.env('APIKEY'),
      nonInteractive: true,
    });
    Common.Common.deployConfig({ samplesDirAppName: 'nextjs' });
    Common.Common.deployApp({
      samplesDirAppName: 'nextjs',
      includeContent: true,
      includeDictionary: true,
      acceptCertificate: 'test',
      options: { timeout: 90000, failOnNonZeroExit: false },
    }).then((cert) => {
      Common.Common.deployApp({
        samplesDirAppName: 'nextjs',
        includeContent: true,
        includeDictionary: true,
        acceptCertificate: cert,
        options: { timeout: 160000, failOnNonZeroExit: true },
      });
    });
  });

  xit('Should deploy react app', function() {
    cy.log(Cypress.env('INSTANCE_PATH'));
    var secret = require('crypto')
      .randomBytes(48)
      .toString('hex');
    Common.Common.setupScjssconfig({
      samplesDirAppName: 'react',
      instancePath: Cypress.env('INSTANCE_PATH'),
      deployUrl: `${Cypress.config().baseUrl}/sitecore/api/jss/import`,
      layoutServiceHost: Cypress.config().baseUrl,
      deploySecret: secret,
      apiKey: Cypress.env('APIKEY'),
      nonInteractive: true,
    });
    Common.Common.deployConfig({ samplesDirAppName: 'react' });
    Common.Common.deployApp({
      samplesDirAppName: 'react',
      includeContent: true,
      includeDictionary: true,
      acceptCertificate: 'test',
      options: { timeout: 90000, failOnNonZeroExit: false },
    }).then((cert) => {
      Common.Common.deployApp({
        samplesDirAppName: 'react',
        includeContent: true,
        includeDictionary: true,
        acceptCertificate: cert,
        options: { timeout: 160000, failOnNonZeroExit: true },
      });
    });
  });
});
