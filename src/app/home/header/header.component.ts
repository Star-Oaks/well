import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PageBanner } from '../../shared/model/home/pageBanner.model';
import { Phone } from '../../shared/model/contacts/phone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('phoneState', [
      state('show', style({
         width: '15rem',
      })),
      state('hide', style({
         width: '4.1rem',
      })),
      transition('show => hide', animate('300ms')),
      transition('hide => show', animate('300ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public show : boolean = false;

  @Input('data') data: PageBanner;
  @Input('phone') phone: Phone;

  constructor(){}

  get statePhone() {
    return this.show ? 'show' : 'hide'
  }
  changeState() {
    this.show = !this.show;
  }
  onPhoneEnter(){
    this.show = true;
  }
  onPhoneLeave (){
    this.show = false;
  }
  ngOnInit() {
  }
}
