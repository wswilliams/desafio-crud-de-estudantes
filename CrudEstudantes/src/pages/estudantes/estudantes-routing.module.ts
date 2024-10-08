import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EstudanteListComponent} from "./estudante-list/estudante-list.component";
import {EstudanteFormComponent} from "./estudante-form/estudante-form.component";

const routes: Routes = [
  {path: '', component: EstudanteListComponent},
  {path: 'new', component: EstudanteFormComponent},
  {path: ':id/edit', component: EstudanteFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudantesRoutingModule {
}
