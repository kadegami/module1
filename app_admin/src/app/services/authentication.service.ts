import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from '../services/trip-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}
  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');
    // Make sure we return a string even if we don't have a token if(!out)
    if (!out) {
      return '';
    }
    return out;
  }
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }
  public isLoggedIn(): boolean {
    // console.log('isLoggedIn');
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      //console.log('token exists');
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      },
    });
  }
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      },
    });
  }
}
