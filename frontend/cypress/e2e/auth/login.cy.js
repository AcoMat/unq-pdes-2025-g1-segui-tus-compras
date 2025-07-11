describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('Email Stage', () => {
    it('should display the email input form initially', () => {
      cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.contains('E-mail o teléfono').should('be.visible');
      cy.contains('Continuar').should('be.visible');
      cy.contains('Crear cuenta').should('be.visible');
    });

    it('should show validation error for invalid email format', () => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.contains('Continuar').click();
      cy.contains('Por favor, ingrese un email válido').should('be.visible');
    });

    it('should accept valid email and proceed to password stage', () => {
      cy.get('input[name="email"]').type('user@example.com');
      cy.contains('Continuar').click();
      cy.contains('Ingresá tu contraseña de Mercado Libre').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });

    it('should navigate to register page when clicking "Crear cuenta"', () => {
      cy.contains('Crear cuenta').click();
      cy.url().should('include', '/register');
    });

    it('should clear error message when typing in email field', () => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.contains('Continuar').click();
      cy.contains('Por favor, ingrese un email válido').should('be.visible');
      
      cy.get('input[name="email"]').clear().type('valid@email.com');
      cy.contains('Por favor, ingrese un email válido').should('not.exist');
    });
  });

  describe('Password Stage', () => {
    beforeEach(() => {
      // Navigate to password stage
      cy.get('input[name="email"]').type('user@example.com');
      cy.contains('Continuar').click();
    });

    it('should display password form with user email', () => {
      cy.contains('Ingresá tu contraseña de Mercado Libre').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.contains('Contraseña').should('be.visible');
      cy.contains('user@example.com').should('be.visible');
      cy.contains('Cambiar cuenta').should('be.visible');
      cy.contains('Iniciar sesión').should('be.visible');
      cy.contains('¿Olvidaste tu contraseña?').should('be.visible');
    });

    it('should return to email stage when clicking "Cambiar cuenta"', () => {
      cy.contains('Cambiar cuenta').click();
      cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión').should('be.visible');
      cy.get('input[name="email"]').should('have.value', 'user@example.com');
    });

    it('should show validation error for empty password', () => {
      cy.contains('Iniciar sesión').click();
      cy.contains('Ingrese su contraseña').should('be.visible');
    });

    it('should navigate to error page when clicking "¿Olvidaste tu contraseña?"', () => {
      cy.contains('¿Olvidaste tu contraseña?').click();
      cy.url().should('include', '/error');
    });

    it('should clear error message when typing in password field', () => {
      cy.contains('Iniciar sesión').click();
      cy.contains('Ingrese su contraseña').should('be.visible');
      
      cy.get('input[name="password"]').type('password123');
      cy.contains('Ingrese su contraseña').should('not.exist');
    });
  });

  describe('Login Process', () => {
    beforeEach(() => {
      // Navigate to password stage
      cy.get('input[name="email"]').type('user@example.com');
      cy.contains('Continuar').click();
    });

    it('should successfully login with valid credentials and redirect to home', () => {
      // Mock successful login response
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        headers: {
          'authorization': 'Bearer mock-token'
        },
        body: {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'user@example.com'
        }
      }).as('loginRequest');

      cy.intercept('GET', '**/users/profile', {
        statusCode: 200,
        body: {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'user@example.com'
        }
      }).as('profileRequest');

      cy.intercept('GET', '**/users/admin', {
        statusCode: 200,
        body: false
      }).as('adminRequest');

      cy.get('input[name="password"]').type('password123');
      cy.contains('Iniciar sesión').click();

      cy.wait('@loginRequest');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should show error stage on login failure', () => {
      // Mock failed login response
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: 'Invalid credentials'
      }).as('loginRequest');

      cy.get('input[name="password"]').type('wrongpassword');
      cy.contains('Iniciar sesión').click();

      cy.wait('@loginRequest');
      cy.contains('¡Ups! Algo salió mal').should('be.visible');
      cy.contains('Error during login: Invalid credentials').should('be.visible');
      cy.contains('Volver a intentar').should('be.visible');
    });

    it('should handle network error during login', () => {
      // Mock network error
      cy.intercept('POST', '**/auth/login', {
        forceNetworkError: true
      }).as('loginRequest');

      cy.get('input[name="password"]').type('password123');
      cy.contains('Iniciar sesión').click();

      cy.wait('@loginRequest');
      cy.contains('¡Ups! Algo salió mal').should('be.visible');
      cy.contains('Error de conexión. Por favor, intente más tarde.').should('be.visible');
    });
  });

  describe('Error Stage', () => {
    beforeEach(() => {
      // Navigate to password stage and trigger an error
      cy.get('input[name="email"]').type('user@example.com');
      cy.contains('Continuar').click();

      // Mock failed login response
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: 'Invalid credentials'
      }).as('loginRequest');

      cy.get('input[name="password"]').type('wrongpassword');
      cy.contains('Iniciar sesión').click();
      cy.wait('@loginRequest');
    });

    it('should display error message and retry button', () => {
      cy.contains('¡Ups! Algo salió mal').should('be.visible');
      cy.contains('Error during login: Invalid credentials').should('be.visible');
      cy.contains('Volver a intentar').should('be.visible');
    });

    it('should return to email stage when clicking "Volver a intentar"', () => {
      cy.contains('Volver a intentar').click();
      cy.contains('Ingresá tu e-mail o teléfono para iniciar sesión').should('be.visible');
      cy.get('input[name="email"]').should('have.value', 'user@example.com');
    });
  });

  describe('User Already Logged In', () => {
    it('should redirect to profile if user is already logged in', () => {
      cy.loginAdmin()
      cy.visit('/login');
      cy.url().should('include', '/profile');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and accessibility attributes', () => {
      // Check email stage
      cy.get('label').contains('E-mail o teléfono').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');

      // Navigate to password stage
      cy.get('input[name="email"]').type('user@example.com');
      cy.contains('Continuar').click();

      // Check password stage
      cy.get('label').contains('Contraseña').should('be.visible');
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });
  });
});