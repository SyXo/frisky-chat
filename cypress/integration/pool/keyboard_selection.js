context('Keyboard Selection', () => {
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
    cy.wait(500)
    cy.get('body').type('{rightarrow}{rightarrow}{downarrow}', { delay: 250 })
    cy.get('#root > div > div:nth-child(8)')
      .should('have.css', 'outline', 'rgb(255, 255, 255) solid 2px')
      .should(
        'have.css',
        'background-image',
        'url("http://localhost:8080/cypress/fixtures/images/7.jpg")',
      )
    cy.get('body').type(' ', { delay: 250 })
    cy.get('#root > div > div').should('have.length', 0)
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/7.jpg")',
    )
    cy.get('body').type(' ', { delay: 250 })
    cy.get('#root > div > div').should('have.length', 15)
    cy.get('body').type('{uparrow} ', { delay: 250 })
    cy.wait(500)
    cy.get('#root > div > div').should('have.length', 0)
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/2.jpg")',
    )
    cy.get('body').type('{leftarrow}', { delay: 250 })
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/1.jpg")',
    )
    cy.get('body').type('{uparrow}', { delay: 250 })
    cy.get('#root > div').should(
      'have.css',
      'background-image',
      'url("http://localhost:8080/cypress/fixtures/images/11.jpg")',
    )
  })
})
