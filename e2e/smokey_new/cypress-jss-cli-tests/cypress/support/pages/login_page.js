
export class LoginPage {

    visit() {
        cy.visit('/sitecore/login?fbc=1');
    }

    login(username, password) {
        cy.get('#UserName').type(username)
        cy.get('#Password').type(password)
        cy.get('#LogInBtn').click()
    }

}

export const loginPage = new LoginPage();