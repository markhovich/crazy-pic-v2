import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IContest } from '../contest.model';
import { ContestService } from '../service/contest.service';

@Component({
  templateUrl: './contest-delete-dialog.component.html',
})
export class ContestDeleteDialogComponent {
  contest?: IContest;

  constructor(protected contestService: ContestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contestService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
