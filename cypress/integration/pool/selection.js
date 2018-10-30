const delay = 500

context('Selection', () => {
  let polyfill

  before(() => {
    const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body
    })
  })

  beforeEach(() => {
    cy.server()
    cy.route('**/user', {
      tags: ['furry'],
    })
    cy.route('**/pool', 'fixture:pool/images.json')
    cy.visit('/', {
      onBeforeLoad(win) {
        delete win.fetch
        win.eval(polyfill)
        win.fetch = win.unfetch
      },
    })
  })

  it('selects and views images with keyboard', () => {
    cy.get('#root > div > div').should('have.length', 15)
    cy.wait(delay)
    cy.get('body').type('{rightarrow}{rightarrow}{downarrow}', { delay })
    cy.get('#root > div > div:nth-child(8)')
      .should('have.css', 'outline', 'rgb(255, 255, 255) solid 2px')
      .should(
        'have.css',
        'background-image',
        'url("http://localhost:8080/cypress/fixtures/images/7.jpg")',
      )
    cy.get('body').type(' ', { delay })
    cy.get('#root > div > div').should('have.length', 0)
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/7.jpg")',
    )
    cy.get('body').type(' ', { delay })
    cy.get('#root > div > div').should('have.length', 15)
    cy.get('body').type('{uparrow} ', { delay })
    cy.wait(500)
    cy.get('#root > div > div').should('have.length', 0)
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/2.jpg")',
    )
    cy.get('body').type('{leftarrow}', { delay })
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/1.jpg")',
    )
    cy.get('body').type('{uparrow}', { delay })
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/11.jpg")',
    )
    cy.get('body').type(' ', { delay })
  })

  it('selects views images with click', () => {
    cy.get('#root > div > div:nth-child(5)').click({ delay })
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/4.jpg")',
    )
    cy.get('#root > div').click({ delay })
    cy.get('#root > div').should(
      'not.have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/4.jpg")',
    )
    cy.get('#root > div > div:nth-child(5)').should(
      'have.css',
      'outline',
      'rgb(255, 255, 255) solid 2px',
    )
  })
})
