import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {EstudantesService} from "../shared/estudantes.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Estudantes} from "../shared/estudantes.model";
import {switchMap} from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-estudante-form',
  templateUrl: './estudante-form.component.html',
  styleUrls: ['./estudante-form.component.scss']
})
export class EstudanteFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  estudanteForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm: boolean = false;
  estudante: Estudantes = new Estudantes();
  listaEstados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];


  constructor(
    private estudantesService: EstudantesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEstudantesForm();
    this.loadEstudantes();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle()
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.createEstudantes()
    else
      this.updateEstudantes()
  }

  //PRIVATE METHODS

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Estudantes'
    else {
      const estudanteName = this.estudante.nome || ''
      this.pageTitle = 'Editando o Estudantes: ' + estudanteName;
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  private buildEstudantesForm() {
    this.estudanteForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.minLength(5)]],
      idade: [null, [Validators.required]],
      curso: [null, [Validators.required]]
    })

  }

  private loadEstudantes() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.estudantesService.getById(Number(params.get("id"))))
      )
        .subscribe(
          (estudante) => {
            this.estudante = estudante;
            this.estudanteForm.patchValue(estudante); // set values on form
          },
          (error) => alert('Ocorreu um error no servidor, tente mais tarde!')
        )
    }
  }

  private createEstudantes() {
    const estudante: Estudantes = Object.assign(new Estudantes(), this.estudanteForm.value)
    estudante.id = this.getIdNext();
    this.estudantesService.create(estudante)
      .subscribe(
        estudante => this.actionsForSuccess(estudante),
        error => this.actionsForError(error)
      )
  }

  private getIdNext(): number {
    const estudantes: Estudantes[] = JSON.parse(localStorage.getItem("estudante"))
    return (estudantes && estudantes.length > 0) ? Math.max(...estudantes.map(estudante => estudante.id)) + 1 : 1;
  }

  private updateEstudantes() {
    const estudante: Estudantes = Object.assign(new Estudantes(), this.estudanteForm.value)
    const mustUpdate = confirm(`Deseja realmente atualizar este estudantes "${estudante.nome}" ?`);

    if (mustUpdate) {
      this.estudantesService.update(estudante).subscribe(
        estudante => this.actionsForSuccess(estudante),
        error => this.actionsForError(error)
      )
    }
  }

  private actionsForSuccess(estudante: Estudantes): void {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl('estudantes', {skipLocationChange: true}).then(
      () => this.router.navigate(['estudantes', estudante.id, 'edit'])
    )
  }

  private actionsForError(error: any): void {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;
    console.error(error);
    if (error.status === 422)
      this.serverErrorMessage = error;
    else
      this.serverErrorMessage = ["Falha na comunicação com o servidor. Por favor, tente mais tarde!"]
  }
}
