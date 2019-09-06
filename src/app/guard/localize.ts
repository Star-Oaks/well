import { Injectable } from '@angular/core';


import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
// import { currentLangGlobal } from '../app.component';
import { TranslatesService } from '../shared/translates';
import { currentLangGlobal } from '../app.component';


@Injectable({ providedIn: 'root' })
export class LocalizeGuard implements CanActivateChild {
    constructor(
        private router: Router,
    ){ }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // console.log(route)
        // if(route.url.length == 0){
         
        //     this.router.navigate(['/', currentLangGlobal]);
        //     return false
        // }
        return true
    }
}