import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Subscription } from 'rxjs';
import { CartProduct } from '../../shared/model/cart/cartProduct';
import { switchMap } from 'rxjs/operators';
import { PRODUCT_TYPE } from '../../shared/model/cart/cartProductType';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { Router } from '@angular/router';
import { TranslatesService } from '../../shared/translates';

const bigBottleWaterUrl: string = "voda-nebesna-krinicja";
const pompaUrl: string = "pompa-dlya-vody";
const emptyBottleUrl: string = "butyl-tara";
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  public isMobile: boolean;
  public totalCartPrice: number;
  public sending: boolean = false;
  public PRODUCT_TYPES: typeof PRODUCT_TYPE = PRODUCT_TYPE;
  private waterIndex: number;
  private battleIndex: number
  private pompaIndex: number
  @Input('cartItems') cartItems: CartProduct[] = [];
  @ViewChild('tooltip', { static: false }) tooltipDirective: TooltipDirective;
  private unAddedProductUrl: string[] = [];
  private cartProductsEvent: Subscription = new Subscription();
  constructor(
    private cartService: CartService,
    private router: Router,
    private translate: TranslatesService
  ) {

  }
  
  openTooltip(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
  closeTooltip() {   
      this.tooltipDirective.hide();
  }
  
  getItemCount(index, event) {
    let difference = event - this.cartItems[index].count;
    this.cartItems[index].count = event;
    this.cartService.updateProductCount(this.cartItems[index]);
    if (this.cartItems[index].urlName == bigBottleWaterUrl) {
      let ind = this.cartItems.findIndex(x => x.urlName == emptyBottleUrl);
      if (ind != -1) {
        let obj: CartProduct = {
          urlName: this.cartItems[ind].urlName,
          count: !this.cartItems[ind].count ? this.cartItems[index].count : this.cartItems[ind].count + difference > 0 ? this.cartItems[ind].count + difference : 1
        }
        this.cartService.updateProductCount(obj)
      }
    }
    this.totalCartPrice = this.getTotalOrderPrice();
  }

  checkForIncludeInCart(url: string): boolean{
    return this.unAddedProductUrl.some(x => x === url);
  }
  defineProduct(url: string): string {
    switch(url) {
      case emptyBottleUrl: return 'cart.additionalInfoBytul';
      case pompaUrl: return 'cart.additionalInfoPompa';
      default: return ''
    }
  }
  getTotalOrderPrice() {
    this.totalCartPrice = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      this.totalCartPrice += this.cartItems[i].price * this.cartItems[i].count;
    }
    return this.totalCartPrice;
  }
  ngOnChanges() {


  }

  showAdditional(i) {
    if (this.cartItems[i]) {
      if (this.cartItems[i].additional) {
        return
      }
      this.cartItems[i].additional = true;
      setTimeout(() => this.cartItems[i].additional = false, 4000);
    }
  }
  createData() {
    let cartProducts = this.cartService.products;
    this.cartItems.forEach(x => {
      cartProducts.forEach(y => {
        if (x.urlName === y.urlName) {
          x.count = y.count;
          if (x.isPackaging) {
            x.type = PRODUCT_TYPE.pack
          }
          else if (x.byThing) {
            x.type = PRODUCT_TYPE.thing;
          }
          else if (x.minOrderCount > 1) {
            x.type = PRODUCT_TYPE.water
          }
          else {
            x.type = PRODUCT_TYPE.pc
          }
        }
      })
    });
    this.unAddedProductUrl = this.cartItems.filter(x => !x.count).map(x => x.urlName);
    this.addAdditionalProducts();

    this.totalCartPrice = this.getTotalOrderPrice();
  }
  submitOrder() {
    if (this.cartItems.length == 0) {
      this.router.navigate(['/', this.translate.getCurrentLang()]);
    }
    this.cartItems.forEach(x => {
      if (!this.cartService.containsProduct(x.urlName)) {
        this.cartService.addProduct({ urlName: x.urlName, count: x.count });
      }
    })
    this.router.navigate(['/', this.translate.getCurrentLang(), 'cart', 'ordering']);

  }
  ngOnInit() {
    
    this.createData();
    this.checkForContain();
    let cartProducts = this.cartService.products;
    let uncorrectProducts = cartProducts.filter(x => this.cartItems.every(y => x.urlName !== y.urlName));
    if (uncorrectProducts.length) {
      uncorrectProducts.forEach(x => {
        this.cartService.deleteProduct(x.urlName);
      })
    }
    this.cartProductsEvent.add(this.cartService.cartProductsEvent.pipe(
      switchMap(() => this.cartService.getProductsByUrlName())
    ).subscribe(
      (res) => {
        if (!!res && this.cartItems.length != res["length"]) {
          this.cartItems = res as CartProduct[];
        }
        this.createData();
      }
    ));
  }

  setCountForEmptyBattle(products) {
    if (products.findIndex(x => x.urlName === emptyBottleUrl) === -1) {
      this.waterIndex = this.cartItems.findIndex((el) => {
        return el.urlName == bigBottleWaterUrl;
      })
      this.battleIndex = this.cartItems.findIndex((el) => {
        return el.urlName == emptyBottleUrl;
      })
      this.cartItems[this.battleIndex].count = this.cartItems[this.waterIndex].count;
    }

    if (products.findIndex(x => x.urlName === pompaUrl) === -1) {
      this.pompaIndex = this.cartItems.findIndex((el) => {
        return el.urlName == pompaUrl;
      })
      this.cartItems[this.pompaIndex].count = 1;
    }
  }

  addAdditionalProducts() {

    const ls = JSON.parse(localStorage.getItem("products"));
    if (this.cartItems.length > ls.length) {
      this.setCountForEmptyBattle(ls);
    }
  }
  ngOnDestroy() {
    if (this.cartProductsEvent) {
      this.cartProductsEvent.unsubscribe();

    }
  }
  private checkForContain(){
    this.cartItems.forEach(x => {
      if (!this.cartService.containsProduct(x.urlName)) {
        this.cartService.addProduct({ urlName: x.urlName, count: x.count });
      }
    })
  }
  deleteItem(urlName: string) {
    let ind = this.cartItems.findIndex(x => x.urlName == urlName);
    if (ind != -1) {
      this.cartItems.splice(ind, 1);
      this.cartService.deleteProduct(urlName);
    }
    if (this.cartItems.length == 0) {
      this.router.navigate(['/', this.translate.getCurrentLang()]);
    }
    this.totalCartPrice = this.getTotalOrderPrice();
  }
}
