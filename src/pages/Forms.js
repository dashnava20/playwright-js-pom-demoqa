// src/pages/Elements.js
import { BasePage } from './BasePage.js';

class Forms extends BasePage {
    constructor(page) {
        super(page) // Llamada al constructor de BasePage
        this.page = page
        
        // Mapa de navegación
        this.MENU_ITEMS = {
            'Practice Form': { label: 'Practice Form', url: '/practice-form' },
            // Espacio para escalabilidad del proyecto (agregar más elementos del menú en el futuro)
        }

        // Practice Form
        this.nameInput = page.locator('#firstName')
        this.lastNameInput = page.locator('#lastName')
        this.emailInput = page.locator('#userEmail')
        this.genderRadioButtons = page.locator('input[name="gender"]')
        this.mobileInput = page.locator('#userNumber')
        this.dateOfBirthInput = page.locator('#dateOfBirthInput')
        this.subjectsInput = page.locator('#subjectsInput')
        this.hobbiesCheckboxes = page.locator('input[type="checkbox"][name="hobbies"]')
        this.pictureUploadInput = page.locator('#uploadPicture')
        this.currentAddressInput = page.locator('#currentAddress')
        this.stateDropdown = page.locator('#state')
        this.cityDropdown = page.locator('#city')
        this.submitButton = page.locator('#submit')
    }

    // Métodos comunes a todas las páginas (si es necesario, se pueden agregar aquí)
        // Navegación Global
        
}
module.exports = { Forms }