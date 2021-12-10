import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContest } from '../contest.model';

@Component({
  selector: 'jhi-contest-detail',
  templateUrl: './contest-detail.component.html',
})
export class ContestDetailComponent implements OnInit {
  contest: IContest | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contest }) => {
      this.contest = contest;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
