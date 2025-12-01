import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
//import { MenuComponent } from './shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.page';


@NgModule({
  declarations: [
    MenuComponent,
  ],
  exports: [
    MenuComponent,
  ],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 

})
export class SharedModule { }
