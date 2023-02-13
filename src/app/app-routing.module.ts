import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Guards/auth.guard';

import { FrmLoginComponent } from './Pantallas/frm-login/frm-login.component';
import { FrmPrincipalComponent } from './Pantallas/frm-principal/frm-principal.component';
import { FrmOfertaBuscarComponent } from './Pantallas/frm-oferta-buscar/frm-oferta-buscar.component';
import { FrmOfertaImportarComponent } from './Pantallas/frm-oferta-importar/frm-oferta-importar.component'
import { FrmOfertaDetallesComponent } from './Pantallas/frm-oferta-detalles/frm-oferta-detalles.component';
import { FrmPlanificadorComponent } from './Pantallas/frm-planificador/frm-planificador.component';
import { FrmPruebasComponent } from './Pantallas/frm-pruebas/frm-pruebas.component';
import { FrmCompraBuscarComponent } from './Pantallas/Compras/frm-compra-buscar/frm-compra-buscar.component';
import { FrmCompraImportarComponent } from './Pantallas/Compras/frm-compra-importar/frm-compra-importar.component';
import { FrmVentasImportarComponent } from './Pantallas/Ventas/frm-ventas-importar/frm-ventas-importar.component';
import { FrmUsuarioBuscarComponent } from './Pantallas/Usuarios/frm-usuario-buscar/frm-usuario-buscar.component';
import { FrmUsuarioComponent } from './Pantallas/Usuarios/frm-usuario/frm-usuario.component';
import { FrmArticulosStockComponent } from './Pantallas/frm-articulos-stock/frm-articulos-stock.component';
import { FrmIncidenciaComponent } from './Pantallas/frm-incidencia/frm-incidencia.component';

const routes: Routes = [
  { path: '', component: FrmLoginComponent },
  { path: 'inicio', component: FrmPrincipalComponent, canActivate: [AuthGuard] },
  { path: 'lista_ofertas', component: FrmOfertaBuscarComponent, canActivate: [AuthGuard] },
  { path: 'importar_oferta', component: FrmOfertaImportarComponent, canActivate: [AuthGuard] },
  { path: 'detalles_oferta', component: FrmOfertaDetallesComponent, canActivate: [AuthGuard] },
  { path: 'planificador', component: FrmPlanificadorComponent, canActivate: [AuthGuard] },
  
  { path: 'compra_buscar', component: FrmCompraBuscarComponent, canActivate: [AuthGuard] },
  { path: 'compra_importar', component: FrmCompraImportarComponent, canActivate: [AuthGuard] },
  { path: 'venta_importar', component: FrmVentasImportarComponent, canActivate: [AuthGuard] },
  { path: 'usuario_buscar', component: FrmUsuarioBuscarComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: FrmUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'ariculos_stock', component: FrmArticulosStockComponent, canActivate: [AuthGuard] },
  { path: 'incidencia', component: FrmIncidenciaComponent, canActivate: [AuthGuard] },

  { path: 'pruebas', component: FrmPruebasComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
