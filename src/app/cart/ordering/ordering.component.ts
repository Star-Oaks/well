import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService } from '../../shared/services/cart.service';
import { Subscription, forkJoin, of, Observable } from 'rxjs';
import { INgxMyDpOptions, IMyDate, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { BrowserService } from '../../shared/services/browser.service';
import { CartProduct } from '../../shared/model/cart/cartProduct';
import { User } from '../../shared/model/user/user';
import { UserAddresses } from '../../shared/model/user/user-addresses';
import { UserService } from '../../shared/services/user.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConflictErrorStatus } from '../../shared/model/conflict-error-status';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelType } from '../../shared/model/shop/labelType';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Schedule } from '../../shared/model/cart/schedule';
import { DayOff } from '../../shared/model/cart/kalendar';
import { DeliveryTimes } from '../../shared/model/cart/delivery-times';
import { Days } from '../../shared/model/cart/days.enum';
import { OrderProduct } from '../../shared/model/cart/orderProduct';
import { Order } from '../../shared/model/cart/order';
import { OrderType } from '../../shared/model/cart/order-type';
import { TranslatesService } from '../../shared/translates';
import { MetaService } from '@ngx-meta/core';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { UserProductPrices } from '../../shared/model/cart/user-prices';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { DEFAULTDELIVERYTIMES } from './default-delivery-times';


@Component({
  selector: 'app-ordering',
  templateUrl: './ordering.component.html',
  styleUrls: ['./ordering.component.scss']
})
export class OrderingComponent implements OnInit {
  public regions: any[] = [];
  public cities: any[] = [];
  public streets: any[] = [];

  public cartItems: CartProduct[] = [];
  public copyCartItems: CartProduct[] = [];
  public userInfo: User;
  public userAddresses: UserAddresses[] = [];

  public schedule: Schedule[] = undefined;
  public dayOff: DayOff[] = [];
  public deliveryTimes: DeliveryTimes[] = [];

  public finalizeOrderForm: FormGroup;
  public addressForm: FormGroup;

  public totalCartPrice: number;
  public choosenAddressId: string;
  private wWidth: number;
  public startPrice: number = 0;
  public fAddressCount: number = 0;

  public addingAddress: boolean = false;
  public addingData: boolean = false;
  public addressExist: boolean = false;
  public isBrowser: boolean;
  public validDate: boolean = true;
  public isUAddress: boolean = false;
  public canPayCourier: boolean = true;
  public canPayCashless: boolean = true;
  public canPayEMoney: boolean = true;
  public errorOrder: boolean = false;
  public errorAddress: boolean = false;
  public openedCalendar: boolean = false;
  public submiting: boolean = false;
  public eMoneyWaiting: boolean = false;
  public disableUntilDays: IMyDate;
  public datePickerOptions: INgxMyDpOptions;
  public disabledDays: IMyDate[] = [];

  private localStorageSubscription: Subscription;
  private translateSubscription: Subscription;
  private paymentTypeSubscription: Subscription;
  private successEMoneySubscription: Subscription;

  @ViewChild('tooltip', { static: false }) tooltip: TooltipDirective;
  @ViewChild('dp', { static: false }) ngxdp: NgxMyDatePickerDirective;
  @ViewChild('formLiq', { static: false }) formLiq: ElementRef;
  @ViewChild('data', { static: false }) data: ElementRef;
  @ViewChild('signature', { static: false }) signature: ElementRef;
  @ViewChild('agreementBlock', { static: false }) agreementBlock: ElementRef;
  @ViewChild('personalDataBlock', { static: false }) personalDataBlock: ElementRef;
  @ViewChild('orderingDateBlock', { static: false }) orderingDateBlock: ElementRef;
  @ViewChild('orderingTimeBlock', { static: false }) orderingTimeBlock: ElementRef;
  @ViewChild('orderingPaymentBlock', { static: false }) orderingPaymentBlock: ElementRef;
  @ViewChild('orderingSubmitBlock', { static: false }) orderingSubmitBlock: ElementRef;
  @ViewChild('errorOrderBlock', { static: false }) errorOrderBlock: ElementRef;
  @ViewChild('errorAddressBlock', { static: false }) errorAddressBlock: ElementRef;
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private browserService: BrowserService,
    private userService: UserService,
    private config: NgSelectConfig,
    private translateCoreService: TranslateService,
    private translateService: TranslatesService,
    private activatedRoute: ActivatedRoute,
    public ngxSmartModalService: NgxSmartModalService,
    private router: Router,
    private readonly meta: MetaService,
    private gtag: Gtag,
    private localStorageService: LocalStorageService
  ) {
    // REWRITE METHOD FOR CORRECT FORMAT
    Date.prototype.toISOString = function () {
      let tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
        };
      return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
    }

    // ADDRESS FORM
    this.addressForm = this.fb.group({
      streetId: this.fb.control(null, [Validators.required]),
      cityId: this.fb.control(null, [Validators.required]),
      regionId: this.fb.control({ value: "", disabled: true }, [Validators.required]),
      house: this.fb.control("", [Validators.required]),
      apartment: this.fb.control("")
    })

    //CART FORM
    this.finalizeOrderForm = this.fb.group({
      totalPrice: this.fb.control(0, Validators.required),
      timeFrom: this.fb.control(null, Validators.required),
      timeTo: this.fb.control(null, Validators.required),
      orderDate: this.fb.control(null, Validators.required),
      orderType: this.fb.control(null, Validators.required),
      addressId: this.fb.control(null, Validators.required),
      comment: this.fb.control(""),
      agreement: this.fb.control(false, Validators.required),
      deliveryTime: this.fb.control('all')
    })

    // RESOLVE DATA
    let req = this.activatedRoute.snapshot.data["data"];
    // USER INFO
    let user: User = req as User;
    this.userInfo = {
      email: user.email,
      fName: user.fName,
      lName: user.lName,
      isUUser: user.isUUser,
      phone: user.phone
    }

    this.userAddresses = user.userAdresses || [];
    this.userAddresses.sort((a, b) => {
      if (a.addressType < b.addressType) { return -1; }
      if (a.addressType > b.addressType) { return 1; }
      return 0;
    })

    

    //PRODUCTS
    let productSub: Subscription = this.cartService.getProductsByUrlName().subscribe(
      res => {
        this.cartItems = res as CartProduct[];
        if (!this.cartItems.length) {
          this.router.navigate(['/', this.translateService.getCurrentLang()])
        }
        let cartProducts = this.cartService.products;
        this.cartItems.forEach(x => {
          cartProducts.forEach(y => {
            if (x.urlName === y.urlName) {
              x.count = y.count;
            }
          })
          this.startPrice += x.count * x.price;
        });
        
        this.copyCartItems = this.cartItems.map(a => Object.assign({}, a));
        this.totalCartPrice = this.getTotalOrderPrice();
        this.getFAddressCount();
      },
      () => { },
      () => {
        if (productSub) {
          productSub.unsubscribe();
        }
      }
    )

    // ISBROWSER
    this.isBrowser = this.browserService.isBrowser;
    if (this.isBrowser) {
      this.wWidth = this.browserService.getViewPortWidth();
    }

    // TRANSLATE
    let title = this.translateCoreService.instant('personal.ordering');
    this.meta.setTitle(title);
    if (this.browserService.isBrowser) {
      this.gtag.pageview({
        page_title: title,
        page_path: this.router.url,
        page_location: environment.api + this.router.url
      });
    }
    this.config.notFoundText = this.translateCoreService.instant('personal.not-found');


    // DATEPICEKR CONFIG
    let currentDay = new Date();
    let hour = currentDay.getHours();
    this.disableUntilDays = {
      year: currentDay.getFullYear(),
      month: currentDay.getMonth() + 1,
      day: hour >= 18 ? currentDay.getDate() + 1 : currentDay.getDate()
    }


    this.datePickerOptions = {
      dateFormat: 'dd.mm.yyyy',
      dayLabels: this.getDaysTranslate(),
      monthSelector: true,
      yearSelector: true,
      sunHighlight: false,
      disableWeekends: false,
      disableDates: this.disabledDays,
      showTodayBtn: false,
      firstDayOfWeek: 'mo',
      showSelectorArrow: true,
      monthLabels: this.getMonthsTranslate(),
      selectorWidth: '252px',
      selectorHeight: '232px',
      disableHeaderButtons: false,
      disableUntil: this.disableUntilDays,
      openSelectorTopOfInput: true,
      focusInputOnDateSelect: false
    };

  }
  ngOnChanges() {
    this.getFAddressCount();
  }
  getFAddressCount() {
    this.fAddressCount = 0;
    this.userAddresses.forEach(x => {
      if (x.addressType == 'f') {
        this.fAddressCount++;
      }
    })
    // choose address if user addresses == 1
    if (this.userAddresses.length === 1) {
      this.chooseLocation(this.userAddresses[0]);
    }
    if(this.fAddressCount > 1) {
      let defaultAddr = this.userAddresses.filter(x => x.isDefault == true);
      if (defaultAddr.length) {
        this.chooseLocation(defaultAddr[0]);
      }
    }
  }

  // DAYS LABELS
  getDaysTranslate() {
    let days = {};
    for (let item in Days) {
      if (isNaN(Number(item))) {
        days[item] = this.translateCoreService.instant('dayLabels.' + item)
      }
    }
    return days
  }

  getMonthsTranslate() {
    let months = {};
    for (let i = 1; i <= 12; i++) {
      months[i] = this.translateCoreService.instant(`monthLabels.${i}`);
    }
    return months
  }
  // ADDRESS METHOD
  addAddressForm() {
    this.clearFinalizeForm();
    setTimeout(() => this.scrollTo(this.personalDataBlock), 100);
    let sub: Subscription = this.userService.getRegions().subscribe(
      res => {
        this.regions = res as any[];
        this.addressForm.patchValue({
          regionId: this.regions[0].id
        });

        let sub: Subscription = this.userService.getCities(this.regions[0].id).subscribe(
          res => {
            this.cities = res as any[];
          },
          () => { },
          () => {
            if (sub) {
              sub.unsubscribe();
            }
          }
        )
        this.addingAddress = true;
        this.cartItems = this.copyCartItems.map(a => Object.assign({}, a));
        this.getTotalOrderPrice();
      },
      () => { },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )

  }
  backToAddresses() {
    this.addingAddress = false;
    this.streets = [];
    this.clearAddress();
    this.getFAddressCount();
    this.addressExist = false;
  }
  clearAddress() {
    this.addressForm.reset();
  }
  makeTheMainAddresses(id: string) {
    if (id) {
      let sub: Subscription = this.userService.patchAddress(id).subscribe(
        () => {
          let index = this.userAddresses.findIndex(x => x.id == id);
          if (index != -1) {
            this.userAddresses.forEach((item) => item.isDefault = false);
            this.userAddresses[index].isDefault = true;
            this.getFAddressCount();
          }
        },
        () => { },
        () => {
          if (sub) {
            sub.unsubscribe()
          }
        }
      )
    }
  }
  clearCity() {
    this.addressForm.patchValue({
      streetId: null,
      cityId: null,
      house: "",
      apartment: ""
    })
    this.addressExist = false;
  }
  // chooseAddress() {
  //   if (this.addressForm.value.regionId && this.addressForm.value.regionId != "") {
  //     this.userService.getCities(this.addressForm.value.regionId).subscribe(
  //       res => {
  //         this.cities = res as any[];
  //         this.addressForm.patchValue({
  //           streetId: null,
  //           cityId: null,
  //           house: "",
  //           apartment: ""
  //         })
  //       }
  //     )
  //   }
  // }
  clearFinalizeForm() {
    this.finalizeOrderForm.patchValue({
      addressId: null,
      timeFrom: null,
      timeTo: null,
      deliveryTime: null,
      orderDate: null,
      orderType: null,
      agreement: false,
      comment: null
    })
    this.choosenAddressId = undefined;
    this.schedule = undefined;
    this.deliveryTimes = [];
  }
  chooseCity() {
    if (this.addressForm.value.cityId && this.addressForm.value.cityId != "") {
      let sub: Subscription = this.userService.getStreets(this.addressForm.value.cityId).subscribe(
        res => {
          this.streets = res as any[];
          this.addressForm.patchValue({
            streetId: null,
            house: "",
            apartment: ""
          })
        },
        () => { },
        () => {
          if (sub) {
            sub.unsubscribe();
          }
        }
      )
    }
  }
  addAddress() {
    if (this.addingData) {
      return
    }
    this.addressExist = false;
    let correct = true;
    if (this.addressForm.controls["regionId"].invalid) {
      this.addressForm.controls["regionId"].markAsTouched();
      correct = false;
    }
    if (this.addressForm.controls["cityId"].invalid) {
      this.addressForm.controls["cityId"].markAsTouched();
      correct = false;
    }
    if (this.addressForm.controls["streetId"].invalid) {
      this.addressForm.controls["streetId"].markAsTouched();
      correct = false;
    }
    if (this.addressForm.controls["house"].invalid) {
      this.addressForm.controls["house"].markAsTouched();
      correct = false;
    }
    if (!correct) {
      return
    }
    let formData = {
      streetId: this.addressForm.value.streetId,
      house: this.addressForm.value.house,
      apartment: this.addressForm.value.apartment
    }
    this.addingData = true;

    let sub: Subscription = this.userService.addAddress(formData).subscribe(
      res => {
        let address: UserAddresses = res as UserAddresses;
        address.addressType = "f";
        this.userAddresses.push(res as UserAddresses);
        this.userAddresses.sort((a, b) => {
          if (a.addressType < b.addressType) { return -1; }
          if (a.addressType > b.addressType) { return 1; }
          return 0;
        })
        this.fAddressCount = 0;
        this.userAddresses.forEach(x => {
          if (x.addressType == 'f') {
            this.fAddressCount++;
          }
        })
        this.addingData = false;
        this.addressExist = false;
        this.clearAddress();
        this.addingAddress = false;
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409) {
            if (err.error == ConflictErrorStatus.TheSame) {
              this.addressExist = true;
              this.addingData = false;
            }
            if (err.error == ConflictErrorStatus.PermissionDenied) {
              this.addingData = false;
            }
          }
        }
      },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )
  }


  // CHOOSE ADDRESS, CHECK ORDER //
  chooseLocation(item: UserAddresses, e?: Event) {
    if (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
    if (this.choosenAddressId == item.id) {
      return
    }
    this.choosenAddressId = item.id;
    this.errorOrder = false;
    this.errorAddress = false;
    if (item.addressType == "u") {
      this.isUAddress = true;
      let products: OrderProduct[] = this.cartItems.map(x => {
        let obj: OrderProduct = {
          productCount: x.count,
          productId: x.id
        }
        return obj
      })
      let formData: Order = {
        addressId: item.id,
        productOrderedDTOs: products,
        totalPrice: this.totalCartPrice
      }
      // CHECK ORDER 
      this.checkOrder(formData);
    }
    else {
      this.isUAddress = false;
      this.checkAddress(item);
    }
  }
  // CHECK ADDRESS 
  checkAddress(item: UserAddresses) {

    let sub: Subscription = this.cartService.checkAddress(item.id).subscribe(
      res => {
        if (res && !item.confirmed) {
          this.errorAddress = true;
          this.setAddress(item.id, false)
        }
        else {
          this.setAddress(item.id, true)
        }
      },
      () => { },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )
  }
  // CHECK ORDER
  checkOrder(formData) {
    this.canPayCashless = true;
    this.canPayCourier = true;
    let sub: Subscription = this.cartService.checkOrder(formData).subscribe(
      res => {
       
        // if (res == 1) {
        //   this.canPayCashless = false;
        //   this.canPayEMoney = true;
        // }
        // if (res == 2) {
        //   this.canPayCourier = false;
        // }
        if (res == 3) {
          this.canPayCourier = true;
          this.canPayEMoney = true;
          this.canPayCashless = false;
        }
        if (res == 4) {
          this.canPayCashless = true;
          this.canPayCourier = false;
          this.canPayEMoney = false;
        }
        this.setAddress(formData.addressId, true);
        if (sub) {
          sub.unsubscribe();
        }
      },
      (err) => {
        if (err instanceof HttpErrorResponse && err.status == 409) {
          this.errorOrder = true;
          setTimeout(() => this.scrollTo(this.errorOrderBlock), 100);
          this.canPayCashless = false;
          this.canPayCourier = false;
          this.canPayEMoney = false;
          this.schedule = undefined;
          this.deliveryTimes = undefined;
          this.finalizeOrderForm.patchValue({
            addressId: this.choosenAddressId,
            timeFrom: null,
            timeTo: null,
            deliveryTime: null,
            orderDate: null,
            orderType: null,
            agreement: false,
            comment: null
          })
        };
        if (sub) {
          sub.unsubscribe();
        }
      }
    )
  }
  //SET ADDRESS 
  setAddress(id: string, confirmed: boolean) {
    this.choosenAddressId = id;
    this.schedule = undefined;
    this.deliveryTimes = undefined;
    this.finalizeOrderForm.patchValue({
      addressId: this.choosenAddressId,
      timeFrom: null,
      timeTo: null,
      deliveryTime: null,
      orderDate: null,
      orderType: null,
      agreement: false,
      comment: null
    })
    if (confirmed) {
      this.getUserPrice(id);
      this.getSchedule(id);
    }
    else {
      setTimeout(() => this.scrollTo(this.errorAddressBlock), 100);
    }
  }

  // GET USER PRICE
  getUserPrice(id: string) {
    let sub: Subscription = this.userService.getUserPrices(id, this.cartItems).subscribe(
      res => {
        let userPrice = res as UserProductPrices;
        this.cartItems = this.copyCartItems.map(a => Object.assign({}, a));
        if (userPrice && userPrice.productsIdsPrice && userPrice.productsIdsPrice.length) {
          this.cartItems.forEach(item => {
            userPrice.productsIdsPrice.forEach(pr => {
              if (item.id == pr.id) {
                item.productPrice = pr.price * item.count;
              }
            })
          })
          let total = userPrice.totalPrice;
          if (total != this.totalCartPrice) {
            if (this.isBrowser && this.wWidth < 768) {
              this.ngxSmartModalService.getModal('userPrice').open();
            }
          }
          this.totalCartPrice = total;
        }
      },
      () => { },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )
  }
  // SET USER PRICE
  // setUserPrices(prices: UserPrices[], floating: boolean) {
  //   this.cartItems.forEach(x => {
  //     prices.forEach(y => {
  //       if (x.id === y.productId) {
  //         if (floating && x.count < 3) {

  //           return
  //         }

  //         x.userPrice = y.value;
  //       }
  //     })

  //     // return x;
  //   })
  //   // console.log(this.cartItems)
  // }

  // GET SCHEDULE 
  getSchedule(id: string) {
    this.deliveryTimes = [];
    this.schedule = undefined;
    this.datePickerOptions.disableDates = [];

    let scheduleReq = this.cartService.getSchedule(id);
    let daysOff = this.cartService.getDaysOff();
    let sub: Subscription = forkJoin([scheduleReq, daysOff])
      .subscribe(
        res => {
          this.schedule = res[0] as Schedule[];
          this.dayOff = res[1] as DayOff[];
          let disableDays: IMyDate[] = this.dayOff.map(x => {
            let date: IMyDate = {
              day: +x.day,
              month: +x.month,
              year: +x.year
            }
            return date
          });
          let currentDay = new Date();
          let curIMyDate: IMyDate = {
            year: currentDay.getFullYear(),
            month: currentDay.getMonth() + 1,
            day: currentDay.getDate()
          }
          if (!this.schedule) {
            this.datePickerOptions.disableWeekdays = [Days[7]];
            this.checkForDates(disableDays, curIMyDate, currentDay)
            this.schedule = [];
          }
          else {
            let notWorkDays = [Days.mo, Days.tu, Days.we, Days.th, Days.fr, Days.sa, Days.su]
              .filter(x => this.schedule.every(y => y.dayNumber !== x))
              .map(x => Days[x]);
            this.datePickerOptions.disableWeekdays = notWorkDays;

            this.checkForDates(disableDays, curIMyDate, currentDay)
          }
          setTimeout(() => this.scrollTo(this.orderingDateBlock), 100);
        },
        (err) => {
          if (sub) {
            sub.unsubscribe();
          }
        },
        () => {
          if (sub) {
            sub.unsubscribe();
          }
        }
      )
  }
  private checkForDates(disableDays, curIMyDate, currentDay) {
    // next day after 18:00
    let isNextDayOff = disableDays.some(x => x.day === curIMyDate.day + 1 && x.month === curIMyDate.month && x.year === curIMyDate.year) || currentDay.getUTCDay() === 6;

    // console.log("is next day" + isNextDayOff);
    if (isNextDayOff && currentDay.getHours() >= 18) {
      let temp = Object.assign({}, curIMyDate);
      temp.day += 2;
      // console.log(temp.day);
      let daysInMonth = this.daysInMonth(temp.month, temp.year);
      if (temp.day > daysInMonth) {
        temp.month += 1;
        temp.day = temp.day - daysInMonth;

      }
      disableDays.push(temp);
    }

    // current day off -> next off
    let isCurrDayOff = disableDays.some(x => x.day === curIMyDate.day && x.month === curIMyDate.month && x.year === curIMyDate.year);
    let isSunDay = currentDay.getDay() === 0;
    // console.log(isCurrDayOff)
    // console.log("is sun" + isSunDay);
    if (isCurrDayOff || isSunDay) {
      let temp = Object.assign({}, curIMyDate);
      temp.day += 1;
      let daysInMonth = this.daysInMonth(temp.month, temp.year);
      if (temp.day > daysInMonth) {
        temp.month += 1;
        temp.day = temp.day - daysInMonth;

      }
      disableDays.push(temp);
    }

    this.datePickerOptions.disableDates = disableDays;
  }
  daysInMonth(month, year) {
    let monthNum = new Date(Date.parse(month + " 1," + year)).getMonth() + 1
    return new Date(year, monthNum, 0).getDate();
  }
  toggleCalendarEvent(e) {
    this.openedCalendar = e == 1 ? true : false;
  }
  openCalendar() {
    // if(!this.openedCalendar){
    //   console.log("open")
    //   this.ngxdp.openCalendar();
    // }
  }
  // CHOOSE DATE
  chooseDeliveryDate(e) {
    this.deliveryTimes = undefined;
    this.finalizeOrderForm.patchValue({
      orderDate: null,
      timeFrom: null,
      timeTo: null,
      deliveryTime: 'all',
      orderType: null,
      agreement: false,
      comment: null
    });
    if (!e.valid) {
      this.validDate = false;
      return
    }

    let dateArr = e.value.split('.');
    let date = new Date(dateArr[2], parseInt(dateArr[1]) - 1, dateArr[0]);
    this.validDate = true;
    let day = date.getDay();
    if (!this.schedule.length) {
      this.deliveryTimes = DEFAULTDELIVERYTIMES[day].sort((a, b) => +a.timeFrom - +b.timeFrom);
    }
    else {

      let times = this.schedule.filter(x => x.dayNumber == day);
      if (times.length) {
        this.deliveryTimes = times.sort((a, b) => parseInt(a.timeFrom) - parseInt(b.timeFrom));

      }
    }
    let utcDate = date.toISOString();
    let substr = utcDate.substr(0, utcDate.length - 6);
    this.finalizeOrderForm.patchValue({
      orderDate: substr,
    });
    this.chooseTime('all');
    setTimeout(() => this.scrollTo(this.orderingTimeBlock), 100);
  }
  // CHOOSE TIME
  chooseTime(timeFrom?: string, timeTo?: string) {
    if (!timeFrom) {
      this.finalizeOrderForm.patchValue({
        timeFrom: null,
        timeTo: null
      })
      return
    }
    if (timeFrom == 'all') {
      let timeFrom: string = "23:59";
      let timeTo: string = "00:00";
      this.deliveryTimes.forEach(x => {
        if (parseInt(x.timeFrom) < parseInt(timeFrom)) {
          timeFrom = x.timeFrom
        }
        if (parseInt(x.timeTo) > parseInt(timeTo)) {
          timeTo = x.timeTo
        }
      })
      this.finalizeOrderForm.patchValue({
        timeFrom: timeFrom,
        timeTo: timeTo,
        orderType: null,
        agreement: false
      })
      return
    }
    let ind = this.deliveryTimes.findIndex(x => x.timeFrom === timeFrom && x.timeTo === timeTo);
    if (ind != -1) {
      this.finalizeOrderForm.patchValue({
        timeFrom: this.deliveryTimes[ind].timeFrom,
        timeTo: this.deliveryTimes[ind].timeTo,
        orderType: null,
        agreement: false
      })
    };
    setTimeout(() => this.scrollTo(this.orderingPaymentBlock), 100);
  }

  // ADD ORDER
  onSubmit() {
    if (this.finalizeOrderForm.invalid || this.submiting) {
      return;
    }
    if (this.errorAddress && this.errorOrder) {
      return
    }
    let valid = true;
    this.finalizeOrderForm.controls.agreement.markAsUntouched();
    if (!this.finalizeOrderForm.controls.agreement.value) {
      setTimeout(() => {
        this.finalizeOrderForm.controls.agreement.markAsTouched();
      }, 200);
      valid = false;
      this.scrollTo(this.agreementBlock);
    }
    if (!valid) {
      return
    }
    let formData = this.finalizeOrderForm.value;
    let products: OrderProduct[] = this.cartItems.map(x => {
      let obj: OrderProduct = {
        productCount: x.count,
        productId: x.id
      }
      return obj
    })
    let data: Order = {
      addressId: formData.addressId,
      orderDate: formData.orderDate,
      comment: formData.comment,
      orderType: formData.orderType,
      timeFrom: formData.timeFrom,
      timeTo: formData.timeTo,
      totalPrice: this.totalCartPrice,
      productOrderedDTOs: products
    }
    this.submiting = true;
    let sub: Subscription = this.cartService.createOrder(data).subscribe(
      res => {
        this.submiting = false;
        if (data.orderType == OrderType.Сourier) {
          this.finalizeOrderForm.reset();
          this.cartService.clearProducts();
          this.router.navigate(['/', this.translateService.getCurrentLang(), 'cart', 'after_payment'], { queryParams: { type: data.orderType } })
        }
        if (data.orderType == OrderType.EMoney) {
          this.data.nativeElement.value = res["data"];
          this.signature.nativeElement.value = res["signature"];
          this.formLiq.nativeElement.submit();
          this.eMoneyWaiting = true;
        }
        if (data.orderType == OrderType.CourierContract) {
          this.finalizeOrderForm.reset();
          this.cartService.clearProducts();
          this.router.navigate(['/', this.translateService.getCurrentLang(), 'cart', 'after_payment'], { queryParams: { type: data.orderType } })
        }
        if (data.orderType == OrderType.Cashless) {
          this.finalizeOrderForm.reset();
          this.cartService.clearProducts();
          this.router.navigate(['/', this.translateService.getCurrentLang(), 'cart', 'after_payment'], { queryParams: { type: data.orderType } })
        }
        this.clearFinalizeForm();
      },
      err => {
        this.submiting = false;
        if (sub) {
          sub.unsubscribe();
        }
      },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )

  }

  // GET TOTAL PRICE
  getTotalOrderPrice() {
    this.totalCartPrice = 0;
    let total: number = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].userPrice || this.cartItems[i].userPrice === 0) {
        this.cartItems[i].productPrice = this.roundToTwo(this.cartItems[i].userPrice * this.cartItems[i].count);
        total += this.cartItems[i].productPrice;
      }
      else if (this.cartItems[i].productLabel && this.cartItems[i].productLabel.labelType == LabelType.discount) {
        let discount = this.cartItems[i].price * this.cartItems[i].productLabel.discount / 100;
        this.cartItems[i].productPrice = this.roundToTwo((this.cartItems[i].price - discount) * this.cartItems[i].count);
        total += this.cartItems[i].productPrice;
      }
      else {
        this.cartItems[i].productPrice = this.roundToTwo(this.cartItems[i].price * this.cartItems[i].count);
        total += this.cartItems[i].productPrice;
      }
    }
    this.totalCartPrice = this.roundToTwo(total)
    return this.totalCartPrice;
  }
  // ROUND NUMBER
  roundToTwo(num) {
    return (Math.round(+(num.toExponential() * 100))) / 100;
  }

  // INIT
  ngOnInit() {
    // this.successEMoneySubscription = this.cartService.eMoneyEvent.subscribe(
    //   (ind) => {
    //     if (this.eMoneyWaiting && ind) {
    //       this.eMoneyWaiting = false;
    //       // ind === 1 ? this.router.navigate([this.translateService.getCurrentLang(), "payment", "success"]) : this.router.navigate([this.translateService.getCurrentLang(), "payment", "error"]);
    //       window.close();
    //     }
    //   }
    // )

    this.translateSubscription = this.translateService.changeLanguageEvent.subscribe(
      () => {
        let products = this.cartService.getProductsByUrlName();
        let user = this.userService.getUserInfo();
        let sub: Subscription = forkJoin([products, user]).subscribe(
          res => {
            let title = this.translateCoreService.instant('personal.ordering');
            this.meta.setTitle(title);
            if (this.browserService.isBrowser) {
              this.gtag.pageview({
                page_title: title,
                page_path: this.router.url,
                page_location: environment.api + this.router.url
              });
            }
            this.config.notFoundText = this.translateCoreService.instant('personal.not-found');
            this.cartItems = res[0] as CartProduct[];
            let cartProducts = this.cartService.products;
            this.cartItems.forEach(x => {
              cartProducts.forEach(y => {
                if (x.urlName === y.urlName) {
                  x.count = y.count;
                }
              })
            });
            this.copyCartItems = this.cartItems.map(a => Object.assign({}, a));
            this.totalCartPrice = this.getTotalOrderPrice();
            
            let user: User = res[1] as User;
            this.userInfo = {
              email: user.email,
              fName: user.fName,
              lName: user.lName,
              isUUser: user.isUUser,
              phone: user.phone
            }
            this.userAddresses = user.userAdresses || [];
            this.userAddresses.sort((a, b) => {
              if (a.addressType < b.addressType) { return -1; }
              if (a.addressType > b.addressType) { return 1; }
              return 0;
            })
            this.addressForm.reset();
            this.choosenAddressId = undefined;
            this.clearFinalizeForm();
            this.getFAddressCount();
            this.datePickerOptions.dayLabels = this.getDaysTranslate();
            this.datePickerOptions.monthLabels = this.getMonthsTranslate();
          },
          () => { },
          () => {
            if (sub) {
              sub.unsubscribe();
            }
          }
        )
      }
    )

    this.paymentTypeSubscription = this.finalizeOrderForm.get('orderType').valueChanges.subscribe(
      () => setTimeout(() => this.scrollTo(this.orderingSubmitBlock), 100)
    )
  }

  private scrollTo(el) {
    if (el && el.nativeElement) {
      let elPosY = this.browserService.getCoordsY(el.nativeElement);

      let wh = this.browserService.getViewPortHeight();
      if (wh) {
        let yAxis = elPosY - wh / 2;
        this.browserService.scrollToY(yAxis, 1500, 'easeOutSine');
      }
    }
  }
  closeTooltip() {
    if (this.tooltip) {
      this.tooltip.hide();
    }
  }

  ngOnDestroy() {
    if (this.localStorageSubscription) {
      this.localStorageSubscription.unsubscribe();
      this.localStorageSubscription = null;
    }
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
      this.translateSubscription = null;
    }
    if (this.paymentTypeSubscription) {
      this.paymentTypeSubscription.unsubscribe();
      this.paymentTypeSubscription = null;
    }
    if (this.successEMoneySubscription) {
      this.eMoneyWaiting = false;
      this.successEMoneySubscription.unsubscribe();
      this.successEMoneySubscription = null;
    }
    this.closeTooltip();
  }
}
