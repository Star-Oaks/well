import { Component, OnInit, Input } from '@angular/core';
import { SliderItem } from '../../shared/model/home/slider-item';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  @Input('data') slides: Array<SliderItem>;

  public slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    dots: true,
    arrows: false,
    mobileFirst: true,
    variableWidth: true,
    centerMode: true,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: '<a class="slick-prev slick-arrow" aria-label="Prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="vdlna" d="M26.552 1254.468v-.94h18.454v.94zm-.162-3.46v5.98l-3.4-2.991z"/></defs><g><g transform="translate(-23 -1251)"><use xlink:href="#vdlna"/></g></g></svg></a>',
    nextArrow: '<a class="slick-next slick-arrow" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="cacma" d="M721.994 1254.468v-.94h18.454v.94zm22.016-.471l-3.4 2.99v-5.978z"/></defs><g><g  transform="translate(-722 -1251)"><use xlink:href="#cacma"/></g></g></svg></a>',
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: true,
        }
      }
    ]
  };
  constructor() { }

  ngOnInit() {
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
}
