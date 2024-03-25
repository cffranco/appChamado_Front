import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../service/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChamadoService } from '../service/chamado-service';
import { catchError, of, tap } from 'rxjs';
import { Chamado } from '../models/chamado';
import { UsuarioService } from '../service/usuario-service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'chamado',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, NgIf, HttpClientModule, NgxPaginationModule],
  providers: [UsuarioService,ChamadoService],
  templateUrl: './chamado.component.html',
  styleUrl: './chamado.component.css'
})
export class ChamadoComponent {

  mostrarModalAdd : boolean = false;
  mostrarModalAval : boolean = false;
  listaDeChamados: Chamado[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  idChamado: number =0;
  regexPattern = '[1-9]|10';
  assunto:string ="";
  resposta:string="";

  avaliarChamadoForm: FormGroup;
  addChamadoForm: FormGroup;
  pesquisarChamadoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private chamadoService: ChamadoService
  ) {
    this.avaliarChamadoForm = this.fb.group({
      nota: ['', [Validators.required,Validators.pattern(this.regexPattern)]]
    });
    this.addChamadoForm = this.fb.group({
      assunto: ['', [Validators.required]]
    });
    this.pesquisarChamadoForm = this.fb.group({
      assuntoFiltro: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.pesquisaPorCliente(this.usuarioService.getId(),this.usuarioService.getToken(), "", "");
  }

  pesquisaPorCliente(idCliente : string, token: string, idChamada : string, assunto: string) {
    return this.chamadoService.pesquisaPorCliente(idCliente, idChamada, assunto,token)
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

  abrirAdd(): void{
    this.mostrarModalAdd=true;
  }

  fecharAdd(): void{
    this.mostrarModalAdd=false;
  }
 
  abrirAval(id:number,assunto:string,resposta:string): void{
    this.assunto = assunto;
    this.resposta = resposta;
    this.idChamado =id;
    this.mostrarModalAval=true;
  }

  fecharAval(): void{
    this.mostrarModalAval=false;
  }

  onSubmitNota(){
    const nota = this.avaliarChamadoForm.get('nota')?.value;
    const idChamado = this.idChamado;
    const token = this.usuarioService.getToken()
    this.chamadoService.inserirNota(idChamado, nota,token)
      .subscribe({
        next: (res) => {
          console.log(res);
          console.log('Chamado inserido com sucesso!');
          alert('Chamado inserido com sucesso!');
            this.avaliarChamadoForm.reset();
            this.fecharAval();
            this.pesquisaPorCliente(this.usuarioService.getId(),this.usuarioService.getToken(), "", "");
        },
        error: (e) => {
          alert(e.error.message);
        }
      });
  }

  onSubmitAdd(){
    const assunto = this.addChamadoForm.get('assunto')?.value;
    const idCliente = this.usuarioService.getId();
    const token = this.usuarioService.getToken()
    this.chamadoService.inserirChamado(idCliente, assunto, token)
      .subscribe({
        next: (res) => {
          console.log(res);
          console.log('Chamado inserido com sucesso!');
          alert('Chamado inserido com sucesso!');
            this.addChamadoForm.reset();
            this.fecharAdd();
            this.pesquisaPorCliente(this.usuarioService.getId(),this.usuarioService.getToken(), "", "");
        },
        error: (e) => alert(e.error.message)
      });
  }
  onSubmitPesquisar(){
    const idCliente = this.usuarioService.getId();
    const token =this.usuarioService.getToken();
    const assuntoFiltro = this.pesquisarChamadoForm.get('assuntoFiltro')?.value;
    if(assuntoFiltro==""){
      this.pesquisaPorCliente(idCliente, token, "", "");
    }else if(/^\d+$/.test(assuntoFiltro)){
       this.pesquisaPorCliente(idCliente,token, assuntoFiltro,"");
    }else{
      this.pesquisaPorCliente(idCliente,token, "",assuntoFiltro);
    }
  }
}
