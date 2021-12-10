import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IContest, Contest } from '../contest.model';
import { ContestService } from '../service/contest.service';

@Component({
  selector: 'jhi-contest-update',
  templateUrl: './contest-update.component.html',
})
export class ContestUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    startDate: [],
    endDate: [],
    url: [null, [Validators.required]],
    userId: [],
  });

  constructor(protected contestService: ContestService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contest }) => {
      if (contest.id === undefined) {
        const today = dayjs().startOf('day');
        contest.startDate = today;
        contest.endDate = today;
      }

      this.updateForm(contest);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contest = this.createFromForm();
    if (contest.id !== undefined) {
      this.subscribeToSaveResponse(this.contestService.update(contest));
    } else {
      this.subscribeToSaveResponse(this.contestService.create(contest));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContest>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(contest: IContest): void {
    this.editForm.patchValue({
      id: contest.id,
      name: contest.name,
      startDate: contest.startDate ? contest.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: contest.endDate ? contest.endDate.format(DATE_TIME_FORMAT) : null,
      url: contest.url,
      userId: contest.userId,
    });
  }

  protected createFromForm(): IContest {
    return {
      ...new Contest(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? dayjs(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate'])!.value ? dayjs(this.editForm.get(['endDate'])!.value, DATE_TIME_FORMAT) : undefined,
      url: this.editForm.get(['url'])!.value,
      userId: this.editForm.get(['userId'])!.value,
    };
  }
}
