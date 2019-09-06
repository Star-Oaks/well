import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';
import { DegustationService } from './degustation.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-degustation-modal',
  templateUrl: './degustation-modal.component.html',
  styleUrls: ['./degustation-modal.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ]),
  ],
})
export class DegustationModalComponent implements OnInit {
  public degustationState: boolean = true;
  public checkoutState: boolean = false;
  public visiblityState = 'hidden';
  public form: FormGroup;
  private phoneRegex: RegExp = /^[+]?([0-9]){10,13}$/;
  public isAuth: boolean = false;

  private degustationSubscription: Subscription;
  private authSubscription: Subscription

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private sidebarService: SidebarService,
    private fb: FormBuilder,
    private degustationService: DegustationService,
    private authService: AuthService
  ) {

    this.degustationSubscription = this.sidebarService.getDegustationModal().subscribe(
      state => {
        if (state) {
          this.ngxSmartModalService.getModal('degustation').open();
        }
        else {
          this.form.patchValue({
            name: "",
            phone: "",
            company: ""
          })
          this.visiblityState = "hidden";
          this.form.markAsUntouched();
          this.degustationState = true;
          this.checkoutState = false;
        }

      })
    this.authSubscription = this.authService.userEvent.subscribe(
      state => {
        if (state) {
          this.isAuth = true;
        }
        else {
          this.isAuth = false;
        }
      }
    )
  }
  closeDegustation() {
    this.sidebarService.closeDegustation();
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.phoneRegex)]),
      company: new FormControl('', Validators.required)
    })
  }

  toAuth() {
    this.form.markAsUntouched();
    this.form.patchValue({
      name: "",
      phone: "",
      company: ""
    })
    this.degustationState = true;
    this.checkoutState = false;
    this.ngxSmartModalService.getModal('degustation').close();
    this.sidebarService.openAuthorization();
    this.visiblityState = "hidden";
  }
  checkout() {
    this.form.markAsTouched();
    let valid = true;

    this.form.controls.name.markAsUntouched();
    this.form.controls.phone.markAsUntouched();
    this.form.controls.company.markAsUntouched();

    if (this.form.controls.name.invalid) {
      setTimeout(() => {
        this.form.controls.name.markAsTouched();
      }, 200);
      valid = false;
    }
    if (this.form.controls.phone.invalid) {
      setTimeout(() => {
        this.form.controls.phone.markAsTouched();
      }, 200);
      valid = false;
    }
    if (this.form.controls.company.invalid) {
      setTimeout(() => {
        this.form.controls.company.markAsTouched();
      }, 200);
      valid = false;
    }
    if (!valid) {
      this.visiblityState = "show";
      return
    }

    let formData = this.form.value;
    this.form.reset();
    this.checkoutState = true;
    this.degustationState = false;
    this.visiblityState = "hidden";
    this.form.patchValue({
      name: "",
      phone: "",
      company: ""
    })

    let deguSub: Subscription = this.degustationService.postDegustationData(formData).subscribe(
      () => {

        setTimeout(() => this.ngxSmartModalService.getModal('degustation').close(), 4000);
        if (deguSub) {
          deguSub.unsubscribe()
        }
      },
      () => {
        if (deguSub) {
          deguSub.unsubscribe()
        }
      }
    )
  }
  ngOnDestroy() {
    if (this.degustationSubscription) {
      this.degustationSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
