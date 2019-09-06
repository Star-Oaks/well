import { Injectable, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class FranchisingService {
  constructor(
    private http: TransferHttpService,
  ) { }
  getFranchingData() {
    return this.http.get("/api/v1/franchising/");
  }
  postFranchingForm(data) {
    return this.http.post("/api/v1/franchising/",data);
  }
}
@Injectable()
export class FranchisingResolveService implements Resolve<Observable<Object>> {
  constructor(
    private franchisingService: FranchisingService,

  ) { }
  resolve() {
    return this.franchisingService.getFranchingData();
  }
}