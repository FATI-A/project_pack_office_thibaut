import { Component } from '@angular/core';
import { DetailsProduitsComponent } from '../pages/details-produits/details-produits.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [DetailsProduitsComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
