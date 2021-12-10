import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PictureService } from '../service/picture.service';

import { PictureComponent } from './picture.component';

describe('Picture Management Component', () => {
  let comp: PictureComponent;
  let fixture: ComponentFixture<PictureComponent>;
  let service: PictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PictureComponent],
    })
      .overrideTemplate(PictureComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PictureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PictureService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.pictures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
