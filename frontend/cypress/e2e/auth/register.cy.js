describe('Register page e2e tests', () => {
    const uniqueEmail = `testuser${Date.now()}@mail.com`;
    const uniqueEmail2 = `testuser${Date.now()}2@mail.com`;

    beforeEach(() => {
        cy.visit('/register');
        cy.intercept('POST', '/auth/register').as('registerRequest');
        cy.intercept('POST', '/auth/login').as('loginRequest');
    });

    it('Realiza un registro exitoso', () => {
        // Paso 1: Email
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[type="checkbox"]').check();
        cy.contains('Continuar').click();
        // Paso 2: Nombre y Apellido
        cy.get('input[name="name"]').type('Juan');
        cy.get('input[name="lastName"]').type('Pérez');
        cy.contains('Continuar').click();
        // Paso 3: Contraseña
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="confirmPassword"]').type('Password123!');
        cy.contains('Continuar').click();
        // Debe mostrar mensaje de éxito
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);
    });

    it('No permite registrar con un email ya usado', () => {
        // Paso 1: Email
        cy.get('input[name="email"]').type(uniqueEmail2);
        cy.get('input[type="checkbox"]').check();
        cy.contains('Continuar').click();
        // Paso 2: Nombre y Apellido
        cy.get('input[name="name"]').type('Pedro');
        cy.get('input[name="lastName"]').type('Gómez');
        cy.contains('Continuar').click();
        // Paso 3: Contraseña
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="confirmPassword"]').type('Password123!');
        cy.contains('Continuar').click();
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);
        // Se creo la cuenta
        cy.visit("/register")
        cy.contains('button', 'Cerrar sesión').click();
        cy.visit("/register")
        // Vuelvo a registrar con mismo email
        cy.get('input[name="email"]').type(uniqueEmail2);
        cy.get('input[type="checkbox"]').check();
        cy.contains('Continuar').click();
        // Paso 2: Nombre y Apellido
        cy.get('input[name="name"]').type('Pedro');
        cy.get('input[name="lastName"]').type('Gómez');
        cy.contains('Continuar').click();
        // Paso 3: Contraseña
        cy.get('input[name="password"]').type('Password123!');
        cy.get('input[name="confirmPassword"]').type('Password123!');
        cy.contains('Continuar').click();
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 400);
        cy.contains('Ups').should('be.visible');
    });

    it('Valida los campos del formulario de email', () => {
        // Paso 1: Email inválido
        cy.get('input[name="email"]').type('noesunemail');
        cy.get('input[type="checkbox"]').check();
        cy.contains('Continuar').click();
        cy.contains('Por favor, ingrese un email válido').should('be.visible');
        // Email válido pero sin aceptar términos
        cy.get('input[name="email"]').clear().type('valido@mail.com');
        cy.get('input[type="checkbox"]').uncheck();
        cy.contains('Continuar').click();
        cy.contains('Por favor, acepte los términos y condiciones').should('be.visible');
    });

    it('Valida los campos del formulario de nombre y apellido', () => {
        // Paso 1: Email válido
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[type="checkbox"]').check();
        cy.contains('Continuar').click();
        // Nombre y Apellido vacío
        cy.get('input[name="name"]').clear();
        cy.contains('Continuar').click();
        cy.contains('Por favor, ingrese un nombre y apellido').should('be.visible');
        // Nombre pero no Apellido
        cy.get('input[name="name"]').type('Juan');
        cy.get('input[name="lastName"]').clear();
        cy.contains('Continuar').click();
        cy.contains('Por favor, ingrese un nombre y apellido').should('be.visible');
    });

    it('Valida los campos del formulario de contraseña', () => {
        // Paso 1: Email válido
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[type="checkbox"]').check();
        cy.contains('Continuar').click();
        // Paso 2: Nombre y Apellido
        cy.get('input[name="name"]').type('Juan');
        cy.get('input[name="lastName"]').type('Pérez');
        cy.contains('Continuar').click();
        // Contraseña vacía
        cy.get('input[name="password"]').clear();
        cy.contains('Continuar').click();
        cy.contains('Por favor, ingrese una contraseña').should('be.visible');
        // No confirmación de contraseña
        cy.get('input[name="password"]').type('123');
        cy.contains('Continuar').click();
        cy.contains('Las contraseñas no coinciden').should('be.visible');
        // Contraseña no coinciden
        cy.get('input[name="confirmPassword"]').type('1233456');
        cy.contains('Continuar').click();
        cy.contains('Las contraseñas no coinciden').should('be.visible');
        // Continuar con contraseña invalida
        cy.get('input[name="confirmPassword"]').clear();
        cy.get('input[name="confirmPassword"]').type('123');
        cy.contains('Continuar').click();
        // Cargando
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 400);
        // Debe mostrar mensaje de error
        cy.contains('Ups').should('be.visible');
    });
});