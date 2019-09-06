import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/model/user/user';
import { TranslateService } from '@ngx-translate/core';
import { MetaService } from '@ngx-meta/core';
import { UserAddresses } from '../../shared/model/user/user-addresses';
import { Subscription, forkJoin, Observable, of } from 'rxjs';
import { TranslatesService } from '../../shared/translates';
import { UserService } from '../../shared/services/user.service';
import { UserOrder } from '../../shared/model/user/user-order';
import { SidebarService } from '../../shared/services/sidebar.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../shared/services/auth.service';
import { Gtag } from 'angular-gtag';
import { environment } from '../../../environments/environment';
import { BrowserService } from '../../shared/services/browser.service';

const errorLiqpayStatus: string[] = [
  "error",
  "failure",
  "reversed",
  // "sandbox"
]

@Component({
  selector: 'app-personal-container',
  templateUrl: './personal-container.component.html',
  styleUrls: ['./personal-container.component.scss']
})
export class PersonalContainerComponent implements OnInit {
  private user: User;
  public userInfo: User;
  public userAddresses: UserAddresses[] = [];
  public userOrders: UserOrder[] = [];

  private translateSubscription: Subscription;
  private deleteErrorOrderSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translateCoreService: TranslateService,
    private readonly metaService: MetaService,
    private translateService: TranslatesService,
    private userService: UserService,
    private router: Router,
    private sidebarService: SidebarService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private gtag: Gtag,
    private browserService: BrowserService
  ) {

    let title = this.translateCoreService.instant('personal.name');
    this.metaService.setTitle(title);
    if (this.browserService.isBrowser) {
      this.gtag.pageview({
        page_title: title,
        page_path: this.router.url,
        page_location: environment.api + this.router.url
      });
    }
    let req = this.activatedRoute.snapshot.data["userInfo"];
    if (req) {
      this.user = req as User;

      this.userInfo = {
        email: this.user.email,
        fName: this.user.fName,
        lName: this.user.lName,
        isUUser: this.user.isUUser
      }

      this.userAddresses = req.userAdresses || [];
      this.userAddresses.sort((a, b) => {
        if (a.addressType < b.addressType) { return -1; }
        if (a.addressType > b.addressType) { return 1; }
        return 0;
      })
      let ordersSub: Subscription = this.userService.getUserOrders().subscribe(
        res => {
          this.userOrders = res as UserOrder[];
          // console.log(this.userOrders)
          let item = this.userOrders.find(x =>
            // { console.log(x)
            //  return x.status == "sandbox"
            // }
            errorLiqpayStatus.some(y => y == x.status)
          );
          // console.log(index)
          // console.log(this.userOrders)
          if (item) {
            setTimeout(() => this.sidebarService.openErrorModal(item), 1000);
          }
        },
        () => { },
        () => {
          if (ordersSub) {
            ordersSub.unsubscribe();
          }
        }
      )
    }
    else {
      this.router.navigate(['/', this.translateService.getCurrentLang()])
      this.localStorageService.clearData("access_token");
      this.localStorageService.clearData("refresh_token");
      // comment localstorage name 
      this.localStorageService.clearData("userName");
      this.authService.setUserName(undefined);
      this.sidebarService.openAuthorization();
    }
  }
  ngOnInit() {
    this.translateSubscription = this.translateService.changeLanguageEvent.subscribe(
      () => {
        let userReq = this.userService.getUserInfo();
        let ordersReq = this.userService.getUserOrders();
        let userSub: Subscription = forkJoin([userReq, ordersReq])
          .subscribe(
            res => {
              this.user = res[0] as User;
              this.userOrders = res[1] as UserOrder[];
              this.userInfo = {
                email: this.user.email,
                fName: this.user.fName,
                lName: this.user.lName,
                isUUser: this.user.isUUser
              }
              this.userAddresses = this.user.userAdresses || [];
              let title = this.translateCoreService.instant('personal.name');
              this.metaService.setTitle(title);
              if (this.browserService.isBrowser) {
                this.gtag.pageview({
                  page_title: title,
                  page_path: this.router.url,
                  page_location: environment.api + this.router.url
                });
              }
              if (userSub) {
                userSub.unsubscribe();
              }
            },
            () => {
              if (userSub) {
                userSub.unsubscribe();
              }
            }
          )
      }
    )
    this.deleteErrorOrderSubscription = this.userService.deleteOrderEvent.subscribe(
      () => {
        let sub: Subscription = this.userService.getUserOrders().subscribe(
          res => {
            this.userOrders = res as UserOrder[];
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
  }
  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    if (this.deleteErrorOrderSubscription) {
      this.deleteErrorOrderSubscription.unsubscribe();
    }
  }
}
