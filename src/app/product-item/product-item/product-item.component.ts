import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/model/shop/product';
import { ProductsConstUrlName } from '../../app-products-const';


@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  public adding: boolean = false;

  @Input('product') product: Product;
  @Input() subCategoryName: string = "";
  constructor(
    private cartService: CartService
  ) {

  }

  ngOnInit() {
    
  }
  ngAfterViewInit() {
  }
  getItemCount(e) {
    this.product.count = e;
  }
  parentEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }
  openTooltip(e: Event) {
    e.stopPropagation();
    e.preventDefault();
  }

  addToCart(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this.adding) {
      return;
    }
    this.adding = true;
    this.cartService.addToCart(e, this.product);
    setTimeout(() => {
      this.adding = false;
    }, 2000);
  }
  checkForConst(urlName: string) {
    return ProductsConstUrlName.some(x => x == urlName);
  }
  ngOnDestroy() {
  }
}
