import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserService } from './user.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access for user with correct role', () => {
    const expectedRole = 'BUSINESS';
    userService.getCurrentUser.and.returnValue({ role: expectedRole, uname: 'testUser', userId: 1 });

    const canActivate = guard.canActivate({ data: { role: expectedRole, uname: 'testUser', userId: 1 } } as any, {} as any);
    expect(canActivate).toBeTrue();
  });

  it('should deny access for user with incorrect role', () => {
    const expectedRole = 'CUSTOMER';
    userService.getCurrentUser.and.returnValue({ role: 'BUSINESS', uname: 'testUser', userId: 1 });

    const canActivate = guard.canActivate({ data: { role: expectedRole, uname: 'testUser', userId: 1 } } as any, {} as any);
    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']); 
  });

  it('should deny access if no user is logged in', () => {
    const expectedRole = 'BUSINESS';
    userService.getCurrentUser.and.returnValue(null); 

    const canActivate = guard.canActivate({ data: { role: expectedRole, uname: 'testUser', userId: 1 } } as any, {} as any);
    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']); 
  });
});
