import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeResolveService } from './home.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      res : HomeResolveService
    }
  },
];

export const HomeRoutes = RouterModule.forChild(routes);
