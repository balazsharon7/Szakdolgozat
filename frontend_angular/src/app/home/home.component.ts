import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { StatisticsService } from '../statistics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string = '';
  userRole: string = ''; 
  statistics: { totalProvisions: number; totalBookings: number; totalMessages: number } = {
    totalProvisions: 0,
    totalBookings: 0,
    totalMessages: 0
  };

  constructor(
    private userService: UserService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.loadStatistics();
  }

  checkLoginStatus(): void {
    const currentUser = this.userService.getCurrentUser();
    this.isLoggedIn = !!currentUser;

    if (currentUser) {
      this.username = currentUser.uname;
      this.userRole = currentUser.role; 
    }
  }

  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe(
      (data) => {
        this.statistics = data;
      },
      (error) => {
        console.error('Hiba történt a statisztikai adatok lekérésekor:', error);
      }
    );
  }
}
