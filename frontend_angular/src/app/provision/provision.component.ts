import { Component, OnInit } from '@angular/core';
import { ProvisionService } from '../provision.service';
import { BookingService } from '../booking.service';
import { UserService } from '../user.service';
import { Provision } from '../provision.model';
import { Booking } from '../booking.model';
import { ReviewService } from '../review.service';
import { Review } from '../review.model';

@Component({
  selector: 'app-provision',
  templateUrl: './provision.component.html',
  styleUrls: ['./provision.component.css']
})
export class ProvisionComponent implements OnInit {
  provisions: Provision[] = [];
  bookings: Booking[] = [];
  reviews: { [provisionId: number]: Review[] } = {};
  newReview: { rating: number; comment: string } = { rating: 0, comment: '' };
  visibleReviews: { [provisionId: number]: boolean } = {};
  newProvision: Provision = {
    provisionId: 0,
    name: '',
    description: '',
    price: 0,
    duration: 0,
    provider: '',
    userId: 0,
  };
  userRole: string = '';
  bookingMessage: string = '';
  messageClass: string = '';
  messageVisible: boolean = false;
  showForm: boolean = false;
  showReviewForm: { [provisionId: number]: boolean } = {};
  filters = {
    name: '',
    minPrice: 0,
    maxPrice: 0,
    provider: ''
  };
  
  filteredProvisions: Provision[] = [];
  showDetailedFilters = false;
  

  constructor(
    private provisionService: ProvisionService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getProvisions();
    this.setUserRole();
    this.loadBookings();
    this.updateReviewData();
  }
  

  isLoggedIn(): boolean {
    return !!this.userService.getCurrentUser();
  }

  getProvisions(): void {
    this.provisionService.getAllProvisions().subscribe(
      (data: Provision[]) => {
        console.log(data)
        this.provisions = data;
        this.filteredProvisions = [...this.provisions];
      
        this.updateReviewData(); 
      },
      (error) => {
        console.error('Hiba történt a hirdetések lekérésekor:', error);
      }
    );
  }
  
  

