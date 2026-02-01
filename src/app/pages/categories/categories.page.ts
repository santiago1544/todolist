import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';
import { Category, CategoriesService } from 'src/app/service/categories-service.service';
import { CategoryPage } from '../category/category.page';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  userId: any
  title: string
  categories: Category[] = [];

  constructor(
    private authService: AuthenticationService,
    private categoriesService: CategoriesService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addCategory();
  }

  addCategory() {
    this.categoriesService.addCategory({
      title: this.title,
      createdAt: new Date()
    }).then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'Category added successfully',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    }).catch(async (error) => {
      const toast = await this.toastCtrl.create({
        message: 'Error adding category: ' + error,
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    });
  }

  async openCategory(category: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryPage,
      componentProps: { id: category.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6
    });
    await modal.present();
  }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      this.userId = user.uid;
      console.log('User ID:', this.userId);

      this.categoriesService.getCategory(this.userId).subscribe(res => {
        this.categories = res;
        console.log('Categories fetched:', this.categories);
      });

    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }
}
