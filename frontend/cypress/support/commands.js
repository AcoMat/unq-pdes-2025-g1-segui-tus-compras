Cypress.Commands.add('loginAdmin', () => {
  cy.intercept('POST', '/auth/login').as('loginRequest');
  cy.visit('/login');
  // Paso 1: Email
  cy.get('input[name="email"]').type("admin@email.com");
  cy.contains('Continuar').click();
  cy.get('input[name="password"]').type('admin123');
  cy.contains('Iniciar sesión').click();
  cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
});
