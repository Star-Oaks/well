import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-ellipsis',
  template: `
    <p [ngStyle]="{'cursor': link ? 'pointer' : 'default'}">
      {{textLimited}} <span *ngIf="textContent.length > symbolLength" class="ellipsis">...</span>
    </p>
  `,
  styles: [`
    .ellipsis{
      display: inline-block;
      position: relative;
      bottom: -0.3px;
    }
  `]
})
export class TextEllipsisComponent implements OnInit {

  @Input() textContent: any;
  @Input() symbolLength: number = 95;
  @Input() link: boolean = false;
  public textLimited: string = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
      this.textLimited = this.textContent.substring(0, this.symbolLength);
  }

}
