const Common = require('../support/common');
const samplesAppAbsFilePath = `${__dirname}\\..\\..\\..\\..\\..\\samples`;
let appFilePath;

describe('Jss Create', function() {
  afterEach(function() {
    cy.log('--- AfterEach ---');
    cy.removeDir(appFilePath);
  });
  [
    {
      testname: 'Should create nextjs app in filesystem with default prerender and fetchWith flags',
      prerender: undefined,
      fetchWith: undefined,
    },
    {
      testname:
        'Should create nextjs app in filesystem with default prerender ssg and fetchWith graphql flags',
      prerender: 'ssg',
      fetchWith: 'graphql',
    },
    {
      testname:
        'Should create nextjs app in filesystem with prerender ssr and fetchWith graphql flags',
      prerender: 'ssr',
      fetchWith: 'graphql',
    },
    {
      testname:
        'Should create nextjs app in filesystem with prerender ssr and fetchWith rest flags',
      prerender: 'ssr',
      fetchWith: 'rest',
    },
  ].forEach((scenario) => {
    it(`${scenario.testname}`, function() {
      cy.getRandomString(10).then(function(randStr) {
        let appName = `automation-nextjs-${scenario.prerender}-${scenario.fetchWith}-${randStr}`;
        appFilePath = `${samplesAppAbsFilePath}\\${appName}`;
        cy.log(`Creating jss app at ${appFilePath}`);

        Common.Common.create({
          appName: appName,
          framework: 'nextjs',
          hostName: `${Cypress.config().baseUrl}`,
          repository: 'Sitecore/jss',
          branch: `${Cypress.env('BRANCH')}`,
          prerender: scenario.prerender,
          fetchWith: scenario.fetchWith,
        });
        Common.Common.assertJSSCreate({ appName: appName, framework: 'nextjs' });
        Common.Common.assertNextjsWithPrerenderOrFetchWithFlags({
          appName: appName,
          prerender: scenario.prerender,
          fetchWith: scenario.fetchWith,
        });
      });
    });
  });

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
    xit(`${scenario.testname}, create`, function() {
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
      });
    });
  });
});
