import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BrowserService } from '../shared/services/browser.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';


@Injectable()
export class SharesService {

    public perPageCount: number = 5;
    public isBrowser: boolean;
    public windowWidth: number;

    constructor(
        private http: TransferHttpService,
        private browserService: BrowserService,
    ) { }

    getLastShares(date?: string, notFirstRequest: boolean = false) {
        if (!date) {
            date = new Date().toISOString()
        }
        this.perPageCount = this.checkWidth(notFirstRequest);
        return this.http.get("/api/v1/shares/catalog/" + date + "/" + this.perPageCount);
    }

    checkWidth(notFirstRequest: boolean) {
        this.isBrowser = this.browserService.getPlatform();
        if (this.isBrowser) {
            this.windowWidth = this.browserService.getViewPortWidth();
            if (this.windowWidth >= 1200) {
                return notFirstRequest ? 6 : 5;
            }
            else {
                return notFirstRequest ? 4 : 3;
            }
        }
        else {
            return notFirstRequest ? 6 : 5
        }
    }

    addRecommendation(data) {
        return this.http.post("/api/v1/shares", data);
    }

    getNotTypicalShare() {
        return this.http.get("/api/v1/shares/first");
    }

    getOneShare(urlName: string) {
        return this.http.get("/api/v1/shares/" + urlName);
    }

    getSharesSeo() {
        return this.http.get("/api/v1/shares");
    }
}

@Injectable()
export class SharesResolveService implements Resolve<Observable<Object>> {

    constructor(
        private sharesService: SharesService,
    ) { }

    resolve() {
        let notTypicalShareRequest = this.sharesService.getNotTypicalShare();
        let lastSharesRequest = this.sharesService.getLastShares();
        let sharesSeoRequest = this.sharesService.getSharesSeo();
        return forkJoin([notTypicalShareRequest, lastSharesRequest, sharesSeoRequest]);

    }
}

@Injectable()
export class NotTypicalShareResolveService implements Resolve<Observable<Object>> {

    constructor(
        private sharesService: SharesService,
    ) { }

    resolve() {
        return this.sharesService.getNotTypicalShare();
    }
}

@Injectable()
export class SharesItemResolveService implements Resolve<Observable<Object>> {

    private routeName: string;

    constructor(
        private sharesService: SharesService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        this.routeName = route.paramMap.get('name');

        return this.sharesService.getOneShare(this.routeName);
    }
}
