import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { UserOrder } from '../../model/user/user-order';
import { CartProduct } from '../../model/cart/cartProduct';
import { UserProduct } from '../../model/user/user-product';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { TranslatesService } from '../../translates';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-error-order',
  templateUrl: './error-order.component.html',
  styleUrls: ['./error-order.component.scss']
})
export class ErrorOrderComponent implements OnInit {
  public userOrder: UserOrder;
  public cartItems: UserProduct[] = [];
  public totalCartPrice: number = 0;

  @ViewChild('cartModal', { static: false }) cartModal: ElementRef;

  private errorSubscription: Subscription;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private sidebarService: SidebarService,
    private scrollbar: MalihuScrollbarService,
    private cartService: CartService,
    private translateService: TranslatesService,
    private router: Router,
    private userService: UserService
  ) {
    this.errorSubscription = this.sidebarService.getErrorEvent().subscribe(
      state => {
        if (state) {
          let item = this.sidebarService.errorOrder;
          this.userOrder = item;
          this.cartItems = this.userOrder.productOrders;
          this.totalCartPrice = this.getTotalOrderPrice();
          if (this.ngxSmartModalService.modalStack.some(x => x.id != "error")) {
            setTimeout(() => this.ngxSmartModalService.getModal('error').open(), 1000)
          }
          this.ngxSmartModalService.getModal('error').open();
          setTimeout(() => {
            this.scrollbar.initScrollbar('#cartModal', { axis: 'y', theme: 'dark-2' });
          }, 200)
        }
      }
    )
  }
  closeErrorOrder() {
    this.ngxSmartModalService.getModal('error').close();
    this.sidebarService.closeErrorOrder();
  }

  getTotalOrderPrice() {
    let price = 0;
    this.cartItems.forEach(x => {
      price += x.productCount * x.productStandartPrice
    })
    return price;
  }
  onCloseErrorOrder() {
    let sub: Subscription = this.userService.deleteOrder(this.userOrder.id).subscribe(
      () => { this.userService.deleteErrorOrder() },
      () => { },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )
  }
  reOrder() {
    let arr: CartProduct[] = this.cartItems.map(x => {
      let item: CartProduct = {
        urlName: x.urlName,
        count: x.productCount
      }
      return item
    })
    this.cartService.addCollectionProducts(arr);
    this.closeErrorOrder();
    this.router.navigate(["/", this.translateService.getCurrentLang(), 'cart']);
  }
  ngOnInit() {

  }
  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }
}
