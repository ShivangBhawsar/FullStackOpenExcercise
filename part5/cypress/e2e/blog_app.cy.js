Cypress.Commands.add('createNewBlog', ({ title, author, url }) => {
  cy.contains('create new').click()
  cy.get('#blog-title').type(title)
  cy.get('#blog-author').type(author)
  cy.get('#blog-url').type(url)
  cy.get('#submit-blog').click()
})

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
    const user1 = {
      name: 'Shivang',
      username: 'zixel',
      password: 'asdf'
    }
    const user2 = {
      name: 'Alan',
      username: 'alan',
      password: 'zxcv'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user1)
    cy.request('POST', 'http://localhost:3003/api/users', user2)
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('zixel')
      cy.get('#password').type('asdf')
      cy.get('#login-button').click()
      cy.contains('login successful')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('zixel')
      cy.get('#password').type('zxcv')
      cy.get('#login-button').click()
      cy.contains('wrong username or password').and('have.css', 'color', 'rgb(255, 0, 0)')

    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('zixel')
      cy.get('#password').type('asdf')
      cy.get('#login-button').click()
      cy.createNewBlog({ title: 'Cypress Test Blog', author: 'zixel', url: 'cypress.com' })
    })

    it('A blog can be created', function () {
      // cy.contains('create new').click()
      // cy.get('#blog-title').type('Cool new test blog for Cypress')
      // cy.get('#blog-author').type('zixel')
      // cy.get('#blog-url').type('getmyurl.com')
      // cy.get('#submit-blog').click()
      cy.createNewBlog({ title: 'Cool new test blog for Cypress', author: 'zixel', url: 'getmyurl.com' })
      cy.contains('Cool new test blog for Cypress zixel')
    })

    it('A blog can be liked', function () {
      cy.get('#view-blog-button').click().then(() => {
        cy.get('#like-button').click().then(() => {
          cy.contains('likes 1');
        })
      });
    })

    it('A blog can be deleted by the user who created it', function () {
      it.only('A blog can be deleted by the user who created it', function () {
        cy.get('#view-blog-button').click().then(() => {
          cy.get('#remove-blog').click();
          cy.contains('Cool new test blog for Cypress').should('not.exist');
        });
      });

    });

    it('Delete button for blog not visible for user who did not create it', function () {
      cy.get('#logout-button').click()
      cy.get('#username').type('alan')
      cy.get('#password').type('zxcv')
      cy.get('#login-button').click()
      cy.get('#view-blog-button').click().then(() => {
        cy.get('#remove-blog').should('not.exist');
      });
    })

    it('Blogs are ordered according to the likes', function () {

      cy.createNewBlog({ title: 'Cypress test blog 2', author: 'zixel', url: 'getmyurl.com' }).then(() => {
        cy.contains('Cypress test blog 2').find('#view-blog-button').click();
        for (let i = 0; i < 5; i++) {
          cy.contains('Cypress test blog 2').parent().find('#like-button').click();
        }
        cy.contains('likes 5');
      })

      cy.createNewBlog({ title: 'Cypress test blog 3', author: 'zixel', url: 'getmyurl.com' }).then(() => {
        cy.contains('Cypress test blog 3').find('#view-blog-button').click();
        for (let i = 0; i < 8; i++) {
          cy.contains('Cypress test blog 3').parent().find('#like-button').click();
        }
        cy.contains('likes 8');
      })

      cy.contains('Cypress Test Blog').find('#view-blog-button').click().then(() => {
        for (let i = 0; i < 6; i++) {
          cy.contains('Cypress Test Blog').parent().find('#like-button').click();
        }
        cy.contains('likes 6');
      }).then(() => {
        cy.reload();
      })

      cy.get('.blog').eq(0).should('contain', 'Cypress test blog 3')
      cy.get('.blog').eq(1).should('contain', 'Cypress Test Blog')
      cy.get('.blog').eq(2).should('contain', 'Cypress test blog 2')

    })
  })
})