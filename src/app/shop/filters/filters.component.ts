import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Dropdown, DropdownOpen, DropdownModule } from 'ngx-dropdown';
import { Filterings } from '../../shared/model/shop/filterings';
import { FilteringsValue } from '../../shared/model/shop/filteringsValue';
import { FilteringProduct } from '../../shared/model/shop/filteringProduct';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input('filtersArray') filters: Filterings[] = [];
  @Input('subCategoryName') subCategoryName: string = '';
  @Output() filterEvent: EventEmitter<FilteringProduct[]> = new EventEmitter();
  public choosenFilterArray: FilteringProduct[] = [];
  constructor() { }
  ngOnInit() {
    this.filters.forEach(x => {
      x.filteringsValues.forEach(y => y.choosen = false);
      x.filteringsValues.sort((a, b) => a.numberInSequence - b.numberInSequence)
    });
  }
  ngOnChanges(){
    this.choosenFilterArray = [];
    this.filterEvent.emit(this.choosenFilterArray);
  }

  changeChecked(filterValue: FilteringsValue) {
    this.filters.forEach(x => {
      x.filteringsValues.forEach(y => {
        if (y.id == filterValue.id) {
          y.choosen = y.choosen ? false : true;
        }
      })
    })
  }
  chooseFilterValue(id: string) {
    let selectedFilter = this.filters.filter(x => x.id == id);

    if (selectedFilter.length > 0) {
      let filter = selectedFilter[0];
      filter.filteringsValues.forEach(x => {
        if (x.choosen) {
          if (!this.choosenFilterArray.some(y => y.filteringsValuesId.some(z => z === x.id))) {
            let index = this.choosenFilterArray.findIndex(x => x.filteringsId === filter.id);
            if(index != -1){
              this.choosenFilterArray[index].filteringsValuesId.push(x.id)
            }
            else {
              let filteringsValueArr = [x.id];
              this.choosenFilterArray.push({filteringsId: filter.id, filteringsValuesId: filteringsValueArr });
            }

          }
        }
        else {
          let index = this.choosenFilterArray.findIndex(x => x.filteringsId === filter.id);
          if(index != -1){
            let ind = this.choosenFilterArray[index].filteringsValuesId.findIndex(y => y === x.id);
            if(ind != -1){
              if(this.choosenFilterArray[index].filteringsValuesId.length > 1){
                this.choosenFilterArray[index].filteringsValuesId.splice(ind,1);
              }
              else {
                this.choosenFilterArray.splice(index,1)
              }
            }
          }
        }
      })
    }
    this.filterEvent.emit(this.choosenFilterArray);
  }
}
