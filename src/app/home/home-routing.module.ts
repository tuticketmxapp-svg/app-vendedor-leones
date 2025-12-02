import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,

  },
  {
    path: 'producto',
    loadChildren: () => import('./detalle-producto/detalle-producto.module').then((m) => m.DetalleProductoModule),
  },
  {
    path: 'detalleCompra',
    canActivate: [AuthGuard],
    loadChildren: () => import('./detalle-compra/detalle-compra.module').then((m) => m.DetalleCompraModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
