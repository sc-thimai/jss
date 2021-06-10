// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { loginPage } from './pages/login_page';
import { launchpadPage } from '../support/pages/launchpad_page';
import { contentEditorPage } from '../support/pages/content_editor_page';

// Cypress.Commands.add('login', (username, password) => {
//     loginPage.login(username, password);
// })

Cypress.Commands.add('removeDir', (path) => {
  cy.task('checkDirExists', path).then(function(res) {
    cy.log(`Directory '${path}' exists - ${res}`);

    if (res) {
      cy.task('removeDir', path).then(function(res) {
        cy.log(`Remove directory '${path}' status - ${res}`);
      });
    }
  });
});

Cypress.Commands.add('getRandomString', (length) => {
  let randomChars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
});

Cypress.Commands.add('createApiKey', () => {
  contentEditorPage.visit();
  contentEditorPage.getSCNode('System').click();
  contentEditorPage.getSCNode('Settings').click();
  contentEditorPage.getSCNode('Services').click();
  contentEditorPage.getSCItem('API Keys').click();
  // contentEditorPage.getSCButton('API Key').click()
});

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'GET',
    url: `${Cypress.config().baseUrl}/sitecore/login?fbc=1`,
  }).then(function(response) {
    const htmlDocument = document.createElement('html');
    htmlDocument.innerHTML = response.body;
    const loginForm = htmlDocument.getElementsByTagName('form')[0];
    cy.request({
      method: 'POST',
      url: `${Cypress.config().baseUrl}/sitecore/login?fbc=1`,
      form: true,
      body: {
        UserName: Cypress.env('USERNAME'),
        Password: Cypress.env('PASSWORD'),
        LogInBtn: 'Log in',
        __EVENTVALIDATION: loginForm.elements.__EVENTVALIDATION.value,
        __VIEWSTATE: loginForm.elements.__VIEWSTATE.value,
      },
      followRedirect: false,
    }).then(function(response) {
      const aspnetCookies = response.allRequestResponses[0]['Response Headers'][
        'set-cookie'
      ][3].match(/(?<=.AspNet.Cookies=)(.*)(?=; path)/g);
      const sitecoreUserticket = response.allRequestResponses[0]['Response Headers'][
        'set-cookie'
      ][4].match(/(?<=sitecore_userticket=)(.*)(?=; expires)/g);
      Cypress.Cookies.preserveOnce('sitecore_userticket', sitecoreUserticket);
      Cypress.Cookies.preserveOnce('.AspNet.Cookies', aspnetCookies);
      launchpadPage.visit();
    });
  });
});

Cypress.Commands.add('readFileFromSCContainer', (filepath) => {
  cy.exec(`docker exec jssdev_cm_1 powershell cat ${filepath}`, { timeout: 10000 }).then(function(
    result
  ) {
    cy.log(`Stdout from docker exec jssdev_cm_1 powershell cat \n\n${result.stdout}`);
    cy.task('log', result.stdout);
    expect(
      result.code,
      'Expect stdout code from docker exec jssdev_cm_1 powershell cat to equal 0'
    ).to.equal(0);
  });
});
