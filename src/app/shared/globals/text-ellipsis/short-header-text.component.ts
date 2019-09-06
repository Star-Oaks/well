import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'short-header-text',
  template: `
    <p class="item-header__text">
      {{textLimited}}
    </p>
  `,
  styles: [`
    .item-header__text{
        color: rgb(72, 80, 85);
        font-family: 'roboto-regular',sans-serif;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 2.5rem;
    }
  `]
})
export class ShortHeaderTextComponent implements OnInit {

  @Input() textContent: any;
  @Input() symbolLength: number = 150;

  public textLimited: string = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
      this.textLimited = this.textContent.substring(0, this.symbolLength);
  }

}
