import { Injectable } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { CartService } from '../../shared/services/cart.service';

@Injectable()
export class CartResolveService implements Resolve<Observable<Object>> {

    constructor(
        private cartService: CartService,
    ) {}

    resolve() {
        // let products = this.cartService.getProductsByUrlName();
        // let promotions = this.cartService.getPromotions();
        // let similar = this.cartService.getSimilar();
        return   this.cartService.getProductsByUrlNameWithAdditional();
    }
}