from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from monTiGMagasin.config import baseUrl
from monTiGMagasin.models import InfoProduct, Transaction
from monTiGMagasin.serializers import InfoProductSerializer, TransactionSerializer
from rest_framework import status
from django.db.models import Sum, F
from django.utils import timezone
from datetime import timedelta,datetime


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
class TotalPerDay(APIView):
    def get(self, request, month, format=None):
        try:
            month = int(month) 
            if month < 1 or month > 12:
                return Response({"error": "Mois invalide"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Format du mois invalide"}, status=status.HTTP_400_BAD_REQUEST)

       
        year = 2025

       
        start_date = timezone.make_aware(datetime(year, month, 1))
        if month == 12:
            end_date = timezone.make_aware(datetime(year, month, 31, 23, 59, 59))
        else:
            end_date = timezone.make_aware(datetime(year, month + 1, 1)) - timezone.timedelta(seconds=1)

        
        transactions = Transaction.objects.filter(
            date__range=[start_date, end_date],
            type='vente',
            prixvente__gt=0
        )

        
        totals = (
            transactions
            .annotate(day=F('date__day'))
            .values('day')
            .annotate(total=Sum(F('prixvente') * F('quantity_in_stock') * -1))
            .order_by('day')
        )

        total_per_day = {day: 0 for day in range(1, 32)}

        for total in totals:
            total_per_day[total['day']] = total['total']

        result = [{"day": day, "total": total_per_day[day]} for day in range(1, 32) if day in total_per_day]

        return Response(result, status=status.HTTP_200_OK)
class TotalPerMonth(APIView):
    def get(self, request, format=None):
        year = 2025
        monthly_totals = []

        for month in range(1, 13):
            request_month = str(month).zfill(2)
            total_per_day_view = TotalPerDay()
            response = total_per_day_view.get(request, request_month)

            
            if response.status_code != status.HTTP_200_OK:
                return Response({"error": f"Erreur en récupérant les données pour le mois {month}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            
            total = sum(day_data["total"] for day_data in response.data)

            monthly_totals.append({"month": month, "total": total})

        return Response(monthly_totals, status=status.HTTP_200_OK)    
class TotalPerWeek(APIView):
    def get(self, request, month, format=None):
        try:
            month = int(month)
            if month < 1 or month > 12:
                return Response({"error": "Mois invalide"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Format du mois invalide"}, status=status.HTTP_400_BAD_REQUEST)

        total_per_day_view = TotalPerDay()
        response = total_per_day_view.get(request, str(month).zfill(2))

        if response.status_code != status.HTTP_200_OK:
            return Response({"error": f"Erreur en récupérant les données pour le mois {month}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        daily_totals = response.data 

        weeks = []
        week_total = 0
        week_number = 1

        for index, day_data in enumerate(daily_totals):
            week_total += day_data["total"]

            if (index + 1) % 7 == 0 or index == len(daily_totals) - 1:
                weeks.append({"week": week_number, "total": week_total})
                week_number += 1
                week_total = 0

        return Response(weeks, status=status.HTTP_200_OK)       
class TotalPerDayAchat(APIView):
    def get(self, request, month, format=None):
        try:
            month = int(month) 
            if month < 1 or month > 12:
                return Response({"error": "Mois invalide"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Format du mois invalide"}, status=status.HTTP_400_BAD_REQUEST)

       
        year = 2025

       
        start_date = timezone.make_aware(datetime(year, month, 1))
        if month == 12:
            end_date = timezone.make_aware(datetime(year, month, 31, 23, 59, 59))
        else:
            end_date = timezone.make_aware(datetime(year, month + 1, 1)) - timezone.timedelta(seconds=1)

        
        transactions = Transaction.objects.filter(
            date__range=[start_date, end_date],
            type='achat',
            priceachat__gt=0
        )

        
        totals = (
            transactions
            .annotate(day=F('date__day'))
            .values('day')
            .annotate(total=Sum(F('priceachat') * F('quantity_in_stock')))
            .order_by('day')
        )

        total_per_day = {day: 0 for day in range(1, 32)}

        for total in totals:
            total_per_day[total['day']] = total['total']

        result = [{"day": day, "total": total_per_day[day]} for day in range(1, 32) if day in total_per_day]

        return Response(result, status=status.HTTP_200_OK)
    
class TotalPerMonthMargin(APIView):
    def get(self, request, month, format=None):
        try:
            month = int(month)
            if month < 1 or month > 12:
                return Response({"error": "Mois invalide"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Format du mois invalide"}, status=status.HTTP_400_BAD_REQUEST)

 
        total_per_day_view = TotalPerDay()
        response_sales = total_per_day_view.get(request, str(month).zfill(2))

        total_per_day_achat_view = TotalPerDayAchat()
        response_purchases = total_per_day_achat_view.get(request, str(month).zfill(2))

        if response_sales.status_code != status.HTTP_200_OK or response_purchases.status_code != status.HTTP_200_OK:
            return Response({"error": f"Erreur en récupérant les données pour le mois {month}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        total_sales = sum(day_data["total"] for day_data in response_sales.data)
        total_purchases = sum(day_data["total"] for day_data in response_purchases.data)


        margin = total_sales - total_purchases

        return Response({ "marge": margin, "ventes": total_sales, "achats": total_purchases}, status=status.HTTP_200_OK)        
class TotalYearlyMargin(APIView):
    def get(self, request, format=None):
        yearly_margin = []

        for month in range(1, 13):
            
            total_per_month_margin_view = TotalPerMonthMargin()
            response = total_per_month_margin_view.get(request, str(month).zfill(2))

            
            if response.status_code != status.HTTP_200_OK:
                return Response({"error": f"Erreur en récupérant les données pour le mois {month}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            
            yearly_margin.append({"month": month, "margin": response.data["margin"]})

        return Response(yearly_margin, status=status.HTTP_200_OK)      

        