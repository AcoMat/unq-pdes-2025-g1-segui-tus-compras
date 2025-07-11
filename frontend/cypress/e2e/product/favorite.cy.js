describe('Pruebas de funcionalidad de favoritos', () => {
    // Test para agregar a favoritos sin login
    it('debería redireccionar a /login al intentar agregar a favoritos sin login', () => {
        cy.visit('/product/MLA49315128');
        // El botón de favoritos debe estar visible
        cy.get('.like-button').should('be.visible');
        cy.get('.like-button').click();
        cy.url().should('include', '/login');
    });

    // Test para agregar a favoritos con login
    it('debería agregar a favoritos el producto estando logueado', () => {
        cy.loginAdmin();
        // Ahora va a la página del producto y lo agrega a favoritos
        cy.visit('/product/MLA49315128');
        cy.get('.like-button')
            .should('be.visible')
            .should('have.class', 'not-liked');
        cy.intercept('PUT', 'http://localhost:8080/favorites').as('putFavorites');
        cy.get('.like-button').click();
        cy.wait('@putFavorites').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body).to.eq('Product MLA49315128 added to favorites');
        });
        cy.get('.like-button')
            .should('be.visible')
            .should('have.class', 'liked');
        //Deslikea el producto
        cy.get('.like-button')
            .should('be.visible')
            .should('have.class', 'liked');
        cy.intercept('PUT', 'http://localhost:8080/favorites').as('removeFavorite');
        cy.get('.like-button').click();
        cy.wait('@removeFavorite').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body).to.eq('Product MLA49315128 removed from favorites');
        });
    });

});