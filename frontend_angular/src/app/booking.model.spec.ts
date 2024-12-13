import { Booking } from './booking.model';

describe('Booking', () => {
  it('should create a booking object', () => {
    const booking: Booking = {
      id: 1,
      userId: 123,
      bookingTime: new Date('1010-11-10'),
      status: 'Confirmed',
      provisionId: 10,
      creatorUserId: 56,
    };
    expect(booking).toBeTruthy();
  });
});
  