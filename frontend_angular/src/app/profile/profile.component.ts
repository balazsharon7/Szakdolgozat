import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ProvisionService } from '../provision.service'; 
import { Provision } from '../provision.model'; 
import { Booking } from '../booking.model';
import { BookingService } from '../booking.service';
import { ReviewService } from '../review.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username: string = '';
  role: string = '';
  provisions: Provision[] = []; 
  selectedProvision: Provision | null = null; 
  currentUserId: number | null = null; 
  notificationClass: string = ''; 
  isAddingProvision: boolean = false;
  bookingsByProvision: { [key: number]: Booking[] } = {}; 
  bookingsAsCreator: Booking[] = [];
  selectedDate: Date | null = null; 
  selectedBooking: Booking | null = null; 
  finalizeDate: Date | null = null; 
  selectedFinalizeBooking: Booking | null = null;
  status:string='';
  finalizedBookings: Booking[] = [];
  showReviewForm: { [key: number]: boolean } = {};
  newReview: { rating: number; comment: string } = { rating: 0, comment: '' };

  profile: { id: number; email: string; password: string; uname: string } = {
    id: 0,
    email: '',
    password: '',
    uname: '',
  };

  newProvision: Provision & { image?: File } = {
    provisionId: 0,
    name: '',
    description: '',
    price: 0,
    duration: 0,
    provider: '',
    userId: 0,
    image: undefined,
  };
  isEditing: boolean = false; 
  notificationMessage: string = '';
  notificationVisible: boolean = false;

  constructor(
    private userService: UserService,
    private provisionService: ProvisionService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.uname;
      this.role = currentUser.role;
      this.currentUserId = currentUser.userId;
  
      this.loadProvisions(this.currentUserId);
      this.loadBookingsAsCreator(this.currentUserId);
  
      if (this.role === 'CUSTOMER') {
        this.loadFinalizedBookings();
      }
    } else {
      this.username = 'Ismeretlen';
      this.role = 'Nincs';
    }
  }
  

  loadFinalizedBookings(): void {
    if (!this.currentUserId) {
      console.error('A felhasználó azonosítója nem elérhető.');
      return;
    }
  
    this.bookingService.getFinalizedBookingsByUserId(this.currentUserId).subscribe({
      next: async (bookings) => {
        try {
          const bookingsWithProvision = await Promise.all(
            bookings.map(async (booking) => {
              if (booking.provisionId) {
                try {
                  const provision = await this.provisionService.getProvisionById(booking.provisionId).toPromise();
                  booking.provision = provision;
                } catch (err) {
                  console.error(`Nem sikerült lekérni a provision ID: ${booking.provisionId}`, err);
                }
              }
              return booking;
            })
          );
          this.finalizedBookings = bookingsWithProvision;
        } catch (err) {
          console.error('Hiba a foglalások feldolgozása során:', err);
        }
      },
      error: (err) => {
        console.error('Hiba történt a véglegesített foglalások lekérésekor:', err);
        this.finalizedBookings = [];
      },
    });
  }
  
  toggleReviewForm(bookingId: number): void {
    this.showReviewForm[bookingId] = !this.showReviewForm[bookingId];
  }

  submitReview(bookingId: number): void {
    const userId = this.userService.getCurrentUser()?.userId;
    const booking = this.finalizedBookings.find(b => b.id === bookingId);
  
    if (!userId || !booking || !booking.provision?.provisionId) {
      alert('Érvénytelen adatok! Nem található a foglalás vagy a hirdetés ID.');
      return;
    }
  
    const provisionId = booking.provision.provisionId;
    const { rating, comment } = this.newReview;
  
    if (!rating || !comment.trim()) {
      alert('Az értékelés és megjegyzés mezők kitöltése kötelező!');
      return;
    }
  
    this.reviewService.createReview(userId, provisionId, rating, comment).subscribe({
      next: (review) => {
        alert('Értékelés sikeresen mentve!');
        this.toggleReviewForm(bookingId);
        this.newReview = { rating: 0, comment: '' }; 
      },
      error: (err) => {
        console.error('Hiba történt az értékelés mentésekor:', err);
        alert('Hiba történt az értékelés mentésekor.');
      },
    });
  }
  
