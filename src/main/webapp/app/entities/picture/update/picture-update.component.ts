import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPicture, Picture } from '../picture.model';
import { PictureService } from '../service/picture.service';
import { IContest } from 'app/entities/contest/contest.model';
import { ContestService } from 'app/entities/contest/service/contest.service';

@Component({
  selector: 'jhi-picture-update',
  templateUrl: './picture-update.component.html',
})
export class PictureUpdateComponent implements OnInit {
  isSaving = false;

  contestsSharedCollection: IContest[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    name: [null, [Validators.required]],
    url: [null, [Validators.required]],
    photograph: [],
    comment: [],
    nbVotes: [],
    note: [],
    contestId: [],
  });

  constructor(
    protected pictureService: PictureService,
    protected contestService: ContestService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ picture }) => {
      this.updateForm(picture);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const picture = this.createFromForm();
    if (picture.id !== undefined) {
      this.subscribeToSaveResponse(this.pictureService.update(picture));
    } else {
      this.subscribeToSaveResponse(this.pictureService.create(picture));
    }
  }

  trackContestById(index: number, item: IContest): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPicture>>): void {
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

  protected updateForm(picture: IPicture): void {
    this.editForm.patchValue({
      id: picture.id,
      name: picture.name,
      url: picture.url,
      photograph: picture.photograph,
      comment: picture.comment,
      nbVotes: picture.nbVotes,
      note: picture.note,
      contestId: picture.contestId,
    });

    this.contestsSharedCollection = this.contestService.addContestToCollectionIfMissing(this.contestsSharedCollection, picture.contestId);
  }

  protected loadRelationshipsOptions(): void {
    this.contestService
      .query()
      .pipe(map((res: HttpResponse<IContest[]>) => res.body ?? []))
      .pipe(
        map((contests: IContest[]) => this.contestService.addContestToCollectionIfMissing(contests, this.editForm.get('contestId')!.value))
      )
      .subscribe((contests: IContest[]) => (this.contestsSharedCollection = contests));
  }

  protected createFromForm(): IPicture {
    return {
      ...new Picture(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      url: this.editForm.get(['url'])!.value,
      photograph: this.editForm.get(['photograph'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      nbVotes: this.editForm.get(['nbVotes'])!.value,
      note: this.editForm.get(['note'])!.value,
      contestId: this.editForm.get(['contestId'])!.value,
    };
  }
}
