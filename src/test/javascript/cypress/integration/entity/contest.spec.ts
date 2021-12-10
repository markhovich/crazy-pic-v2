import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Contest e2e test', () => {
  const contestPageUrl = '/contest';
  const contestPageUrlPattern = new RegExp('/contest(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const contestSample = { name: 'connecting wireless FTP', url: 'http://christelle.org' };

  let contest: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/contests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/contests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/contests/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (contest) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/contests/${contest.id}`,
      }).then(() => {
        contest = undefined;
      });
    }
  });

  it('Contests menu should load Contests page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('contest');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Contest').should('exist');
    cy.url().should('match', contestPageUrlPattern);
  });

  describe('Contest page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(contestPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Contest page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/contest/new$'));
        cy.getEntityCreateUpdateHeading('Contest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', contestPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/contests',
          body: contestSample,
        }).then(({ body }) => {
          contest = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/contests+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [contest],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(contestPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Contest page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('contest');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', contestPageUrlPattern);
      });

      it('edit button click should load edit Contest page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Contest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', contestPageUrlPattern);
      });

      it('last delete button click should delete instance of Contest', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('contest').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', contestPageUrlPattern);

        contest = undefined;
      });
    });
  });

  describe('new Contest page', () => {
    beforeEach(() => {
      cy.visit(`${contestPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Contest');
    });

    it('should create an instance of Contest', () => {
      cy.get(`[data-cy="name"]`).type('THX SQL').should('have.value', 'THX SQL');

      cy.get(`[data-cy="startDate"]`).type('2021-12-08T21:28').should('have.value', '2021-12-08T21:28');

      cy.get(`[data-cy="endDate"]`).type('2021-12-08T23:43').should('have.value', '2021-12-08T23:43');

      cy.get(`[data-cy="url"]`).type('https://léopoldine.com').should('have.value', 'https://léopoldine.com');

      cy.get(`[data-cy="userId"]`).type('97807').should('have.value', '97807');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        contest = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', contestPageUrlPattern);
    });
  });
});
