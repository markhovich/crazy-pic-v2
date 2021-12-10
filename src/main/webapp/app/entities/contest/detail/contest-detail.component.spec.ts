import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ContestDetailComponent } from './contest-detail.component';

describe('Contest Management Detail Component', () => {
  let comp: ContestDetailComponent;
  let fixture: ComponentFixture<ContestDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContestDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ contest: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ContestDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ContestDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load contest on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.contest).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
