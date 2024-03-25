import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsuarioService } from '../service/usuario-service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, HttpClientModule],
  providers: [UsuarioService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

   }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    const email = this.loginForm.get('email')?.value;
    const senha = this.loginForm.get('senha')?.value;
  
    this.usuarioService.login(email, senha)
      .pipe(
        tap(usuario => { 
          if (usuario && usuario.perfil && usuario.id && usuario.token) {
            this.usuarioService.setToken(usuario.token);
            this.usuarioService.setId(usuario.id.toString());
            if(usuario.perfil=="A"){
              this.router.navigate(['resposta']);
            }else if(usuario.perfil=="C"){
              this.router.navigate(['chamado']);
            }else {
              this.router.navigate(['']);
            }

          }
        }),
        catchError(error => {
          if (error.status === 401) {
            console.error('Login failed (401): Invalid credentials');
            alert('Login ou Senha invalida!');
            this.loginForm.reset();
            return of(error); 
          } else {
            console.error('Login error:', error);
            alert('Ocorreu um erro inesperado, tente mais tarde');
            this.loginForm.reset();
            return of(error); 
          }
        })
      )
      .subscribe();
      }
}
