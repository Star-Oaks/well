import { Component, OnInit, Input } from '@angular/core';
import { ValueBlock } from '../../shared/model/about-company/value-block-company';





@Component({
  selector: 'app-our-values',
  templateUrl: './our-values.component.html',
  styleUrls: ['./our-values.component.scss']
})
export class OurValuesComponent implements OnInit {
  public slideConfig = {
    slidesToShow: 2,
    slidesToScroll: 1,
    mobileFirst: true,
    dots: false,
    infinite: true,
    prevArrow: '<a class="slick-prev slick-arrow" aria-label="Prev"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="vdlna" d="M26.552 1254.468v-.94h18.454v.94zm-.162-3.46v5.98l-3.4-2.991z"/></defs><g><g transform="translate(-23 -1251)"><use xlink:href="#vdlna"/></g></g></svg></a>',
    nextArrow: '<a class="slick-next slick-arrow" aria-label="Next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="6" viewBox="0 0 22 6"><defs><path id="cacma" d="M721.994 1254.468v-.94h18.454v.94zm22.016-.471l-3.4 2.99v-5.978z"/></defs><g><g  transform="translate(-722 -1251)"><use xlink:href="#cacma"/></g></g></svg></a>',
    responsive: [ 
       {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,      
        },
      },
    ]
  };

  @Input('data') data: ValueBlock;
  
  constructor() {
  }
  ngOnInit() {
  }
  slickInit(event){
    if( event.slick.slideWidth == 0){
      setTimeout(
        ()=> {
          this.refresh(event);
        }, 100);
    }
  }
  refresh(event){
    event.slick.refresh();
  }
  afterChange(event){
    if( event.slick.slideWidth == 0){
      setTimeout(
        ()=> {
          this.refresh(event);
        }
        , 100);
    }
  }
}
