import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  userBookingCount: number = 0;
  constructor(public userService: UserService, private router: Router) {}

  
  isLoggedIn(): boolean {
  return this.userService.isLoggedIn();
}

  
isBusinessUser(): boolean {
  const user = this.userService.getCurrentUser();
  return !!(user && user.role === 'BUSINESS'); 
}

isCostumerUser(): boolean {
  const user = this.userService.getCurrentUser();
  return !!(user && user.role === 'CUSTOMER'); 
}

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
