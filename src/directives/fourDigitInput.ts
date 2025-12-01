import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[fourDigitInput]'
})
export class fourDigitInputDirective {
  @Output() sanitizedValueCvv: EventEmitter<string> = new EventEmitter<string>();
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    const sanitizedValue: string =initialValue.replace(/[^0-9]/g, '').slice(0, 4);
    if (initialValue !== sanitizedValue) {
      this.el.nativeElement.value = sanitizedValue;
      this.sanitizedValueCvv.emit(sanitizedValue);
      event.stopPropagation();
    }
  }
}
