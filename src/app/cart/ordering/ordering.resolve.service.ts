import { Injectable } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { CartService } from '../../shared/services/cart.service';

@Injectable()
export class OrderingResolveService implements Resolve<Observable<Object>> {

    constructor(
        private userService: UserService,
    ) {}

    resolve() {
        // let products = this.cartService.getProductsByUrlName();
        // let user = this.userService.getUserInfo();
        return this.userService.getUserInfo()
    }
}