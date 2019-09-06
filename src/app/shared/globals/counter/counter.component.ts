import { Component, OnInit, forwardRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';


export function createCounterRangeValidator(maxValue, minValue) {
  return (c: FormControl) => {
    let err = {
      rangeError: {
        given: c.value,
        max: maxValue || 10,
        min: minValue || 0
      }
    };

    return (c.value > +maxValue || c.value < +minValue) ? err : null;
  }
}

@Component({
  selector: 'app-counter',
  template: `
  <div class="counter"> <a (click)="decrease()">-</a> <span> {{counterValue}} </span>  <a (click)="increase()">+</a></div>
  `,
  styleUrls: ['./counter.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CounterInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CounterInputComponent), multi: true }
  ]
})
export class CounterInputComponent implements ControlValueAccessor, OnChanges {

  propagateChange: any = () => { };
  validateFn: any = () => { };

  @Input('counterValue') _counterValue = 0;
  @Input() counterRangeMax;
  @Input() counterRangeMin;
  @Input() counterCount = 1;
  @Output() currentValueChange = new EventEmitter();
  @Output() minValueEvent = new EventEmitter();

  get counterValue() {
    return this._counterValue;
  }

  set counterValue(val) {
    this._counterValue = val;
    this.propagateChange(val);
  }
  ngOnChanges(inputs) {
    if (inputs.counterRangeMax || inputs.counterRangeMin) {
      this.validateFn = createCounterRangeValidator(this.counterRangeMax, this.counterRangeMin);
    }
  }

  writeValue(value) {
    if (value) {
      this.counterValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() { }

  increase() {
    if (this._counterValue >= this.counterRangeMax) {
      return;
    }
    this.counterValue += this.counterCount;
    this.currentValueChange.emit(this.counterValue);
  }

  decrease() {
 
    if (this._counterValue <= this.counterRangeMin) {
      this.minValueEvent.emit();
      return
    }
    this.counterValue -= this.counterCount;
    this.currentValueChange.emit(this.counterValue);
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
  
}