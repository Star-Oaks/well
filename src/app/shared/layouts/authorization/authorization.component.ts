import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription, timer } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthForm } from '../../model/authForm';
import { LocalStorageService } from '../../services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatesService } from '../../translates';
import * as sha1 from 'js-sha1';
import { environment } from '../../../../environments/environment';
import { ForgetForm } from '../../model/forgetForm';
import { HttpErrorResponse } from '@angular/common/http';
import { ConflictErrorStatus } from '../../model/conflict-error-status';
@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  // state's auth
  public authState: boolean = true;
  public forgotState: boolean = false;
  public registerState: boolean = false;

  public authForm: FormGroup;
  public forgetForm: FormGroup;
  public count: number = 180;
  private countResend: number = 3;
  // dynamic states
  public logining: boolean = false;
  public sendPhoneNubmer: boolean = false;
  public changingPassword: boolean = false;
  // forget errors
  public phoneErr: boolean = false;
  public phoneInvalid: boolean = false;
  public codeErr: boolean = false;
  public passwordErr: boolean = false;
  public repeatPasswordErr: boolean = false;
  // async erros
  public userExist: boolean = false;
  public unavailable: boolean = false;
  public uncorrectData: boolean = false;
  public uncorrectPhoneSms: boolean = false;
  public unknowError: boolean = false;
  public permissionDenied: boolean = false;
  public forgotPermissionDenied: boolean = false;
  // forgot state's 
  public forgotPhoneState: boolean = true;
  public sendPasswordState: boolean = true;
  public successChange: boolean = false;
  //regex
  private passRegex: RegExp = /^(?=.*[a-z])[a-zA-Z\d@$!%*#?&"', \.\^\(\)\`\:\;\-\=\+]{8,}$/;
  private telRegex: RegExp = /^[0-9]{9}$/;
  private codeRegex: RegExp = /^[0-9]{8}$/;
  private smsRegex: RegExp = /^[0-9]{4}$/;

  private authSubscription: Subscription;
  private valueChangesSubscription: Subscription;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private sidebarService: SidebarService,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslatesService,
    private cd: ChangeDetectorRef
  ) {

    this.authForm = this.fb.group({
      code: this.fb.control("", [Validators.required, Validators.pattern(this.codeRegex)]),
      isYUser: this.fb.control(false),
      phone: this.fb.control("", [Validators.required, Validators.pattern(this.telRegex)]),
      password: this.fb.control("", [Validators.required, Validators.pattern(this.passRegex)]),
    })
    this.forgetForm = this.fb.group({
      phone: this.fb.control("", [Validators.required, Validators.pattern(this.telRegex)]),
      code: this.fb.control("", [Validators.required, Validators.pattern(this.smsRegex)]),
      password: this.fb.control("", [Validators.required, Validators.pattern(this.passRegex)]),
      repeatPassword: this.fb.control("", [Validators.required, Validators.pattern(this.passRegex)])
    })
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  // changeCheckbox() {
  //   this.authForm.patchValue({
  //     code: "",
  //     phone: "",
  //     password: ""
  //   })
  //   this.uncorrectData = false;
  // }
  auth(e?) {
    if (e) {
      e.target.blur();
      this.cd.detectChanges();
    }
    this.uncorrectData = false;
    this.unknowError = false;
    this.permissionDenied = false;
    this.authForm.controls["code"].markAsPristine();
    this.authForm.controls["password"].markAsPristine();
    this.authForm.controls["phone"].markAsPristine();

    if (this.authForm.value.isYUser) {
      if (this.authForm.controls["code"].invalid || this.authForm.controls["password"].invalid) {
        setTimeout(() => {
          this.authForm.controls["code"].markAsDirty();
          this.authForm.controls["password"].markAsDirty();
        }, 200)
        this.authForm.controls["code"].markAsTouched();
        this.authForm.controls["password"].markAsTouched();
        this.uncorrectData = true;

        return
      }
    }
    else {
      if (this.authForm.controls["phone"].invalid || this.authForm.controls["password"].invalid) {
        setTimeout(() => {
          this.authForm.controls["phone"].markAsDirty();
          this.authForm.controls["password"].markAsDirty();
        }, 200)
        this.authForm.controls["phone"].markAsTouched();
        this.authForm.controls["password"].markAsTouched();
        this.uncorrectData = true;
        return
      }
    }
    this.logining = true;
    let formData: AuthForm;
    if (this.authForm.value.isYUser) {
      formData = {
        phone: this.authForm.value.code,
        password: this.authForm.value.password,
        grant_type: 1,
        client: 2
      }
    }
    else {
      formData = {
        phone: this.authForm.value.phone,
        password: this.authForm.value.password,
        grant_type: 1,
        client: 2
      }
    }
    let authSub: Subscription = this.authService.auth(formData)
    .subscribe(
      response => {
        if (response["access_token"]) {
          this.localStorageService.setData("access_token", response["access_token"]);
        }
        if (response["refresh_token"]) {
          this.localStorageService.setData("refresh_token", response["refresh_token"]);
        }
        if (response["userName"]) {
          this.authService.setUserName(response["userName"])
        }
        this.authForm.patchValue({
          phone: "",
          password: ""
        });
        this.authForm.reset();
        this.ngxSmartModalService.getModal('login').close();
        let params = this.activatedRoute.snapshot.queryParams;
        if (params && params.link) {
          let lang = this.translate.getCurrentLang();
          this.router.navigate(['/', lang, params.link])
        }
        if (authSub) {
          authSub.unsubscribe()
        }
        this.logining = false;
      },
      err => {
        this.authForm.reset();
        this.logining = false;
        if (err && err.status === 409 && err.error == ConflictErrorStatus.NotFound) {
          if (this.authForm.value.isYUser) {
            setTimeout(() => {
              this.authForm.controls["code"].markAsDirty();
              this.authForm.controls["password"].markAsDirty();
            }, 200)
            this.authForm.controls["code"].markAsTouched();
            this.authForm.controls["code"].setErrors({ 'invalid': true });
            this.authForm.controls["password"].markAsTouched();
            this.authForm.controls["password"].setErrors({ 'invalid': true });
          }
          else {
            this.authForm.reset();
            setTimeout(() => {
              this.authForm.controls["phone"].markAsDirty();
              this.authForm.controls["password"].markAsDirty();
            }, 200)
            this.authForm.controls["phone"].setErrors({ 'invalid': true });
            this.authForm.controls["phone"].markAsTouched();
            this.authForm.controls["password"].setErrors({ 'invalid': true });
            this.authForm.controls["password"].markAsTouched();

          }
          this.uncorrectData = true;
        }
        if (err && err.status === 409 && err.error == ConflictErrorStatus.PermissionDenied) {
          this.permissionDenied = true;
        }
        if (err instanceof HttpErrorResponse && err.status === 400) {
          this.unknowError = true;
        }
        if (authSub) {
          authSub.unsubscribe()
        }

      }
    )
  }
  closeAuth() {
    this.sidebarService.closeAuth();
    this.clearForms();

    // states
    this.authState = true;
    this.forgotState = false;
    this.registerState = false;
  }
  changeToForgot() {
    this.clearForms();
    this.authState = false;
    this.forgotState = true;
    this.registerState = false;
  }
  changeToAuth() {
    this.clearForms();

    this.authState = true;
    this.forgotState = false;
    this.registerState = false;

  }
  registration() {
    this.authState = false;
    this.forgotState = false;
    this.registerState = true;
  }
  sendCode() {
    this.userExist = false;
    this.unavailable = false;
    this.forgotPermissionDenied = false;
    this.phoneErr = false;
    this.phoneInvalid = false;
    this.forgetForm.controls["phone"].markAsUntouched();
    if (this.forgetForm.controls["phone"].invalid) {
      setTimeout(() => {
        this.forgetForm.controls["phone"].markAsTouched();
      }, 200)
      this.phoneErr = true;
      return
    }
    this.sendPhoneNubmer = true;
    let authSub: Subscription = this.authService.resetPassword(this.forgetForm.value.phone).subscribe(
      () => {
        this.forgetForm.controls["phone"].disable();
        this.forgotPhoneState = false;
        this.sendPasswordState = true;
        this.sendPhoneNubmer = false;
        let timeout = setInterval(() => {
          if (this.count === 0) {
            clearTimeout(timeout);
            return
          }
          this.count--;
        }, 1000);
        if (authSub) {
          authSub.unsubscribe()
        }
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          this.sendPhoneNubmer = false;
          if (err.status == 409) {
            if (err.error == ConflictErrorStatus.NotFound) {
              this.userExist = true;
              this.forgetForm.controls["phone"].setErrors({ invalid: true });
              setTimeout(() => {
                this.forgetForm.controls["phone"].markAsTouched();
              }, 200);
            }
            if (err.error == ConflictErrorStatus.PermissionDenied) {
              this.forgotPermissionDenied = true;
              this.forgetForm.controls["phone"].setErrors({ invalid: true });
              setTimeout(() => {
                this.forgetForm.controls["phone"].markAsTouched();
              }, 200);
            }
            if (err.error == ConflictErrorStatus.Invalid) {
              setTimeout(() => {
                this.forgetForm.controls["phone"].markAsTouched();
              }, 200);
              this.phoneInvalid = true;
              this.forgetForm.controls["phone"].setErrors({ invalid: true });
            }
            if (err.error == ConflictErrorStatus.ServiceTemporarilyUnavailable) {
              this.unavailable = true;
            }
          }
        }
        if (authSub) {
          authSub.unsubscribe()
        }
      }
    )
  }
  resendPassword() {
    if (this.countResend == 0) {
      return
    }
    this.countResend--;
    let authSub: Subscription = this.authService.resetPassword(this.forgetForm.controls["phone"].value).subscribe(
      () => {
        this.count = 180;
        let timeout = setInterval(() => {
          if (this.count === 0) {
            clearTimeout(timeout);
            return
          }
          this.count--;
        }, 1000)
        if (authSub) {
          authSub.unsubscribe()
        }
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409) {
            if (err.error == ConflictErrorStatus.NotFound) {
              this.userExist = true;
              this.forgetForm.controls["phone"].markAsUntouched();
            }
            if (err.error == ConflictErrorStatus.Invalid) {
              this.forgetForm.controls["phone"].setErrors({ invalid: true });
            }
            if (err.error == ConflictErrorStatus.ServiceTemporarilyUnavailable) {
              this.unavailable = true;
            }
          }
        }
        if (authSub) {
          authSub.unsubscribe()
        }
      }
    )
  }
  changePassword() {
    //errors
    this.codeErr = false;
    this.passwordErr = false;
    this.repeatPasswordErr = false;

    //async errors
    this.uncorrectData = false;
    this.uncorrectPhoneSms = false;
    this.forgotPermissionDenied = false;

    // anim function
    this.forgetForm.controls["code"].markAsUntouched();
    this.forgetForm.controls["password"].markAsUntouched();
    this.forgetForm.controls["repeatPassword"].markAsUntouched();

    //validation
    let correct = true;
    if (this.forgetForm.controls["code"].invalid) {
      setTimeout(() => {
        this.forgetForm.controls["code"].markAsTouched();
      }, 200);
      this.forgetForm.controls["code"].setErrors({ 'invalid': true });
      this.codeErr = true;
      correct = false;
    }
    if (this.forgetForm.controls["password"].invalid) {
      setTimeout(() => {
        this.forgetForm.controls["password"].markAsTouched();
      }, 200);
      this.forgetForm.controls["password"].setErrors({ 'invalid': true });
      this.passwordErr = true;
      correct = false;
    }
    if (this.forgetForm.value.password != this.forgetForm.value.repeatPassword || this.forgetForm.controls["repeatPassword"].invalid) {
      setTimeout(() => {
        this.forgetForm.controls["repeatPassword"].markAsTouched();
      }, 200);
      this.repeatPasswordErr = true;
      this.forgetForm.controls["repeatPassword"].setErrors({ 'invalid': true })
      correct = false;
    }
    if (!correct) {
      this.uncorrectData = true;
      return
    }
    let code = sha1(btoa(this.forgetForm.value.code + environment.key));
    let formData: ForgetForm = {
      phone: this.forgetForm.controls["phone"].value,
      code: code,
      password: this.forgetForm.value.password
    }

    this.changingPassword = true;
    let authSub: Subscription = this.authService.changePassword(formData).subscribe(
      () => {
        this.forgetForm.reset();
        this.successChange = true;

        this.forgetForm.controls["phone"].enable();
        setTimeout(() => {
          this.changeToAuth();
          this.successChange = false;
          this.sendPasswordState = false;
        }, 2000);
        if (authSub) {
          authSub.unsubscribe()
        }
        this.changingPassword = false;
      },
      err => {
        this.changingPassword = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409 && err.error == ConflictErrorStatus.NotFound) {
            this.userExist = true;
            setTimeout(() => {
              this.forgetForm.controls["code"].markAsTouched();
            }, 200);
            this.forgetForm.controls["code"].setErrors({ 'invalid': true });
          }
          if (err.status == 409 && err.error == ConflictErrorStatus.PermissionDenied) {
            this.forgotPermissionDenied = true;
            setTimeout(() => {
              this.forgetForm.controls["code"].markAsTouched();
            }, 200);
            this.forgetForm.controls["code"].setErrors({ 'invalid': true });
          }
          if (err.status == 409 && err.error == ConflictErrorStatus.Invalid) {
            this.uncorrectPhoneSms = true;
            setTimeout(() => {
              this.forgetForm.controls["code"].markAsTouched();
            }, 200);
            this.forgetForm.controls["code"].setErrors({ 'invalid': true });
          }
        }
        if (authSub) {
          authSub.unsubscribe()
        }
      }
    )
  }
  ngOnInit() {
    this.authSubscription = this.sidebarService.getStateAuth().subscribe(
      state => {
        if (state) {
          this.ngxSmartModalService.getModal('login').open();
        }
      }
    )
    this.valueChangesSubscription = this.forgetForm.valueChanges
      .subscribe(
        () => {
          if (this.forgetForm.controls["password"].valid && this.forgetForm.controls["repeatPassword"].touched && this.forgetForm.value.password != this.forgetForm.value.repeatPassword) {
            this.forgetForm.controls["repeatPassword"].setErrors({ 'invalid': true });
          }
        }
      )
  }
  toAuth() {
    this.forgetForm.reset();
    this.changeToAuth();

  }

  private clearForms() {
    this.forgetForm.reset();
    this.authForm.reset();

    // async login
    this.uncorrectData = false;
    this.permissionDenied = false;
    this.unknowError = false;

    // async forgot
    this.userExist = false;
    this.unavailable = false;
    this.forgotPermissionDenied = false;

    // forgot
    this.phoneErr = false;
    this.phoneInvalid = false;
    this.codeErr = false;
    this.passwordErr = false;
    this.repeatPasswordErr = false;
    this.forgotPhoneState = true;
    this.sendPasswordState = false;
  }
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
      this.authSubscription = null;
    }
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
      this.valueChangesSubscription = null;
    }
  }
}
