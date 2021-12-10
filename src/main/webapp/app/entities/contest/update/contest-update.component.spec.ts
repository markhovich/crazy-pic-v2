jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContestService } from '../service/contest.service';
import { IContest, Contest } from '../contest.model';

import { ContestUpdateComponent } from './contest-update.component';

describe('Contest Management Update Component', () => {
  let comp: ContestUpdateComponent;
  let fixture: ComponentFixture<ContestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contestService: ContestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ContestUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ContestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contestService = TestBed.inject(ContestService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const contest: IContest = { id: 456 };

      activatedRoute.data = of({ contest });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contest));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contest>>();
      const contest = { id: 123 };
      jest.spyOn(contestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contest }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contestService.update).toHaveBeenCalledWith(contest);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contest>>();
      const contest = new Contest();
      jest.spyOn(contestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contest }));
      saveSubject.complete();

      // THEN
      expect(contestService.create).toHaveBeenCalledWith(contest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contest>>();
      const contest = { id: 123 };
      jest.spyOn(contestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contestService.update).toHaveBeenCalledWith(contest);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
