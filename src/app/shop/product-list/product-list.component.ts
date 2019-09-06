import { Component, OnInit, Input } from '@angular/core';
import { BrowserService } from '../../shared/services/browser.service';
import { Product } from '../../shared/model/shop/product';
import { environment } from '../../../environments/browser/environment.prod';
import { TranslatesService } from '../../shared/translates';
import { Subscription } from 'rxjs';
import { LocalizeRouterService } from '../../shared/localize/localize-router.service';

const schema = {

  "@context": "http://schema.org",
  "@type": "ItemList",
  "itemListElement": [
  ]
}
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];
  public isBrowser: boolean;
  public wWidth: number;
  public countProducts: number = 24;
  public endList: boolean = false;
  public schema = schema;
  @Input('productsArray') productsCopy: Product[] = [];
  @Input() subCategoryName: string = '';
  constructor(
    private browserService: BrowserService,
    private translate: TranslatesService,
    private localize: LocalizeRouterService
  ) {
    this.isBrowser = this.browserService.getPlatform();
    if (this.isBrowser) {
      this.wWidth = this.browserService.getViewPortWidth();

      // this.product.productImg =  x.pro && this.product.productPhotos.length ?  this.product.productPhotos[0].smallImageUrl : "";
    }
  }
  ngOnChanges() {
    if (this.productsCopy && this.productsCopy.length) {
      this.endList = false;

      if (this.isBrowser) {
        if (this.wWidth < 768) {
          this.countProducts = 16;
        }
        else {
          this.countProducts = 24;
        }
        this.productsCopy = this.productsCopy.map(x => {
          x.productImg = x.productPhoto ? this.wWidth < 768 ? x.productPhoto.thumbnailImageUrl : x.productPhoto.smallImageUrl : "";
          return x
        })
        this.paginate();
      }
      else {
        this.countProducts = 24;
        this.productsCopy = this.productsCopy.map(x => {
          x.productImg = x.productPhoto ? this.wWidth < 768 ? x.productPhoto.thumbnailImageUrl : x.productPhoto.smallImageUrl : "";
          return x
        })
        this.paginate();
      }
    }
    else {
      this.products = [];
    }
    this.completeSeoScript();
  }
  paginate() {
    if (this.productsCopy.length <= this.countProducts) {
      this.products = this.productsCopy.slice(0, this.productsCopy.length);
      this.endList = true;
    }
    else {
      this.products = this.productsCopy.slice(0, this.countProducts)
    }

  }
  loadMore() {
    if (this.products.length + this.countProducts >= this.productsCopy.length) {
      this.products.push(...this.productsCopy.slice(this.products.length, this.productsCopy.length));
      this.endList = true;
    }
    else {
      this.products.push(...this.productsCopy.slice(this.products.length, this.products.length + this.countProducts))
    }
  }
  completeSeoScript() {
    this.schema = undefined;
  
    setTimeout(() => {
      this.schema = schema;
      for (let i = 0; i < this.products.length; i++) {
        const product = this.products[i];
        this.schema.itemListElement[i] = {
          "@type": "ListItem",
          "position": i + 1,
          "url": environment.host + '/' + this.localize.currentLang + '/products/' + product.categoryUrlName + "/" + product.urlName
        }

      }
    });

  }
  ngOnInit() {    
  }
}
