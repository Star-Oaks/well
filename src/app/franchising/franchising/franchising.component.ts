
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Franchising } from '../../shared/model/franchising';
import { TranslatesService } from '../../shared/translates';
import { Subscription } from 'rxjs';
import { FranchisingService } from './franchising.service';
import { MetaService } from '@ngx-meta/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-franchising',
  templateUrl: './franchising.component.html',
  styleUrls: ['./franchising.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ])
  ]
})
export class FranchisingComponent implements OnInit {
  public form: FormGroup;
  public data: Franchising;
  public seoText: string;
  public sendState: boolean = false;
  public schema = Schema;

  public visiblityState = 'show';
  public visiblityState2 = "hidden";

  private phoneRegex: RegExp = /^[+]?([0-9]){10,13}$/;
  private emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  private translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private franchisingService: FranchisingService,
    private fb: FormBuilder,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {
    let request = this.activatedRoute.snapshot.data['res'];
    this.data = request as Franchising;
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
  }

  completeSeoScript() {
    this.schema = undefined;
    setTimeout(() => {
      this.schema = Schema;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");;
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.translateCore.instant("franchising.name")
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/franchising";
      
    })

  }

  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(
      () => {
        let franchisingSub: Subscription = this.franchisingService.getFranchingData().subscribe(
          res => {
            this.data = res as Franchising;
            this.completeSeoScript()
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
            if (franchisingSub) {
              franchisingSub.unsubscribe();
            }
          },
          () => {
            if (franchisingSub) {
              franchisingSub.unsubscribe();
            }
          }
        )
      }
    )
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex)]),
      city: new FormControl('', Validators.required)
    });
  }
  checkout() {
    this.form.markAsTouched();
    let valid = true;
    if (this.form.controls.email.invalid) {
      this.form.controls.email.markAsTouched();
      valid = false;
    }
    if (this.form.controls.phoneNumber.invalid) {
      this.form.controls.phoneNumber.markAsTouched();
      valid = false;
    }
    if (this.form.controls.city.invalid) {
      this.form.controls.city.markAsTouched();
      valid = false;
    }
    if (!valid) {
      return
    }
    let franchisingSub: Subscription = this.franchisingService.postFranchingForm(this.form.value).subscribe(
      () => {
        this.sendState = true;
        this.visiblityState = "hidden";
        this.visiblityState2 = "show";
        this.form.reset();
        if (franchisingSub) {
          franchisingSub.unsubscribe();
        }
      },
      () => {
        if (franchisingSub) {
          franchisingSub.unsubscribe();
        }
      }
    )
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
