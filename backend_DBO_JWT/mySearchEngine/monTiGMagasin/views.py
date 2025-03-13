from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from monTiGMagasin.config import baseUrl
from monTiGMagasin.models import InfoProduct
from monTiGMagasin.serializers import InfoProductSerializer
from rest_framework import status

#######################
#...TME3 JWT starts...#
from rest_framework.permissions import IsAuthenticated
#...end of TME3 JWT...#
#######################

# Create your views here.
class InfoProductList(APIView):
#######################
#...TME3 JWT starts...#
    permission_classes = (IsAuthenticated,)
#...end of TME3 JWT...#
#######################
    def get(self, request, format=None):
        products = InfoProduct.objects.all()
        serializer = InfoProductSerializer(products, many=True)
        return Response(serializer.data)
class InfoProductDetail(APIView):
#######################
#...TME3 JWT starts...#
    permission_classes = (IsAuthenticated,)
#...end of TME3 JWT...#
#######################
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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UpdateMultipleProducts(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        product_updates = request.data.get('products', [])

        updated_products = []
        for product_data in product_updates:
            try:
                product = InfoProduct.objects.get(id=product_data.get('id'))
                product.discount = product_data.get('discount', product.discount)
                product.quantityInStock = product_data.get('quantityInStock', product.quantityInStock)
                product.save()

                updated_products.append(InfoProductSerializer(product).data)
            except InfoProduct.DoesNotExist:
                return Response({"error": f"Produit avec id {product_data.get('id')} introuvable."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"updated_products": updated_products}, status=status.HTTP_200_OK)