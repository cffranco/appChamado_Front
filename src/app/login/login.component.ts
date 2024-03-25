import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
    .subscribe({
      next: (res) => {
        if (res && res.perfil && res.id && res.token) {
          this.usuarioService.setToken(res.token);
          this.usuarioService.setId(res.id.toString());
          if(res.perfil=="A"){
            this.router.navigate(['resposta']);
          }else if(res.perfil=="C"){
            this.router.navigate(['chamado']);
          }else {
            this.router.navigate(['']);
          }
        }
      },
      error: (e) => {
        alert(e.error.message);
      }
    });
  }
}
