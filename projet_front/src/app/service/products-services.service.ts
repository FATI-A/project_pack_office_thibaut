import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/produit';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { routes } from '../app.routes';

@Injectable({
  providedIn: 'root',
})

export class ProductsServicesService {
  private apiUrl = 'http://localhost:8000/api/token/';
  private refreshTokenUrl = 'http://localhost:8000/api/token/refresh/';
  dataProducts: Product[] = [];
 
  constructor(private http: HttpClient) { }
  // message d'erreur
  login(username: string, password: string): any {   
    const response = this.http.post(this.apiUrl, {"username": username, "password": password});
    return response;
  }



  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        alert("❌ Votre session a expiré, veuillez vous reconnecter !");
        // window.location.href = "login.html"; // Redirection ici, mais tu peux l'adapter si nécessaire
        return;
    }

    const response = await fetch(`${this.refreshTokenUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        console.log("🔄 Token rafraîchi !");
        return data.access;
    } else {
        alert("❌ Votre session a expiré, veuillez vous reconnecter !");
    }
}
getInfoProducts(): Observable<Product[]> {
  let accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
      alert("❌ Vous devez vous connecter !");
      return of([]);  // Retourne un Observable vide
  }

  return new Observable(observer => {
      fetch(`http://localhost:8000/infoproducts/`, {
          headers: { "Authorization": `Bearer ${accessToken}` }
      })
      .then(response => {
          if (response.status === 401) {
              console.warn("⚠️ Token expiré, tentative de rafraîchissement...");
              return this.refreshToken().then(newToken => {
                  return fetch(`http://localhost:8000/infoproducts/`, {
                      headers: { "Authorization": `Bearer ${newToken}` }
                  });
              });
          }
          return response;
      })
      .then(response => response.json())
      .then(data => {
          this.dataProducts = data;
          observer.next(data);
          observer.complete();
      })
      .catch(error => {
          console.error("❌ Erreur réseau :", error);
          observer.error(error);
      });
  });
}
// updateProduct(id: number, product: Product) {
//   return this.http.put<Product>(`http://localhost:8000/infoproducts/${id}`, product);
// }
}