import { Component, inject } from '@angular/core';
import { ProductsServicesService } from '../service/products-services.service';  // Ton service modifié
import { FormsModule } from '@angular/forms'; // Importer FormsModule ici
import { Router } from '@angular/router';
import { routes } from '../app.routes';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  responseLogin: any;
  productsService: ProductsServicesService = inject(ProductsServicesService)

  constructor(
    private router: Router
  ) {}

  login(): void {
    this.productsService.login(this.username, this.password).subscribe((response: any) => {
        // console.log(response);
        this.responseLogin = response;
        localStorage.setItem('access_token', this.responseLogin.access);
        localStorage.setItem('refresh_token', this.responseLogin.refresh);
        if(this.responseLogin){
          this.productsService.getInfoProducts();
          this.router.navigate(['dashboard']);
        } else{
          this.router.navigate(['/login']);
        }
        
    })
  }
}
