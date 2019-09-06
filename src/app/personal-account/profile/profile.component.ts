import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../shared/model/user/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { ConflictErrorStatus } from '../../shared/model/conflict-error-status';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public userForm: FormGroup;
  public passwordForm: FormGroup;

  public save: boolean = false;
  public visiblityState: boolean = false;
  public visiblityPassState: boolean = false;
  public savingData: boolean = false;
  public savingPass: boolean = false;
  private nameRegex: RegExp = /^([\s]{0,3}[a-zа-яёєіїґ][\s]{0,3}){2,20}$/i;
  private emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  private passRegex: RegExp = /^(?=.*[a-z])[a-zA-Z\d@$!%*#?&"', \.\^\(\)\`\:\;\-\=\+]{8,}$/;

  private valueChangesSubscription: Subscription;
  @Input('user') user: User;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) { }
  saveUserData() {
    if (this.savingData) {
      return
    }

    this.userForm.controls["fName"].markAsUntouched();
    this.userForm.controls["lName"].markAsUntouched();
    this.userForm.controls["email"].markAsUntouched();

    let correct = true;
    if (this.userForm.controls["fName"].invalid) {
      setTimeout(() => {
        this.userForm.controls["fName"].markAsTouched();
      }, 200);
      correct = false;
    }
    if (this.userForm.controls["lName"].invalid) {
      setTimeout(() => {
        this.userForm.controls["lName"].markAsTouched();
      }, 200);
      correct = false;
    }
    if (this.userForm.controls["email"].invalid) {
      setTimeout(() => {
        this.userForm.controls["email"].markAsTouched();
      }, 200);
      correct = false;
    }
    if (!correct) {
      return
    }
    this.savingData = true;
    let formData = {
      fName: this.userForm.value.fName.replace(/\s+/g, ''),
      email: this.userForm.value.email,
      lName: this.userForm.value.lName
    }
    let userSub: Subscription = this.userService.putAccountData(formData).subscribe(
      () => {
        this.visiblityState = true;
        this.savingData = false;
        this.authService.setUserName(this.userForm.value.fName);
        setTimeout(() => this.visiblityState = false, 4000);
      },
      err => {
        this.savingData = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409 && err.error == ConflictErrorStatus.Invalid) {
            this.userForm.controls["email"].markAsTouched();
            this.userForm.controls["email"].setErrors({ invalid: true });
          }
        }
      },
      () => {
        if (userSub) {
          userSub.unsubscribe();
        }
      }
    )
  }
  changePassword() {
    if (this.savingPass) {
      return
    }
    let correct = true;
    if (this.passwordForm.controls["oldPass"].invalid) {
      this.passwordForm.controls["oldPass"].markAsTouched();
      correct = false;
    }
    if (this.passwordForm.controls["newPass"].invalid) {
      this.passwordForm.controls["newPass"].markAsTouched();
      correct = false;
    }
    if (this.passwordForm.value.newPass != this.passwordForm.value.newPassRepeat) {
      this.passwordForm.controls["newPassRepeat"].markAsTouched();
      this.passwordForm.controls["newPassRepeat"].setErrors({ 'invalid': true })
      correct = false;
    }
    if (!correct) {
      return
    }
    this.savingPass = true;
    let changesSub: Subscription = this.userService.changePassword(this.passwordForm.value).subscribe(
      () => {
        this.savingPass = false;
        this.passwordForm.reset();
        this.visiblityPassState = true;
        setTimeout(() => this.visiblityPassState = false, 4000);
      },
      (err) => {
        this.savingPass = false;
        if (err instanceof HttpErrorResponse) {
          if (err.status == 409 && err.error == ConflictErrorStatus.Invalid) {
            this.passwordForm.controls["oldPass"].markAsTouched();
            this.passwordForm.controls["oldPass"].setErrors({ invalid: true });
          }
        }
      },
      () => {
        if (changesSub) {
          changesSub.unsubscribe();
        }
      }
    )
  }
  ngOnInit() {
    this.userForm = this.fb.group({
      email: this.fb.control(this.user.email, [Validators.required, Validators.pattern(this.emailRegex)]),
      fName: this.fb.control(this.user.fName, [Validators.required, Validators.pattern(this.nameRegex)]),
      lName: this.fb.control(this.user.lName, [Validators.required, Validators.pattern(this.nameRegex)]),
    })
    this.passwordForm = this.fb.group({
      oldPass: this.fb.control("", [Validators.required]),
      newPass: this.fb.control("", [Validators.required, Validators.pattern(this.passRegex)]),
      newPassRepeat: this.fb.control("", [Validators.required]),
    })

    this.valueChangesSubscription = this.passwordForm.valueChanges
      .subscribe(
        () => {
          if (this.passwordForm.controls["newPass"].valid && this.passwordForm.controls["newPass"].touched && this.passwordForm.value.newPass != this.passwordForm.value.newPassRepeat) {
            this.passwordForm.controls["newPassRepeat"].setErrors({ 'invalid': true });
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
}
