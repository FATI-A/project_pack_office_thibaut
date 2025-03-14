import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/produit';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { routes } from '../app.routes';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ProductsServicesService {
  private apiUrl = 'http://localhost:8000/api/token/';
  private refreshTokenUrl = 'http://localhost:8000/api/token/refresh/';
  private apiUrlProduct = 'http://127.0.0.1:8000/infoproduct/';
  private apiUrlProcuts = 'http://127.0.0.1:8000/products/update_multiple/';
  dataProducts: Product[] = [];

  constructor(private http: HttpClient, private router: Router) {}
  // message d'erreur
  login(username: string, password: string): any {
    const response = this.http.post(this.apiUrl, {
      username: username,
      password: password,
    });
    return response;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      alert('❌ Votre session a expiré, veuillez vous reconnecter !');
      // window.location.href = "login.html"; // Redirection ici, mais tu peux l'adapter si nécessaire
      return;
    }

    const response = await fetch(`${this.refreshTokenUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      console.log('🔄 Token rafraîchi !');
      return data.access;
    } else {
      Swal.fire({
        icon: 'info',
        title: 'session expiré',
        text: 'Votre session a expiré, veuillez vous reconnecter !.',
        confirmButtonColor: '#d33',
      });
      this.router.navigate(['/login']);
    }
  }
  getInfoProducts(): Observable<Product[]> {
    let accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      alert('❌ Vous devez vous connecter !');
      return of([]); // Retourne un Observable vide
    }

    return new Observable((observer) => {
      fetch(`http://localhost:8000/infoproducts/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((response) => {
          if (response.status === 401) {
            console.warn('⚠️ Token expiré, tentative de rafraîchissement...');
            return this.refreshToken().then((newToken) => {
              return fetch(`http://localhost:8000/infoproducts/`, {
                headers: { Authorization: `Bearer ${newToken}` },
              });
            });
          }
          return response;
        })
        .then((response) => response.json())
        .then((data) => {
          this.dataProducts = data;
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.error('❌ Erreur réseau :', error);
          observer.error(error);
        });
    });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    };

    return new Observable<Product>((observer) => {
      Swal.fire({
        title: 'Confirmer la mise à jour',
        text: 'Voulez-vous vraiment modifier ce produit ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, mettre à jour',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`${this.apiUrlProduct}${id}/`, requestOptions)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Erreur de mise à jour du produit: ${response.statusText}`
                );
              }
              return response.json();
            })
            .then((updatedProduct: Product) => {
              observer.next(updatedProduct);
              observer.complete();
              Swal.fire({
                icon: 'success',
                title: 'Produit mis à jour',
                text: 'Les données sont bien modifiées !',
                confirmButtonColor: '#28a745',
              });
            })
            .catch((error: Error) => {
              console.error('❌ Erreur réseau :', error);
              observer.error(error);

              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la mise à jour du produit.',
                confirmButtonColor: '#d33',
              });
            });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Modification annulée',
            text: "Aucune modification n'a été apportée.",
            confirmButtonColor: '#d33',
          });
        }
      });
    });
  }

  updateMultiple(products: Product[]): Observable<Product[]> {
    const accessToken = localStorage.getItem('access_token');
    console.log('accessToken', accessToken);

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    };

    return new Observable<Product[]>((observer) => {
      Swal.fire({
        title: 'Confirmer la mise à jour',
        text: 'Voulez-vous vraiment modifier ces produits ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, mettre à jour',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`${this.apiUrlProcuts}`, requestOptions)
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Erreur de mise à jour des produits: ${response.statusText}`
                );
              }
              return response.json();
            })
            .then((updatedProducts: Product[]) => {
              observer.next(updatedProducts);
              observer.complete();
              Swal.fire({
                icon: 'success',
                title: 'Produits mis à jour',
                text: 'Les données des produits sont bien modifiées !',
                confirmButtonColor: '#28a745',
              });
            })
            .catch((error: Error) => {
              console.error('❌ Erreur réseau :', error);
              observer.error(error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la mise à jour des produits.',
                confirmButtonColor: '#d33',
              });
            });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Modification annulée',
            text: "Aucune modification n'a été apportée aux produits.",
            confirmButtonColor: '#d33',
          });
        }
      });
    });
  }
}
