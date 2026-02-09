// pages/Elements.js

class Elements {
    constructor(page) {
        this.page = page
        this.elementsList = page.locator('.menu-list')

        // Text Box
        //this.textBoxMenu = this.elementsList.getByRole('link', { name: 'Text Box' })
        this.textBoxMenu = page.getByRole('listitem').filter({ hasText: 'Text Box' })
        this.fullNameInput = page.locator('#userName')
        this.emailInput = page.locator('#userEmail')
        this.currentAddressInput = page.locator('#currentAddress')
        this.permanentAddressInput = page.locator('#permanentAddress')
        this.submitButton = page.locator('#submit')

        // Check Box
        this.checkBoxMenu = page.getByRole('listitem').filter({ hasText: 'Check Box' })
        this.expandAllButton = page.getByRole('button', { name: 'Expand all' })
        this.collapseAllButton = page.getByRole('button', { name: 'Collapse all' })
        this.desktopCheckbox = page.locator('label[for="tree-node-desktop"] .rct-checkbox')
        this.reactCheckbox = page.locator('label[for="tree-node-react"] .rct-checkbox')
        this.downloadsCheckbox = page.locator('label[for="tree-node-downloads"] .rct-checkbox')
        this.resultsSection = page.locator('#result')
    }
    // Text Box Methods
    async navigateToTextBox() {
        await this.textBoxMenu.click()
    }
    async fillTextBoxForm(fullName, email, currentAddress, permanentAddress) {
        await this.fullNameInput.fill(fullName)
        await this.emailInput.fill(email)
        await this.currentAddressInput.fill(currentAddress)
        await this.permanentAddressInput.fill(permanentAddress)

        await this.submitButton.click()
    }
    // Check Box Methods
    async navigateToCheckBox() {
        await this.checkBoxMenu.click()
    }
    async expandAllCheckboxes() {
        await this.expandAllButton.click()
    }
    async collapseAllCheckboxes() {
        await this.collapseAllButton.click()
    }
    async selectDesktopCheckbox() {
        await this.desktopCheckbox.click()
    }
    async selectReactCheckbox() {
        await this.reactCheckbox.click()
    }
    async selectDownloadsCheckbox() {
        await this.downloadsCheckbox.click()
    }
    async getResultsText() {
        return await this.resultsSection.textContent()
    }
}

module.exports = { Elements };