const samplesAppAbsFilePath = `${__dirname}\\..\\..\\..\\..\\..\\samples`;
let appFilePath;

/**
 * Create nextjs app with prerender/fetchWith flags. Assert actual files specific to prerender/fetchWith with expected from samples nextjs app.
 *
 * @param {Object} options - Flags for jss create nextjs
 * @param {string} options.prerender - SSG|SSR
 * @param {string} options.fetchWith - REST|GRAPHQL
 */
function createNextjsAppWithPrerenderOrFetchWithFlags({
  prerender = 'ssg',
  fetchWith = 'graphql',
} = {}) {
  const flags = Object.keys(arguments[0]);
  let args = arguments;
  args[0].prerender = args[0].prerender || prerender;
  args[0].fetchWith = args[0].fetchWith || fetchWith;
  cy.log(args);
  cy.getRandomString(10).then(function(randStr) {
    let appName = `automation-nextjs-${prerender}-${fetchWith}-${randStr}`;
    appFilePath = `${samplesAppAbsFilePath}\\${appName}`;
    cy.log(`Creating jss app at ${appFilePath}`);
    let createCmd = `jss create ${appName} nextjs --repository "Sitecore/jss" --branch "dev"`;
    if (prerender) {
      createCmd += ` --prerender "${prerender}"`;
    }
    if (fetchWith) {
      createCmd += ` --fetchWith "${fetchWith}"`;
    }
    cy.exec(`cd ${Cypress.env('SAMPLEAPPRELPATH')} && ${createCmd}`, { timeout: 100000 }).then(
      function(result) {
        cy.log(`Stdout from '${createCmd}' \n\n${result.stdout}`);
        expect(result.code, 'Expect stdout code from jss create to equal 0').to.equal(0);
      }
    );

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
  });
  return true;
}

describe('Jss Create', function() {
  afterEach(function() {
    cy.log('--- AfterEach ---');
    cy.removeDir(appFilePath);
  });

  it('Should create app in filesystem with valid hostname, repository, and branch flags', function() {
    cy.getRandomString(10).then(function(randStr) {
      let appName = `app-from-automation-for-${Cypress.env('FRAMEWORK')}-${randStr}`;
      appFilePath = `${__dirname}\\..\\..\\..\\..\\..\\samples\\${appName}`;
      cy.log(`Creating jss app at ${appFilePath}`);
      let createCmd = `jss create ${appName} ${Cypress.env('FRAMEWORK')} --hostName "${
        Cypress.config().baseUrl
      }" --repository "Sitecore/jss" --branch "dev"`;
      cy.exec(`cd ${Cypress.env('SAMPLEAPPRELPATH')} && ${createCmd}`, { timeout: 100000 }).then(
        function(result) {
          cy.log(`Stdout from '${createCmd}' \n\n${result.stdout}`);
          expect(result.code, 'Expect stdout code from jss create to equal 0').to.equal(0);
        }
      );

      cy.task('getFilesFromDir', `${samplesAppAbsFilePath}\\${appName}`).then(function(
        res
      ) {
        cy.task(
          'getFilesFromDir',
          `${samplesAppAbsFilePath}\\${Cypress.env('FRAMEWORK')}`
        ).then(function(res1) {
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
          ];
          const ignoredFilesdifference = difference.filter((x) => !filesOKToIgnore.includes(x));
          cy.log(
            `Files not ok to ignore that dont exist in expected app - ${ignoredFilesdifference}`
          );
          // eslint-disable-next-line no-unused-expressions
          expect(
            ignoredFilesdifference,
            'Expect files in top level dir of app equals files in top level dir of sample app'
          ).to.be.empty;
          for (let i = 0; i < res.length; i++) {
            cy.task('isDir', `${samplesAppAbsFilePath}\\${appName}\\${res[i]}`).then(
              function(res1) {
                if (!res1) {
                  cy.task(
                    'getFileSize',
                    `${samplesAppAbsFilePath}\\${appName}\\${res[i]}`
                  ).then(function(res1) {
                    cy.log(
                      `Check filesize for '${samplesAppAbsFilePath}\\${appName}\\${res[i]}' is non zero, filesize = ${res1}`
                    );
                    expect(
                      res1,
                      'Expect filesize of files in top level dir of app is not equal to 0'
                    ).to.not.equal(0);
                  });
                }
              }
            );
          }
        });
      });
    });
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
      createNextjsAppWithPrerenderOrFetchWithFlags({
        prerender: scenario.prerender,
        fetchWith: scenario.fetchWith,
      });
    });
  });
});
