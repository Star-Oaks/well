
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../shared/model/shop/product';
import { SubCategory } from '../../shared/model/shop/subCategory';
import { MetaService } from '@ngx-meta/core';
import { SeoTag } from '../../shared/model/seo';
import { FilteringProduct } from '../../shared/model/shop/filteringProduct';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from '../../shared/localize/localize-router.service';


const breadcrumbs = {
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "",
    "item": ""
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "",
    "item": ""
  }]
}

@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.scss'],
})

export class ShopPageComponent implements OnInit {
  public products: Product[] = [];
  public subCategory: SubCategory;
  public seoText: string;
  public filteringProducts: Product[] = [];
  public filteringArr: FilteringProduct[] = [];

  private routerSubscription: Subscription;
  public schema = breadcrumbs;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly meta: MetaService,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService,
    private translateCore: TranslateService,
    private  localize: LocalizeRouterService
  ) {
    this.linkService.addTag({ rel: 'canonical', href: this.router.url });
    let req = this.activatedRoute.snapshot.data["res"];
    this.products = req[0] as Product[];
    this.subCategory = req[1] as SubCategory;

    if (this.subCategory.filterings.length === 0) {
      this.filteringProducts = this.products;
    }
    else {
      this.subCategory.filterings.sort((a, b) => a.numberInSequence - b.numberInSequence);
      this.filterProduct();
    }
    this.completeSeoScript();
    this.setMeta(this.subCategory.seoTag);
  }
  private setMeta(seoTag: SeoTag) {
    this.meta.setTitle(`${seoTag.title}`);
    this.meta.setTag('description', seoTag.description);
    this.seoText = seoTag.text;
    if (this.browserService.isBrowser) {
      this.gtag.pageview({
        page_title: seoTag.title,
        page_path: this.router.url,
        page_location: environment.host + this.router.url
      });
    }
  }
  private completeSeoScript(){
    this.schema = undefined;
    setTimeout(()=>{
      this.schema = breadcrumbs;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.subCategory.subName;
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/catalog/" + this.subCategory.urlName;
    })
  }
  ngOnInit() {
    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let req = this.activatedRoute.snapshot.data["res"];
          this.products = req[0] as Product[];
          this.subCategory = req[1] as SubCategory;
          this.subCategory.filterings.sort((a, b) => a.numberInSequence - b.numberInSequence);
          this.setMeta(this.subCategory.seoTag);
          this.completeSeoScript();
        }
      })
  }
  changeFilter(filterArr: FilteringProduct[]) {
    this.filteringArr = filterArr;
    this.filterProduct();
  }
  filterProduct() {
    if (!this.filteringArr.length) {
      this.filteringProducts = this.products;
      return
    }
    let allP = this.products.filter(product => {
      return product.filterings.some(productF => this.filteringArr.some(filtering => filtering.filteringsValuesId.some(fv => productF.filteringsValuesId[0] == fv)))
    })
    if (this.filteringArr.length == 1)
      this.filteringProducts = [...allP]
    else {
      this.filteringProducts = allP.filter(p => {
        return p.filterings.filter(q => this.filteringArr.some(g => q.filteringsId == g.filteringsId)).every(f =>
          this.filteringArr.some(farr => farr.filteringsValuesId.length == 1 ? farr.filteringsValuesId[0] == f.filteringsValuesId[0]
            : farr.filteringsValuesId.some(z => z == f.filteringsValuesId[0]))
        )
      })
    }
  }
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
