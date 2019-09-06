import { Injectable, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable ()
export class WaterService {
    constructor (
        private http: TransferHttpService,
    ) { }
    getWaterData() {
        return this.http.get("/api/v1/aboutwater/");
    }
}

@Injectable()
export class WaterResolveService implements Resolve<Observable<Object>> {
  constructor(
    private waterService: WaterService,

  ) { }
  resolve() {
    return this.waterService.getWaterData();
  }
}