import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class AgreementsService {

    constructor(
        private http: TransferHttpService
    ) {}
    getPublicSalesContract() {
        return this.http.get("/api/v1/agreement");
      }
    savePublicSalesContract(data) {
        return this.http.put("/api/v1/agreement", data);
    }

    getUserAgreement() {
        return this.http.get("/api/v1/agreement/user");
      }
    saveUserAgreement(data) {
        return this.http.put("/api/v1/agreement/user", data);
    }
}

@Injectable()
export class PublicContractResolveService implements Resolve<Observable<Object>> {
  constructor(
    private agreementsService: AgreementsService,

  ) { }
  resolve() {
    return this.agreementsService.getPublicSalesContract();
  }
}

@Injectable()
export class UserAgreementResolveService implements Resolve<Observable<Object>> {
  constructor(
    private agreementsService: AgreementsService,

  ) { }
  resolve() {
    return this.agreementsService.getUserAgreement();
  }
}

