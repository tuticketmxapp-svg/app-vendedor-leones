import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[phoneNumber]'
})
export class phoneNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue: string = this.el.nativeElement.value;
    const sanitizedValue: string = initialValue.replace(/[^0-9]/g, '').slice(0, 10);
    
    if (initialValue !== sanitizedValue) {
      this.el.nativeElement.value = sanitizedValue;
      event.stopPropagation();
    }
  }
}