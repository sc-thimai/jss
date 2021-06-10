

export class ContentEditorPage {

    visit() {
        cy.visit('/sitecore/shell/Applications/Content%20Editor.aspx?sc_bw=1')
    }

    /************************************************************************************************
     * 
     * Content Tree 
     * 
     ************************************************************************************************/

    getSCHomeNodeItem() {
        return cy.get(".scContentTreeNode").find("span").contains("Home")

    }
    getSCContentTreeAppNode(appName) {
       return cy.contains(appName).parent().find('.scContentTreeNodeGlyph')
    }

    getSCContentTreeComponentsNode(appName) {
        return cy.contains(appName).parent().find("div.scContentTreeNode").contains('Components')
    }

    getSCContentTreeContentNode(appName) {
        return cy.contains(appName).parent().find("div.scContentTreeNode").contains('Content')
    }
    
    getSCContentTreeHomeNode(appName) {
        return cy.contains(appName).parent().find("div.scContentTreeNode").contains('home')
    }

    getSCContentTreeDictionaryNode(appName) {
        return cy.contains(appName).parent().find("div.scContentTreeNode").contains('Dictionary')
    }

    assertSCItemsExistForApp(appName) {
        this.getSCContentTreeAppNode(appName).click()
        this.getSCContentTreeComponentsNode(appName).should('be.visible')
        this.getSCContentTreeContentNode(appName).should('be.visible')
        this.getSCContentTreeHomeNode(appName).should('be.visible')
        this.getSCContentTreeDictionaryNode(appName).should('be.visible')
    }

    getSCNodeItem(appName, item) {
        return cy.contains(appName).parent().find('div.scContentTreeNode').contains(item)
    }

    getSCNode(itemName) {
        return cy.contains(itemName).parent().find('.scContentTreeNodeGlyph') 
    }

    getSCItem(itemName) {
        return cy.contains(itemName)
    }

    getSCButton(buttonName) {
        return cy.contains('div', buttonName)
    }

    getIframe() {
        return '*[src^="/sitecore/shell/-/xaml/Sitecore.Shell"]'
    }

    getIframePrompt() {
        return 'form[action="/sitecore/shell/default.aspx?xmlcontrol=Prompt"]'
    }
    
    



}

export const contentEditorPage = new ContentEditorPage();