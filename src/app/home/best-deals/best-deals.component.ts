import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BestDeals } from '../../shared/model/home/best-dials.model';
import { CartService } from '../../shared/services/cart.service';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { Product } from '../../shared/model/shop/product';
import { ProductsConstUrlName } from '../../app-products-const';


@Component({
  selector: 'app-best-deals',
  templateUrl: './best-deals.component.html',
  styleUrls: ['./best-deals.component.scss'],
})
export class BestDealsComponent implements OnInit {

  public show: boolean = false;
  public isBrowser: boolean = false;

  @Input('data') products: Array<BestDeals>;
  @ViewChild('tooltip', { static: false }) tooltip: TooltipDirective;
  constructor(
    private cartService: CartService,
  ) {
  }
  parentEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
  getItemCount(e, ind) {
    this.products[ind].count = e;
  }
  openTooltip(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
  closeTooltip() {
    if (this.tooltip) {
      this.tooltip.hide();
    }
  }
  checkForConst(urlName: string) {
    return ProductsConstUrlName.some(x => x == urlName);
  }
  addToCart(urlName: string, e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let ind = this.products.findIndex(x => x.urlName == urlName);
    if (ind != -1) {
      if (this.products[ind].adding) {
        return;
      }
      this.products[ind].adding = true;
      this.cartService.addToCart(e, <Product><any>this.products[ind]);
      setTimeout(() => {
        this.products[ind].adding = false;
      }, 2000);
    }
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.closeTooltip();
  }
}
