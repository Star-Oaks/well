import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { SidebarService } from '../shared/services/sidebar.service';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private sidebarService: SidebarService,
        private activatedRoute: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private authService: AuthService,

    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.localStorageService.getData("userName") || this.authService.userName) {
            // comment localstorage name 
            // console.log('est token ili name')
            return true;
        }
        // console.log("dfsdfss")
        if (route.queryParamMap.get('link')) {
            this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {'link': route.queryParamMap.get('link')} } );
            this.sidebarService.openAuthorization();
            return false
        }
        // console.log("guard")
        // console.log(route)
        this.router.navigate([], { relativeTo: this.activatedRoute });
        this.sidebarService.openAuthorization();
        return false;
    }
}