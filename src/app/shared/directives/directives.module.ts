import { NgModule } from "@angular/core";
import { OnlyNumber } from './onlyNumbers';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
    declarations: [OnlyNumber, TooltipDirective],
    exports: [OnlyNumber, TooltipDirective]
})
export class DirectivesModule {
    
}