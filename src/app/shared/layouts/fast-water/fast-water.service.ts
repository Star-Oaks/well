import { Injectable } from "@angular/core";
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class FastWatherService {
    constructor(
        private http: TransferHttpService
    ) { }

    postFastWatherData(data) {
        return this.http.post("/api/v1/orders/quickwaterorder",data);
    }

}