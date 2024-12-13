
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { ProvisionService } from '../provision.service';
import { Booking } from '../booking.model';
import { UserService } from '../user.service';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  messageContent: string = '';
  showMessageDialog: boolean = false;
  selectedBookingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private provisionService: ProvisionService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.getUserBookings();
    
  }
  getUserBookings(): void {
    const currentUser = this.userService.getCurrentUser();
    const userId = currentUser?.userId;
  
    if (userId) {
      this.bookingService.getBookingsByUserId(userId).subscribe(
        async (data: Booking[]) => {
          try {
         
            const bookingsWithProvision = await Promise.all(
              data.map(async (booking) => {
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
            this.bookings = bookingsWithProvision; 
          } catch (err) {
            console.error('Hiba a foglalások feldolgozása során:', err);
          }
        },
        (error) => {
          console.error('Hiba történt a foglalások lekérése során:', error);
        }
      );
    } else {
      console.error('User ID is undefined');
    }
  }
  


  deleteBooking(bookingId: number): void {
    this.bookingService.deleteBooking(bookingId).subscribe(
      () => {
        console.log('Foglalás törölve:', bookingId);
        
        this.bookings = this.bookings.filter(booking => booking.id !== bookingId);
      },
      (error) => {
        console.error('Hiba történt a foglalás törlése során:', error);
      }
    );
  }


openMessageDialog(bookingId: number): void {
  this.selectedBookingId = bookingId;

  const provision = this.bookings.find(b => b.id === bookingId)?.provision;
  if (provision) {
 
    const receiverId = provision.userId; 
    this.selectedBookingId = receiverId;
  }
  this.showMessageDialog = true;
}


  closeMessageDialog(): void {
    this.showMessageDialog = false;
    this.messageContent = ''; 
    this.selectedBookingId = null;
  }

  sendMessage(): void {
    const currentUser = this.userService.getCurrentUser();
    const senderId = currentUser?.userId;  
    const receiverId = this.selectedBookingId;  
  
    if (senderId && receiverId && this.messageContent.trim()) {
     
      this.messagesService.sendMessage(senderId, receiverId, this.messageContent).subscribe(
        (response) => {
          console.log('Üzenet sikeresen elküldve', response);
          this.closeMessageDialog();
        },
        (error) => {
          console.error('Hiba történt az üzenet küldése során:', error);
        }
      );
    } else {
      console.log('Üzenet tartalma nem lehet üres vagy hiányzik a feladó/címzett ID!');
    }
  }
  
}