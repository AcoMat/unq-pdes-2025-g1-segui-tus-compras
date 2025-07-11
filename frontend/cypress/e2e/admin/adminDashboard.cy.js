describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display admin dashboard when admin user logs in', () => {
    // Login as admin
    cy.loginAdmin();
    
    // Verify admin dashboard is visible
    cy.contains('Bienvenido, Admin!').should('be.visible');
    cy.contains('Desde acá podes administrar el sitio').should('be.visible');
    
    // Verify admin components are present
    cy.contains('Usuarios de la pagina').should('be.visible');
    cy.contains('Productos más comprados').should('be.visible');
    cy.contains('Top Productos Favoritos').should('be.visible');
    cy.contains('Top Compradores').should('be.visible');
  });

  it('should not display admin dashboard for regular users', () => {
    // Login as regular user
    cy.intercept('POST', '/auth/login').as('loginRequest');
    cy.visit('/login');
    
    // Login with regular user credentials
    cy.get('input[name="email"]').type('juliantrejo@email.com');
    cy.contains('Continuar').click();
    cy.get('input[name="password"]').type('julian123');
    cy.contains('Iniciar sesión').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    
    // Verify admin dashboard is NOT visible
    cy.contains('Bienvenido, Admin!').should('not.exist');
    cy.contains('Desde acá podes administrar el sitio').should('not.exist');
    
    // Verify regular home content is visible instead
    cy.get('[data-cy="home-carousel"]').should('exist');
    cy.contains('Usuarios de la pagina').should('not.exist');
    cy.contains('Productos más comprados').should('not.exist');
    cy.contains('Top Productos Favoritos').should('not.exist');
    cy.contains('Top Compradores').should('not.exist');
  });

  it('shouldnt show the dashboard if logged in', () => {
    // Try to visit admin dashboard directly
    cy.visit('/admin');

    // Verify redirection to login page
    cy.url().should('include', '/login');
    cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión').should('be.visible');
  });
});