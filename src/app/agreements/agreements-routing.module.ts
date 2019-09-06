import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { UserAgreementResolveService, PublicContractResolveService } from './agreements.service';
import { PublicSalesContractComponent } from './public-sales-contract/public-sales-contract.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "public-sales-contract",
    pathMatch: "full",
  },
  {
    path: "user-agreement",
    component: UserAgreementComponent,
    data: {
      title: 'Пользовательский договор'
    },
      resolve: {
      userAgreement: UserAgreementResolveService 
    }
  },
  {
    path: "public-sales-contract",
    component: PublicSalesContractComponent,
    data: {
      title: 'Публичный договор купли-продажи'
    },
    resolve: {
      publicContract: PublicContractResolveService 
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementsRoutingModule { }
