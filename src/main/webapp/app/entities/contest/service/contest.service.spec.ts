import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IContest, Contest } from '../contest.model';

import { ContestService } from './contest.service';

describe('Contest Service', () => {
  let service: ContestService;
  let httpMock: HttpTestingController;
  let elemDefault: IContest;
  let expectedResult: IContest | IContest[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ContestService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      startDate: currentDate,
      endDate: currentDate,
      url: 'AAAAAAA',
      userId: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Contest', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Contest()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Contest', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
          url: 'BBBBBB',
          userId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Contest', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          endDate: currentDate.format(DATE_TIME_FORMAT),
          userId: 1,
        },
        new Contest()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Contest', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          startDate: currentDate.format(DATE_TIME_FORMAT),
          endDate: currentDate.format(DATE_TIME_FORMAT),
          url: 'BBBBBB',
          userId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          startDate: currentDate,
          endDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Contest', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addContestToCollectionIfMissing', () => {
      it('should add a Contest to an empty array', () => {
        const contest: IContest = { id: 123 };
        expectedResult = service.addContestToCollectionIfMissing([], contest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contest);
      });

      it('should not add a Contest to an array that contains it', () => {
        const contest: IContest = { id: 123 };
        const contestCollection: IContest[] = [
          {
            ...contest,
          },
          { id: 456 },
        ];
        expectedResult = service.addContestToCollectionIfMissing(contestCollection, contest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Contest to an array that doesn't contain it", () => {
        const contest: IContest = { id: 123 };
        const contestCollection: IContest[] = [{ id: 456 }];
        expectedResult = service.addContestToCollectionIfMissing(contestCollection, contest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contest);
      });

      it('should add only unique Contest to an array', () => {
        const contestArray: IContest[] = [{ id: 123 }, { id: 456 }, { id: 24047 }];
        const contestCollection: IContest[] = [{ id: 123 }];
        expectedResult = service.addContestToCollectionIfMissing(contestCollection, ...contestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const contest: IContest = { id: 123 };
        const contest2: IContest = { id: 456 };
        expectedResult = service.addContestToCollectionIfMissing([], contest, contest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contest);
        expect(expectedResult).toContain(contest2);
      });

      it('should accept null and undefined values', () => {
        const contest: IContest = { id: 123 };
        expectedResult = service.addContestToCollectionIfMissing([], null, contest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contest);
      });

      it('should return initial array if no Contest is added', () => {
        const contestCollection: IContest[] = [{ id: 123 }];
        expectedResult = service.addContestToCollectionIfMissing(contestCollection, undefined, null);
        expect(expectedResult).toEqual(contestCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
