import { Routes, RouterModule } from "@angular/router";
import { SharesComponent } from './shares/shares.component';
import { OneShareComponent } from './one-share/one-share.component';
import { NotTypicalShareComponent } from './not-typical-share/not-typical-share.component';
import { SharesResolveService, SharesItemResolveService, NotTypicalShareResolveService } from './shares.service';


const routes: Routes = [
    {
        path: '',
        component: SharesComponent,
        resolve: {
            shares: SharesResolveService
        }
    },
    {
        path: 'friend/:name',
        component: NotTypicalShareComponent,
        resolve: {
            notTypicalShare: NotTypicalShareResolveService
        }
    },
    {
        path: ':name',
        component: OneShareComponent,
        resolve: {
            sharesItem: SharesItemResolveService
        }
    },

]
export const SharesRoutes = RouterModule.forChild(routes)