import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { Journal, JournalService } from 'src/app/service/journal-service.service';
import { JournalPage } from '../journal/journal.page';

@Component({
  selector: 'app-journals',
  standalone: false,
  templateUrl: './journals.page.html',
  styleUrls: ['./journals.page.scss'],
})
export class JournalsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  userId:any
  title: string
  content: string
  journals: Journal[] = [];

  constructor(private authService: AuthenticationService, private journalService: JournalService, private toastCtrl: ToastController, private modalCtrl: ModalController) { }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addJournal();
  }

  addJournal() {
    this.journalService.addJournal({
      title: this.title,
      content: this.content,
      createdAt: new Date()
    }).then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'Journal added successfully',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } ).catch(async (error) => {
      const toast = await this.toastCtrl.create({
        message: 'Error adding journal: ' + error,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    });
  }

  async openJournal(journal: Journal) {
    const modal = await this.modalCtrl.create({
      component: JournalPage,
      componentProps: { id: journal.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6
    });
    await modal.present();
  }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user.uid;
      console.log('User ID:', this.userId);
      this.journalService.getJournal(this.userId).subscribe(res => {
        this.journals = res;
        console.log('Journals fetched:', this.journals);
      });
    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }



}
