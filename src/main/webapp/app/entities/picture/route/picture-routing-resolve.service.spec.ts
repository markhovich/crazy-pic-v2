jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPicture, Picture } from '../picture.model';
import { PictureService } from '../service/picture.service';

import { PictureRoutingResolveService } from './picture-routing-resolve.service';

describe('Picture routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: PictureRoutingResolveService;
  let service: PictureService;
  let resultPicture: IPicture | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(PictureRoutingResolveService);
    service = TestBed.inject(PictureService);
    resultPicture = undefined;
  });

  describe('resolve', () => {
    it('should return IPicture returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPicture = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPicture).toEqual({ id: 123 });
    });

    it('should return new IPicture if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPicture = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultPicture).toEqual(new Picture());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Picture })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultPicture = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultPicture).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
