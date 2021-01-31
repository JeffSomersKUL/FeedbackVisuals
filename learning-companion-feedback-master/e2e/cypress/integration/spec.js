describe('basic tests', () => {

  it('working main page', () => {
    cy.server()
    cy.route('**/programs', 'fixture:programs.json').as('getPrograms')
    cy.visit('/')
    cy.get('header').contains('Feedback ijkingstoets')
    cy.wait('@getPrograms')
    cy.get("[data-cy='program-item']").should('have.length', 3)
    cy.get("[data-cy='program-item']").first().click()
    cy.location('pathname').should('eq', '/10/bi')

  })
  //.MuiStep-horizontal button
  describe('Stepped dashboard', () => {
    beforeEach(() => {
      cy.server()
    })
    it('shows the right amount of steps', () => {
      cy.route('**/steps/10/bi', 'fixture:bi.json').as('getSteps')
      cy.visit('/10/bi')
      cy.get('header').contains('Feedback ijkingstoets')
      cy.wait('@getSteps')
      cy.get('.MuiStepper-root')
        .should('have.length', 2)
        .first().find('.MuiStep-horizontal button').should('have.length', 4)
      cy.get("[data-cy='previous-button']").should('be.disabled')
      cy.get("[data-cy='next-button']").should('be.enabled')
      cy.matchImageSnapshot('page0')
    })

    it('has a working flow', () => {
      cy.route('**/steps/10/bi', 'fixture:bi.json').as('getSteps')
      cy.route({ method: 'GET', url: '**/data/10/bi/*', status: 404, response: '' }).as('getFeedbackAll')
      cy.route('**/data/10/bi/geldigeCode', 'fixture:feedback.json').as('getFeedback')
      cy.visit('/10/bi')
      cy.get('header').contains('Feedback ijkingstoets')
      cy.wait('@getSteps')
      cy.get('.MuiStepper-root')
        .should('have.length', 2)
        .first().find('.MuiStep-horizontal button').should('have.length', 4)

      cy.matchImageSnapshot('page0')
      cy.get("[data-cy='previous-button']").should('be.disabled')
      cy.get("[data-cy='next-button']").should('be.enabled').click()

      cy.matchImageSnapshot('page1')
      cy.get("[data-cy='previous-button']").should('be.enabled')
      cy.get("[data-cy='next-button']").should('be.disabled')
      cy.get("[data-cy='feedback-button']").should('be.disabled')
      cy.get("[data-cy='feedback-input'] input").type('ll')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.wait('@getFeedbackAll')
      cy.get("[data-cy='feedback-error']")
        .should('be.visible')
        .contains('Er ging iets mis. Ben je zeker dat dit de juiste code is ?')

      cy.get("[data-cy='next-button']").should('be.disabled')
      cy.get("[data-cy='feedback-input'] input").clear().type('10ir11111')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.get("[data-cy='feedback-error']")
        .should('be.visible')
        .contains('Deze code komt overeen met een andere ijkingstoets of met een andere sessie. Klik hier voor de juiste webpagina.')
      cy.get("[data-cy='code-error-redirect']").should('have.attr', 'href', '/10/ir')

      cy.get("[data-cy='next-button']").should('be.disabled')
      cy.get("[data-cy='feedback-input'] input").clear().type('11bi11111')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.get("[data-cy='feedback-error']")
        .should('be.visible')
        .contains('Deze code komt overeen met een andere ijkingstoets of met een andere sessie. Klik hier voor de juiste webpagina.')
      cy.get("[data-cy='code-error-redirect']").should('have.attr', 'href', '/11/bi')

      cy.get("[data-cy='feedback-input'] input").clear().type('geldigeCode')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.wait('@getFeedback')

      let i = 2
      while(i < 15){
        cy.matchImageSnapshot('page'+i)
        cy.get("[data-cy='previous-button']").should('be.enabled')
        cy.get("[data-cy='next-button']").should('be.enabled').click()
        i+=1
      }      

      cy.matchImageSnapshot('page' + i)
      cy.get("[data-cy='previous-button']").should('be.enabled')
      cy.get("[data-cy='next-button']").should('not.exist')

    })

    it('has a working flow with hidden steps', () => {
      cy.route('**/steps/10/bi', 'fixture:bi-invisible.json').as('getSteps')
      cy.route({ method: 'GET', url: '**/data/10/bi/*', status: 404, response: '' }).as('getFeedbackAll')
      cy.route('**/data/10/bi/geldigeCode', 'fixture:feedback.json').as('getFeedback')
      cy.visit('/10/bi')
      cy.get('header').contains('Feedback ijkingstoets')
      cy.wait('@getSteps')
      cy.get('.MuiStepper-root')
        .should('have.length', 2)
        .first().find('.MuiStep-horizontal button').should('have.length', 3)

      cy.matchImageSnapshot('page1-0')
      cy.get("[data-cy='previous-button']").should('be.disabled')
      cy.get("[data-cy='next-button']").should('be.enabled').click()

      cy.matchImageSnapshot('page1-1')
      cy.get("[data-cy='previous-button']").should('be.enabled')
      cy.get("[data-cy='next-button']").should('be.disabled')
      cy.get("[data-cy='feedback-button']").should('be.disabled')
      cy.get("[data-cy='feedback-input'] input").type('ll')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.wait('@getFeedbackAll')
      cy.get("[data-cy='feedback-error']")
        .should('be.visible')
        .contains('Er ging iets mis. Ben je zeker dat dit de juiste code is ?')

      cy.get("[data-cy='feedback-input'] input").type('{backspace}{backspace}geldigeCode')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.wait('@getFeedback')

      let i = 2
      while (i < 7) {
        cy.matchImageSnapshot('page1-' + i)
        cy.get("[data-cy='previous-button']").should('be.enabled')
        cy.get("[data-cy='next-button']").should('be.enabled').click()
        i += 1
      }

      cy.matchImageSnapshot('page1-' + i)
      cy.get("[data-cy='previous-button']").should('be.enabled')
      cy.get("[data-cy='next-button']").should('not.exist')

    })

    it('show edit options if canEdit', () => {
      cy.route('**/steps/10/bi', 'fixture:bi.json').as('getSteps')
      cy.route('**/data/10/bi/geldigeCode', 'fixture:feedback-edit.json').as('getFeedback')
      cy.visit('/10/bi')
      cy.get('header').contains('Feedback ijkingstoets')
      cy.wait('@getSteps')

      cy.get("[data-cy='next-button']").should('be.enabled').click()
      cy.get("[data-cy='feedback-input'] input").type('geldigeCode')
      cy.get("[data-cy='feedback-button']").should('be.enabled').click()
      cy.wait('@getFeedback')
      cy.matchImageSnapshot('edit-page1')

      cy.get("[data-cy='help-button']").click()
      cy.matchImageSnapshot('edit-page1-help')
      cy.get("[data-cy='help-dialog']").should('be.visible')
      cy.get("[data-cy='help-dialog-close']").click()
      cy.matchImageSnapshot('edit-page1') // Should be like before

      cy.get("[data-cy='manage-button']").click()
      cy.matchImageSnapshot('edit-page1-manage')
      cy.get("[data-cy='manage-dialog']").should('be.visible')
      cy.get("[data-cy='manage-dialog-close']").click()
      cy.matchImageSnapshot('edit-page1') // Should be like before

      cy.get("[data-cy='edit-button']").should('be.visible').click()
      cy.matchImageSnapshot('edit-page-editing')
    })
  })
})