import { Routes, RouterModule } from '@angular/router';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'success',
        pathMatch: 'full'
    },
    {
        path: 'success',
        component: SuccessComponent,
    },
    {
        path: 'error',
        component: ErrorComponent
    }
];

export const LiqpayPaymentRoutes = RouterModule.forChild(routes);