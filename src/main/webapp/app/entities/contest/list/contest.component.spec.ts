import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContestService } from '../service/contest.service';

import { ContestComponent } from './contest.component';

describe('Contest Management Component', () => {
  let comp: ContestComponent;
  let fixture: ComponentFixture<ContestComponent>;
  let service: ContestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ContestComponent],
    })
      .overrideTemplate(ContestComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContestComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ContestService);

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
    expect(comp.contests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
