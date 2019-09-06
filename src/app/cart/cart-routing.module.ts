import { Routes, RouterModule } from "@angular/router";
import { OrderingComponent } from './ordering/ordering.component';
import { CartComponent } from './cart/cart.component';
import { OrderingResolveService } from './ordering/ordering.resolve.service';
import { CartResolveService } from './cart/cart.resolve.service';
import { AfterPaymentComponent } from './after-payment/after-payment.component';

const ROUTES: Routes = [
    {
        path: "",
        component: CartComponent,
        resolve: {
            res: CartResolveService
        }
    },
    {
        path: "ordering",
        component: OrderingComponent,
        resolve: {
            data: OrderingResolveService
        }
    },

    {
        path: "after_payment",
        component: AfterPaymentComponent
    }
]

export const CART_ROUTES = RouterModule.forChild(ROUTES);