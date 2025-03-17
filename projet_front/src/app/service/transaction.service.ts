import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { transaction } from '../models/transaction';
import { HttpHeaders } from '@angular/common/http';
import { MonthlyMarginData } from '../models/MonthlyMarginData';


@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://127.0.0.1:8000/transactions/month/';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les transactions
  getTransactions(month: number): Observable<transaction[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const url = `${this.apiUrl}${month}/`;
    return this.http.get<transaction[]>(url, { headers });
  }

  getDailySalesForMonth(): Observable<any[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const url = `http://127.0.0.1:8000/total-per-day/03/`;
    return this.http.get<any[]>(url, { headers });
  }

  getDailySalesForYear(): Observable<any[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const url = `http://127.0.0.1:8000/total-per-month/`;
    return this.http.get<any[]>(url, { headers });
  }
  getDailySalesForWeek(): Observable<any[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const url = `http://127.0.0.1:8000/total-per-week/03/`;
    return this.http.get<any[]>(url, { headers });
  }
  getMergeForMonth(): Observable<MonthlyMarginData> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${accessToken}`
    );
    const url = `http://127.0.0.1:8000/month-margin/03/`;
    return this.http.get<MonthlyMarginData>(url, { headers });
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
