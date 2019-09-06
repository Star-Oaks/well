import { Component, ViewChild, Output, EventEmitter, ElementRef, Input, ViewChildren, QueryList } from '@angular/core';
import { TranslatesService } from '../../translates';
import { Subscription, forkJoin } from 'rxjs';
import { Social } from '../../model/contacts/social';
import { Phone } from '../../model/contacts/phone';
import { Adress } from '../../model/contacts/adress';
import { FooterService } from './footer.service';
import { BrowserService } from '../../services/browser.service';
import { LocalizeRouterService } from '../../localize/localize-router.service';

const CLinks: any[] = [
  {
    link: 'https://promo.krinitsa.com.ua',
    localize: false,
    name: 'promo'
  },
  {
    link: '/kompaniya',
    localize: true,
    name: 'company'
  },
  {
    link: '/o-vode',
    localize: true,
    name: 'voda'
  },
  {
    link: '/tochki',
    localize: true,
    name: 'dots'
  },
  {
    link: '/dostavka',
    localize: true,
    name: 'delivery'
  },
  {
    link: '/franchising',
    localize: true,
    name: 'franchising'
  },
  {
    link: '/novosti',
    localize: true,
    name: 'news'
  },
];
const CustLinks: any[] = [
  {
    link: '/akcii',
    localize: true,
    name: 'shares'
  },
  {
    link: '/o-kofe/kofe-corsico',
    localize: true,
    name: 'corsico'
  },
  {
    link: '/o-kofe/kofe-jacobs',
    localize: true,
    name: 'jacobs'
  },
  {
    link: '/o-kofe/degustacia-kofe',
    localize: true,
    name: 'degustation'
  },
  {
    link: '/encyclopedia',
    localize: true,
    name: 'encyclopedia'
  },
  {
    link: '/kontakty',
    localize: true,
    name: 'contacts'
  },
  {
    link: '/sitemap',
    localize: false,
    name: 'sitemap'
  }
]
const schema = {
  "@context": "http://schema.org",
  "@type": "Organization",
  "url": "krinitsa.com.ua",
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+38 097 455 84 55",
    "contactType": "customer service"
  }]
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  public companyLinks: any[] = CLinks;
  public customersLinks: any[] = CustLinks;
  public currentLang: string = "";
  public social: Social;
  public phones: Phone[] = [];
  public adress: Adress;
  public schema = schema;

  public translateSubscription: Subscription;
  @Input() isHomePage: boolean = false;
  @Output() footerEvent = new EventEmitter();
  @ViewChild('footer', { static: true }) footer: ElementRef;
  @ViewChildren('phonesCollections') phonesCollections: QueryList<ElementRef>;
  constructor(
    private translate: TranslatesService,
    private footerService: FooterService,
    private browserService: BrowserService
  ) {

  }
  sendFooterPos() {
    let pos = this.browserService.getCoordsY(this.footer.nativeElement);
    this.footerEvent.emit(pos);
  }
  ngOnInit() {
    
    
    let phonesRequest = this.footerService.getPhones();
    let adressRequest = this.footerService.getAdresses();
    let socialRequest = this.footerService.getSocials();

    let dataSub: Subscription = forkJoin([phonesRequest, adressRequest, socialRequest]).subscribe(
      res => {
        this.phones = res[0] as Phone[];
        this.phones.sort((a, b) => a.numberInSequence - b.numberInSequence)
        this.adress = res[1] as Adress;
        this.social = res[2] as Social;
        if (dataSub) {
          dataSub.unsubscribe();
        }
      },
      () => {
        if (dataSub) {
          dataSub.unsubscribe();
        }
      }
    )
    this.currentLang = this.translate.getCurrentLang();
   
    this.translateSubscription = this.translate.getCurrentLangEvent().subscribe(
      (res) => {
        this.currentLang = res;
        this.footerService.getAdresses().subscribe(
          res => {
            this.adress = res as Adress;
          }
        )
      }
    )

  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
