

import {
    HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,
    HttpRequest,
    HttpHeaders,
    HttpUserEvent,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { _catch } from "rxjs/operator/catch";
import { _throw } from "rxjs/observable/throw";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { LocalStorageService } from './shared/services/local-storage.service';
import { AuthForm } from './shared/model/authForm';
import { AuthService } from './shared/services/auth.service';
import { take, map, switchMap, catchError, finalize, retryWhen, concatMap, delay, takeWhile } from 'rxjs/operators';
import { BehaviorSubject, Observable, forkJoin, timer } from 'rxjs';
import { SidebarService } from './shared/services/sidebar.service';
import { environment } from '../environments/environment';
import * as env from '../environments/browser/environment';

import { currentLangGlobal } from './app.component';
import { NotFoundService } from './not-found/not-found.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private authService: AuthService,
        private sidebarService: SidebarService,
        private notFoundService: NotFoundService
    ) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
        let marketUrl;
        if (environment.production) {
            marketUrl = environment.api;
        }
        else {
            marketUrl = env.environment.api;
        }
        const exp = /^(http:|https:)/;
        const apiExp = /api/;
        if (!exp.exec(req.url)) {
            if (apiExp.exec(req.url)) {
                let code = currentLangGlobal;
                let token = this.localStorageService.getData("access_token");
                let oldHeaders = req.headers;
                if (oldHeaders.has('cSYhui9vxpk4')) {
                    let headers = new HttpHeaders({
                        'langCode': code,
                        'Authorization': "Bearer " + token,
                        'cSYhui9vxpk4': oldHeaders.get('cSYhui9vxpk4')
                    });
                    req = req.clone({
                        headers: headers,
                        url: marketUrl + req.url,
                    });
                }
                else {
                    let headers = new HttpHeaders({
                        'langCode': code,
                        'Authorization': "Bearer " + token
                    });
                    req = req.clone({
                        headers: headers,
                        url: marketUrl + req.url,
                    });
                }
            }

        }
        // console.log(req.headers.get('langCode'));
        return next.handle(req)
            // .pipe(
            //     delay(2000)
            // )
            ._catch(error => {
                if (error instanceof HttpErrorResponse && error.status == 401) {
                    if (error.headers.get('Token-Expired')) {
                        return this.handle401Error(req, next)
                    }
                    else {
                        this.authService.logout();
                        this.router.navigate(['/', currentLangGlobal]);
                        this.sidebarService.openAuthorization();
                        return _throw(error);
                    }
                }
                else if (error instanceof HttpErrorResponse && error.status == 404) {
                    this.router.navigate(['/404']);
                    this.notFoundService.setStatus(error.status, error.message)
                    return _throw(error);
                }
                // else if (error instanceof HttpErrorResponse && error.status == 400){
                //     this.localStorageService.clearData("access_token");
                //     this.localStorageService.clearData("refresh_token");
                //     return _throw(error);
                // }
                else {
                    // this.authService.logout();
                    return _throw(error);
                }

            });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        // console.log("401")
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenSubject.next(null);
            let access_token = this.localStorageService.getData("access_token");
            let refresh_token = this.localStorageService.getData("refresh_token");
            if (access_token && refresh_token) {
                let data: AuthForm = {
                    grant_type: 2,
                    client: 2,
                    refresh_token: refresh_token,
                    access_token: access_token
                }
                // console.log("return auth")
                return this.authService.auth(data).pipe(
                    take(1),
                    switchMap((resp) => {
                        if (resp) {
                            this.localStorageService.setData('access_token', resp["access_token"]);
                            this.localStorageService.setData('refresh_token', resp["refresh_token"]);
                            this.authService.setUserName(resp["userName"])
                            this.tokenSubject.next(resp["access_token"]);
                            //  console.log("refresh token write")
                            request = request.clone({ setHeaders: { Authorization: `Bearer ${resp["access_token"]}` } });
                            return next.handle(request)
                        }
                    }),
                    catchError((err) => {
                        this.isRefreshingToken = false;
                        this.sidebarService.openAuthorization();
                        return <any>this.authService.logout();
                    }),
                    finalize(() => {
                        this.isRefreshingToken = false;
                    })

                );

            }
            else {
                // this.sidebarService.openAuthorization();
                this.isRefreshingToken = false;
                return <any>this.authService.logout();
            }

        }
        else {
            // console.log("wait")
            return timer(2000).pipe(         // <== Wait 2 Seconds
                switchMap(() => {
                    let countErr: number = 0;
                    let token = this.localStorageService.getData("access_token");
                    request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
                    return next.handle(request)
                        .pipe(
                            retryWhen(errors => errors
                                .pipe(
                                    concatMap((error, count) => {
                                        countErr++;
                                        this.isRefreshingToken = false;
                                        if (count < 2 && (error.status == 401 || error.status == 404)) {
                                            return Observable.of(error.status);
                                        }
                                        else {
                                            this.localStorageService.clearData("access_token");
                                            this.localStorageService.clearData("refresh_token");
                                            this.localStorageService.clearData("userName");
                                            this.authService.setUserName(undefined);
                                            this.router.navigate(['/']);
                                            this.sidebarService.openAuthorization();
                                            return Observable.of(error.status);
                                        }
                                    }),
                                    delay(1000)
                                )
                            ),
                            takeWhile(
                                () => {
                                    return countErr < 3
                                }
                            )

                        )
                })
            )
        }
    }
}