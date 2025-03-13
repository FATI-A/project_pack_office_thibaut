import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour accéder à RouterOutlet
import { DetailsProduitsComponent } from './pages/details-produits/details-produits.component';
import { CategoryFruitComponent } from './pages/category-fruit/category-fruit.component';
import { CategoryPoissonsComponent } from './pages/category-poissons/category-poissons.component';
import { CategoryCrustaceComponent } from './pages/category-crustace/category-crustace.component';
import { ChiffreAffaireComponent } from './chiffre-affaire/chiffre-affaire.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige vers /login par défaut
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'details-produit', component: DetailsProduitsComponent },
  { path: 'catecory-fruit', component: CategoryFruitComponent },
  { path: 'catecory-poisson', component: CategoryPoissonsComponent },
  { path: 'catecory-crustace', component: CategoryCrustaceComponent },
  { path: 'chiffre-affaire', component: ChiffreAffaireComponent },
];
