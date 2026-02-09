// tests/e2e_elements.spec.js
import { test, expect } from '@playwright/test';
import { Elements } from '../src/pages/Elements.js';
import { removeFixedOverlays } from '../src/utils/helperUtilities.js';
import testData from '../src/data/dataTestDemoQA.json' assert { type: 'json' };

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
});
