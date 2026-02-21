// tests/e2e_elements.spec.js
import { test, expect } from '@playwright/test';
import { Elements } from '../src/pages/Elements.js';
import { navigateTo, removeFixedOverlays } from '../src/utils/helperUtilities.js';
import testData from '../src/data/dataTestDemoQA.json' assert { type: 'json' };
import testTableData from '../src/data/dataTableDemoQA.json' assert { type: 'json' };


test.describe('Elements Page Tests', () => {
    let elements;
    let testContext = 'Elements'; // Contexto general para los logs de esta suite

    test.beforeEach(async ({ page }) => {
        elements = new Elements(page, testContext);
        const elementsBtn = page.getByRole('link', { name: 'Elements' })
        
        await elements.goTo('https://demoqa.com/');
        await elementsBtn.click();
        await expect(page).toHaveURL(/.*elements/);
        
        await page.waitForLoadState('domcontentloaded');
        await removeFixedOverlays(page, 'Elements');
    });

    test('Fill Text Box Form', async ({ page }) => {
        elements.context = 'Elements/TextBox'; //Log especifico para este test
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'TextBox', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Llenado del formulario
        const { fullName, email, currentAddress, permanentAddress } = testData.textBoxData;
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

        elements.log('pass', 'Form filled and submitted successfully with correct output');

        // 4. E2E Mensaje de Confirmación
        elements.log('end', 'Text Box: Form submitted and output verified');
    });
    
    test('Check Box Interactions', async ({ page }) => {
        elements.context = 'Elements/CheckBox'; //Log especifico para este test
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'CheckBox', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones
        await elements.expandAllCheckboxes();

        const expectedItems = [];
        expectedItems.push(await elements.selectCheckbox('Desktop'));
        expectedItems.push(await elements.selectCheckbox('React'));
        expectedItems.push(await elements.selectCheckbox('Downloads'));

        // 3. Aserción dinámica
        const resultsText = (await elements.getResultsText()).replace(/\s+/g, '');

        for (const item of expectedItems) {
            expect(resultsText).toContain(item);
        }

        elements.log('pass', `Check Box: Check Box interactions completed successfully`);

        // 4. E2E Mensaje de Confirmación
        elements.log('end', `Check Box: Tree nodes selected and results matched`);
    });

    test('Radio Button Interactions', async ({ page }) => {
        elements.context = 'Elements/RadioBtn'; //Log especifico para este test
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'RadioBtn', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones con Radio Buttons
        await elements.selectRadioButton('Yes');
        const yesResult = await elements.getRadioResult();
        expect(yesResult).toContain('You have selected Yes');

        await elements.selectRadioButton('Impressive');
        const impressiveResult = await elements.getRadioResult();
        expect(impressiveResult).toContain('You have selected Impressive');

        // 3. E2E Mensaje de Confirmación
        elements.log('pass', `Radio Button: interactions completed successfully`);
    });

    test('Web Tables Interactions', async ({ page }) => {
        elements.context = 'Elements/WebTables'; //Log especifico para este test

        const { firstName, lastName, email, age, salary, department } = testTableData.tableData;

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'WebTables', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Validar cantidad inicial (DemoQA trae 3 por defecto)
        const initialCount = await elements.getFilledRowCount();
        expect(initialCount).toBe(3);

        elements.log('pass', `Table state: Initial row count is ${initialCount}`);

        // 3 & 4. Añadir registro y llenar pop-up
        await elements.openRegistrationForm();
        await expect(elements.registrationModal).toBeVisible(); // Validamos que aparezca

        await elements.fillRegistrationForm(testTableData.tableData);
        await expect(elements.registrationModal).toBeHidden(); // Validamos que desaparezca
        elements.log('pass', `Record added: ${email.substring(0, 6)}...`);

        // 5. Volver a validar la cantidad (Debe ser +1)
        const newCount = await elements.getFilledRowCount();
        expect(newCount).toBe(initialCount + 1);
        
        elements.log('pass', `Table state: New filled row count is ${newCount}`);

        // 6. Editar el nuevo registro y validar el cambio
        const newFirstName = 'UpdatedName';
        const updatedName = await elements.editRecordByEmail(email, newFirstName);
        await expect(elements.registrationModal).toBeHidden(); // Validamos que desaparezca
        expect(updatedName).toBe(newFirstName); // Validar mejor que el cambio se reflejó en la tabla
        
        elements.log('pass', `Record edited: ${email.substring(0, 6)}... with new first name: ${updatedName}`);

        // 7. Eliminar el nuevo registro y validar que volvimos al conteo inicial
        await elements.deleteRecordByEmail(email);
        const finalCount = await elements.getFilledRowCount();
        expect(finalCount).toBe(initialCount);

        elements.log('pass', `Table state: Final filled row count is ${finalCount}`);
        
        // 8. E2E Mensaje de Confirmación
        elements.log('pass', `Web Tables: CRUD cycle completed (Add/Count/Delete).`);
    });

    test('Button Interactions', async ({ page }) => {
        elements.context = 'Elements/Buttons'; //Log especifico para este test
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'Buttons', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones y validación de mensajes
        const doubleClickMessage = await elements.clickButton('double');
        expect(doubleClickMessage).toContain('You have done a double click');

        const rightClickMessage = await elements.clickButton('right');
        expect(rightClickMessage).toContain('You have done a right click');

        const dynamicClickMessage = await elements.clickButton('dynamic');
        expect(dynamicClickMessage).toContain('You have done a dynamic click');

        elements.log('pass', 'Button interactions completed successfully with correct messages');

        // 3. E2E Mensaje de Confirmación
        elements.log('pass', `Buttons: Click, Double Click & Right Click verified`);
    });

    test('E2E: Navigation Links (New Tabs)', async ({ page }) => {
        elements.context = 'Elements/Links'; //Log especifico para este test

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'Links', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Filtramos solo los de navegación (Home, DynamicHome)
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
                
                elements.log('pass', `[NAV] ${key}: New tab navigation verified`);
            } catch (error) {
                console.error(`❌ - [NAV] ${key} failed: ${error.message}`);
                // No se lanza el error para que el 'for' continúe
            }
        }

        elements.log('pass', `Final Report (NAV): ${functional}/${navLinks.length} links functional`);
        
        expect(functional, 'Not all navigation links passed').toBe(navLinks.length);
        
        // 3. E2E Mensaje de Confirmación
        elements.log('pass', `Links: New tab navigation verified (${functional}/${navLinks.length})`);
    });

    test('E2E: API Status Links', async ({ page }) => {
        elements.context = 'Elements/Links'; //Log especifico para este test
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'Links', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Filtramos solo los de api (status codes)
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
                
                elements.log('pass', `[API] ${key}: Response ${expected.status} verified.`);
            } catch (error) {
                console.error(`❌ - [API] ${key} failed: ${error.message}`);
                failedLinks.push(key);
            }
        }

        elements.log('pass', `Final Report (API): ${functional}/${apiLinks.length} links functional`);

        // Control en caso de errores en el bucle:
        if (failedLinks.length > 0) {
            throw new Error(`❌ - The following API links failed: ${failedLinks.join(', ')}`);
        }

        // 4. E2E Mensaje de Confirmación
        elements.log('pass', `Links: API status codes validated (${functional}/${apiLinks.length})`);
    });
   
    test('Verify valid and broken resources', async ({ page }) => {
        test.fixme(true, 'Environment issue: Both images are returning broken on DemoQA');
        /**
         * 19/12/2026: Ejecución pausada debido a bug en Images (both are broken).
         * Links funcionales pero las imágenes están fallando en el entorno de DemoQA.
         * Se recomienda revisar manualmente o esperar a que lo solucionen para reactivar este test.
         */

        elements.context = 'Elements/BrokenLinks'; //Log especifico para este test

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'BrokenLinks', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Validar Imágenes
        const isValidImgBroken = await elements.isImageBroken(elements.validImage);
        const isBrokenImgBroken = await elements.isImageBroken(elements.brokenImage);

        expect(isValidImgBroken, 'Valid image should not be broken').toBe(false);
        expect(isBrokenImgBroken, 'Broken image should be detected as broken').toBe(true);
        
        elements.log('pass', 'Image integrity checks passed');

        // 3. Validar Links
        const isValidLinkBroken = await elements.isLinkBroken(elements.validLink);
        const isBrokenLinkBroken = await elements.isLinkBroken(elements.brokenLink);

        expect(isValidLinkBroken, 'Valid link should return OK').toBe(false);
        expect(isBrokenLinkBroken, 'Broken link should return an error status').toBe(true);
        
        elements.log('pass', 'Link status checks passed');

        // 4. E2E Mensaje de Confirmación
        elements.log('pass', `Broken Links: Image integrity and URL status checked successfully`);
    });

    test('Verify upload and download functionality', async ({ page }) => {
        elements.context = 'Elements/UploadDownload'; //Log especifico para este test
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'UploadDownload', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Validar Descarga
        const downloadedFilePath = await elements.downloadFile();
        expect(downloadedFilePath).toBeTruthy();
        
        elements.log('pass', `File downloaded successfully: ${downloadedFilePath}`);

        // 3. Validar Subida
        const fileToUpload = 'src/data/test_upload_file.txt'; // File located in src/data directory
        await elements.uploadFile(fileToUpload);
        const uploadResult = await elements.getUploadedFilePath();
        expect(uploadResult).toContain('test_upload_file.txt');
        elements.log('pass', `File uploaded successfully: ${fileToUpload}`);

        // 4. E2E Mensaje de Confirmación
        elements.log('pass', `Upload & Download: File upload and download verified`);
    });

    test('Verify dynamic properties', async ({ page }) => {
        elements.context = 'Elements/DynamicProperties'; //Log especifico para este test

        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await navigateTo(page, 'DynamicProperties', testContext);
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Verificar que el texto con ID aleatorio sea visible
        const isRandomIDVisible = await elements.isVisibleRandomIDText();
        expect(isRandomIDVisible.length).toBeGreaterThan(0);
        
        elements.log('pass', `Random ID "${isRandomIDVisible}" text is visible.`);

        // 3. Verificar que el botón se habilite después de un tiempo
        const isEnableAfter = await elements.isEnableAfterButtonEnabled();
        expect(isEnableAfter).toBe(true);
        
        elements.log('pass', 'Button is enabled after 5 seconds.');

        // 4. Verificar que el botón reciba la clase 'text-danger'
        elements.log('info', 'Waiting for button to change color...');

        await expect.poll(async () => {
            return await elements.getButtonClasses();
        }, {
            message: 'Button did not receive text-danger class within timeout',
            timeout: 7000,
        }).toContain('text-danger');

        elements.log('pass', 'Button changed color with "text-danger" class after 5 seconds.');

        // 4. Verificar que el botón "Visible After 5 Seconds" aparezca
        elements.log('info', 'Waiting for the hidden button to appear...');

        const isVisible = await elements.isVisibleAfterButtonVisible();
        expect(isVisible).toBe(true);

        elements.log('pass', `Button "Visible After 5 Seconds" is now: ${isVisible ? 'Visible' : 'Hidden'}`);

        // 5. E2E Mensaje de Confirmación
        elements.log('pass', `Dynamic Properties: Visibility and style changes verified`);
    });
});