  setUserRole(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.userRole = currentUser.role;
    }
  }

  loadBookings(): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;

    this.bookingService.getBookingsByUserId(currentUser.userId).subscribe(
      (data: Booking[]) => {
        this.bookings = data;
      },
      (error) => {
        console.error('Hiba a foglalások betöltése során:', error);
      }
    );
  }

  createProvision(): void {
    const currentUser = this.userService.getCurrentUser();
    this.newProvision.userId = currentUser?.userId || 0;
  
    
    const formData = new FormData();
    formData.append('name', this.newProvision.name);
    formData.append('description', this.newProvision.description);
    formData.append('price', this.newProvision.price.toString());
    formData.append('duration', this.newProvision.duration.toString());
    formData.append('provider', this.newProvision.provider);
    formData.append('userId', this.newProvision.userId.toString());
  
 
    if (this.newProvision.imageUrl) {
      formData.append('image', this.newProvision.imageUrl);
    }
  
  
    this.provisionService.createProvision(formData).subscribe(
      (createdProvision) => {
        console.log('Új hirdetés létrehozva:', createdProvision);
        this.provisions.push(createdProvision);
        this.newProvision = {
          name: '',
          description: '',
          price: 0,
          duration: 0,
          provider: '',
          userId: 0,
        };
        this.showForm = false; 
      },
      (error) => {
        console.error('Hiba történt a hirdetés létrehozása során:', error);
      }
    );
  }
  
  isProvisionBooked(provisionId: number | undefined): boolean {
    if (provisionId === undefined) {
      return false;
    }
    return this.bookings.some((booking) => booking.provisionId === provisionId);
  }



  isReviewVisible(provisionId: number | undefined): boolean {
    return provisionId !== undefined && !!this.visibleReviews[provisionId];
  }

  createBooking(provision: Provision): void {
    if (!provision.provisionId) {
      console.error('Hiba: provisionId nem érhető el!');
      return;
    }

    const currentUser = this.userService.getCurrentUser();
    const userId = currentUser?.userId;
    const provisionId = provision.provisionId;

    if (userId && provisionId) {
      this.bookingService.createBooking(userId, provisionId).subscribe(
        (newBooking: Booking) => {
          console.log('Foglalás létrehozva:', newBooking);
          this.bookings.push(newBooking);
          this.bookingMessage = 'Sikeres foglalás!';
          this.messageClass = 'alert-success';
          this.messageVisible = true;

          setTimeout(() => {
            this.messageVisible = false;
          }, 3000);
        },
        (error) => {
          console.error('Hiba történt a foglalás során:', error);
          this.bookingMessage = 'Hiba történt a foglalás során!';
          this.messageClass = 'alert-danger';
          this.messageVisible = true;

          setTimeout(() => {
            this.messageVisible = false;
          }, 3000);
        }
      );
    } else {
      console.error('Nincs bejelentkezett felhasználó vagy provision ID hiányzik');
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  toggleReviewForm(provisionId: number): void {
    this.showReviewForm[provisionId] = !this.showReviewForm[provisionId];
  }
  
  toggleReviews(provisionId: number): void {
    this.visibleReviews[provisionId] = !this.visibleReviews[provisionId];
    if (this.visibleReviews[provisionId] && !this.reviews[provisionId]) {
      this.loadReviews(provisionId);
    }
  }
  
  
  loadReviews(provisionId: number): void {
    this.reviewService.getReviewsByProvisionId(provisionId).subscribe({
      next: (data: Review[]) => {
        this.reviews[provisionId] = data || [];
      },
      error: (error) => {
        console.error(`Hiba történt a vélemények lekérésekor (${provisionId}):`, error);
      }
    });
  }
  
  

  createReview(provisionId: number): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      console.error('Nincs bejelentkezett felhasználó!');
      return;
    }
  
    const { rating, comment } = this.newReview;
    if (!rating || !comment.trim()) {
      alert('Az értékelés és megjegyzés mezők kitöltése kötelező!');
      return;
    }
  
    this.reviewService.createReview(currentUser.userId, provisionId, rating, comment).subscribe({
      next: (review: Review) => {
   
        this.loadReviews(provisionId);
  
    
        this.newReview = { rating: 0, comment: '' };
        alert('Értékelés sikeresen mentve!');
      },
      error: (err) => {
        console.error('Hiba történt az értékelés mentése során:', err);
        alert('Hiba történt az értékelés mentésekor.');
      }
    });
  }
  
  
  
  calculateAverageRating(provisionId: number): string {
    const provisionReviews = this.reviews[provisionId];
    if (!provisionReviews || provisionReviews.length === 0) {
      return 'Nincs értékelés';
    }
  
    const totalRating = provisionReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / provisionReviews.length;
  
   
    return Number.isInteger(averageRating) ? `${averageRating}/5` : `${averageRating.toFixed(1)}/5`;
  }
  
  updateReviewData(): void {
    this.provisions.forEach((provision) => {
      const provisionId = provision.provisionId!;
      if (provisionId) {
        this.reviewService.getReviewsByProvisionId(provisionId).subscribe(
          (data: Review[]) => {
            this.reviews[provisionId] = data || [];
          },
          (error) => {
            console.error(`Hiba történt az értékelések frissítésekor (${provisionId}):`, error);
            this.reviews[provisionId] = []; 
          }
        );
      }
    });
  }

 applyFilters(): void {
  this.filteredProvisions = this.provisions.filter((provision) => {
    const matchesName = this.filters.name
      ? provision.name.toLowerCase().includes(this.filters.name.toLowerCase())
      : true;

    const matchesMinPrice = this.filters.minPrice
      ? provision.price >= this.filters.minPrice
      : true;

    const matchesMaxPrice = this.filters.maxPrice
      ? provision.price <= this.filters.maxPrice
      : true;

    const matchesProvider = this.filters.provider
      ? provision.provider.toLowerCase().includes(this.filters.provider.toLowerCase())
      : true;

    return matchesName && matchesMinPrice && matchesMaxPrice && matchesProvider;
  });
}

 resetFilters(): void {
  this.filters = {
    name: '',
    minPrice: 0,
    maxPrice: 0,
    provider: ''
  };
  this.filteredProvisions = [...this.provisions]; 
}


  toggleDetailedFilters(): void {
    this.showDetailedFilters = !this.showDetailedFilters;
  }
  

}
