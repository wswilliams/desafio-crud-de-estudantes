import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Estudantes } from './estudantes.model';

@Injectable({
  providedIn: 'root'
})
export class EstudantesService {

  // Alterado para URL externa do backend
  private apiPath: string = "http://0.0.0.0:8003/estudantes"; 

  constructor(private http: HttpClient) { }

  getAll(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiPath}?limit=${pageSize}&offset=${page}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(response => response)  // Ajustado para lidar com o formato da resposta paginada
    );
  }

  getById(id: number): Observable<Estudantes> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEstudante)
    );
  }

  create(estudante: Estudantes): Observable<Estudantes> {
    return this.http.post(this.apiPath, estudante).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEstudante)
    );
  }

  update(estudante: Estudantes): Observable<Estudantes> {
    const url = `${this.apiPath}/${estudante.id}`;

    return this.http.put(url, estudante).pipe(
      catchError(this.handleError),
      map(() => estudante)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  //Private Methods
  private jsonDataToEstudantes(jsonData: any[]): Estudantes[] {
    const estudantes: Estudantes[] = [];
    jsonData.forEach(element => estudantes.push(element as Estudantes));
    return estudantes;
  }

  private jsonDataToEstudante(jsonData: any): Estudantes {
    return jsonData as Estudantes;
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return throwError(error);
  }
}