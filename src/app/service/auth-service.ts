import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = 'http://localhost:8000/'; 
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  login(email: string, senha: string): Observable<Usuario> {
    const body = { email, senha }; 
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<Usuario>(this.apiUrl + 'api/auth/login', body, httpOptions)
      .pipe(map(response => response));
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    const token = localStorage.getItem('token');
    return token || '';
  }

  setPerfil(perfil: string): void {
    localStorage.setItem('perfil', perfil);
  }

  getPerfil(): string {
    const perfil = localStorage.getItem('perfil');
    return perfil || '';
  }

  setId(id: string): void {
    localStorage.setItem('id', id);
  }

  getId(): string {
    const id = localStorage.getItem('id');
    return id || '';
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
