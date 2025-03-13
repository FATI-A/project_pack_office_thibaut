export interface transaction {
  id: number;
  price: number;
  name?: string;
  discount?: number; 
  quantityInStock: number;
  tig_id: number;
  prixVente: number;
  date: string;
  typeTransaction: string;
}
