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

    it.only('blogs are ordered by likes', function () {
      cy.contains('create new blog').click();
      cy.get('#title-input').type('a blog created by cypress');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type(
        'https://docs.cypress.io/guides/overview/why-cypress'
      );
      cy.get('#create-button').click();

      cy.visit('http://localhost:3000');

      cy.get('.blog')
        .eq(0)
        .should('contain', 'a blog created by cypress')
        .contains('view')
        .click();
      cy.get('.blog')
        .eq(0)
        .should('contain', 'a blog created by cypress')
        .contains('like')
        .click();

      cy.contains('create new blog').click();
      cy.get('#title-input').type('The title with the second most likes');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type(
        'https://docs.cypress.io/guides/overview/why-cypress'
      );
      cy.get('#create-button').click();

      cy.visit('http://localhost:3000');

      cy.get('.blog')
        .eq(1)
        .should('contain', 'The title with the second most likes');
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

  describe('Delete blogs', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.get('.success').contains('Matti Luukkainen successfully logged in');

      cy.contains('create new blog').click();
      cy.get('#title-input').type('a blog created by cypress');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type(
        'https://docs.cypress.io/guides/overview/why-cypress'
      );
      cy.get('#create-button').click();
      cy.contains('a blog created by cypress');

      cy.contains('view').click();
      cy.contains('remove').click();
    });

    it('fails with wrong credentials', function () {
      const user = {
        name: 'Matte Mene',
        username: 'mene16x',
        password: 'salainen',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', user);
      cy.contains('log in').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.get('.success').contains('Matti Luukkainen successfully logged in');

      cy.contains('create new blog').click();
      cy.get('#title-input').type('a blog created by cypress');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type(
        'https://docs.cypress.io/guides/overview/why-cypress'
      );
      cy.get('#create-button').click();
      cy.contains('a blog created by cypress');

      cy.contains('Log out').click();

      cy.contains('log in').click();
      cy.get('#username').type('mene16x');
      cy.get('#password').type('salainen');
      cy.get('#login-button').click();

      cy.contains('view').click();
      cy.get('.blog').should('not.contain', 'remove');
    });
  });
});
