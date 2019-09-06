import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { SidebarService } from '../../services/sidebar.service';
import { FormBuilder, Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { FastWatherService } from './fast-water.service';
import { AuthService } from '../../services/auth.service';
import { Gtag } from 'angular-gtag';
import { BrowserService } from '../../services/browser.service';
import { MODALS_COLLECTION } from '../../model/modal-collection';
import { ModalData } from '../../model/modal-data';

@Component({
  selector: 'app-fast-water',
  templateUrl: './fast-water.component.html',
  styleUrls: ['./fast-water.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ]),
  ],
})
export class FastWaterComponent implements OnInit {
  public quickState: boolean = true;
  public checkoutState: boolean = false;
  public modalName: string;
  public modalData: ModalData;
  public visiblityState = 'hidden';
  public form: FormGroup;
  public isAuth: boolean = false;
  private phoneRegex: RegExp = /^[+]?([0-9]){10,13}$/;

  private quickSubscription: Subscription;
  private authorizationSubscription: Subscription;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private sidebarService: SidebarService,
    private fb: FormBuilder,
    private fastherServise: FastWatherService,
    private authService: AuthService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {

    this.quickSubscription = this.sidebarService.getStateModal().subscribe((res) => {
      if (res.state) {
        this.ngxSmartModalService.getModal('modalOrder').open();
        this.modalName = res.key;
        this.modalData = MODALS_COLLECTION.filter(x => x.key === this.modalName).reduce(x => x);
      }
      else {
        this.resetForm();
      }
    });
    this.authorizationSubscription = this.authService.userEvent.subscribe(
      state => {
        if (state) {
          this.isAuth = true;
        }
        else {
          this.isAuth = false
        }
      }
    )

  }
  resetForm() {
    this.form.markAsUntouched();
    this.form.patchValue({
      bottleCount: 2,
      name: "",
      phoneNumber: "",
      city: ""
    });
    this.quickState = true;
    this.checkoutState = false;
    this.visiblityState = "hidden";
  }
  closeQuick() {
    this.sidebarService.closeModal();
  }
  ngOnInit() {
    this.form = this.fb.group({
      bottleCount: 2,
      name: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex)]),
      city: new FormControl('', Validators.required)
    });
  }
  toAuth() {
    this.ngxSmartModalService.getModal('modalOrder').close();
    this.sidebarService.openAuthorization();
  }

  checkout() {
    this.form.markAsTouched();
    let valid = true;

    this.form.controls.name.markAsUntouched();
    this.form.controls.city.markAsUntouched();
    this.form.controls.phoneNumber.markAsUntouched();

    if (this.form.controls.name.invalid) {
      setTimeout(() => {
        this.form.controls.name.markAsTouched();
      }, 200);
      valid = false;
    }
    if (this.form.controls.city.invalid) {
      setTimeout(() => {
        this.form.controls.city.markAsTouched();
      }, 200);
      valid = false;

    }
    if (this.form.controls.phoneNumber.invalid) {
      setTimeout(() => {
        this.form.controls.phoneNumber.markAsTouched();
      }, 200);
      valid = false;
    }
    if (this.form.controls.bottleCount.value <= 0) {
      valid = false;
    }
    if (!valid) {
      this.visiblityState = "show";
      return
    }

    let formData = this.form.value;
    this.quickState = false;
    this.checkoutState = true;

    let waterSub: Subscription = this.fastherServise.postFastWatherData(formData).subscribe(
      () => {
        setTimeout(() => this.ngxSmartModalService.getModal('modalOrder').close(), 4000);
        if (this.browserService.isBrowser && this.modalData.gtag) {

          this.gtag.event('click', {
            method: 'click',
            event_category: this.modalData.gtag.event_category,
            event_label: this.modalData.gtag.event_label
          });
        }
        if (waterSub) {
          waterSub.unsubscribe()
        }
      },
      () => {
        if (waterSub) {
          waterSub.unsubscribe()
        }
      }
    );
  }


  ngOnDestroy() {
    if (this.quickSubscription) {
      this.quickSubscription.unsubscribe();
    }
    if (this.authorizationSubscription) {
      this.authorizationSubscription.unsubscribe();
    }
  }
}
