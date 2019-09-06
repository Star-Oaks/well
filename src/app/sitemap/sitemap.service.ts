import { Injectable } from '@angular/core';
import { SidebarDataService } from '../shared/layouts/sidebar/sidebarData.service';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from '../shared/model/shop/category';

@Injectable()
export class SitemapResolveService implements Resolve<Observable<Category[]>> {
    constructor(
        private sitemap: SidebarDataService
    ) { }
    resolve(): Observable<Category[]> {
        return this.sitemap.getMenuData();
    }
}