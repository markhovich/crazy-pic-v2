import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPicture, getPictureIdentifier } from '../picture.model';

export type EntityResponseType = HttpResponse<IPicture>;
export type EntityArrayResponseType = HttpResponse<IPicture[]>;

@Injectable({ providedIn: 'root' })
export class PictureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pictures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(picture: IPicture): Observable<EntityResponseType> {
    return this.http.post<IPicture>(this.resourceUrl, picture, { observe: 'response' });
  }

  update(picture: IPicture): Observable<EntityResponseType> {
    return this.http.put<IPicture>(`${this.resourceUrl}/${getPictureIdentifier(picture) as number}`, picture, { observe: 'response' });
  }

  partialUpdate(picture: IPicture): Observable<EntityResponseType> {
    return this.http.patch<IPicture>(`${this.resourceUrl}/${getPictureIdentifier(picture) as number}`, picture, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPicture>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPicture[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPictureToCollectionIfMissing(pictureCollection: IPicture[], ...picturesToCheck: (IPicture | null | undefined)[]): IPicture[] {
    const pictures: IPicture[] = picturesToCheck.filter(isPresent);
    if (pictures.length > 0) {
      const pictureCollectionIdentifiers = pictureCollection.map(pictureItem => getPictureIdentifier(pictureItem)!);
      const picturesToAdd = pictures.filter(pictureItem => {
        const pictureIdentifier = getPictureIdentifier(pictureItem);
        if (pictureIdentifier == null || pictureCollectionIdentifiers.includes(pictureIdentifier)) {
          return false;
        }
        pictureCollectionIdentifiers.push(pictureIdentifier);
        return true;
      });
      return [...picturesToAdd, ...pictureCollection];
    }
    return pictureCollection;
  }
}
