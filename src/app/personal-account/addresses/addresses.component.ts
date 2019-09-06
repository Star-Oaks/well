import { Component, OnInit, Input } from '@angular/core';
import { UserAddresses } from '../../shared/model/user/user-addresses';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { BrowserService } from '../../shared/services/browser.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, } from 'rxjs';
import { TranslatesService } from '../../shared/translates';
import { ConflictErrorStatus } from '../../shared/model/conflict-error-status';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  public regions: any[] = [];
  public cities: any[] = [];
  public streets: any[] = [];
  public addressForm: FormGroup;

  public fAddressCount: number = 0;
  public addingAddress: boolean = false;
  public addingData: boolean = false;
  public isBrowser: boolean;
  public addressExist: boolean = false;
  public permission: boolean = false;

  private translateSubscription: Subscription;

  @Input('addresses') addresses: UserAddresses[] = [];
  @Input('isUUser') isUUser: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private translateCoreService: TranslateService,
    private config: NgSelectConfig,
    private browserService: BrowserService,
    private translateService: TranslatesService,
  ) {
    this.isBrowser = this.browserService.getPlatform();
    this.addressForm = this.fb.group({
      streetId: this.fb.control("", [Validators.required]),
      cityId: this.fb.control("", [Validators.required]),
      regionId: this.fb.control({ value: "", disabled: true }, [Validators.required]),
      house: this.fb.control("", [Validators.required]),
      apartment: this.fb.control("")
    })
    this.config.notFoundText = this.translateCoreService.instant('personal.not-found');
  }
  addAddressForm() {
    this.addingAddress = true;
    this.getFirstAddressData();
    if (this.isBrowser) {
      window.scrollTo(0, 0);
    }
  }
  
  ngOnChanges() {
    this.getFAddressCount();
  }

  getFAddressCount() {
    this.fAddressCount = 0;
    this.addresses.forEach(x => {
      if (x.addressType == 'f') {
        this.fAddressCount++;
      }
    })
  }
  // chooseAddress() {
  //   if (this.addressForm.value.regionId && this.addressForm.value.regionId != "") {
  //     this.userService.getCities(this.addressForm.value.regionId).subscribe(
  //       res => {
  //         this.cities = res as any[];
  //         this.addressForm.patchValue({
  //           streetId: "",
  //           cityId: "",
  //           house: "",
  //           apartment: ""
  //         })
  //       }
  //     )
  //   }
  // }
  chooseCity() {
    if (this.addressForm.value.cityId && this.addressForm.value.cityId != "") {
      let sub: Subscription = this.userService.getStreets(this.addressForm.value.cityId).subscribe(
        res => {
          this.streets = res as any[];
          this.addressForm.patchValue({
            streetId: "",
            house: "",
            apartment: ""
          })
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
  clearAddress() {
    this.addressForm.reset();
  }
  clearCity() {
    this.addressForm.patchValue({
      streetId: "",
      cityId: "",
      house: "",
      apartment: ""
    })
  }
  backToAddresses() {
    this.addingAddress = false;
    this.addressExist = false;
    this.clearAddress();
  }

  deleteAddress(id: string) {
    if (id) {
      let sub: Subscription = this.userService.deleteAddress(id).subscribe(
        () => {
          let index = this.addresses.findIndex(x => x.id == id);
          if (index != -1) {
            this.addresses.splice(index, 1);
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
  
  addAddress() {
    if (this.addingData) {
      return
    }
    this.addressExist = false;
    let correct = true;

    this.addressForm.controls["streetId"].markAsUntouched();
    this.addressForm.controls["house"].markAsUntouched();
    this.addressForm.controls["apartment"].markAsUntouched();

    this.permission = false;
    if (this.addressForm.controls["streetId"].invalid) {
      setTimeout(() => {
        this.addressForm.controls["streetId"].markAsTouched();
      }, 200);

      correct = false;
    }
    if (this.addressForm.controls["house"].invalid) {
      setTimeout(() => {
        this.addressForm.controls["house"].markAsTouched();
      }, 200);
      correct = false;
    }
    if (this.addressForm.controls["apartment"].invalid) {
      setTimeout(() => {
        this.addressForm.controls["apartment"].markAsTouched();
      }, 200);
      correct = false;
    }
    if (!correct) {
      return
    }
    this.addingData = true;
    let formData = {
      streetId: this.addressForm.value.streetId,
      house: this.addressForm.value.house,
      apartment: this.addressForm.value.apartment
    }
    let sub: Subscription = this.userService.addAddress(formData).subscribe(
      res => {
        let address: UserAddresses = res as UserAddresses;
        address.addressType = "f";
        this.addresses.push(res as UserAddresses);
        this.addresses.sort((a, b) => {
          if (a.addressType < b.addressType) { return -1; }
          if (a.addressType > b.addressType) { return 1; }
          return 0;
        })
        this.addingData = false;
        this.clearAddress();
        this.addingAddress = false;
        this.getFAddressCount();
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409) {
            if (err.error == ConflictErrorStatus.TheSame) {
              this.addressExist = true;
              this.addingData = false;
            }
            if (err.error == ConflictErrorStatus.PermissionDenied) {
              this.permission = true;
              this.addingData = false;
            }
          }
        }
      },
      () => {
        if (sub) {
          sub.unsubscribe()
        }
      }
    )
  }
  makeTheMainAddresses(id: string) {
    if (id) {
      let sub: Subscription = this.userService.patchAddress(id).subscribe( 
        () => {
          let index = this.addresses.findIndex(x => x.id == id);
          if (index != -1) {
            
            this.addresses.forEach((item) => item.isDefault = false);
            this.addresses[index].isDefault = true;
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
  getFirstAddressData(){
    let sub: Subscription = this.userService.getRegions().subscribe(
      res => {
        this.regions = res as any[];
        this.addressForm.patchValue({
          regionId: this.regions[0].id
        })
        let citySub: Subscription = this.userService.getCities(this.regions[0].id).subscribe(
          res => {
            this.cities = res as any[];
          },
          () => { },
          () => {
            if (citySub) {
              citySub.unsubscribe();
            }
          }
        )
      },
      () => { },
      () => {
        if (sub) {
          sub.unsubscribe();
        }
      }
    )
  }
  ngOnInit() {
    this.translateSubscription = this.translateService.changeLanguageEvent.subscribe(
      () => {
        this.addingAddress = false;
      }
    );
    
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }
}
