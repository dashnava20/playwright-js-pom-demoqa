import { removeFixedOverlays } from '../utils/helperUtilities.js';

export class BasePage {
    constructor(page, category = 'App', subCategory = '') {
        this.page = page;
        this.context = subCategory ? `${category}/${subCategory}` : category;
        this.LOG_ICONS = {
            nav: '🧭', act: '💻', info: '📋', 
            pass: '✅', warn: '⚠️', end: '🎯'
        };
    }

    async goTo(url) {
        await this.page.goto(url);
        //await removeFixedOverlays(this.page);
    }

    // Método para hacer click y limpiar antes (si es necesario)
    async clickWithCleanup(locator) {
        await removeFixedOverlays(this.page); // Limpieza "just in case"
        await locator.click();
    }

    // 📝 El corazón del CCP
    log(type, message) {
        const icon = this.LOG_ICONS[type] || '🔹';
        const prefix = `[${this.context}]`.padEnd(30);
        //console.log(`${prefix} ${icon}  -  ${message}`);
        console.log(`${prefix} | ${icon} | ${message}`);
    }
}