toggleFinalizeForm(booking: any): void {
 
  if (this.selectedFinalizeBooking === booking) {
    this.selectedFinalizeBooking = null;
  } else {
    this.selectedFinalizeBooking = booking;
    this.finalizeDate = booking.bookingTime ? new Date(booking.bookingTime) : null;
  }
}

goToMessages(bookingId: number): void {
  this.router.navigate(['/messages'], { queryParams: { bookingId } });
}


  initializeData(): void {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.uname;
      this.role = currentUser.role;
      this.currentUserId = currentUser.userId;

      this.loadProvisions(currentUser.userId);
    } else {
      this.username = 'Ismeretlen';
      this.role = 'Nincs';
    }
  }

  finalizeBooking(booking: Booking): void {
    this.selectedFinalizeBooking = booking;
    this.finalizeDate = booking.bookingTime ? new Date(booking.bookingTime) : null;
  }
  
  finalizeBookingDate(): void {
    if (!this.selectedFinalizeBooking || !this.finalizeDate) {
      this.showNotification('Dátum és idő kiválasztása kötelező!', 'error');
      return;
    }
  
  
    const newDate = this.finalizeDate.toISOString();
  
    this.bookingService.updateBooking(
      this.selectedFinalizeBooking.id, 
      newDate,                         
      'FINALIZED'                      
    ).subscribe({
      next: () => {
        this.showNotification('Foglalás sikeresen véglegesítve!', 'success');
        this.loadBookingsAsCreator(this.currentUserId!);
        this.cancelFinalize();
      },
      error: () => {
        this.showNotification('Hiba a foglalás véglegesítésekor.', 'error');
      },
    });
  }
  
  
  cancelFinalize(): void {
    this.selectedFinalizeBooking = null;
    this.finalizeDate = null;
  }
  
  

  loadProvisions(userId: number): void {
    this.provisionService.getUserProvisions(userId).subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.provisions = data;
          this.provisions.forEach((provision) => {
            if (provision.provisionId) {
              this.loadBookingsByProvision(provision.provisionId);
            }
          });
        } else {
          this.provisions = [];
        }
      },
      error: (err) => {
        console.error('Hiba történt a hirdetések lekérésekor:', err);
        this.provisions = [];
      },
    });
  }



  editBooking(booking: Booking): void {
    this.selectedBooking = { ...booking };
    this.selectedDate = new Date(booking.bookingTime); 
  }
  

  updateBookingDate(): void {
    if (!this.selectedBooking || !this.selectedDate) {
      this.showNotification('Kérlek válassz ki egy foglalást és egy dátumot!', 'error');
      return;
    }
  
    this.bookingService.updateBookingDate(this.selectedBooking.id, this.selectedDate,this.status).subscribe({
      next: (updatedBooking) => {
        this.showNotification('Foglalás időpontja sikeresen frissítve!', 'success');
        this.loadBookingsAsCreator(this.currentUserId!);
        this.cancelEditBooking();
      },
      error: () => {
        this.showNotification('Hiba a foglalás időpontjának frissítésekor.', 'error');
      },
    });
  }
  
  
  
  cancelEditBooking(): void {
    this.selectedBooking = null;
    this.selectedDate = null;
  }

  toggleEditProfile(): void {
    this.isEditing = !this.isEditing;
  }

  toggleNewProvisionForm(): void {
    this.isAddingProvision = !this.isAddingProvision;
  }

  deleteBooking(bookingId: number, provisionId: number): void {
    if (confirm('Biztosan törölni szeretnéd ezt a foglalást?')) {
      this.bookingService.deleteBooking(bookingId).subscribe({
        next: () => {
          this.loadBookingsAsCreator(this.currentUserId!);
          if (this.bookingsByProvision[provisionId]) {
            this.bookingsByProvision[provisionId] = this.bookingsByProvision[provisionId].filter((b) => b.id !== bookingId);
          }
        },
        error: (err) => {
          console.error('Hiba történt a foglalás törlésekor:', err);
        },
      });
    }
  }

  loadBookingsByProvision(provisionId: number): void {
    this.bookingService.getBookingsByProvisionIdWithUsername(provisionId).subscribe({
      next: (bookings: any[]) => {
        this.bookingsByProvision[provisionId] = bookings.map(booking => ({
          ...booking,
          bookingTime: new Date(booking.bookingTime), 
        }));
      },
      error: (err) => console.error('Hiba történt a foglalások lekérésekor:', err),
    });
  }
  
  loadBookingsAsCreator(creatorUserId: number): void {
    this.bookingService.getBookingsByCreatorUserId(creatorUserId).subscribe({
      next: (bookings: Booking[]) => {
        this.bookingsAsCreator = bookings.map(booking => ({
          ...booking,
          bookingTime: new Date(booking.bookingTime), 
        }));
      },
      error: (err) => console.error('Hiba történt a foglalások lekérésekor:', err),
    });
  }
  
  

  createProvision(): void {
    if (
      !this.newProvision.name ||
      !this.newProvision.description ||
      !this.newProvision.price ||
      !this.newProvision.duration
    ) {
      this.showNotification('Minden mezőt ki kell tölteni!', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.newProvision.name);
    formData.append('description', this.newProvision.description);
    formData.append('price', this.newProvision.price.toString());
    formData.append('duration', this.newProvision.duration.toString());
    formData.append('provider', this.newProvision.provider);
    formData.append('userId', this.currentUserId!.toString());
  
    if (this.newProvision.image) {
      formData.append('image', this.newProvision.image);
    }
  
    this.provisionService.createProvision(formData).subscribe({
      next: (data) => {
        this.provisions.push(data);
        this.newProvision = {
          provisionId: 0,
          name: '',
          description: '',
          price: 0,
          duration: 0,
          provider: '',
          userId: this.currentUserId!,
        };
        this.showNotification('Hirdetés sikeresen létrehozva!', 'success');
      },
      error: () => {
        this.showNotification('Hiba történt a hirdetés létrehozásakor.', 'error');
      },
    });
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.newProvision.image = file;
    }
  }
  
  editProvision(provision: Provision): void {
    this.selectedProvision = { ...provision };
    this.viewportScroller.scrollToPosition([0, 0]);
  }
  confirmDelete(provisionId: number | undefined): void {
    if (!provisionId) return;
    if (confirm('Biztosan törölni szeretnéd ezt a hirdetést?')) {
      this.provisionService.deleteProvision(provisionId).subscribe({
        next: () => {
          this.provisions = this.provisions.filter((p) => p.provisionId !== provisionId);
          this.showNotification('Hirdetés sikeresen törölve!', 'success');
        },
        error: () => {
          this.showNotification('Hiba történt a hirdetés törlésekor.', 'error');
        },
      });
    }
  }
  
  saveProvision(): void {
    if (this.selectedProvision) {
      const provisionId = this.selectedProvision.provisionId;
  
      if (provisionId) {
      
        this.provisionService.updateProvision(provisionId, this.selectedProvision).subscribe({
          next: () => {
            this.showNotification('Hirdetés sikeresen frissítve!', 'success');
            this.loadProvisions(this.currentUserId!);
            this.selectedProvision = null;
          },
          error: () => {
            this.showNotification('Hiba történt a hirdetés frissítésekor.', 'error');
          },
        });
      }
    }
  }
  
  cancelEdit(): void {
    this.selectedProvision = null; 
  }
  

  saveProfile(): void {
    if (!this.profile.email || !this.profile.password || !this.profile.uname || !this.profile.id) {
      this.showNotification('Az összes mezőt ki kell tölteni!', 'error');
      return;
    }

    this.userService.updateProfile(this.profile).subscribe({
      next: () => {
        this.showNotification('Profil sikeresen frissítve!', 'success');
        this.toggleEditProfile();
      },
      error: (err) => {
        this.showNotification('Hiba történt a profil frissítése során!', 'error');
        console.error('Hiba:', err);
      },
    });
  }

  showNotification(message: string, type: string): void {
    this.notificationMessage = message;
    this.notificationClass = type === 'success' ? 'success' : 'error';
    this.notificationVisible = true;

    setTimeout(() => {
      this.notificationVisible = false;
    }, 3000);
  }
}
