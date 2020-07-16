/// <reference types="Cypress" />

describe("Form tests", function() {
  it('Test nav link', function() {
    cy.visit('http://localhost:3000/')

    cy.get('[data-cy=pizza]')
      .click()

    cy.pause()
  })

  it('Test inputs and submit', function() {
    cy.get('input[name="name"]')
      .type('Bob')
      .should('have.value', 'Bob')

    cy.get('[data-cy=size]')
      .select('18')
      .should('have.value', '18')

    cy.get('[data-cy=sauce]')
      .select('alfredo')
      .should('have.value', 'alfredo')

    cy.get('input[name="pepperoni"]')
      .check()
      .should('be.checked')

    cy.get('input[name="olives"]')
      .check()
      .should('be.checked')

    cy.get('input[name="instructions"]')
      .type('Give me my pizza!')
      .should('have.value', 'Give me my pizza!')

    cy.get('[data-cy=submit]')
      .click()

    cy.get('[data-cy=order]')
      .should('exist')
      .should('not.be.empty')

    cy.pause()
  })

  it('Test name validation', function() {
    cy.get('input[name="name"]')
      .type('B')
    
    cy.get('.err')
      .should('have.text', 'Name must be at least 2 characters long')
  })
})