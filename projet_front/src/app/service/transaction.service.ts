import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { transaction } from '../models/transaction';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private apiUrl = 'http://127.0.0.1:8000/transactions/month/3/'; // Votre URL API

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les transactions
  getTransactions(): Observable<transaction[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );

    return this.http.get<transaction[]>(this.apiUrl, { headers });
  }
  getMargeMensuelle(): Observable<any> {
    const ventes = -1200;
    const achats = 800;

    const marge = ventes - achats;
    return of({
      ventes: ventes,
      achats: achats,
      marge: marge,
    });
  }
}
