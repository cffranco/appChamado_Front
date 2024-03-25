import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Chamado } from '../models/chamado';

@Injectable({
  providedIn: 'root'
})
export class ChamadoService {

  private apiUrl: string = 'http://localhost:8080/'; // Insira a URL da sua API
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  pesquisaPorCliente(idCliente: string, idChamado: string, assunto: string, token: string): Observable<Chamado[]> {
    const body = { idCliente, idChamado, assunto }; 
    const headers = new HttpHeaders({'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Chamado[]>(this.apiUrl + 'chamado/pesquisar', body, {headers: headers})
    .pipe(map(response => response));
  }

  pesquisaPorAdmin(token: string): Observable<Chamado[]> { 
    const headers = new HttpHeaders({'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

    return this.http.post<Chamado[]>(this.apiUrl + 'chamado/pesquisarAdmin', {headers: headers})
    .pipe(map(response => response));
  }

  inserirChamado(idCliente: string, assunto: string,token: string): Observable<any> {
    const body = { idCliente, assunto }; 
    const headers = new HttpHeaders({'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
    return this.http.post<Chamado>(this.apiUrl + 'chamado/salva', body, {headers: headers})
    .pipe(map(response => response));
  }

  inserirResposta(id: number, idAdmin: string, resposta: string, token: string): Observable<any> {
    const body = { id, idAdmin, resposta }; 
    const headers = new HttpHeaders({'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
    return this.http.put<Chamado>(this.apiUrl + 'chamado/resposta', body, {headers: headers})
    .pipe(map(response => response));
  }

  inserirNota(id: number, avaliacao: string,token: string): Observable<any> {
    const body = { id, avaliacao }; 
    const headers = new HttpHeaders({'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });
    return this.http.put<Chamado>(this.apiUrl + 'chamado/avaliar', body, {headers: headers})
    .pipe(map(response => response));
  }

}
