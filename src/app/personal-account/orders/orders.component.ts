import { Component, OnInit, Input } from '@angular/core';
import { UserOrder } from '../../shared/model/user/user-order';
import { CartService } from '../../shared/services/cart.service';
import { CartProduct } from '../../shared/model/cart/cartProduct';
import { UserProduct } from '../../shared/model/user/user-product';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  public paginateOrders: UserOrder[] = [];

  public endList: boolean = false;
  public count: number = 4;
  private countLoad: number;

  @Input('orders') orders: UserOrder[] = [];

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) { 
  }
  ngOnInit() {
  }
  ngOnChanges() {
    this.orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    this.orders.forEach(x => {
      let total: number = 0;
      x.productOrders.forEach(y => {
        y.adding = false;
        total += y.productCount * y.productStandartPrice;
      })
      x.adding = false;
      x.totalPrice = total;
    });
    this.paginate();
  }
  paginate() {
    if (this.orders.length <= this.count) {
      this.paginateOrders = this.orders.slice(0, this.orders.length);
      this.endList = true;
    }
    else {
      this.paginateOrders = this.orders.slice(0, this.count);
      this.endList = false;
    }
    this.countLoad = 1;
  }
  loadMore() {
    if (this.paginateOrders.length + this.count >= this.orders.length) {
      this.paginateOrders.push(...this.orders.slice(this.paginateOrders.length, this.orders.length));
      this.endList = true;
    }
    else {
      this.paginateOrders.push(...this.orders.slice(this.paginateOrders.length, this.paginateOrders.length + this.count));
    }
    this.countLoad++;
  }

  addToCart(product: UserProduct, orderId: string, e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let indexOrder = this.paginateOrders.findIndex(x => x.id === orderId);
    if (indexOrder != -1) {
      let ind = this.paginateOrders[indexOrder].productOrders.findIndex(x => x.urlName == product.urlName);
      if (ind != -1) {
        if (this.paginateOrders[indexOrder].productOrders[ind].adding) {
          return;
        }
        let obj: CartProduct = {
          urlName: this.paginateOrders[indexOrder].productOrders[ind].urlName,
          count: this.paginateOrders[indexOrder].productOrders[ind].productCount || 1
        }
        this.cartService.addProduct(obj);
        this.paginateOrders[indexOrder].productOrders[ind].adding = true;
        setTimeout(() => this.paginateOrders[indexOrder].productOrders[ind].adding = false, 2000);
      }
    }
  }
  deleteProduct(product: UserProduct, orderId: string) {
    let indexOrder = this.paginateOrders.findIndex(x => x.id == orderId);
    if (indexOrder != -1) {
      let ind = this.paginateOrders[indexOrder].productOrders.findIndex(x => x.urlName == product.urlName);
      if (ind != -1) {
        let deleteSub: Subscription = this.userService.deleteProductFormOrder(this.paginateOrders[indexOrder].id, this.paginateOrders[indexOrder].productOrders[ind].productId).subscribe(
          () => {
            this.paginateOrders[indexOrder].productOrders.splice(ind, 1);
            if (this.paginateOrders[indexOrder].productOrders.length == 0) {
              this.deleteOrder(orderId);
            }
            else {
              this.paginateOrders[indexOrder].totalPrice = 0;
              this.paginateOrders[indexOrder].productOrders.forEach(x => {
                this.paginateOrders[indexOrder].totalPrice += x.productCount * x.productStandartPrice;
              });
            }
          },
          () => { },
          () => {
            if (deleteSub) {
              deleteSub.unsubscribe()
            }
          }
        )
      }
    }
  }
  deleteOrder(orderId: string) {
    let indexOrder = this.paginateOrders.findIndex(x => x.id == orderId);
    if (indexOrder != -1) {
      let deleteSub: Subscription = this.userService.deleteOrder(orderId).subscribe(
        () => {
          this.orders.splice(indexOrder, 1);
          this.paginateOrders = this.orders.slice(0, this.countLoad * this.count);
          if (this.countLoad * this.count >= this.orders.length) {
            this.endList = true;
          }
        },
        () => { },
        () => {
          if (deleteSub) {
            deleteSub.unsubscribe()
          }
        }
      )
    }
  }
  repeatOrder(orderId: string) {
    let indexOrder = this.paginateOrders.findIndex(x => x.id == orderId);
    if (indexOrder != -1) {
      if (this.paginateOrders[indexOrder].adding) {
        return
      }
      let products = this.paginateOrders[indexOrder].productOrders.map(x => {
        return <CartProduct>{
          urlName: x.urlName,
          count: x.productCount
        }
      })
      this.cartService.addCollectionProducts(products);
      this.paginateOrders[indexOrder].adding = true;
      setTimeout(() => this.paginateOrders[indexOrder].adding = false, 2000)
    }
  }
}