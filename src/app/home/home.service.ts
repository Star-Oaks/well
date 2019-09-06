import { Injectable, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';
@Injectable()
export class HomeService {
    constructor(
        private http: TransferHttpService,
    ) { }
    getHomeData() {
        return this.http.get("/api/v1/mainpage")
    }
    getBestdealsData() {
        return this.http.get("/api/v1/product/bestdeals")
    }
    getPhones() {
        return this.http.get("/api/v1/contacts/phone")
    }
}

@Injectable()
export class HomeResolveService implements Resolve<Observable<Object>>{
    constructor(
        private homeService: HomeService
    ) { }
    resolve() {
        let homeDataRequest = this.homeService.getHomeData();
        let homeBestdealsRequest = this.homeService.getBestdealsData();
        let phonesRequest = this.homeService.getPhones();
        return forkJoin([homeDataRequest, homeBestdealsRequest, phonesRequest]);
    }
}