import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Subscription, forkJoin } from 'rxjs';
import { TranslatesService } from '../../shared/translates';
import { ActivatedRoute, Router } from '@angular/router';
import { CartProduct } from '../../shared/model/cart/cartProduct';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SidebarService } from '../../shared/services/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { MetaService } from '@ngx-meta/core';
import { AuthService } from '../../shared/services/auth.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public cartItems: CartProduct[] = [];
  public data: CartProduct[] = [];
  public dataProm: CartProduct[] = [];
  public totalCartPrice: number = 0;
  private translateSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private translatesService: TranslatesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sidebarService: SidebarService,
    private translateService: TranslatesService,
    private translateCoreService: TranslateService,
    private readonly meta: MetaService,
    private authService: AuthService,
    private gtag: Gtag,
    private browserService: BrowserService,
    private translate: TranslatesService
  ) {
    let title = this.translateCoreService.instant('order.name');
    this.meta.setTitle(title);
    if (this.browserService.isBrowser) {
      this.gtag.pageview({
        page_title: title,
        page_path: this.router.url,
        page_location: environment.api + this.router.url
      });
    }
    let data = this.activatedRoute.snapshot.data["res"];
    if (!data) {
      this.router.navigate(['/', this.translateService.getCurrentLang()])
      this.localStorageService.clearData("access_token");
      this.localStorageService.clearData("refresh_token");
      this.sidebarService.openAuthorization();
    }
    this.cartItems = data as CartProduct[];
    this.checkProducts();
    let promotions = this.cartService.getPromotions();
    let similar = this.cartService.getSimilar();
    let dataSub: Subscription = forkJoin([promotions, similar])
      .subscribe(
        res => {
          this.data = res[1] as CartProduct[];
          this.dataProm = res[0] as CartProduct[];
        },
        () => {
          this.router.navigate(['/', this.translateService.getCurrentLang()])
          this.localStorageService.clearData("access_token");
          this.localStorageService.clearData("refresh_token");
          // comment localstorage name
          this.localStorageService.clearData("userName");
          this.authService.setUserName(undefined);
          this.sidebarService.openAuthorization();
        },
        () => {
          if (dataSub) {
            dataSub.unsubscribe()
          }
        }
      )

  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(() => {
      let products = this.cartService.getProductsByUrlNameWithAdditional();
      let promotions = this.cartService.getPromotions();
      let similar = this.cartService.getSimilar();
      let cartSub: Subscription = forkJoin([products, promotions, similar])
        .subscribe(
          res => {
            this.cartItems = res[0] as CartProduct[];
            this.data = res[2] as CartProduct[];
            this.dataProm = res[1] as CartProduct[];
            let title = this.translateCoreService.instant('order.name');
            this.meta.setTitle(title);
            if (this.browserService.isBrowser) {
              this.gtag.pageview({
                page_title: title,
                page_path: this.router.url,
                page_location: environment.api + this.router.url
              });
            }
          },
          () => { },
          () => {
            if (cartSub)
              cartSub.unsubscribe();
          }
        )
    })
  }
  ngOnChanges() {
    this.checkProducts();
  }
  checkProducts() {
    if (!this.cartItems.length) {

      this.router.navigate([this.translate.getCurrentLang()]);
    }
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
