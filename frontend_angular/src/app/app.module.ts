import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeHu from '@angular/common/locales/hu';
import { registerLocaleData } from '@angular/common';
import { BookingsComponent } from './bookings/bookings.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProvisionComponent } from './provision/provision.component';
import { HomeComponent } from './home/home.component';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { CalendarModule as PrimeNgCalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

registerLocaleData(localeHu);

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    BookingsComponent,
    MessagesComponent,
    ProfileComponent,
    LoginComponent,
    NavbarComponent,
    ProvisionComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    CalendarModule,
    PrimeNgCalendarModule, 
    ButtonModule,         
    InputTextModule,      
    DropdownModule,       
    DialogModule,         
    ToastModule,           
    TableModule,          
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'hu' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  bootstrap: [AppComponent],
})
export class AppModule {}
