/**
 * Utility to clean the UI from annoying ads and overlays in DemoQA
 * @param {import('@playwright/test').Page} page 
 */
export async function removeFixedOverlays(page) {
    await page.evaluate(() => {
        const selectors = [
            '#fixedban',            // El banner de arriba
            'footer',               // El footer que suele tapar botones
            '.modal-backdrop',      // Sobras de modales
            'div[class*="modal-backdrop"]',
        ];

        selectors.forEach(sel => {
            const elements = document.querySelectorAll(sel);
            elements.forEach(el => el.remove());
        });

        // Cleanup de estilos en el body (Bootstrap)
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');
    });
}