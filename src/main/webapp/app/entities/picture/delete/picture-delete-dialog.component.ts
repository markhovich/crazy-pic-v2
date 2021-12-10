import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPicture } from '../picture.model';
import { PictureService } from '../service/picture.service';

@Component({
  templateUrl: './picture-delete-dialog.component.html',
})
export class PictureDeleteDialogComponent {
  picture?: IPicture;

  constructor(protected pictureService: PictureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pictureService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
