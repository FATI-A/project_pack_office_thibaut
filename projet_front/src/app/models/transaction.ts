export interface transaction {
  id: number;
  priceachat: number;
  name?: string;
  discount?: number;
  quantity_in_stock: number;
  tig_id: number;
  prixvente: number;
  date: string;
  type: string;
}
