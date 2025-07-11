describe('Product Review Tests', () => {
    describe('Access Control', () => {
        it('should redirect to login if user is not authenticated', () => {
            cy.visit('/product/MLA22986401/review');
            cy.url().should('include', '/product/MLA22986401');
            cy.url().should('not.include', '/review');
        });

        it('should redirect to product page if user has not bought the product', () => {
            cy.loginAdmin();
            cy.visit('/product/MLA22986401/review');
            cy.url().should('include', '/product/MLA22986401');
            cy.url().should('not.include', '/review');
        });
    });

    describe('Review Form', () => {
        before(() => {
            cy.loginAdmin();
            // Secure login and add product purchase
            cy.visit('/product/MLA49315128');
            cy.contains('Agregar al carrito').click();
            cy.visit('/cart');
            cy.intercept('Post', '/purchases').as('purchase');
            cy.contains('Continuar compra').click();
            cy.contains('Continuar').click();
            cy.wait('@purchase').its('response.statusCode').should('eq', 200);
            cy.visit('/profile');
            cy.contains('Cerrar sesión').click();
        });

        beforeEach(() => {
            cy.loginAdmin();
            cy.visit('/product/MLA49315128/review');
            cy.contains('¿Qué te pareció este producto?').should('be.visible');
        })

        it('should display product information and review form', () => {
            // Check product image is displayed
            cy.get('img').first().should('be.visible');

            // Check product question
            cy.contains('¿Qué te pareció este producto?').should('be.visible');

            // Check star rating component
            cy.get('[alt="Empty Star"]').should('have.length', 5);

            // Check rating labels
            cy.contains('Malo').should('be.visible');
            cy.contains('Excelente').should('be.visible');

            // Check optional comment section
            cy.contains('Contanos más acerca del producto').should('be.visible');
            cy.contains('(opcional)').should('be.visible');
            cy.get('textarea').should('be.visible');

            // Check action buttons
            cy.contains('Cancelar').should('be.visible');
            cy.contains('Enviar').should('be.visible');
        });

        it('should allow user to select star rating', () => {
            // Initially all stars should be empty
            cy.get('[alt="Empty Star"]').should('have.length', 5);
            cy.get('[alt="Filled Star"]').should('have.length', 0);

            // Click on third star
            cy.get('[alt="Empty Star"]').eq(2).click();

            // Should have 3 filled stars and 2 empty stars
            cy.get('[alt="Filled Star"]').should('have.length', 3);
            cy.get('[alt="Empty Star"]').should('have.length', 2);

            // Click on fifth star
            cy.get('[alt="Empty Star"]').eq(1).click(); // This would be the 5th star now

            // Should have 5 filled stars
            cy.get('[alt="Filled Star"]').should('have.length', 5);
            cy.get('[alt="Empty Star"]').should('have.length', 0);
        });

        it('should allow user to deselect rating by clicking the same star', () => {
            // Select 3 stars
            cy.get('[alt="Empty Star"]').eq(2).click();
            cy.get('[alt="Filled Star"]').should('have.length', 3);

            // Click the same (3rd) star again to deselect
            cy.get('[alt="Filled Star"]').eq(2).click();

            // Should be back to no stars selected
            cy.get('[alt="Empty Star"]').should('have.length', 5);
            cy.get('[alt="Filled Star"]').should('have.length', 0);
        });

        it('should allow user to add optional comment', () => {
            const testComment = 'Este producto es excelente, muy buena calidad y llegó rápido.';

            cy.get('textarea').type(testComment);
            cy.get('textarea').should('have.value', testComment);
        });

        it('should show error when trying to submit without rating', () => {
            // Add comment but no rating
            cy.get('textarea').type('Buen producto');
            // Try to submit
            cy.contains('Enviar').click();
            // Should show alert
            cy.on('window:alert', (str) => {
                expect(str).to.equal('Por favor, selecciona una calificación.');
            });
        });

        it('should successfully submit review with rating and comment', () => {
            // Now visit the review page
            cy.intercept('POST', '/products/MLA49315128/reviews').as('postReview');
            // Select 4 stars
            cy.get('[alt="Empty Star"]').eq(3).click();
            cy.get('[alt="Filled Star"]').should('have.length', 4);

            // Add comment
            const testComment = 'Muy buen producto, lo recomiendo.';
            cy.get('textarea').type(testComment);

            // Submit review
            cy.contains('Enviar').click();

            // Api must return 200
            cy.wait('@postReview').then((interception) => {
                expect(interception.response.statusCode).to.equal(200);
            });
            // Should redirect to product page
            cy.url().should('include', '/product/MLA49315128');
            cy.url().should('not.include', '/review');

            // Verify the review appears on the product page
            cy.contains('Opiniones del producto').should('be.visible');
            
            // Check that the review comment appears
            cy.contains(testComment).should('be.visible');
            
            // Check that the rating appears (4 filled stars)
            cy.get('[alt="Filled Star"]').should('have.length.at.least', 4);
            
            // Verify the average rating is updated
            cy.get('.blue-meli').should('be.visible').and('contain.text', '.');
            
            // Verify the review count is displayed
            cy.contains('calificaciones').should('be.visible');
        });

        it('should successfully submit review with only rating (no comment)', () => {
            cy.intercept('POST', '/products/MLA49315128/reviews').as('postReview');
            // Select 5 stars
            cy.get('[alt="Empty Star"]').eq(4).click();
            cy.get('[alt="Filled Star"]').should('have.length', 5);

            // Submit without comment
            cy.contains('Enviar').click();

            // Should make API call
            // Api must return 200
            cy.wait('@postReview').then((interception) => {
                expect(interception.response.statusCode).to.equal(200);
            });
            // Should redirect to product page
            cy.url().should('include', '/product/MLA49315128');
            cy.url().should('not.include', '/review');

            // Verify the review appears on the product page
            cy.contains('Opiniones del producto').should('be.visible');
            
            // Check that the rating appears (5 filled stars in the review section)
            cy.get('[alt="Filled Star"]').should('have.length.at.least', 5);
            
            // Verify the average rating is updated and should be close to 5
            cy.get('.blue-meli').should('be.visible').and('contain.text', '.');
            
            // Verify the review count is displayed
            cy.contains('calificaciones').should('be.visible');
            
            // Check that the review section shows at least one review
            cy.get('.d-flex.flex-column.gap-2.pb-3').should('exist');
        });

        it('should update existing review when user submits multiple reviews for same product', () => {
            cy.intercept('POST', '/products/MLA49315128/reviews').as('postReview');
            
            // First review submission
            cy.get('[alt="Empty Star"]').eq(2).click(); // 3 stars
            cy.get('[alt="Filled Star"]').should('have.length', 3);
            
            const firstComment = 'Primera review - producto regular.';
            cy.get('textarea').type(firstComment);
            
            cy.contains('Enviar').click();
            
            cy.wait('@postReview').then((interception) => {
                expect(interception.response.statusCode).to.equal(200);
            });
            
            // Should redirect to product page
            cy.url().should('include', '/product/MLA49315128');
            cy.url().should('not.include', '/review');
            
            // Verify first review appears
            cy.contains('Opiniones del producto').should('be.visible');
            cy.contains(firstComment).should('be.visible');
            
            // Go back to review page for second review
            cy.visit('/product/MLA49315128/review');
            
            // Second review submission with different data
            cy.get('[alt="Empty Star"]').eq(4).click(); // 5 stars
            cy.get('[alt="Filled Star"]').should('have.length', 5);
            
            const secondComment = 'Segunda review - excelente producto, cambié de opinión!';
            cy.get('textarea').clear().type(secondComment);
            
            cy.contains('Enviar').click();
            
            cy.wait('@postReview').then((interception) => {
                expect(interception.response.statusCode).to.equal(200);
            });
            
            // Should redirect to product page
            cy.url().should('include', '/product/MLA49315128');
            cy.url().should('not.include', '/review');
            
            // Verify only the second (latest) review appears
            cy.contains('Opiniones del producto').should('be.visible');
            cy.contains(secondComment).should('be.visible');
            
            // Verify the first review is no longer visible
            cy.contains(firstComment).should('not.exist');
            
            // Verify the rating reflects the latest review (5 stars)
            cy.get('[alt="Filled Star"]').should('have.length.at.least', 5);
            
            // Verify the average rating shows the updated value
            cy.get('.blue-meli').should('be.visible').and('contain.text', '.');
            
            // Verify review count is still displayed (should still be at least 1)
            cy.contains('calificaciones').should('be.visible');
        });

        it('should handle API error gracefully', () => {
            // Mock API error
            cy.intercept('POST', '/products/MLA49315128/reviews', {
                statusCode: 500,
                body: { error: 'Internal server error' }
            }).as('postReviewError');

            // Select rating and submit
            cy.get('[alt="Empty Star"]').eq(2).click();
            cy.contains('Enviar').click();

            // Should show error alert
            cy.on('window:alert', (str) => {
                expect(str).to.equal('Ocurrió un error al enviar la reseña. Por favor, inténtalo de nuevo más tarde.');
            });

            // Should stay on review page
            cy.url().should('include', '/review');
        });

        it('should navigate back to product when cancel is clicked', () => {
            cy.contains('Cancelar').click();
            cy.url().should('include', '/product/MLA49315128');
            cy.url().should('not.include', '/review');
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            cy.loginAdmin();
        });

        it('should handle missing product gracefully', () => {
            cy.visit('/product/INVALID_ID/review');
            // Should show error page
            cy.contains('Parece que esta página no existe').should('be.visible');
        });
    });
});