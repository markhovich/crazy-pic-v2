import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contest',
        data: { pageTitle: 'crazyPicApp.contest.home.title' },
        loadChildren: () => import('./contest/contest.module').then(m => m.ContestModule),
      },
      {
        path: 'picture',
        data: { pageTitle: 'crazyPicApp.picture.home.title' },
        loadChildren: () => import('./picture/picture.module').then(m => m.PictureModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
