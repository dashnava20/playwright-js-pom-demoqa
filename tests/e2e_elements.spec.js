// tests/e2e_elements.spec.js
import { test, expect } from '@playwright/test';
import { Elements } from '../src/pages/Elements.js';
import { removeFixedOverlays } from '../src/utils/helperUtilities.js';
import testData from '../src/data/dataTestDemoQA.json' assert { type: 'json' };
import testTableData from '../src/data/dataTableDemoQA.json' assert { type: 'json' };

test.describe('Elements Page Tests', () => {

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
    });

    test('Button Interactions', async ({ page }) => {
        const elements = new Elements(page);
        
        // 1. Navegación dinámica y validación de URL
        const expectedUrl = await elements.navigateTo('Buttons');
        expect(page).toHaveURL(new RegExp(expectedUrl));

        // 2. Interacciones con Buttons
        await elements.clickDoubleClickButton();
        await elements.clickRightClickButton();
        await elements.clickDynamicClickButton();

        // 3. Validar mensajes de los botones
        const doubleClickMessage = await elements.getDoubleClickMessage();
        expect(doubleClickMessage).toContain('You have done a double click');

        const rightClickMessage = await elements.getRightClickMessage();
        expect(rightClickMessage).toContain('You have done a right click');

        const dynamicClickMessage = await elements.getDynamicClickMessage();
        expect(dynamicClickMessage).toContain('You have done a dynamic click');

        // 4. E2E Mensaje de Confirmación
        console.log('✅ - Button interactions completed successfully.');
    });
});