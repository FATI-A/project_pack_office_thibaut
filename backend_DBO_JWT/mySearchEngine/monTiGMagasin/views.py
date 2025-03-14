from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from monTiGMagasin.config import baseUrl
from monTiGMagasin.models import InfoProduct, Transaction
from monTiGMagasin.serializers import InfoProductSerializer, TransactionSerializer
from rest_framework import status


from rest_framework.permissions import IsAuthenticated

class InfoProductList(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        products = InfoProduct.objects.all()
        serializer = InfoProductSerializer(products, many=True)
        return Response(serializer.data)
class InfoProductDetail(APIView):

    permission_classes = (IsAuthenticated,)

    def get_object(self, tig_id):
        try:
            return InfoProduct.objects.get(tig_id=tig_id)
        except InfoProduct.DoesNotExist:
            raise Http404
    def get(self, request, tig_id, format=None):
        product = self.get_object(tig_id=tig_id)
        serializer = InfoProductSerializer(product)
        return Response(serializer.data)
    def put(self, request, tig_id, format=None):
        product = self.get_object(tig_id=tig_id)

        serializer = InfoProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            new_quantity_in_stock = serializer.validated_data.get('quantityInStock', product.quantityInStock)

            discount = serializer.validated_data.get('discount', product.discount)

            if new_quantity_in_stock > 0:
                    transaction_type = 'achat'
                    prixvente = 0
            elif new_quantity_in_stock < 0:
                    transaction_type = 'vente'
                    if discount > 0:
                        prixvente = product.price - discount
                    else:
                        prixvente = product.prixvente
            else:
                    transaction_type = 'péremption'
    
            product.prixvente = prixvente
            product.save()

            Transaction.objects.create(
                tig_id=product.tig_id,
                name=product.name,
                priceachat=product.price, 
                prixvente= product.prixvente, 
                quantity_in_stock=new_quantity_in_stock,
                type=transaction_type
            )

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateMultipleProducts(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        product_updates = request.data.get('products', [])
        updated_products = []

        for product_data in product_updates:
            try:
                
                product = InfoProduct.objects.get(tig_id=product_data.get('tig_id')) 

                
                product.discount = product_data.get('discount', product.discount)
                product.quantityInStock = product_data.get('quantityInStock', product.quantityInStock)
                product.price = product_data.get('price', product.price)
                product.prixvente = product_data.get('prixvente', product.prixvente)
                product.save()

                
                new_quantity_in_stock = product.quantityInStock
            
                if new_quantity_in_stock > 0:
                    transaction_type = 'achat'
                    prixvente = 0
                elif new_quantity_in_stock < 0:
                    transaction_type = 'vente'
                    if   product.discount  > 0:
                        prixvente = product.price - product.discount 
                    else:
                        prixvente = product.prixvente
                else:
                    transaction_type = 'péremption'
    
                product.prixvente = prixvente
                product.save()

                
                Transaction.objects.create(
                    tig_id=product.tig_id,
                    name=product.name,
                    priceachat=product.price, 
                    prixvente=product.prixvente, 
                    quantity_in_stock=new_quantity_in_stock,
                    type=transaction_type 
                )

                updated_products.append(InfoProductSerializer(product).data)

            except InfoProduct.DoesNotExist:
                return Response({"error": f"Produit avec tig_id {product_data.get('tig_id')} introuvable."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"updated_products": updated_products}, status=status.HTTP_200_OK)
    

class TransactionList(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, tig_id):
        try:
            return InfoProduct.objects.get(tig_id=tig_id)
        except InfoProduct.DoesNotExist:
            raise Http404
        
    def get(self, request, month=None, tig_id=None, format=None):
        if month:
            transactions = Transaction.objects.filter(date__month=month)
            if not transactions.exists():
                return Response({"message": f"Aucune transaction trouvée pour le mois {month}."}, status=404)
        else:
            transactions = Transaction.objects.all()
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    def delete(self, request, tig_id, format=None):
        transactions = Transaction.objects.filter(tig_id=tig_id)
        
        if transactions.exists():
            transactions.delete()
            return Response({"message": f"Transactions avec tig_id {tig_id} supprimées avec succès."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": f"Aucune transaction trouvée avec tig_id {tig_id}."}, status=status.HTTP_404_NOT_FOUND)