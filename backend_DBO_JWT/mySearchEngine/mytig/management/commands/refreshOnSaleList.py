from django.core.management.base import BaseCommand
from faker import Faker
from random import randint
from monTiGMagasin.models import Transaction, InfoProduct
import random
from datetime import datetime, timedelta

fake = Faker()

class Command(BaseCommand):
    help = 'Remplir la table Transaction avec des données factices'

    def handle(self, *args, **kwargs):
        self.seed_transactions(200)

    def seed_transactions(self, n=10):
        """
        Remplir la table Transaction avec n faux enregistrements.
        """

        products = InfoProduct.objects.all()

        if not products:
            self.stdout.write(self.style.WARNING("Aucun produit dans la base de données."))
            return

        for _ in range(n):
            product = products[randint(0, len(products) - 1)]


            tig_id = product.tig_id
            name = product.name
            priceachat = round(product.price, 2)
            prixvente = round(product.prixvente, 2)
            quantity_in_stock = randint(-50, 100) 
            date = fake.date_between(start_date='-1y', end_date='today')

            
            if quantity_in_stock > 0:
                transaction_type = 'achat'
                
                prixvente = 0
            elif quantity_in_stock < 0:
                transaction_type = 'vente'
                
                prixvente = max(priceachat + 5, priceachat + random.uniform(1, 10))
                prixvente = round(prixvente, 2) 
            else:
                transaction_type = 'peremption'
                prixvente = 0 

            Transaction.objects.create(
                tig_id=tig_id,
                name=name,
                priceachat=priceachat,
                prixvente=prixvente,
                quantity_in_stock=quantity_in_stock,
                type=transaction_type,
                date=date
            )

            self.stdout.write(self.style.SUCCESS(f"Transaction ajoutée : {name} ({transaction_type}) - Quantité: {quantity_in_stock} - Date: {date}"))
