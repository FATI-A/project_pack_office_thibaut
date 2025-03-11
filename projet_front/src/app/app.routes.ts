import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour accéder à RouterOutlet
import { DetailsProduitsComponent } from './pages/details-produits/details-produits.component';

export const routes: Routes = [
 { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirige vers /login par défaut
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
   {path : 'details-produit', component : DetailsProduitsComponent}
];
