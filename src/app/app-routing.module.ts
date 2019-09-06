import { Routes, RouterModule } from '@angular/router';
import { WrapperComponent } from './shared/layouts/wrapper/wrapper.component';
import { AuthGuard } from './guard/guard';

export const APPROUTES: Routes = [
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: 'ua', redirectTo: '/', pathMatch: 'full' },
  { path: 'ua/sitemap', redirectTo: '/sitemap', pathMatch: 'full' },
  { path: ':lang/home', redirectTo: ':lang', pathMatch: 'full' },
  {
    path: '',
    component: WrapperComponent,
    // canActivateChild: [MetaGuard],
    // canActivate: [LocalizeGuard],
    children: [
      { path: '404', loadChildren: './not-found/not-found.module#NotFoundModule' },
      { path: 'sitemap', loadChildren: './sitemap/sitemap.module#SitemapModule' },
      { path: 'payment', loadChildren: './liqpay-payment/liqpay-payment.module#LiqpayPaymentModule' },
      { path: ':lang/payment', loadChildren: './liqpay-payment/liqpay-payment.module#LiqpayPaymentModule' },
      {
        path: ':lang/kompaniya',
        loadChildren: './about-company/about-company.module#AboutCompanyModule'
      },
      {
        path: ':lang/o-vode',
        loadChildren: './about-water/about-water.module#AboutWaterModule'
      },
      {
        path: ':lang/cart',
        loadChildren: './cart/cart.module#CartModule',
        canActivate: [AuthGuard]
      },
      {
        path: ':lang/o-kofe',
        loadChildren: './coffee/coffee.module#CoffeeModule'
      },
      {
        path: ':lang/kontakty',
        loadChildren: './contacts/contacts.module#ContactsModule'
      },
      {
        path: ':lang/dostavka',
        loadChildren: './delivery-and-payments/delivery-and-payments.module#DeliveryAndPaymentsModule'
      },
      {
        path: ':lang/encyclopedia',
        loadChildren: './encyclopedia/encyclopedia.module#EncyclopediaModule'
      },
      {
        path: ':lang/tochki',
        loadChildren: './exchange-point/exchange-point.module#ExchangePointModule'
      },
      {
        path: ':lang/franchising',
        loadChildren: './franchising/franchising.module#FranchisingModule'
      },
      {
        path: ':lang/novosti',
        loadChildren: './news/news.module#NewsModule'
      },
      {
        path: ':lang/akcii',
        loadChildren: './shares/shares.module#SharesModule'
      },
      {
        path: ':lang/catalog',
        loadChildren: './shop/shop.module#ShopModule'
      },
      {
        path: ':lang/products',
        loadChildren: './products/products.module#ProductsModule'
      },
      {
        path: ':lang/kabinet',
        loadChildren: './personal-account/personal-account.module#PersonalAccountModule',
        canActivate: [AuthGuard]
      },
      {
        path: ':lang/agreements',
        loadChildren: './agreements/agreements.module#AgreementsModule'
      },
      {
        path: ':lang/search',
        loadChildren: './search/search.module#SearchModule'
      },
      {
        path: ':lang/sitemap',
        loadChildren: './sitemap/sitemap.module#SitemapModule'
      },
      {
        path: ':lang',
        loadChildren: './home/home.module#HomeModule'
      },
      {
        path: '',
        loadChildren: './home/home.module#HomeModule'
      },

    ],
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

export const AppRoutes = RouterModule.forRoot(APPROUTES, {
  initialNavigation: true,
  scrollPositionRestoration: 'top',
});
