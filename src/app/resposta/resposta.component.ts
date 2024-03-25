import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../service/usuario-service';
import { ChamadoService } from '../service/chamado-service';
import { Chamado } from '../models/chamado';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'resposta',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, NgIf, HttpClientModule, NgxPaginationModule],
  providers: [UsuarioService,ChamadoService],
  templateUrl: './resposta.component.html',
  styleUrl: './resposta.component.css'
})
export class RespostaComponent {

  mostrarModalResp : boolean = false;
  addRespostaForm: FormGroup;
  listaDeChamados: Chamado[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  idChamado: number=0;
  assunto?:string;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private chamadoService: ChamadoService
  ) {
    this.addRespostaForm = this.fb.group({
      resposta: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.pesquisaPorAdmin();
  }

  pesquisaPorAdmin() {
    const token = this.usuarioService.getToken();
    return this.chamadoService.pesquisaPorAdmin(token)
      .pipe(
        tap(chamado => {
          console.log('Lista de chamados:', chamado);
          this.listaDeChamados = chamado;
        }),
        catchError(error => {
          if (error.status === 401) {
            console.error('Login failed (401): Invalid credentials');
            alert('Falha (401): Credencial Invalida');
            return of(error);
          } else {
            console.error('Chamda error:', error);
            alert('Ocorreu um erro inesperado, tente mais tarde');
            return of(error);
          }
        })
      ).subscribe(); 
  }

  onSubmitResp(){
    const resposta = this.addRespostaForm.get('resposta')?.value;
    const idAdmin = this.usuarioService.getId();
    const idChamado = this.idChamado;
    const token = this.usuarioService.getToken();
    this.chamadoService.inserirResposta(idChamado, idAdmin, resposta,token)
      .subscribe({
        next: (res) => {
          console.log(res);
          console.log('Chamado inserido com sucesso!');
          alert('Chamado inserido com sucesso!');
            this.addRespostaForm.reset();
            this.fecharResp();
            this.pesquisaPorAdmin();
        },
        error: (e) => {
          alert(e.error.message);
        }
      });
  }

  abrirResp(id:number, assunto:string): void{
    this.assunto = assunto;
    this.idChamado = id;
    this.mostrarModalResp=true;
  }

  fecharResp(): void{
    this.assunto = "";
    this.idChamado = 0;
    this.mostrarModalResp=false;
  }
  
}
