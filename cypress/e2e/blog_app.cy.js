describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('front page can be opened', function () {
    cy.contains('blogs');
    cy.contains('login to application');
  });

  it('login form can be opened', function () {
    cy.contains('log in').click();
  });

  it('user can login', function () {
    cy.contains('log in').click();
    cy.get('#username').type('mluukkai');
    cy.get('#password').type('salainen');
    cy.get('#login-button').click();

    cy.contains('Matti Luukkainen logged in');
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('log in').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();
    });

    it('a new blog can be created', function () {
      cy.contains('create new blog').click();
      cy.get('#title-input').type('a blog created by cypress');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type(
        'https://docs.cypress.io/guides/overview/why-cypress'
      );
      cy.get('#create-button').click();
      cy.contains('a blog created by cypress');
    });

    it('a blog can be liked', function () {
      cy.contains('create new blog').click();
      cy.get('#title-input').type('a blog created by cypress');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type(
        'https://docs.cypress.io/guides/overview/why-cypress'
      );
      cy.get('#create-button').click();
      cy.contains('a blog created by cypress');
      cy.contains('view').click();
      cy.contains('like').click();
      cy.contains('1').click();
    });
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.get('.success').contains('Matti Luukkainen successfully logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('mamma');
      cy.get('#login-button').click();

      cy.get('.error').contains('wrong credentials');
    });
  });
});
