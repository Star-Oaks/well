import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { BestDeals } from '../../shared/model/home/best-dials.model';
import { Product } from '../../shared/model/shop/product';
import { ProductsConstUrlName } from '../../app-products-const';

@Component({
  selector: 'app-recommendations-item',
  templateUrl: './recommendations-item.component.html',
  styleUrls: ['./recommendations-item.component.scss']
})
export class RecommendationsItemComponent implements OnInit {
  @Input('product') product: BestDeals;
  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {

  }
  parentEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
  getItemCount(e) {
    this.product.count = e;
  }
  openTooltip(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
  checkForConst(urlName: string) {
    return ProductsConstUrlName.some(x => x == urlName);
  }
  addToCart(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this.product.adding) {
      return;
    }
    this.product.adding = true;
    this.cartService.addToCart(e, <Product><any>this.product);
    setTimeout(() => {
      this.product.adding = false;
    }, 2000);
  }
  ngOnDestroy() {
  }
}
