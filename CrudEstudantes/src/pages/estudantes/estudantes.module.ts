import {NgModule} from '@angular/core';
import {EstudantesRoutingModule} from './estudantes-routing.module';
import {EstudanteListComponent} from './estudante-list/estudante-list.component';
import {EstudanteFormComponent} from './estudante-form/estudante-form.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [
        EstudanteListComponent,
        EstudanteFormComponent
    ],
    imports: [
        SharedModule,
        EstudantesRoutingModule
    ]
})
export class EstudantesModule {
}
