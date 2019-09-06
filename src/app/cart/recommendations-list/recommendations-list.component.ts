import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recommendations-list',
  templateUrl: './recommendations-list.component.html',
  styleUrls: ['./recommendations-list.component.scss']
})
export class RecommendationsListComponent implements OnInit {

  @Input('productsArray') products;

  constructor() { }

  ngOnInit() {
  }

}
