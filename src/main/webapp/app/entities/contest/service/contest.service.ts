import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContest, getContestIdentifier } from '../contest.model';

export type EntityResponseType = HttpResponse<IContest>;
export type EntityArrayResponseType = HttpResponse<IContest[]>;

@Injectable({ providedIn: 'root' })
export class ContestService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contests');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contest: IContest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contest);
    return this.http
      .post<IContest>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(contest: IContest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contest);
    return this.http
      .put<IContest>(`${this.resourceUrl}/${getContestIdentifier(contest) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(contest: IContest): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contest);
    return this.http
      .patch<IContest>(`${this.resourceUrl}/${getContestIdentifier(contest) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IContest>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContest[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContestToCollectionIfMissing(contestCollection: IContest[], ...contestsToCheck: (IContest | null | undefined)[]): IContest[] {
    const contests: IContest[] = contestsToCheck.filter(isPresent);
    if (contests.length > 0) {
      const contestCollectionIdentifiers = contestCollection.map(contestItem => getContestIdentifier(contestItem)!);
      const contestsToAdd = contests.filter(contestItem => {
        const contestIdentifier = getContestIdentifier(contestItem);
        if (contestIdentifier == null || contestCollectionIdentifiers.includes(contestIdentifier)) {
          return false;
        }
        contestCollectionIdentifiers.push(contestIdentifier);
        return true;
      });
      return [...contestsToAdd, ...contestCollection];
    }
    return contestCollection;
  }

  protected convertDateFromClient(contest: IContest): IContest {
    return Object.assign({}, contest, {
      startDate: contest.startDate?.isValid() ? contest.startDate.toJSON() : undefined,
      endDate: contest.endDate?.isValid() ? contest.endDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? dayjs(res.body.startDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((contest: IContest) => {
        contest.startDate = contest.startDate ? dayjs(contest.startDate) : undefined;
        contest.endDate = contest.endDate ? dayjs(contest.endDate) : undefined;
      });
    }
    return res;
  }
}
