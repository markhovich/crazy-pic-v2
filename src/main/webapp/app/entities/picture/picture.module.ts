import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PictureComponent } from './list/picture.component';
import { PictureDetailComponent } from './detail/picture-detail.component';
import { PictureUpdateComponent } from './update/picture-update.component';
import { PictureDeleteDialogComponent } from './delete/picture-delete-dialog.component';
import { PictureRoutingModule } from './route/picture-routing.module';

@NgModule({
  imports: [SharedModule, PictureRoutingModule],
  declarations: [PictureComponent, PictureDetailComponent, PictureUpdateComponent, PictureDeleteDialogComponent],
  entryComponents: [PictureDeleteDialogComponent],
})
export class PictureModule {}
