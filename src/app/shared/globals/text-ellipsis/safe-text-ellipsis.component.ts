import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-safe-text-ellipsis',
  template: `
      <span [class.ellipsis]="textContent.length > symbolLength" [innerHtml]="textLimited | sanitizeHtml"></span> 
  `,
  styles: [`
    .ellipsis{
      display: inline-block;
      position: relative;
      bottom: -0.3px;
    }

    .ellipsis::after{
      content: '...';
      display: inline-block;
      bottom: 0;
      right: -3px;
      position: absolute;
    }
  `]
})
export class SafeTextEllipsisComponent implements OnInit {

  @Input() textContent: string;
  @Input() symbolLength: number = 95;

  public textLimited: string = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
      this.textLimited = this.textContent.substring(0, this.symbolLength); 
  }

}
