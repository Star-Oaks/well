import { Injectable, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class AboutCompanyService {
    constructor(
      private http: TransferHttpService,
    ) { }
    getAboutCompanyData() {
      
      return this.http.get("/api/v1/company/");
    }
  }
  @Injectable()
  export class AboutCompanyResolveService implements Resolve<Observable<Object>> {
    constructor(
      private aboutService: AboutCompanyService,
  
    ) { }
    resolve() {
      return this.aboutService.getAboutCompanyData();
    }
  }