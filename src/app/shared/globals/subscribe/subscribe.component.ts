import { Component, OnInit, Input } from '@angular/core';
import { TranslatesService } from '../../translates';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { SubscribeService } from './subscribe.service';
import { Gtag } from 'angular-gtag';
import { BrowserService } from '../../services/browser.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ]),


    trigger('inputChenged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ]),
    trigger('textChenged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ]),
  ],
})
export class SubscribeComponent implements OnInit {
  public data: FormGroup;
  public visiblityState = 'hidden';
  public inputState = 'show';
  public textState = 'hidden';
  public successSend: boolean = false;
  private pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  constructor(
    private fb: FormBuilder,
    private subscribeService: SubscribeService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) { }

  ngOnInit() {
    this.data = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.pattern)]),
    });
  }
  saveEmail() {
    if (this.successSend) {
      return
    }
    if (this.data.valid) {
      this.subscribeService.postSubscribeData(this.data.value).subscribe(
        () => {
          this.visiblityState = 'hidden';
          this.textState = 'shown';
          this.inputState = 'hidden';
          this.successSend = true;
          // if (this.browserService.isBrowser) {
          //   this.gtag.event('click', {
          //     method: 'click',
          //     event_category: 'subscription',
          //     event_label: 'Подписка на акции'
          //   })
          // }
        },
        () => {
          this.textState = 'hidden';
          this.visiblityState = 'shown';
          this.inputState = 'shown';
          setTimeout(() => { this.visiblityState = 'hidden' }, 3000);
        }
      );
    }
    else {
      this.textState = 'hidden';
      this.visiblityState = 'shown';
      this.inputState = 'show';
      setTimeout(() => { this.visiblityState = 'hidden' }, 3000);
    }
  }
}
