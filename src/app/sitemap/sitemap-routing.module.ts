import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitemapComponent } from './sitemap.component';
import { SitemapResolveService } from './sitemap.service';

const routes: Routes = [
  {
    path: '',
    component: SitemapComponent,
    resolve: {
      data: SitemapResolveService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitemapRoutingModule { }
