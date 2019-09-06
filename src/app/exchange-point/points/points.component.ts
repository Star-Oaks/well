import { Component, OnInit, EventEmitter } from '@angular/core';
import { Point } from '../../shared/model/dots-page/exchange-point.model';
import { MetaService } from '@ngx-meta/core';

import { TranslatesService } from '../../shared/translates';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DotsPage } from '../../shared/model/dots-page/dots-page';
import { PointsService } from './points.service';
import { LinkService } from '../../shared/services/link.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';
import { TranslateService } from '@ngx-translate/core';
import { Schema } from '../../shared/globals/seo-models/seo-scrip-model';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {
  public data: DotsPage;
  public windowWidth: number;
  public seoText: string;
  public lattitude: number;
  public longitude: number;
  public points: Array<Point> = [];
  public zoom: number;
  public mapStyles: Array<any>;
  public icon: string;
  public openedWindow: number = 0;
  public schema = Schema

  private translateSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translatesService: TranslatesService,
    private translateCore: TranslateService,
    private pointsService: PointsService,
    private readonly meta: MetaService,
    private router: Router,
    private linkService: LinkService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {
    this.linkService.addTag({ rel: 'canonical', href: this.router.url })
    let request = this.activatedRoute.snapshot.data['res'];
    this.data = request as DotsPage;
    this.completeSeoScript();
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
    this.zoom = 9.1;
    this.mapStyles = [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }];
    this.icon = "/assets/img/icons/map-icon.png";

  };
  openWindow(id) {
    this.openedWindow = id; // alternative: push to array of numbers
  }

  isInfoWindowOpen(id) {
    return this.openedWindow == id; // alternative: check if id is in array
  }
  completeSeoScript() {
    this.schema = undefined;
    setTimeout(() => {
      this.schema = Schema;
      this.schema.itemListElement[0].name = this.translateCore.instant("siteSeo");;
      this.schema.itemListElement[0].item = environment.host;
      this.schema.itemListElement[1].name = this.translateCore.instant("points.name")
      this.schema.itemListElement[1].item = environment.host + "/" + this.translateCore.currentLang + "/tochki";
    })

  }
  ngOnInit() {
    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(() => {
      this.pointsService.getPointsData().subscribe((res) => {
        this.data = res as DotsPage;
        this.completeSeoScript();
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
      })

    })
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
