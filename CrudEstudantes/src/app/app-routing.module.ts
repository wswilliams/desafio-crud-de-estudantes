import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'estudantes', loadChildren: () => import('../pages/estudantes/estudantes.module').then(m => m.EstudantesModule) },
  { path: '', redirectTo: '/estudantes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
