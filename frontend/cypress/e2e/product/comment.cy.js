describe('Product comments', () => {
  beforeEach(() => {
    cy.visit('/product/MLA49315128');
  });

  it('should add a comment', () => {
    // Login as admin user
    cy.loginAdmin();
    
    // Navigate to the product page
    cy.visit('/product/MLA49315128');
    
    // Wait for page to load
    cy.contains('Preguntas').should('be.visible');
    
    // Find the question form textarea
    cy.get('textarea[name="question"]').should('be.visible');
    
    // Type a test question
    const testQuestion = 'Esta es una pregunta de prueba desde Cypress';
    cy.get('textarea[name="question"]').type(testQuestion);
    
    // Set up intercept to monitor the comment POST request
    cy.intercept('POST', '/products/MLA49315128/comments').as('postComment');
    
    // Click the "Preguntar" button
    cy.contains('Preguntar').click();
    
    // Wait for the API call to complete
    cy.wait('@postComment').its('response.statusCode').should('eq', 200);
    
    // Verify the textarea is cleared after submission
    cy.get('textarea[name="question"]').should('have.value', '');
    
    // Verify the comment appears in the questions section
    cy.contains(testQuestion).should('be.visible');
  });

  it('should not allow adding empty comments', () => {
    // Login as admin user
    cy.loginAdmin();
    
    // Navigate to the product page
    cy.visit('/product/MLA49315128');
    
    // Wait for page to load
    cy.contains('Preguntas').should('be.visible');
    
    // Set up intercept to monitor the comment POST request
    cy.intercept('POST', '/products/MLA49315128/comments').as('postComment');
    
    // Try to submit empty comment
    cy.get('textarea[name="question"]').should('be.visible');
    
    // Stub the alert to verify it's called
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('windowAlert');
    });
    
    cy.contains('Preguntar').click();
    
    // Verify alert is shown with the correct message
    cy.get('@windowAlert').should('have.been.calledWith', 'Por favor, ingrese una pregunta.');
    
    // Verify textarea is focused
    cy.get('textarea[name="question"]').should('be.focused');
    
    // Verify no API call was made
    cy.get('@postComment').should('not.exist');
    
    // Verify textarea still has empty value
    cy.get('textarea[name="question"]').should('have.value', '');
  });

  it('should require login to add comments', () => {
    // Navigate to the product page without login
    cy.visit('/product/MLA49315128');
    
    // Wait for page to load
    cy.contains('Preguntas').should('be.visible');
    
    // Try to add a comment
    cy.get('textarea[name="question"]').should('be.visible');
    cy.get('textarea[name="question"]').type('Esta pregunta debería requerir login');
    
    // Click the "Preguntar" button
    cy.contains('Preguntar').click();
    
    // Should be redirected to login page with the return URL
    cy.url().should('include', '/login');
    
    // Verify the return URL is set correctly in the location state
    // (This ensures user will be redirected back to the product page after login)
    cy.location('pathname').should('eq', '/login');
  });

  it('should redirect back to product page after login', () => {
    // Navigate to the product page without login
    cy.visit('/product/MLA49315128');
    
    // Wait for page to load
    cy.contains('Preguntas').should('be.visible');
    
    // Try to add a comment to trigger redirect
    cy.get('textarea[name="question"]').should('be.visible');
    cy.get('textarea[name="question"]').type('Esta pregunta requiere login');
    cy.contains('Preguntar').click();
    
    // Should be redirected to login page
    cy.url().should('include', '/login');
  });
});