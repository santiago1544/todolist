import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  
  userId: any

  constructor(private authService: AuthenticationService) { 
    this.authService.getProfile().then(user => {
      this.userId = user?.uid;
      console.log("JournalService - User ID:", this.userId);
    });
  }
}
