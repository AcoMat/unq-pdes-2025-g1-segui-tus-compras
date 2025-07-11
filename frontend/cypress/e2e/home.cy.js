describe('Home Page e2e tests', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('#1').should('be.visible')
  })

  it('should display all carousel cards', () => {
    cy.visit('/')
    cy.get('#1').within(() => {
      cy.contains('Envio Gratis').should('exist')
      cy.contains('Ingresá a tu cuenta').should('exist')
      cy.contains('Más vendidos').should('exist')
    })
  })

  it('should navigate to login when clicking the login card', () => {
    cy.visit('/')
    cy.get('#1').within(() => {
      cy.contains('Ingresar a tu cuenta').click({ force: true })
    })
    cy.url().should('include', '/login')
  })

  it('should navigate to login when clicking on login', () => {
    cy.visit('/')
    cy.get(':nth-child(2) > a').click({ force: true })
    cy.url().should('include', '/login')
    cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión', { matchCase: false })
  })

  it('should navigate to register when clicking on register', () => {
    cy.visit('/')
    cy.get('.header-links > :nth-child(1) > a').click({ force: true })
    cy.url().should('include', '/register')
    cy.contains('Ingresá tu e-mail', { matchCase: false })

  })

  it('should refresh when clicking on logo', () => {
    cy.visit('/')
    cy.get('[style="min-width: 134px; margin-right: 24px;"] > a > img').click({ force: true })
    cy.url().should('include', '/')
    cy.get('#1').should('be.visible')
  })
})

