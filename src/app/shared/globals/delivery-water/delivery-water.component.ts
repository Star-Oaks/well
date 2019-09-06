import { Component, OnInit, Input } from '@angular/core';
import { BrowserService } from '../../services/browser.service';
import { ReadMoreDirective } from '../directives/read-more.directive';

@Component({
  selector: 'app-delivery-water',
  templateUrl: './delivery-water.component.html',
  styleUrls: ['./delivery-water.component.scss']
})
export class DeliveryWaterComponent implements OnInit {
  public count: number;
  public load: boolean = false;
  public isBrowser: boolean;

  @Input('data') data: string = undefined;

  constructor(
    private browserService: BrowserService,
  ) {
    if (this.browserService.getPlatform()) {
      this.isBrowser = true;
      if (this.browserService.getViewPortWidth() < 768) {
        this.count = 105;
      }
      else {
        this.count = 265;
      }
    }
    else {
      this.isBrowser = false;
      this.count = 265;
    }
  }
  ngOnChanges() {
    this.load = false;
    setTimeout(() => { this.load = true });
  }
  ngOnInit() {
    this.load = true;
  }

}
