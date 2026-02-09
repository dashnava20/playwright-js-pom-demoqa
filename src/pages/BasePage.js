import { removeFixedOverlays } from '../utils/helperUtilities.js';

export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async goTo(url) {
        await this.page.goto(url);
        await removeFixedOverlays(this.page);
    }

    // Método para hacer click y limpiar antes (si es necesario)
    async clickWithCleanup(locator) {
        await removeFixedOverlays(this.page); // Limpieza "just in case"
        await locator.click();
    }
}