import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BrowserService } from '../shared/services/browser.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';


@Injectable()
export class EncyclopediaService {

    public perPageCount: number = 6;
    public isBrowser: boolean;
    public windowWidth: number;

    constructor(
        private http: TransferHttpService,
        private browserService: BrowserService,
    ) { }

    getLastArticles(date?: string) {
        if (!date) {
            date = new Date().toISOString()
        }
        this.perPageCount = this.checkWidth();
        return this.http.get("/api/v1/encyclopedia/catalog/" + date + "/" + this.perPageCount);
    }
    checkWidth() {
        this.isBrowser = this.browserService.getPlatform();
        if (this.isBrowser) {
            this.windowWidth = this.browserService.getViewPortWidth();
            if (this.windowWidth >= 1200) {
                return 6;
            }
            else {
                return 4;
            }
        }
        else {
            return 6
        }
    }
    getArticle(urlName: string) {
        return this.http.get("/api/v1/encyclopedia/" + urlName);
    }

    getEncyclopediaSeo() {
        return this.http.get("/api/v1/encyclopedia");
    }
}

@Injectable()
export class EncyclopediaResolveService implements Resolve<Observable<Object>> {

    constructor(
        private encyclopediaService: EncyclopediaService,
    ) { }

    resolve() {
        let lastArticlesRequest = this.encyclopediaService.getLastArticles();
        let encyclopediaSeoRequest = this.encyclopediaService.getEncyclopediaSeo();
        return forkJoin([lastArticlesRequest, encyclopediaSeoRequest]);

    }
}

@Injectable()
export class ArticleResolveService implements Resolve<Observable<Object>> {

    private routeName: string;

    constructor(
        private encyclopediaService: EncyclopediaService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        this.routeName = route.paramMap.get('name');
        return this.encyclopediaService.getArticle(this.routeName);
    }
}