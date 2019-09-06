import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SidebarService } from '../../services/sidebar.service';
import { CartService } from '../../services/cart.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { Subscription } from 'rxjs';
import { CartProduct } from '../../model/cart/cartProduct';
import { PRODUCT_TYPE } from '../../model/cart/cartProductType';

const bigBottleWaterUrl: string = "voda-nebesna-krinicja";
const pompaUrl: string = "pompa-dlya-vody";
const emptyBottleUrl = "butyl-tara";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  private waterIndex: number;
  private battleIndex: number
  private pompaIndex: number

  public cartItems: CartProduct[] = [];
  public totalCartPrice: number = 0;
  public PRODUCT_TYPES: typeof PRODUCT_TYPE = PRODUCT_TYPE;
  @ViewChild('cartModal', { static: false }) cartModal: ElementRef;

  private cartSubscription: Subscription;
  private cartCloseSubscription: Subscription;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private sidebarService: SidebarService,
    private scrollbar: MalihuScrollbarService,
    private cartService: CartService,
  ) {
  }

  closeCart() {
    this.sidebarService.closeCart();
  }

  getItemCount(index, event) {
    this.cartItems[index].count = event;
    this.cartItems[index].additional = false;
    this.cartService.updateProductCount(this.cartItems[index]);
    // if (this.cartItems[index].urlName == bigBottleWaterUrl) {
    //   this.cartItems[this.battleIndex].count = this.cartItems[this.waterIndex].count;
    // }
    this.totalCartPrice = this.getTotalOrderPrice();
  }

  getTotalOrderPrice() {
    let price = 0;
    this.cartItems.forEach(x => {
      price += x.count * x.price
    })
    return price;
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
  // addAdditionalProducts() {

  //   const ls = JSON.parse(localStorage.getItem("products"));
  //   if (this.cartItems.length > ls.length) {
  //     this.setCountForEmptyBattle(ls);
  //   }
  // }


  // setCountForEmptyBattle(products) {
  //   if (products.findIndex(x => x.urlName === emptyBottleUrl) === -1) {
  //     this.waterIndex = this.cartItems.findIndex((el) => {
  //       return el.urlName == bigBottleWaterUrl;
  //     })
  //     this.battleIndex = this.cartItems.findIndex((el) => {
  //       return el.urlName == emptyBottleUrl;
  //     })
  //     this.cartItems[this.battleIndex].count = this.cartItems[this.waterIndex].count;
  //     // let obj: CartProduct = {
  //     //   urlName : this.cartItems[this.battleIndex].urlName,
  //     //   count: this.cartItems[this.battleIndex].count
  //     // }
  //     // this.cartService.addProduct(obj);
  //   }

  //   if (products.findIndex(x => x.urlName === pompaUrl) === -1) {
  //     this.pompaIndex = this.cartItems.findIndex((el) => {
  //       return el.urlName == pompaUrl;
  //     })
  //     this.cartItems[this.pompaIndex].count = 1;
  //     // let obj: CartProduct = {
  //     //   urlName : this.cartItems[this.pompaIndex].urlName,
  //     //   count: this.cartItems[this.pompaIndex].count
  //     // }
  //     // this.cartService.addProduct(obj);
  //   }

  // }
  ngOnInit() {
    this.cartSubscription = this.sidebarService.getStateCart().subscribe(
      state => {
        if (state) {
          this.cartItems = [];
          if (this.cartService.products.length) {
            this.cartService.getProductsByUrlName().subscribe(
              res => {
                this.cartItems = res as CartProduct[];
                let cartProducts = this.cartService.products;
                let uncorrectProducts = cartProducts.filter(x => this.cartItems.every(y => x.urlName !== y.urlName));
                if (uncorrectProducts.length) {
                  uncorrectProducts.forEach(x => {
                    this.cartService.deleteProduct(x.urlName);
                  })
                }
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
                this.cartItems = this.cartItems.filter(x => !!x.count);
                this.totalCartPrice = this.getTotalOrderPrice();
                this.ngxSmartModalService.getModal('cart').open();
                setTimeout(() => {
                  this.scrollbar.initScrollbar('#cartModal', { axis: 'y', theme: 'dark-2' });
                }, 200)
              }
            )
          }
          else {
            this.ngxSmartModalService.getModal('cart').open();
          }
        }
      }
    );
    this.cartCloseSubscription = this.sidebarService.cartCloseEvent.subscribe(
      () => {
        if (this.scrollbar) {
          this.scrollbar.destroy('#cartModal');
        }
        this.ngxSmartModalService.getModal('cart').close();
      }
    )
  }
  deleteItem(urlName: string) {
    let ind = this.cartItems.findIndex(x => x.urlName == urlName);
    if (ind != -1) {
      this.cartItems.splice(ind, 1);
    }
    this.cartService.deleteProduct(urlName);
    this.totalCartPrice = this.getTotalOrderPrice();
  }
  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.cartCloseSubscription) {
      this.cartCloseSubscription.unsubscribe();
    }

  }
}
