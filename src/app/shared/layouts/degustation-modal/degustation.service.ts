import { Injectable } from "@angular/core";
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class DegustationService {
    constructor(
        private http: TransferHttpService
    ) { }

    postDegustationData(data) {
        return this.http.post("/api/v1/degustation",data);
    }

}