import { Component, OnInit, ViewChild } from '@angular/core';
import { OurClients } from '../../model/our-clients/our-clients-page';
import { TranslatesService } from '../../translates';
import { OurClientsService } from './our-clients.service';
import { Subscription } from 'rxjs';
import { OurClientsItem } from '../../model/our-clients/our-clients-item';
import { SlickItemDirective } from 'ngx-slick-carousel';

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss'],
})
export class OurClientsComponent implements OnInit {
  public data: OurClients;
  public slides: OurClientsItem[] = [];

  public slideConfig = {
    dots: false,
    arrows: true,
    rows: 2,
    slidesPerRow: 2,
    mobileFirst: true,
    autoplaySpeed: 3000,
    prevArrow:
      '<a class="slick-prev slick-arrow" aria-label="Prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="vdlna" d="M26.552 1254.468v-.94h18.454v.94zm-.162-3.46v5.98l-3.4-2.991z"/></defs><g><g transform="translate(-23 -1251)"><use xlink:href="#vdlna"/></g></g></svg></a>',
    nextArrow:
      '<a class="slick-next slick-arrow" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="cacma" d="M721.994 1254.468v-.94h18.454v.94zm22.016-.471l-3.4 2.99v-5.978z"/></defs><g><g  transform="translate(-722 -1251)"><use xlink:href="#cacma"/></g></g></svg></a>',
    responsive: [
      {
        breakpoint: 575,
        settings: {
          slidesPerRow: 3,
        },
      },
    ],
  };


  public translateSubscription: Subscription;
  public ourClientsSubscription: Subscription;
  constructor(
    private translatesService: TranslatesService,
    private ourClientsService: OurClientsService,
  ) {
    this.ourClientsSubscription =  this.ourClientsService.getOurClientsServiceData().subscribe((res) => {
      this.data = res as OurClients;
      this.slides = this.data.clientsLogoItem;

    });
  }
  slickInit(event) {
    if (event.slick.slideWidth == 0) {
      setTimeout(
        () => {
          this.refresh(event);
        }, 100);
    }
  }
  refresh(event) {
    event.slick.refresh();
  }
  afterChange(event) {
    if (event.slick.slideWidth == 0) {
      setTimeout(
        () => {
          this.refresh(event);
        }
        , 100);
    }
  }
  trackByFunc(index, item) {
    if (!item) {
      return
    }
    return index
  }
  ngOnInit() {

    this.translateSubscription = this.translatesService.changeLanguageEvent.subscribe(() => {
      const ourCliensSub: Subscription = this.ourClientsService.getOurClientsServiceData().subscribe(
        (res) => {
          this.data = undefined;
          setTimeout(() => this.data = res as OurClients);
          if (ourCliensSub) {
            ourCliensSub.unsubscribe();
          }
        },
        () => {
          if (ourCliensSub) {
            ourCliensSub.unsubscribe();
          }
        }
      );
    });
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    if (this.ourClientsSubscription) {
      this.ourClientsSubscription.unsubscribe();
    }
  }
}
