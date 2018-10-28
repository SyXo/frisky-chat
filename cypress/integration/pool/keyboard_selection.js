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

  it('selects images with keyboard', () => {
    cy.get('div[src]').should('have.length', 15)
    cy.get('body').type('{rightarrow}{rightarrow}{downarrow}', { delay: 100 })
    cy.get('div[src]:nth-child(8)').should(
      'have.css',
      'outline',
      'rgb(255, 255, 255) solid 2px',
    )
  })
})
