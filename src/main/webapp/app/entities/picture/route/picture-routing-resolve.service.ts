import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPicture, Picture } from '../picture.model';
import { PictureService } from '../service/picture.service';

@Injectable({ providedIn: 'root' })
export class PictureRoutingResolveService implements Resolve<IPicture> {
  constructor(protected service: PictureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPicture> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((picture: HttpResponse<Picture>) => {
          if (picture.body) {
            return of(picture.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Picture());
  }
}
