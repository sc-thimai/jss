

export class LaunchpadPage {

    visit() {
        cy.visit('/sitecore/shell/sitecore/client/Applications/Launchpad?sc_lang=en')
    }

    getContentEditorButton() {
       return cy.get('[title="Content Editor"]')
   }

}

export const launchpadPage = new LaunchpadPage();