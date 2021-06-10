
export class CommonPage {
    getLogout() {
        return cy.get('.logout').contains('Log out');
    }

    //Item ID: under Quick Info section when clicking on an item (e.g. clicking on JssNextWeb > home > under quick info)
    getItemId() {
        return cy.contains('Item ID:').parent().find('td').find('input').invoke('val')
    }
}

export const commonPage = new CommonPage();