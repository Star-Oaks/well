import { Routes, RouterModule } from "@angular/router";
import { DegustationComponent } from './degustation/degustation.component';
import { JacobsComponent } from './jacobs/jacobs.component';
import { CorsicoComponent } from './corsico/corsico.component';
import { CorsicoResolveService } from './corsico/corsico.service';
import { JacobsResolceService, JacobsService } from './jacobs/jacobs.service';
import { DegustationResolveService } from './degustation/degustation.service';



const routes: Routes = [
    { path: '', redirectTo: 'degustacia-kofe', pathMatch: 'full' },
    {
        path: '',
        children: [
            {
                path: 'degustacia-kofe',
                component: DegustationComponent,
                resolve: {
                    degustation: DegustationResolveService
                }
            },
            {
                path: 'kofe-jacobs',
                component: JacobsComponent,
                resolve: {
                    res : JacobsResolceService
                }
            },
            {
                path: 'kofe-corsico',
                component: CorsicoComponent,
                resolve: {
                    corsico: CorsicoResolveService
                }
               
            }
        ]
    }

]
export const CoffeeRoutes = RouterModule.forChild(routes)