import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PictureDetailComponent } from './picture-detail.component';

describe('Picture Management Detail Component', () => {
  let comp: PictureDetailComponent;
  let fixture: ComponentFixture<PictureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PictureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ picture: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PictureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PictureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load picture on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.picture).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
