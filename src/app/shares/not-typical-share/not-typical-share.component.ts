import { Component, OnInit } from '@angular/core';
import { MetaService } from '@ngx-meta/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BrowserService } from '../../shared/services/browser.service';

import { TranslatesService } from '../../shared/translates';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NotTypicalShare } from '../../shared/model/shares/not-typical-share';
import { Subscription } from 'rxjs';
import { SharesService } from '../shares.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

const breadgrams = {
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
  }, {
    "@type": "ListItem",
    "position": 3,
    "name": "",
    "item": ""
  }]
}

@Component({
  selector: 'app-not-typical-share',
  templateUrl: './not-typical-share.component.html',
  styleUrls: ['./not-typical-share.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('300ms')),
      transition('shown => hidden', animate('300ms')),
    ]),
    trigger('visibilityChanged2', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('hidden => shown', animate('1000ms')),
      transition('shown => hidden', animate('1000ms')),
    ]),
    trigger('visibilityValid', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('hidden => shown', animate('1000ms')),
      transition('shown => hidden', animate('1000ms')),
    ]),
  ],
})
export class NotTypicalShareComponent implements OnInit {
  public form: FormGroup;
  public arrayItems: FormArray;
  public data: NotTypicalShare;
  public seoText: string;
  public routeName: string;
  public windowWidth: number;
  public isBrowser: boolean = false;
  public symbolsAllowed: number = 23;
  public schemaBreadgrams = breadgrams;

  public visiblityState = 'shown';
  public visiblityHeader = 'hidden';
  public visiblityValidText = 'hidden';
  private phoneRegex: RegExp = /^[+]?([0-9]){10,13}$/;
  public sendState: boolean = false;

  private translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharesService: SharesService,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    
    private fb: FormBuilder,
    private readonly meta: MetaService,
    private browserService: BrowserService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag
  ) {
    let request = this.activatedRoute.snapshot.data['notTypicalShare'];
    this.data = request as NotTypicalShare;
    this.isBrowser = this.browserService.getPlatform();
    this.completeSeoScript();
    if (this.data.seoTag) {
      this.meta.setTitle(`${this.data.seoTag.title}`);
      this.meta.setTag('description', this.data.seoTag.description);
      this.linkService.addTag({ rel: 'canonical', href: this.router.url })
      this.seoText = this.data.seoTag.text;
      if (this.browserService.isBrowser) {
        this.gtag.pageview({
          page_title: this.data.seoTag.title,
          page_path: this.router.url,
          page_location: environment.api + this.router.url
        });
      }
    }

    if (this.isBrowser) {
      this.windowWidth = this.browserService.getViewPortWidth();
      if (this.windowWidth > 992) {
        this.data.bannerImageUrl = this.data.bigImageUrl;
      }
      else {
        this.data.bannerImageUrl = this.data.smallImageUrl;
      }
    }
    else {
      this.data.bannerImageUrl = this.data.smallImageUrl;
    }

    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      inveteds: this.fb.array([]),
    });

    this.arrayItems = <FormArray>this.form.controls.inveteds;
    this.arrayItems.push(
      this.fb.group({
        name: this.fb.control("", Validators.required),
        phoneNumber: this.fb.control("", [Validators.required, Validators.pattern(this.phoneRegex)]),
      }),
    );

  }
  completeSeoScript() {
    const urlTree = this.router.parseUrl(this.router.url);
    const uri = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
    this.schemaBreadgrams = undefined;
    setTimeout(() => {
      this.schemaBreadgrams = breadgrams;
      this.schemaBreadgrams.itemListElement[0].name = this.translateCore.instant("siteSeo");
      this.schemaBreadgrams.itemListElement[0].item = environment.host;
      this.schemaBreadgrams.itemListElement[1].name = this.translateCore.instant("shares.name");
      this.schemaBreadgrams.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/akcii" 
      this.schemaBreadgrams.itemListElement[2].name = this.data.header;
      this.schemaBreadgrams.itemListElement[2].item = environment.host + "/" + uri;
    })

  }

  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(() => {
      let shareSub: Subscription = this.sharesService.getNotTypicalShare().subscribe(
        (res) => {
          this.data = res as NotTypicalShare;
          this.completeSeoScript();
          if (this.isBrowser) {
            this.windowWidth = this.browserService.getViewPortWidth();
            if (this.windowWidth > 992) {
              this.data.bannerImageUrl = this.data.bigImageUrl;
            }
            else {
              this.data.bannerImageUrl = this.data.smallImageUrl;
            }
          }
          else {
            this.data.bannerImageUrl = this.data.smallImageUrl;
          }
          if (this.data.seoTag) {
            this.meta.setTitle(`${this.data.seoTag.title}`);
            this.meta.setTag('description', this.data.seoTag.description);
            this.seoText = this.data.seoTag.text;
            if (this.browserService.isBrowser) {
              this.gtag.pageview({
                page_title: this.data.seoTag.title,
                page_path: this.router.url,
                page_location: environment.api + this.router.url
              });
            }
          }
          if (shareSub) {
            shareSub.unsubscribe();
          }
        });
    });
  }

  addNumber() {
    this.arrayItems.push(
      this.fb.group({
        name: this.fb.control("", Validators.required),
        phoneNumber: this.fb.control("", [Validators.required, Validators.pattern(this.phoneRegex)]),
      }),
    );
    this.form.controls.inveteds = this.arrayItems;
  }

  checkout() {
    this.form.markAsTouched();
    this.visiblityValidText = "hidden";
    let valid = true;
    if (this.form.controls.address.invalid) {
      this.form.controls.address.markAsTouched();
      valid = false;
    }
    if (this.form.controls.name.invalid) {
      this.form.controls.name.markAsTouched();
      valid = false;
    }
    let inv = this.form.controls.inveteds as FormArray;
    inv.controls.forEach(x => {
      if (x["controls"].name.invalid || x["controls"].phoneNumber.invalid) {
        if (x["controls"].name.invalid) {
          x["controls"].name.markAsTouched();
        }
        if (x["controls"].phoneNumber.invalid) {
          x["controls"].phoneNumber.markAsTouched();
        }
        valid = false;
      }
    })
    if (!valid) {
      this.visiblityValidText = "shown";
      setTimeout(() => this.visiblityValidText, 4000);
      return
    }
    this.visiblityValidText = "hidden"
    let addRecommSub: Subscription = this.sharesService.addRecommendation(this.form.value).subscribe(
      () => {
        // if (this.browserService.isBrowser) {
        //   this.gtag.event('event', {
        //     method: 'click',
        //     event_category: 'recommend',
        //     event_label: 'Порекомендовать'
        //   });
        // }
        this.visiblityState = 'hidden';
        this.visiblityHeader = 'shown';
        this.sendState = true;
        if (addRecommSub) {
          addRecommSub.unsubscribe();
        }
      });
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
