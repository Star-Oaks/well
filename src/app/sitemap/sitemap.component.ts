import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../shared/model/shop/category';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatesService } from '../shared/translates';
import { LinkService } from '../shared/services/link.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  public links: Category[] = [];
  public seoText: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private meta: MetaService,
    private translateCore: TranslateService,
    private router: Router,
    private linkService: LinkService
  ) { }

  ngOnInit() {
    let res = this.activatedRoute.snapshot.data["data"];
    this.links = this.mapLinks(res as Category[]);
    this.linkService.addTag({ rel: 'canonical', href: this.router.url });
    this.meta.setTitle(this.translateCore.instant('sitemap.title'));
    this.meta.setTag("description", this.translateCore.instant("sitemap.description"));
    // this.translate.changeLanguageEvent.subscribe(() => {
    //   this.meta.setTitle(this.translateCore.instant('sitemap.title'));
    //   this.meta.setTag("description", this.translateCore.instant("sitemap.description"));
    // })
  }
  mapLinks(res: Category[]): Category[] {
    let data = res;
    if (data && data.length) {

      data = data.map(x => {
        if (x.asSubcategory && x.subCategories && x.subCategories.length > 0) {
          return {
            imageUrl: x.subCategories[0].imageUrl,
            name: x.subCategories[0].name,
            numberInSequence: x.subCategories[0].numberInSequence,
            urlName: x.subCategories[0].urlName,
            asSubcategory: true,
          }
        }
        else {
          return x
        }
      })
      data.sort((a, b) => a.numberInSequence - b.numberInSequence).forEach(x => {
        if (x.subCategories && x.subCategories && x.subCategories.length > 0) {
          x.subCategories.sort((a, b) => a.numberInSequence - b.numberInSequence);
        }
      })
      return data
    }
    return [];
  }
}
