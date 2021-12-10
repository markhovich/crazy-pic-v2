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

describe('Picture e2e test', () => {
  const picturePageUrl = '/picture';
  const picturePageUrlPattern = new RegExp('/picture(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const pictureSample = { name: 'bricks-and-clicks Wooden a', url: 'https://héloïse.org' };

  let picture: any;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit('');
    cy.login(username, password);
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/pictures+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/pictures').as('postEntityRequest');
    cy.intercept('DELETE', '/api/pictures/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (picture) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/pictures/${picture.id}`,
      }).then(() => {
        picture = undefined;
      });
    }
  });

  it('Pictures menu should load Pictures page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('picture');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Picture').should('exist');
    cy.url().should('match', picturePageUrlPattern);
  });

  describe('Picture page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(picturePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Picture page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/picture/new$'));
        cy.getEntityCreateUpdateHeading('Picture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', picturePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/pictures',
          body: pictureSample,
        }).then(({ body }) => {
          picture = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/pictures+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [picture],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(picturePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Picture page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('picture');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', picturePageUrlPattern);
      });

      it('edit button click should load edit Picture page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Picture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', picturePageUrlPattern);
      });

      it('last delete button click should delete instance of Picture', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('picture').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', picturePageUrlPattern);

        picture = undefined;
      });
    });
  });

  describe('new Picture page', () => {
    beforeEach(() => {
      cy.visit(`${picturePageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Picture');
    });

    it('should create an instance of Picture', () => {
      cy.get(`[data-cy="name"]`).type('a Steel').should('have.value', 'a Steel');

      cy.get(`[data-cy="url"]`).type('http://longin.eu').should('have.value', 'http://longin.eu');

      cy.get(`[data-cy="photograph"]`).type('Borders Chips Avon').should('have.value', 'Borders Chips Avon');

      cy.get(`[data-cy="comment"]`).type('États-Unis Directeur').should('have.value', 'États-Unis Directeur');

      cy.get(`[data-cy="nbVotes"]`).type('19264').should('have.value', '19264');

      cy.get(`[data-cy="note"]`).type('29137').should('have.value', '29137');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        picture = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', picturePageUrlPattern);
    });
  });
});
