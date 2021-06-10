
export class NavigationBarPage {

    getPublishTab() {
        return cy.get('.scRibbonNavigatorButtonsGroupButtons').contains('Publish')
    }

    getExperienceEditor() {
        return cy.get('.header').contains('Experience Editor')
    }

    
}

export const navigationBarPage = new NavigationBarPage();