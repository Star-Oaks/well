import { Component, OnInit, Input } from '@angular/core';
import { BestDeals } from '../../shared/model/home/best-dials.model';

@Component({
  selector: 'app-promotions-list',
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListComponent implements OnInit {

  @Input('productsArray') products: BestDeals[] = [];

  constructor() { }

  ngOnInit() {
  }

}
