import { Routes, RouterModule } from "@angular/router";
import { ShopPageComponent } from './shop-page/shop-page.component';
import { ShopResolveService } from './shop.service';


const routes: Routes = [

    { path: '', redirectTo: '/404', pathMatch: 'full' },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: ':category/:urlName',
                component: ShopPageComponent,
                // runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                resolve: {
                    res: ShopResolveService
                }
            },
            {
                path: ':urlName',
                component: ShopPageComponent,
                // runGuardsAndResolvers: 'paramsOrQueryParamsChange',
                resolve: {
                    res: ShopResolveService
                },

            },
        ]
    }

];
export const shopRoutes = RouterModule.forChild(routes)