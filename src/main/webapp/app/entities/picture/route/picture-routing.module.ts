import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PictureComponent } from '../list/picture.component';
import { PictureDetailComponent } from '../detail/picture-detail.component';
import { PictureUpdateComponent } from '../update/picture-update.component';
import { PictureRoutingResolveService } from './picture-routing-resolve.service';

const pictureRoute: Routes = [
  {
    path: '',
    component: PictureComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PictureDetailComponent,
    resolve: {
      picture: PictureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PictureUpdateComponent,
    resolve: {
      picture: PictureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PictureUpdateComponent,
    resolve: {
      picture: PictureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pictureRoute)],
  exports: [RouterModule],
})
export class PictureRoutingModule {}
