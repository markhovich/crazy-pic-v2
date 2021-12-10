import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContestComponent } from '../list/contest.component';
import { ContestDetailComponent } from '../detail/contest-detail.component';
import { ContestUpdateComponent } from '../update/contest-update.component';
import { ContestRoutingResolveService } from './contest-routing-resolve.service';

const contestRoute: Routes = [
  {
    path: '',
    component: ContestComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContestDetailComponent,
    resolve: {
      contest: ContestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContestUpdateComponent,
    resolve: {
      contest: ContestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContestUpdateComponent,
    resolve: {
      contest: ContestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contestRoute)],
  exports: [RouterModule],
})
export class ContestRoutingModule {}
