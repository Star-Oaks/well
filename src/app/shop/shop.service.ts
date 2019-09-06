import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class ShopService {
    constructor(
        private http: TransferHttpService
    ) { }
    getProductsBySubCategory(urlName: string) {
        return this.http.get("/api/v1/product/subcategory/" + urlName)
    }
    getFiltersBySubCategory(urlName: string) {
        return this.http.get("/api/v1/subcategory/" + urlName)
    }
}

@Injectable()
export class ShopResolveService implements Resolve<Observable<Object>> {
    constructor(
        private shopService: ShopService,
    ) { }
    resolve(route: ActivatedRouteSnapshot) {
        let productsRequest = this.shopService.getProductsBySubCategory(route.paramMap.get('urlName'));
        let filtersRequest = this.shopService.getFiltersBySubCategory(route.paramMap.get('urlName'));
        return forkJoin([productsRequest, filtersRequest]);
    }
}
