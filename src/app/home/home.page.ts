import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  user:any

  constructor(public authSevice: AuthenticationService, public route: Router) {
    this.user = authSevice.getProfile();
  }
  
  async logout(){
    this.authSevice.signOut().then(()=>{
      console.log('User signed out successfully.');
      this.route.navigate(['/landing']);
    }).catch((error)=>{
      console.error('Error signing out: ', error);
    });
  }
}
