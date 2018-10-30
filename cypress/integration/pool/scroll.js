const delay = 500

context('Scroll', () => {
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
    cy.route('**/pool', 'fixture:pool/many-images.json')
    cy.visit('/', {
      onBeforeLoad(win) {
        delete win.fetch
        win.eval(polyfill)
        win.fetch = win.unfetch
      },
    })
  })

  it('scrolls with keyboard', () => {
    cy.get('#root > div > div').should('have.length', 45)
    cy.get('body').type(
      '{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}',
      { delay },
    )
    cy.get('[data-cy=thumbnail-35]').should('be.visible')
  })

  it("doesn't load thumbnails out of view on first load", () => {
    cy.get('[data-cy=thumbnail-44]').should('not.be.visible')
  })

  it('no longer renders thumbnails scrolled out of view', () => {
    cy.get('body').type(
      '{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}',
      { delay },
    )
    cy.get('[data-cy=thumbnail-0]').should('not.be.visible')
  })
})
