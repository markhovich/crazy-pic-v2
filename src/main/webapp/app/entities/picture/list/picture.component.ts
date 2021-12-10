import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPicture } from '../picture.model';
import { PictureService } from '../service/picture.service';
import { PictureDeleteDialogComponent } from '../delete/picture-delete-dialog.component';

@Component({
  selector: 'jhi-picture',
  templateUrl: './picture.component.html',
})
export class PictureComponent implements OnInit {
  pictures?: IPicture[];
  isLoading = false;

  constructor(protected pictureService: PictureService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.pictureService.query().subscribe(
      (res: HttpResponse<IPicture[]>) => {
        this.isLoading = false;
        this.pictures = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPicture): number {
    return item.id!;
  }

  delete(picture: IPicture): void {
    const modalRef = this.modalService.open(PictureDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.picture = picture;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
