from django.core.management.base import BaseCommand, CommandError
from mytig.models import ProduitEnPromotion
from mytig.serializers import ProduitEnPromotionSerializer
from mytig.config import baseUrl
import requests
import time

class Command(BaseCommand):
    help = 'Refresh the list of products which are on sale.'

    def handle(self, *args, **options):
        self.stdout.write('['+time.ctime()+'] Refreshing data...')
        response = requests.get(baseUrl+'products/')
        jsondata = response.json()
        ProduitEnPromotion.objects.all().delete()
        for product in jsondata:
            if product['sale']:
                serializer = ProduitEnPromotionSerializer(data={'tigID':str(product['id'])})
                if serializer.is_valid():
                    serializer.save()
                    self.stdout.write(self.style.SUCCESS('['+time.ctime()+'] Successfully added product id="%s"' % product['id']))
        self.stdout.write('['+time.ctime()+'] Data refresh terminated.')
# from django.core.management.base import BaseCommand
# from monTiGMagasin.models import InfoProduct
# from django.db.models import Count

# class Command(BaseCommand):
#     help = 'Supprime les doublons dans InfoProduct'

#     def handle(self, *args, **kwargs):
#         # Trouver les doublons
#         duplicates = InfoProduct.objects.values('tig_id').annotate(count=Count('tig_id')).filter(count__gt=1)

#         # Parcourez les doublons et supprimez-les
#         for duplicate in duplicates:
#             tig_id = duplicate['tig_id']
#             # Obtenez tous les enregistrements en double pour ce tig_id
#             products = InfoProduct.objects.filter(tig_id=tig_id)

#             # Gardez un seul produit et supprimez les autres
#             products.exclude(id=products.first().id).delete()

#         self.stdout.write(self.style.SUCCESS('Doublons supprimés avec succès.'))