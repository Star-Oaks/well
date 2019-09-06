import { Routes, RouterModule } from "@angular/router";
import { PersonalContainerComponent } from './personal-container/personal-container.component';
import { UserResolveService } from '../shared/services/user.service';

const routes: Routes = [
    {
        path: '',
        component: PersonalContainerComponent,
        resolve: {
            userInfo: UserResolveService
        },
        // data: {
        //     meta: {
        //         title: 'personal.title',
        //         override: true,
        //     },
        // },
    }
]
export const PersonalAccountRoutes = RouterModule.forChild(routes)