import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl: string = 'http://localhost:8080/'; 
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  login(email: string, senha: string): Observable<Usuario> {
    const body = { email, senha }; 
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<Usuario>(this.apiUrl + 'api/auth/login', body, {headers: headers})
      .pipe(map(response => response));
  }
  //usuario/login
  //
  setId(id: string): void {
    localStorage.setItem('id', id);
  }

  getId(): string {
    const id = localStorage.getItem('id');
    return id || '';
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    return token || '';
  }
}
