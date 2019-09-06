import { Injectable } from '@angular/core';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class FooterService {
    constructor(
        private http: TransferHttpService
    ){}
    getSocials(){
        return this.http.get("/api/v1/contacts/social")
    }
    getPhones(){
        return this.http.get("/api/v1/contacts/phone")
    }
    getAdresses(){
        return this.http.get("/api/v1/contacts/adress")
    }
}