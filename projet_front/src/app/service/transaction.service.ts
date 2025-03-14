import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }

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
