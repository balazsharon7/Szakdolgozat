import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';

import { BookingsComponent } from './bookings/bookings.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ProvisionComponent } from './provision/provision.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Kis Vállalkozó Portál' },
  { path: 'login', component: LoginComponent, title: 'Bejelentkezés' },
  { path: 'register', component: RegisterComponent, title: 'Regisztráció' },
  { path: 'provision', component: ProvisionComponent, title: 'Hirdetések', canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, title: 'Foglalások', canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, title: 'Üzenetek', canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, title: 'Profilom', canActivate: [AuthGuard] },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
