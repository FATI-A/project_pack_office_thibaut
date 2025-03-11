import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
