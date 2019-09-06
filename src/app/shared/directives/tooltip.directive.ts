import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[tooltip]',
    exportAs: 'tooltipDir'
})
export class TooltipDirective {
    @Input('tooltip') tooltipTitle: string;
    @Input() placement: string;
    @Input() delay: string;
    @Input("custom-width") custom: string;
    tooltip: HTMLElement;
    // 호스트 요소와 tooltip 요소 간의 거리
    @Input() offset: number = 2;
    @Input() offsetLeft: number = 10;
    constructor(private el: ElementRef, private renderer: Renderer2) { 
    }

    @HostListener('mouseenter', ['$event']) onMouseEnter(e) {     
        if (!this.tooltip) { this.show(e); }       
    }

    @HostListener('mouseleave', ['$event.target']) onMouseLeave(e) {
        if (this.tooltip) {
            this.hide(); 
        }
    }

    show(e?) {   
        this.create();
        this.setPosition(e);
        this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
    }

    hide() {
        if (this.tooltip) {
            this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
            window.setTimeout(() => {
                this.renderer.removeChild(document.body, this.tooltip);
                this.tooltip = null;
            }, parseInt(this.delay));
        }
    }

    create() {
        this.tooltip = this.renderer.createElement('span');
        this.renderer.appendChild(
            this.tooltip,
            this.renderer.createText(this.tooltipTitle) // textNode
        );

        this.renderer.appendChild(document.body, this.tooltip);

        this.renderer.addClass(this.tooltip, 'ng-tooltip');
        this.renderer.addClass(this.tooltip, `ng-tooltip-${this.placement}`);

        // delay 설정
        this.renderer.setStyle(this.tooltip, '-webkit-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, '-moz-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, '-o-transition', `opacity ${this.delay}ms`);
        this.renderer.setStyle(this.tooltip, 'transition', `opacity ${this.delay}ms`);
    }

    setPosition(e) {
        // 호스트 요소의 사이즈와 위치 정보
        let el: HTMLElement = this.el.nativeElement;
        const hostPos = el.parentElement.getBoundingClientRect();
        this.tooltip.style.width = hostPos.width - 20 + 'px';
        // tooltip 요소의 사이즈와 위치 정보
        const tooltipPos = this.tooltip.getBoundingClientRect();

        // window의 scroll top
        // getBoundingClientRect 메소드는 viewport에서의 상대적인 위치를 반환한다.
        // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        let top, left;
        if (this.placement === 'top') {
            top = hostPos.top - tooltipPos.height - this.offset;

            
            left = hostPos.left + (hostPos.width - tooltipPos.width) - this.offsetLeft;

        }

        if (this.placement === 'custom-top') {
            this.tooltip.style.width = 200 + "px";
   
            if (document.documentElement.clientWidth >= 768) {
                top = e.target.getBoundingClientRect().bottom;
                left = e.target.getBoundingClientRect().left - 178;
            }
            else {
                top = e.target.getBoundingClientRect().bottom;
                left = e.target.getBoundingClientRect().left - 178;
            }
            this.renderer.addClass(this.tooltip, 'custom-top');
        }       
        if (this.placement === 'bottom') {
            top = hostPos.top + 30;
            left = hostPos.left + (hostPos.width - tooltipPos.width) - this.offsetLeft;


        }
        // if (this.placement === 'left') {
        //   top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        //   left = hostPos.left - tooltipPos.width - this.offset;
        // }

        // if (this.placement === 'right') {
        //   top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        //   left = hostPos.right + this.offset;
        // }

        // 스크롤이 발생한 경우, tooltip 요소의 top에 세로 스크롤 좌표값을 반영하여야 한다.
        this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
        this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    }
}
