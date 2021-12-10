import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContest } from '../contest.model';
import { ContestService } from '../service/contest.service';
import { ContestDeleteDialogComponent } from '../delete/contest-delete-dialog.component';

@Component({
  selector: 'jhi-contest',
  templateUrl: './contest.component.html',
})
export class ContestComponent implements OnInit {
  contests?: IContest[];
  isLoading = false;

  constructor(protected contestService: ContestService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contestService.query().subscribe(
      (res: HttpResponse<IContest[]>) => {
        this.isLoading = false;
        this.contests = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IContest): number {
    return item.id!;
  }

  delete(contest: IContest): void {
    const modalRef = this.modalService.open(ContestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contest = contest;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
