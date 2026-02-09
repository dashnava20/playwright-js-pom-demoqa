// src/pages/Elements.js
import { BasePage } from './BasePage.js';

class Elements extends BasePage {
    constructor(page) {
        super(page) // Llamada al constructor de BasePage
        this.page = page
        
        // Mapa de navegación
        this.MENU_ITEMS = {
            'Text Box': { label: 'Text Box', url: '/text-box' },
            'CheckBox': { label: 'Check Box', url: '/checkbox' },
            'RadioBtn': { label: 'Radio Button', url: '/radio-button' },
            'WebTables': { label: 'Web Tables', url: '/webtables' },
            'Buttons': { label: 'Buttons', url: '/buttons' },
            'Links': { label: 'Links', url: '/links' },
            'BrokenLinks': { label: 'Broken Links - Images', url: '/broken' },
            'UploadDownload': { label: 'Upload and Download', url: '/upload-download' },
            'DynamicProperties': { label: 'Dynamic Properties', url: '/dynamic-properties' }
        }

        // Text Box
        this.fullNameInput = page.locator('#userName')
        this.emailInput = page.locator('#userEmail')
        this.currentAddressInput = page.locator('#currentAddress')
        this.permanentAddressInput = page.locator('#permanentAddress')
        this.submitButton = page.locator('#submit')

        // Check Box
        this.expandAllButton = page.getByRole('button', { name: 'Expand all' })
        this.collapseAllButton = page.getByRole('button', { name: 'Collapse all' })
        this.desktopCheckbox = page.locator('label[for="tree-node-desktop"] .rct-checkbox')
        this.reactCheckbox = page.locator('label[for="tree-node-react"] .rct-checkbox')
        this.downloadsCheckbox = page.locator('label[for="tree-node-downloads"] .rct-checkbox')
        this.resultsSection = page.locator('#result')
    }
    
    // Navegación Global
    /**
     * Navega dinámicamente y valida la URL automáticamente.
     * @param {string} pageName - La clave definida en MENU_ITEMS (ej: 'TextBox')
     */
    async navigateTo(pageName) {
        const menuItem = this.MENU_ITEMS[pageName];
        //Manejo de erores
        if(!menuItem) {
            throw new Error(`❌ - Page ${pageName} not found.`);
        }
        console.log(`✅ - Navigating to "${menuItem.label}" page.`);

        await this.page.getByRole('listitem')
            .filter({ hasText: menuItem.label })
            .click();
        console.log(`✅ - Navigation to "${menuItem.label}" successful. Current URL: ${this.page.url()}`);
        
        return menuItem.url; // Devuelve la URL esperada para validación
    }
    
    // Text Box: Métodos
    async fillTextBoxForm(name, email, currentAddr, permanentAddr) {
        await this.fullNameInput.fill(name)
        await this.emailInput.fill(email)
        await this.currentAddressInput.fill(currentAddr)
        await this.permanentAddressInput.fill(permanentAddr)
        await this.submitButton.click()
    }

    // Check Box: Métodos
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

    // Radio Button: Métodos
    async selectRadioButton(option) {
        const radioOption = this.page.locator('.custom-control-label').filter({ hasText: new RegExp(`^${option}$`) })
        await radioOption.click()
    }
    async getRadioResult() {
        return await this.page.locator('p:has-text("You have selected")').textContent()
    }
}

module.exports = { Elements };