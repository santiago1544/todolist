import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-journals',
  standalone: false,
  templateUrl: './journals.page.html',
  styleUrls: ['./journals.page.scss'],
})
export class JournalsPage implements OnInit {
  userId:any
  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user.uid;
      console.log('User ID:', this.userId);
    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }

}
