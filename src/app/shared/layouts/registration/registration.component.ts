import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as sha1 from 'js-sha1';
import { environment } from '../../../../environments/environment';
import { RegisterForm } from '../../model/registerForm';
import { AuthForm } from '../../model/authForm';
import { LocalStorageService } from '../../services/local-storage.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ConflictErrorStatus } from '../../model/conflict-error-status';
import { Subscription } from 'rxjs';
import { Gtag } from 'angular-gtag';
import { BrowserService } from '../../services/browser.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public firstPart: boolean = true;
  public secondPart: boolean = false;

  public registerForm: FormGroup;
  public count: number = 180;
  private countResend: number = 3;

  // async variables
  public check: boolean = false;
  public sending: boolean = false;

  // fileds erross
  public emailErr : boolean =  false;
  public nameErr : boolean =  false;
  public phoneErr : boolean =  false;
  public codeErr : boolean =  false;
  public passErr : boolean =  false;
  public repeatPassErr : boolean =  false;
  public acceptErr : boolean =  false;

  // request errors
  public correctData: boolean = true;
  private mobileHash: string;
  public mobileCodeUncorrect: boolean = false;
  public userExist: boolean = false;
  public serviceTemporarilyUnavailable: boolean = false;


  // regex
  private passRegex: RegExp = /^(?=.*[a-z])[a-zA-Z\d@$!%*#?&"', \.\^\(\)\`\:\;\-\=\+]{8,}$/;
  private telRegex: RegExp = /^[0-9]{9}$/;
  private codeRegex: RegExp = /^[0-9]{4}$/;
  private nameRegex: RegExp = /^([\s]{0,3}[a-zа-яёєіїґ][\s]{0,3}){2,20}$/i;
  private emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

  @Output() toAuthEvent: EventEmitter<any> = new EventEmitter();

  private valueChangesSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public ngxSmartModalService: NgxSmartModalService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {

    this.registerForm = this.fb.group({
      phone: this.fb.control("", [Validators.required, Validators.pattern(this.telRegex)]),
      password: this.fb.control("", [Validators.required, Validators.pattern(this.passRegex)]),
      repeatPassword: this.fb.control("", [Validators.required]),
      code: this.fb.control("", [Validators.required, Validators.pattern(this.codeRegex)]),
      fName: this.fb.control("", [Validators.required, Validators.pattern(this.nameRegex)]),
      email: this.fb.control("", [Validators.required, Validators.pattern(this.emailRegex)]),
      accept: this.fb.control(false, Validators.required)
    })
  }

  ngOnInit() {
    this.valueChangesSubscription = this.registerForm.valueChanges
      .subscribe(
      () => {
        this.mobileCodeUncorrect = false;
        if (this.registerForm.controls["password"].valid && this.registerForm.controls["repeatPassword"].touched && this.registerForm.value.password != this.registerForm.value.repeatPassword) {
          this.registerForm.controls["repeatPassword"].setErrors({ 'invalid': true });
        }
      }
    )
  }
  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
      this.valueChangesSubscription = null;
    }
  }
  verification() {
    this.correctData = true;
    this.userExist = false;
    this.serviceTemporarilyUnavailable = false;
    this.nameErr =  false;
    this.phoneErr = false;
    this.emailErr = false;
    this.acceptErr = false;

    // animations func
    this.registerForm.controls["fName"].markAsUntouched();
    this.registerForm.controls["phone"].markAsUntouched();
    this.registerForm.controls["email"].markAsUntouched();
    this.registerForm.controls["accept"].markAsUntouched();

    let correct = true;
    if (this.check) {
      return
    }
    if (this.registerForm.controls["fName"].invalid) {
      setTimeout(() => {
        this.registerForm.controls["fName"].markAsTouched();
      }, 200);
      this.nameErr = true;
      correct = false;
    }
    if (this.registerForm.controls["phone"].invalid) {
      setTimeout(() => {
        this.registerForm.controls["phone"].markAsTouched();
      }, 200);
      this.phoneErr = true;
      correct = false;
    }
    if (this.registerForm.controls["email"].invalid) {
      setTimeout(() => {
        this.registerForm.controls["email"].markAsTouched();
      }, 200);
      this.emailErr = true;
      correct = false;
    }
    if (this.registerForm.value.accept != true) {
      setTimeout(() => {
        this.registerForm.controls["accept"].markAsTouched();
      }, 200);
      this.acceptErr = true;
      correct = false;
    }

    if (!correct) {
      this.correctData = false;
      return
    }
    this.check = true;
    // let checkSub: Subscription = this.authService.checkMail(this.registerForm.value.email).subscribe(
    //   () => {

    let authSub: Subscription = this.authService.getPhoneData(this.registerForm.value.phone).subscribe(
      res => {
        this.mobileHash = res as string;
        this.check = false;
        this.firstPart = false;
        this.secondPart = true;

        let timeout = setInterval(() => {
          if (this.count === 0) {
            clearTimeout(timeout);
            return
          }
          this.count--;
        }, 1000);
        if (authSub) {
          authSub.unsubscribe();
        }
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409 && err.error == ConflictErrorStatus.Exist || err.status == 409 && err.error == ConflictErrorStatus.Invalid) {
            this.userExist = true;
            this.registerForm.controls["phone"].setErrors({ incorrect: true });
            this.registerForm.controls["phone"].markAsUntouched();
            setTimeout(() => {
              this.registerForm.controls["phone"].markAsTouched();
            }, 200);
            this.registerForm.patchValue({
              phone: ''
            });
          }
          if (err.status == 409 && err.error == ConflictErrorStatus.ServiceTemporarilyUnavailable) {

            this.serviceTemporarilyUnavailable = true;
          }
          this.check = false;
        }
        if (authSub) {
          authSub.unsubscribe();
        }
      }
    )
    // if (checkSub) {
    //   checkSub.unsubscribe();
    // }
    // },
    // err => {
    //   if (err instanceof HttpErrorResponse && err.status == 409 && err.error == ConflictErrorStatus.Invalid) {
    //     this.registerForm.controls["email"].setErrors({ 'incorrect': true });
    //     this.check = false;
    //   }
    //   if (checkSub) {
    //     checkSub.unsubscribe();
    //   }
    //   }
    // )

  }
  resendPassword() {
    if (this.countResend == 0) {
      return
    }
    this.countResend--;
    let phoneSub: Subscription = this.authService.getPhoneData(this.registerForm.value.phone).subscribe(
      res => {
        this.mobileHash = res as string;
        this.check = false;
        this.firstPart = false;
        this.secondPart = true;
        this.count = 180;
        let timeout = setInterval(() => {
          if (this.count === 0) {
            clearTimeout(timeout);
            return
          }
          this.count--;
        }, 1000)
        if (phoneSub) {
          phoneSub.unsubscribe();
        }
      },
      () => {
        if (phoneSub) {
          phoneSub.unsubscribe();
        }
      }
    )
  }
  sendData() {
    this.correctData = true;
    let correct = true;
    this.mobileCodeUncorrect = false;
  

    this.codeErr = false;
    this.passErr = false;
    this.repeatPassErr = false;

    // anim funcs
    this.registerForm.controls["code"].markAsUntouched();
    this.registerForm.controls["password"].markAsUntouched();
    this.registerForm.controls["repeatPassword"].markAsUntouched();
    if (this.registerForm.controls["code"].invalid) {
      this.registerForm.controls["code"].setErrors({ 'invalid': true });
      setTimeout(() => {
        this.registerForm.controls["code"].markAsTouched();
      }, 200);
      this.codeErr = true;
      correct = false;
    }
    if (this.registerForm.controls["password"].invalid) {
      this.passErr = true;
      setTimeout(() => {
        this.registerForm.controls["password"].markAsTouched();
      }, 200);
      correct = false;
    }
    if (this.registerForm.value.password != this.registerForm.value.repeatPassword || this.registerForm.controls["repeatPassword"].invalid) {
     this.repeatPassErr = true;
      setTimeout(() => {
        this.registerForm.controls["repeatPassword"].markAsTouched();
      }, 200);
      this.registerForm.controls["repeatPassword"].setErrors({ 'invalid': true })
      correct = false;
    }
    if (!correct) {
      this.correctData = false;
      return
    }

    let sha = sha1(btoa(this.registerForm.value.code + environment.key));
    if (!this.mobileHash || sha != this.mobileHash.toLowerCase()) {
      this.mobileCodeUncorrect = true;
      this.registerForm.controls["code"].setErrors({ 'invalid': true });

      setTimeout(() => {
        this.registerForm.controls["code"].markAsTouched();
      }, 200);
      return
    }
    this.sending = true;
    let value = this.registerForm.value;
    let formData: RegisterForm = {
      fName: value.fName.replace(/\s+/g, ''),
      phone: value.phone,
      email: value.email,
      password: value.password
    }
    let regSub: Subscription = this.authService.register(formData).subscribe(
      () => {
        if (this.browserService.isBrowser) {
          this.gtag.event('click', {
            method: 'click',
            event_category: 'button-registration',
            event_label: 'Кнопка Отправить (регистрация)'
          });
        }
        let formData: AuthForm = {
          phone: value.phone,
          password: value.password,
          grant_type: 1,
          client: 2
        }
        let authSub: Subscription = this.authService.auth(formData).subscribe(
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
            this.registerForm.reset();
            this.mobileHash = "";
            this.firstPart = true;
            this.secondPart = false;
            this.mobileCodeUncorrect = false;
            this.mobileHash = null;
            this.correctData = true;
            this.userExist = false;
            this.sending = false;
            
            this.ngxSmartModalService.getModal('login').close();
            if (authSub) {
              authSub.unsubscribe();
            }
            this.sending = false;
          },
          () => {
            if (authSub) {
              authSub.unsubscribe();
              this.sending = false;
            }
          }
        )
        if (regSub) {
          regSub.unsubscribe();
        }
      },
      () => {
        if (regSub) {
          regSub.unsubscribe();
        }
        this.sending = false;
      }
    )
  }
  toFirstPart() {
    this.registerForm.reset();
    this.firstPart = true;
    this.secondPart = false;
    this.mobileCodeUncorrect = false;
    this.mobileHash = null;
    this.correctData = true;
    this.userExist = false;
    this.sending = false;

    this.codeErr = false;
    this.passErr = false;
    this.repeatPassErr = false;

    this.count = 180;
    let timeout = setInterval(() => {
      if (this.count === 0) {
        clearTimeout(timeout);
        return
      }
      this.count--;
    }, 1000);
  }
  toAuth() {
    this.firstPart = true;
    this.secondPart = false;
    this.mobileCodeUncorrect = false;
    this.correctData = true;
    this.registerForm.reset();
    this.toAuthEvent.emit();
  }

}
