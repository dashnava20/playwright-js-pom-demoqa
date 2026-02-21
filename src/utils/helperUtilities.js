// utils/HelperUtilities.js

// 1. Centralizamos la data de navegación
export const MENU_ITEMS = {
    // Elements
    TextBox: { label: 'Text Box', url: '/text-box' },
    CheckBox: { label: 'Check Box', url: '/checkbox' },
    RadioBtn: { label: 'Radio Button', url: '/radio-button' },
    WebTables: { label: 'Web Tables', url: '/webtables' },
    Buttons: { label: 'Buttons', url: '/buttons' },
    Links: { label: 'Links', url: '/links' },
    BrokenLinks: { label: 'Broken Links - Images', url: '/broken' },
    UploadDownload: { label: 'Upload and Download', url: '/upload-download' },
    DynamicProperties: { label: 'Dynamic Properties', url: '/dynamic-properties' },
    // Forms
    PracticeForm: { label: 'Practice Form', url: '/practice-form' },
};

// 🛠️ Mini-logger interno para mantener el "Clean Console Protocol" en los utilities
function helperLog(context, type, message) {
    const icons = { nav: '🧭', act: '🖱️', info: '📋', pass: '✅', warn: '⚠️', end: '🎯' };
    const icon = icons[type] || '🔹';
    const prefix = `[${context}]`.padEnd(30);
    //console.log(`${prefix} ${icon} - ${message}`);
    console.log(`${prefix} | ${icon} | ${message}`);
}

/**
 * Utility to navigate using the global sidebar
 * @param {import('@playwright/test').Page} page 
 * @param {string} pageName - Key matching MENU_ITEMS
 * @returns {Promise<string>} - The expected URL slug
 */
export async function navigateTo(page, pageName, category = 'App') {
    const menuItem = MENU_ITEMS[pageName];
    if(!menuItem) throw new Error(`❌ - Page "${pageName}" not found in MENU_ITEMS`);

    const fullContext = `${category}/${pageName}`;
    helperLog(fullContext, 'nav', `Navigating to: ${menuItem.label}`);

    const itemLocator = page.locator('.element-list.show li')
        .filter({ hasText: new RegExp(`^${menuItem.label}$`) })
        .locator('a');

    if (await itemLocator.count() === 0) {
        helperLog(pageName, 'warn', 'Active menu not found, searching globally...');
    }

    await itemLocator.scrollIntoViewIfNeeded();
    await itemLocator.click();

    const expectedHeader = page.getByRole('heading', { name: menuItem.label, exact: true });
    await expectedHeader.waitFor({ state: 'visible', timeout: 5000 });

    helperLog(fullContext, 'pass', `Page loaded: ${menuItem.label}`);

    return menuItem.url;
}

/**
 * Utility to clean the UI from annoying ads and overlays
 */
export async function removeFixedOverlays(page, category = 'App') {
    await page.evaluate(() => {
        const selectors = [
            '#fixedban', 'footer', 'ins.adsbygoogle', 
            'div[id^="google_ads_iframe"]', '.modal-backdrop', 
            'div[class*="modal-backdrop"]', '#adplus-anchor', '#RightSide_Banner'
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });

        document.body.style.overflow = 'visible';
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        document.body.style.removeProperty('overflow');
    });

    helperLog(`${category}/Cleanup`, 'info', 'Fixed overlays removed');
}