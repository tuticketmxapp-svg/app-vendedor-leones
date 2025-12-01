import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTwoDigitInput]'
})
export class TwoDigitInputDirective {
  @Output() sanitizedValueExpiration: EventEmitter<string> = new EventEmitter<string>();
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    const sanitizedValue: string = initialValue.replace(/[^0-9]/g, '').slice(0, 2);
    if (initialValue !== sanitizedValue) {
      this.el.nativeElement.value = sanitizedValue;
      this.sanitizedValueExpiration.emit(sanitizedValue);
      event.stopPropagation();
    }
  }
}
