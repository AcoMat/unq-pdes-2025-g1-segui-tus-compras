describe('Purchase flow', () => {
  it('should allow admin to purchase product MLA49315128 after login', () => {
    cy.loginAdmin();
    
    // Go to product page
    cy.visit('/product/MLA49315128');
    
    // Add to cart
    cy.contains('Agregar al carrito').click();
    
    // Go to cart
    cy.visit('/cart');
    
    // Proceed to checkout
    cy.intercept('Post', '/purchases').as('purchase');
    cy.contains('Continuar compra').click();
    // Confirm purchase
    cy.contains('Continuar').click();
    // Assert purchase success
    cy.wait('@purchase').its('response.statusCode').should('eq', 200);
  });

  it('should not allow user to purchase product MLA49315128 without login', () => {
    cy.visit('/product/MLA49315128');

    // Try to add to cart
    cy.contains('Agregar al carrito').click();

    // Assert that user is redirected to login page
    cy.url().should('include', '/login');
    cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión', { matchCase: false }).should('exist');
  });
});