import { Injectable, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TransferHttpService } from '@gorniv/ngx-transfer-http';

@Injectable()
export class PointsService {
    constructor(
        private http: TransferHttpService,
    ) { }

    getPointsData() {
        return this.http.get("/api/v1/dotspageone/")
    }
}
@Injectable()
export class PointsResolveService implements Resolve<Observable<Object>>{
    constructor(
        private pointsService: PointsService

    ) { }

    resolve() {
        return this.pointsService.getPointsData();
    }
}