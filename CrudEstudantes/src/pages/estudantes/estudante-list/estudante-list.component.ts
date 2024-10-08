import {Component, OnInit} from '@angular/core';
import {EstudantesService} from "../shared/estudantes.service";
import {Estudantes} from "../shared/estudantes.model";
import toastr from "toastr"

@Component({
  selector: 'app-estudante-list',
  templateUrl: './estudante-list.component.html',
  styleUrls: ['./estudante-list.component.scss']
})
export class EstudanteListComponent implements OnInit {
  estudantes: Estudantes[];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number = 10;

  constructor(private estudantesService: EstudantesService) {
  }

  ngOnInit(): void {
    this.loadEstudantes();
  }

  loadEstudantes(page: number = 0): void {
    this.estudantesService.getAll(page, this.pageSize).subscribe(
      response => {
        this.estudantes = response.estudantes;  // Supondo que a resposta tenha um campo 'data' com os estudantes
        this.totalPages = response.total_pages;  // Supondo que a resposta tenha um campo 'totalPages'
      },
      error => alert('Erro ao carregar a lista!')
    );
  }

  deleteUser(estudante) {
    const mustDelete = confirm(`Deseja realmente excluir este estudante "${estudante.nome}" ?`);

    if (mustDelete) {
      toastr.success("Estudante excluído com sucesso!");
      this.estudantesService.delete(estudante.id).subscribe(
        () => this.estudantes = this.estudantes.filter(element => element != estudante),
        () => alert('Erro ao tentar excluir')
      )
    }
  }

  // Métodos para navegação entre páginas
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEstudantes(this.currentPage + 8);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEstudantes(this.currentPage);
    }
  }
}