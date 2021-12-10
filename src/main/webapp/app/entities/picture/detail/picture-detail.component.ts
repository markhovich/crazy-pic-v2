import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPicture } from '../picture.model';

@Component({
  selector: 'jhi-picture-detail',
  templateUrl: './picture-detail.component.html',
})
export class PictureDetailComponent implements OnInit {
  picture: IPicture | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ picture }) => {
      this.picture = picture;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
