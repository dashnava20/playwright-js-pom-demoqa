// tests/e2e_elements.spec.js
import { test, expect } from '@playwright/test';
import { Elements } from '../src/pages/Elements.js';
import { removeFixedOverlays } from '../src/utils/helperUtilities.js';
import testData from '../src/data/dataTestDemoQA.json' assert { type: 'json' };
import testTableData from '../src/data/dataTableDemoQA.json' assert { type: 'json' };

test.describe('Elements Page Tests', () => {
    const LOG_PREFIX = '📊 - E2E/Elements/';

    test.beforeEach(async ({ page }) => {
        const elements = new Elements(page);
        await elements.goTo('https://demoqa.com/elements');
        await removeFixedOverlays(page);
    });

    test('Fill Text Box Form', async ({ page }) => {
        const elements = new Elements(page);
        const { fullName, email, currentAddress, permanentAddress } = testData.textBoxData;
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('Text Box');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Llenado del formulario
        await elements.fillTextBoxForm(
            fullName,
            email,
            currentAddress,
            permanentAddress
        );
        
        // 3. Aserciones
        const outputName = await elements.page.locator('#name').textContent();
        expect(outputName).toContain(fullName);

        const outputEmail = await elements.page.locator('#email').textContent();
        expect(outputEmail).toContain(email);

        const outputCurrentAddress = await elements.page.locator('#currentAddress').last().textContent(); //Existen dos elementos con el mismo id, por lo que se utiliza .last() para seleccionar el correcto
        expect(outputCurrentAddress).toContain(currentAddress);

        const outputPermanentAddress = await elements.page.locator('#permanentAddress').last().textContent(); //Existen dos elementos con el mismo id, por lo que se utiliza .last() para seleccionar el correcto
        expect(outputPermanentAddress).toContain(permanentAddress);

        // 4. E2E Mensaje de Confirmación
        console.log('✅ - Text Box form submitted successfully and verified.');
        console.log(`${LOG_PREFIX}Text Box: Form submitted and output verified.`);
        
    });
    
    test('Check Box Interactions', async ({ page }) => {
        const elements = new Elements(page);
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('CheckBox');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones con Check Boxes
        await elements.expandAllCheckboxes();
        await elements.selectDesktopCheckbox();
        await elements.selectReactCheckbox();
        await elements.selectDownloadsCheckbox();
        
        // 3. Aserciones
        const resultsText = await elements.getResultsText();
        expect(resultsText).toContain('You have selected :desktopnotescommandsreactdownloadswordFileexcelFile');

        // 4. E2E Mensaje de Confirmación
        console.log('✅ - Check Box interactions completed successfully.');
        console.log(`${LOG_PREFIX}Check Box: Tree nodes selected and results matched.`);
    });

    test('Radio Button Interactions', async ({ page }) => {
        const elements = new Elements(page);
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('RadioBtn');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones con Radio Buttons
        await elements.selectRadioButton('Yes');
        const yesResult = await elements.getRadioResult();
        expect(yesResult).toContain('You have selected Yes');

        await elements.selectRadioButton('Impressive');
        const impressiveResult = await elements.getRadioResult();
        expect(impressiveResult).toContain('You have selected Impressive');

        // 3. E2E Mensaje de Confirmación
        console.log('✅ - Radio Button interactions completed successfully.');
        console.log(`${LOG_PREFIX}Radio Button: Dynamic selection and state verified.`);
    });

    test('Web Tables Interactions', async ({ page }) => {
        const elements = new Elements(page);
        const { firstName, lastName, email, age, salary, department } = testTableData.tableData;

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('WebTables');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Validar cantidad inicial (DemoQA trae 3 por defecto)
        const initialCount = await elements.getFilledRowCount();
        expect(initialCount).toBe(3);
        console.log(`✅ - Initial filled row count: ${initialCount}`);

        // 3 & 4. Añadir registro y llenar pop-up
        await elements.openRegistrationForm();
        await expect(elements.registrationModal).toBeVisible(); // Validar que aparezca
        await elements.fillRegistrationForm(testTableData.tableData);
        await expect(elements.registrationModal).toBeHidden(); // Validar que desaparezca
        console.log(`✅ - New register added successfully with email: ${email}`);

        // 5. Volver a validar la cantidad (Debe ser +1)
        const newCount = await elements.getFilledRowCount();
        expect(newCount).toBe(initialCount + 1);
        console.log(`✅ - New filled row count: ${newCount}`);

        // 6. Eliminar el nuevo registro y validar que volvimos al conteo inicial
        await elements.deleteRecordByEmail(testTableData.tableData.email);
        const finalCount = await elements.getFilledRowCount();
        expect(finalCount).toBe(initialCount);
        console.log(`✅ - Register deleted successfully with email: ${email}`);
        console.log(`✅ - Final filled row count: ${finalCount}`);
        console.log(`${LOG_PREFIX}Web Tables: CRUD cycle completed (Add/Count/Delete).`);
    });

    test('Button Interactions', async ({ page }) => {
        const elements = new Elements(page);
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('Buttons');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones y validación de mensajes
        const doubleClickMessage = await elements.clickButton('double');
        expect(doubleClickMessage).toContain('You have done a double click');

        const rightClickMessage = await elements.clickButton('right');
        expect(rightClickMessage).toContain('You have done a right click');

        const dynamicClickMessage = await elements.clickButton('dynamic');
        expect(dynamicClickMessage).toContain('You have done a dynamic click');

        // 4. E2E Mensaje de Confirmación
        console.log('✅ - Button interactions completed successfully.');
        console.log(`${LOG_PREFIX}Buttons: Click, Double Click & Right Click verified.`);
    });

    test('E2E: Navigation Links (New Tabs)', async ({ page }) => {
        const elements = new Elements(page);

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('Links');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // Filtramos solo los de navegación (Home, DynamicHome)
        const navLinks = Object.keys(elements.LINK_ITEMS).filter(key => 
            elements.LINK_ITEMS[key].type === 'navigation'
        );

        let functional = 0;

        for (const key of navLinks) {
            try {
                const newTab = await elements.clickLink(key);
                
                // Aserción
                await expect(newTab).toHaveURL(new RegExp(elements.LINK_ITEMS[key].expectedUrl));
                
                await newTab.close(); // Limpieza inmediata
                functional++;
                console.log(`✅ - [NAV] ${key}: Validated successfully.`);
            } catch (error) {
                console.error(`❌ - [NAV] ${key} failed: ${error.message}`);
                // No se lanza el error para que el 'for' continúe
            }
        }

        console.log(`✅ - Final Report (NAV): ${functional}/${navLinks.length} links functional.`);
        
        // Senior Tip: Si algo falló, forzamos que el test falle al final para ser honestos con el reporte
        expect(functional, 'Not all navigation links passed').toBe(navLinks.length);
        console.log(`${LOG_PREFIX}Links: New tab navigation verified (${functional}/${navLinks.length}).`);
    });

    test('E2E: API Status Links', async ({ page }) => {
        const elements = new Elements(page);
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('Links');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        const apiLinks = Object.keys(elements.LINK_ITEMS).filter(key => 
            elements.LINK_ITEMS[key].type === 'api'
        );

        let functional = 0;
        const failedLinks = [];

        for (const key of apiLinks) {
            try {
                const response = await elements.clickLink(key);
                const expected = elements.LINK_ITEMS[key];

                // Validamos status code
                expect(response.status()).toBe(expected.status);
                
                // Validamos texto en la UI (el párrafo que aparece abajo)
                const statusMsg = page.locator('#linkResponse');
                await expect(statusMsg).toContainText(expected.status.toString());
                await expect(statusMsg).toContainText(expected.statusText);

                functional++;
                console.log(`✅ - [API] ${key}: Response ${expected.status} verified.`);
            } catch (error) {
                console.error(`❌ - [API] ${key} failed: ${error.message}`);
                failedLinks.push(key);
            }
        }

        console.log(`✅ - Final Report (API): ${functional}/${apiLinks.length} links functional.`);

        // Si quieres que el test falle si hubo errores en el bucle:
        if (failedLinks.length > 0) {
            throw new Error(`❌ - The following API links failed: ${failedLinks.join(', ')}`);
        }
        console.log(`${LOG_PREFIX}Links: API status codes validated (${functional}/${apiLinks.length}).`);
    });
   
    test('Verify valid and broken resources', async ({ page }) => {
        const elements = new Elements(page);

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('BrokenLinks');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Validar Imágenes
        const isValidImgBroken = await elements.isImageBroken(elements.validImage);
        const isBrokenImgBroken = await elements.isImageBroken(elements.brokenImage);

        expect(isValidImgBroken, 'Valid image should not be broken').toBe(false);
        expect(isBrokenImgBroken, 'Broken image should be detected as broken').toBe(true);
        console.log('✅ - Image integrity checks passed.');

        // 3. Validar Links
        const isValidLinkBroken = await elements.isLinkBroken(elements.validLink);
        const isBrokenLinkBroken = await elements.isLinkBroken(elements.brokenLink);

        expect(isValidLinkBroken, 'Valid link should return OK').toBe(false);
        expect(isBrokenLinkBroken, 'Broken link should return an error status').toBe(true);
        console.log('✅ - Link status checks passed.');

        // Tu cierre estandarizado
        console.log(`${LOG_PREFIX}Broken Links: Image integrity and URL status checked.`);
    });
});