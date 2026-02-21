// src/pages/Elements.js
import { BasePage } from './BasePage.js';

class Elements extends BasePage {
    constructor(page) {
        super(page, 'Elements') // Llamada al constructor de BasePage y asignación nombre
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
        this.expandAllButton = page.locator('.rc-tree-switcher')
        this.expandInternalButton = page.locator('.rc-tree-switcher.rc-tree-switcher_close')
        this.resultsSection = page.locator('#result')
        this.CHECKBOX_CONFIG = {
            'Desktop': { label: 'Desktop', expected: 'desktopnotescommands' },
            'React': { label: 'React', expected: 'react' },
            'Downloads': { label: 'Downloads', expected: 'downloadswordFileexcelFile' },
        }

        // Radio Button
        // (No se requieren selectores específicos aquí, ya que se manejan dinámicamente en los métodos)

        // Web Tables
        // Locators principales
        this.addButton = page.locator('#addNewRecordButton')
        this.registrationModal = page.locator('.modal-content')
        this.submitButton = page.locator('#submit')
        
        // Locators de la tabla
        this.tableBody = page.locator('tbody');
        this.allRows = this.tableBody.locator('tr');
        this.filledRows = this.allRows.filter({ has: page.locator('span[title="Edit"]') });
        this.editButton = (row) => row.locator('span[title="Edit"]');
        this.deleteButton = (row) => row.locator('span[title="Delete"]');

        // Locators del Formulario (Pop-up)
        this.firstNameInput = page.locator('#firstName')
        this.lastNameInput = page.locator('#lastName')
        this.emailInput = page.locator('#userEmail')
        this.ageInput = page.locator('#age')
        this.salaryInput = page.locator('#salary')
        this.departmentInput = page.locator('#department')

        // Buttons
        this.doubleClickButton = this.page.locator('#doubleClickBtn')
        this.rightClickButton = this.page.locator('#rightClickBtn')
        this.dynamicClickButton = this.page.getByRole('button', { name: 'Click Me', exact: true })
        this.doubleClickMessage = this.page.locator('#doubleClickMessage')
        this.rightClickMessage = this.page.locator('#rightClickMessage')
        this.dynamicClickMessage = this.page.locator('#dynamicClickMessage')

        // Links
        // Mapa de navegación
        this.LINK_ITEMS = {
            'Home': {
                id: 'simpleLink',
                type: 'navigation', // Para saber que abre una pestaña
                expectedUrl: 'https://demoqa.com/'
            },
            'DynamicHome': {
                id: 'dynamicLink',
                type: 'navigation',
                expectedUrl: 'https://demoqa.com/'
            },
            'Created': {
                id: 'created',
                type: 'api', // Para saber que debe validar el status
                status: 201,
                statusText: 'Created'
            },
            'NoContent': { id: 'no-content', type: 'api', status: 204, statusText: 'No Content' },
            'Moved': { id: 'moved', type: 'api', status: 301, statusText: 'Moved Permanently' },
            'BadRequest': { id: 'bad-request', type: 'api', status: 400, statusText: 'Bad Request' },
            'Unauthorized': { id: 'unauthorized', type: 'api', status: 401, statusText: 'Unauthorized' },
            'Forbidden': { id: 'forbidden', type: 'api', status: 403, statusText: 'Forbidden' },
            'NotFound': { id: 'invalid-url', type: 'api', status: 404, statusText: 'Not Found' }
        }

        // Broken Links
        this.validImage = page.locator('.body-height img[src="/images/Toolsqa.jpg"]');
        this.brokenImage = page.locator('.body-height img[src="/images/Toolsqa_1.jpg"]');
        this.validLink = page.getByRole('link', { name: 'Click Here for Valid Link' });
        this.brokenLink = page.getByRole('link', { name: 'Click Here for Broken Link' });

        // Upload & Download
        this.uploadInput = page.locator('#uploadFile')
        this.uploadedFilePath = page.locator('#uploadedFilePath')
        this.downloadButton = page.locator('#downloadButton')

        // Dynamic Properties
        this.randomIDText = page.getByText('This text has random Id', { exact: true })
        this.enableAfterButton = page.locator('#enableAfter')
        this.colorChangeButton = page.locator('#colorChange')
        this.visibleAfterButton = page.locator('#visibleAfter')
    }

    // Métodos comunes a todas las páginas (si es necesario, se pueden agregar aquí)    
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
        this.log('act', `Expanding tree nodes...`);
        const firstClosedButton = this.page.locator('.rc-tree-switcher_close').first();

