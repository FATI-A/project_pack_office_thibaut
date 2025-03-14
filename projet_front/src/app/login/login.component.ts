import { Component, inject } from '@angular/core';
import { ProductsServicesService } from '../service/products-services.service';  // Ton service modifié
import { FormsModule } from '@angular/forms'; // Importer FormsModule ici
import { Router } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  responseLogin: any;
  productsService: ProductsServicesService = inject(ProductsServicesService);

  constructor(private router: Router) {}

  login(): void {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.productsService.login(this.username, this.password).subscribe(
      (response: any) => {
        this.responseLogin = response;
        localStorage.setItem('access_token', this.responseLogin.access);
        localStorage.setItem('refresh_token', this.responseLogin.refresh);
        if (this.responseLogin) {
          this.productsService.getInfoProducts();
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      (error: Error) => {
        this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
      }
    );
  }
}
