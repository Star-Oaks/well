import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Resolve } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BrowserService } from '../../shared/services/browser.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';


@Injectable()
export class NewsService {

    public perPageCount: number = 6;
    public isBrowser: boolean;
    public windowWidth: number;
    
    constructor(
        private http: TransferHttpService,
        private browserService: BrowserService,  
    ) {}

    getLastNews( date?: string){
        if(!date){
            date = new Date().toISOString()
        }
        this.perPageCount = this.checkWidth();
        return this.http.get("/api/v1/news/catalog/" + date + "/" + this.perPageCount);        
    }
    checkWidth(){
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
    getNewsItem(urlName: string){
        return this.http.get("/api/v1/news/" + urlName);        
    }

    getNewsSeo(){
        return this.http.get("/api/v1/news");   
    }
}

@Injectable()
export class NewsResolveService implements Resolve<Observable<Object>> {

    constructor(
        private newsService: NewsService,  
    ) {}

    resolve() {
        let lastNewsRequest = this.newsService.getLastNews();
        let newsSeoRequest = this.newsService.getNewsSeo();
        return forkJoin([lastNewsRequest, newsSeoRequest]);
        
    }
}

@Injectable()
export class NewsItemResolveService implements Resolve<Observable<Object>> {

    private routeName: string;

    constructor(
        private newsService: NewsService,         
    ) {}

    resolve(route: ActivatedRouteSnapshot) {
        this.routeName = route.paramMap.get('name');
        return this.newsService.getNewsItem(this.routeName);
    }
}