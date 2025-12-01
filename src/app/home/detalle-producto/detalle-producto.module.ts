import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Routes, RouterModule } from '@angular/router';
import { DetalleProductoComponent } from './detalle-producto.component';

const routes: Routes = [
  {
    path: '',
    component: DetalleProductoComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
})
export class DetalleProductoModule {}
