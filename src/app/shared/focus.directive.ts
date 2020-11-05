import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusMe]'
})
export class FocusMeDirective {
    constructor(el: ElementRef) {
      setTimeout(()=>{
        el.nativeElement.focus();
      },500);
    }
}