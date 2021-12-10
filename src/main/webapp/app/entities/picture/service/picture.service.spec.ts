import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPicture, Picture } from '../picture.model';

import { PictureService } from './picture.service';

describe('Picture Service', () => {
  let service: PictureService;
  let httpMock: HttpTestingController;
  let elemDefault: IPicture;
  let expectedResult: IPicture | IPicture[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PictureService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      url: 'AAAAAAA',
      photograph: 'AAAAAAA',
      comment: 'AAAAAAA',
      nbVotes: 0,
      note: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Picture', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Picture()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Picture', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          url: 'BBBBBB',
          photograph: 'BBBBBB',
          comment: 'BBBBBB',
          nbVotes: 1,
          note: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Picture', () => {
      const patchObject = Object.assign(
        {
          url: 'BBBBBB',
          photograph: 'BBBBBB',
          comment: 'BBBBBB',
          nbVotes: 1,
        },
        new Picture()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Picture', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          url: 'BBBBBB',
          photograph: 'BBBBBB',
          comment: 'BBBBBB',
          nbVotes: 1,
          note: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Picture', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPictureToCollectionIfMissing', () => {
      it('should add a Picture to an empty array', () => {
        const picture: IPicture = { id: 123 };
        expectedResult = service.addPictureToCollectionIfMissing([], picture);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(picture);
      });

      it('should not add a Picture to an array that contains it', () => {
        const picture: IPicture = { id: 123 };
        const pictureCollection: IPicture[] = [
          {
            ...picture,
          },
          { id: 456 },
        ];
        expectedResult = service.addPictureToCollectionIfMissing(pictureCollection, picture);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Picture to an array that doesn't contain it", () => {
        const picture: IPicture = { id: 123 };
        const pictureCollection: IPicture[] = [{ id: 456 }];
        expectedResult = service.addPictureToCollectionIfMissing(pictureCollection, picture);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(picture);
      });

      it('should add only unique Picture to an array', () => {
        const pictureArray: IPicture[] = [{ id: 123 }, { id: 456 }, { id: 95676 }];
        const pictureCollection: IPicture[] = [{ id: 123 }];
        expectedResult = service.addPictureToCollectionIfMissing(pictureCollection, ...pictureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const picture: IPicture = { id: 123 };
        const picture2: IPicture = { id: 456 };
        expectedResult = service.addPictureToCollectionIfMissing([], picture, picture2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(picture);
        expect(expectedResult).toContain(picture2);
      });

      it('should accept null and undefined values', () => {
        const picture: IPicture = { id: 123 };
        expectedResult = service.addPictureToCollectionIfMissing([], null, picture, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(picture);
      });

      it('should return initial array if no Picture is added', () => {
        const pictureCollection: IPicture[] = [{ id: 123 }];
        expectedResult = service.addPictureToCollectionIfMissing(pictureCollection, undefined, null);
        expect(expectedResult).toEqual(pictureCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
