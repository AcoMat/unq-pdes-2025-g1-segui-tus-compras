describe('Profile page e2e Test', () => {
    const uniqueEmail = `testuser_${Date.now()}@mail.com`;

    it('should not display the profile page without login', () => {
        // try to visit the profile page unlogged in
        cy.visit('/profile')
        // expect the user to be redirected to the login page
        cy.url().should('include', '/login')
        cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión', { matchCase: false }).should('exist')
    })
    
    it('should display profile page', () => {
        cy.loginAdmin()
        cy.visit('/profile')
        cy.contains('Matias Acosta').should('exist')
        cy.contains('admin@email.com').should('exist')
        cy.contains('Cerrar sesión').should('exist')
    })
})