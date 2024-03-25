import { RouterModule, Routes } from '@angular/router';
import { ChamadoComponent } from './chamado/chamado.component';
import { LoginComponent } from './login/login.component';
import { RespostaComponent } from './resposta/resposta.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'chamado', component: ChamadoComponent},
    { path: 'resposta', component: RespostaComponent},
];

