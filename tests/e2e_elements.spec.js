// tests/e2e_elements.spec.js
import { test, expect } from '@playwright/test';
import { Elements } from '../pages/Elements.js';
import { removeFixedOverlays } from '../src/utils/helperUtilities.js';

test.describe('Elements Page Tests', () => {

    test.beforeEach(async ({ page }) => {
        const elements = new Elements(page);
        await page.goto('https://demoqa.com/elements');
        await removeFixedOverlays(page);
    });

    test('Fill Text Box Form', async ({ page }) => {
        const elements = new Elements(page);
        await elements.navigateToTextBox();
        await elements.fillTextBoxForm(
            'John Doe',
            'john.doe@example.com',
            '123 Main St, Anytown, USA',
            '456 Elm St, Othertown, USA'
        );
        
        // Assertions
        const outputName = await elements.page.locator('#name').textContent();
        expect(outputName).toContain('John Doe');

        // E2E confirmation message
        console.log('Text Box form submitted successfully and verified.');
    });
    
    test('Check Box Interactions', async ({ page }) => {
        const elements = new Elements(page);
        await elements.navigateToCheckBox();
        await elements.expandAllCheckboxes();
        await elements.selectDesktopCheckbox();
        await elements.selectReactCheckbox();
        await elements.selectDownloadsCheckbox();
        
        // Assertions
        const resultsText = await elements.getResultsText();
        expect(resultsText).toContain('You have selected :desktopnotescommandsreactdownloadswordFileexcelFile');

        // E2E confirmation message
        console.log('Check Box interactions completed successfully.');
    });

    // Temporary test
    test.only('Temporary Test - To be removed later', async ({ page }) => {
        await page.goto('https://demos.telerik.com/kendo-ui/grid/index');
        const grid = page.locator('#grid');
        const gridSearchBar = grid.getByRole('textbox', { name: 'Search...' })
        
        await expect(grid).toBeVisible();
        
        const rows = grid.locator('tbody tr');
        const rowCount = await rows.count();
        console.log(`Original #rows: ${rowCount}`);
        
        await gridSearchBar.fill('Tofu');
        await expect(rows).toHaveCount(3); // Considerando el separador de categorías como una fila más

        const filteredRowCount = await rows.count();
        console.log(`Filtered #rows: ${filteredRowCount}`);
        expect(rows).toHaveCount(3); // Considerando el separador de categorías como una fila más
        await expect(rows.nth(1)).toContainText('Tofu');
        
        
    });

});