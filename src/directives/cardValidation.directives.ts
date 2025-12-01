import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[cardValidation]'
})
export class cardValidationDirective {

  @Output() sanitizedValueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue: string = this.el.nativeElement.value;
    const sanitizedValue: string = initialValue.replace(/[^0-9]/g, '').slice(0, 16);
    if (initialValue !== sanitizedValue) {
      this.el.nativeElement.value = sanitizedValue;
      this.sanitizedValueChange.emit(sanitizedValue);
      event.stopPropagation();
    }
  }
}