        while (await firstClosedButton.isVisible({ timeout: 1000 }).catch(() => false)) {
            await firstClosedButton.scrollIntoViewIfNeeded();
            await firstClosedButton.click();
            await this.page.waitForTimeout(300);
        }
    }
    async collapseAllCheckboxes() {
        await this.collapseAllButton.click()
    }

    async selectCheckbox(optionName) {
        const config = this.CHECKBOX_CONFIG[optionName];
        if (!config) throw new Error(`❌ - Option not configured: "${optionName}"`);

        this.log('act', `Checkbox selected: ${config.label}`);

        // Buscamos el span con el texto exacto dentro del árbol de checkboxes
        const checkbox = this.page.getByRole('checkbox', { name: `Select ${config.label}` });

        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.click();

        // Retornamos el string esperado para que el test lo use en su aserción
        return config.expected;
    }
    async getResultsText() {
        return await this.resultsSection.textContent()
    }

    // Radio Button: Métodos
    async selectRadioButton(option) {
        const radioOption = this.page.locator('.form-check-label').filter({ hasText: new RegExp(`^${option}$`) })
        await radioOption.click()
        this.log('pass', `Radio button selected: ${option}`);
    }
    async getRadioResult() {
        return await this.page.locator('p:has-text("You have selected")').textContent()
    }

    // Web Tables: Métodos
    async getFilledRowCount() {
        return await this.filledRows.count()
    }

    async openRegistrationForm() {
        await this.addButton.click()
    }

    async fillRegistrationForm(data) {
        await this.firstNameInput.fill(data.firstName)
        await this.lastNameInput.fill(data.lastName)
        await this.emailInput.fill(data.email)
        await this.ageInput.fill(data.age)
        await this.salaryInput.fill(data.salary)
        await this.departmentInput.fill(data.department)
        await this.submitButton.click()
    }

    async editRecordByEmail(email, newFirstName) {
        const row = this.filledRows.filter({ hasText: email })
        await row.locator('span[title="Edit"]').click()
        await this.firstNameInput.fill(newFirstName)
        await this.submitButton.click()

        return newFirstName; // Devolvemos el nuevo nombre para validación
    }

    async deleteRecordByEmail(email) {
        this.log('act', `Deleting record: ${email.substring(0, 6)}...`);

        const row = this.allRows.filter({ has: this.page.locator('td', { hasText: email }) });
        const deleteButton = row.locator('span[id^="delete-record"]');

        await deleteButton.dispatchEvent('click');
        await this.page.locator(`text=${email}`).waitFor({ state: 'hidden', timeout: 3000 });

        this.log('pass', `Record no longer visible: ${email.substring(0, 6)}...`);
    }
    // Buttons: Métodos
    async clickButton(buttonType) {
        switch(buttonType) {
            case 'double':
                await this.doubleClickButton.dblclick();
                return await this.doubleClickMessage.textContent()
            case 'right':
                await this.rightClickButton.click( { button: 'right' } )
                return await this.rightClickMessage.textContent()
            case 'dynamic':
                await this.dynamicClickButton.click()
                return await this.dynamicClickMessage.textContent()
            default:
                throw new Error(`❌ - Invalid button type: ${buttonType}`)
        }
    }

    /**
     * Gestiona el clic en links y devuelve el resultado de la acción (Response o Page)
     */
    async clickLink(linkKey) {
        const item = this.LINK_ITEMS[linkKey];
        if (!item) throw new Error(`❌ - Key "${linkKey}" not found in LINK_ITEMS`);

        const linkLocator = this.page.locator(`#${item.id}`);

        if (item.type === 'navigation') {
            // 1. Manejo de Nueva Pestaña
            // Esperamos el evento 'page' que se dispara al abrir target="_blank"
            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page'),
                linkLocator.click(),
            ]);
            await newPage.waitForLoadState();
            return newPage; // Devolvemos la nueva pestaña para que el test la valide y cierre
        }

        if (item.type === 'api') {
            // 2. Intercepción de API
            // Esperamos la respuesta que genera el clic
            const responsePromise = this.page.waitForResponse(response =>
                response.url().includes(item.id) || response.status() === item.status
            );

            await linkLocator.click();
            const response = await responsePromise;
            return response; // Devolvemos la respuesta para validar status
        }
    }

    // Broken Links: Métodos

    /**
     * Valida si una imagen está rota verificando su estado natural en el DOM.
     * @param {Locator} imageLocator 
     * @returns {boolean} true si está rota, false si es visible
     */
    async isImageBroken(imageLocator) {
        // Evaluamos directamente en el navegador
        return await imageLocator.evaluate((img) => {
            // Una imagen está rota si no ha cargado o su ancho natural es 0
            this.log('info', `Evaluating image: src="${img.src}", complete=${img.complete}, naturalWidth=${img.naturalWidth}`);
            return !img.complete || img.naturalWidth === 0;
        });
    }

    /**
     * Valida si un link devuelve un error 4xx o 5xx.
     * @param {Locator} linkLocator 
     */
    async isLinkBroken(linkLocator) {
        const href = await linkLocator.getAttribute('href');
        // Si el href es relativo, Playwright lo resuelve automáticamente con la BaseURL
        const response = await this.page.request.get(href);
        return !response.ok(); // ok() devuelve true si el status está entre 200-299
    }

    // Upload & Download: Métodos
    async uploadFile(filePath) {
        await this.uploadInput.setInputFiles(filePath);
    }
    async getUploadedFilePath() {
        return await this.uploadedFilePath.textContent();
    }
    async downloadFile() {
        // Interceptamos la descarga para obtener el path del archivo descargado
        const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.downloadButton.click()
        ]);
        const downloadPath = await download.path();
        return downloadPath; // Devolvemos el path para validación
    }

    // Dynamic Properties: Métodos
    async isVisibleRandomIDText() {
        if(await this.randomIDText.isVisible()) {
            const textContent = await this.randomIDText.getAttribute('id');
            return textContent;
        }
        return null;
    }

    async isEnableAfterButtonEnabled() {
        // Esperamos a que el botón se habilite (después de 5 segundos)
        await this.page.waitForFunction(
            (selector) => {
                const btn = document.querySelector(selector);
                return btn && !btn.disabled;
            },
            '#enableAfter',
            { timeout: 7000 } // Un poco más del tiempo esperado para evitar falsos negativos
        );
        return await this.enableAfterButton.isEnabled();
    }

    /**
     * Obtiene el string completo de clases del botón.
     * @returns {Promise<string>}
     */
    async getButtonClasses() {
        return await this.colorChangeButton.getAttribute('class');
    }

    async isVisibleAfterButtonVisible() {
        try {
            await this.visibleAfterButton.waitFor({ state: 'visible', timeout: 7000 });
            return true;
        } catch (error) {
            return false;
        }
    }
}
module.exports = { Elements };