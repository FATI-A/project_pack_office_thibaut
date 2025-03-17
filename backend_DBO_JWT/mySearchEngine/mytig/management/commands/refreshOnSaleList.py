from django.core.management.base import BaseCommand
from faker import Faker
from random import randint
from monTiGMagasin.models import Transaction, InfoProduct
import random
from datetime import datetime

fake = Faker()

class Command(BaseCommand):
    help = "Remplir la table Transaction avec des données factices pour l'année 2025"

    def handle(self, *args, **kwargs):
        self.seed_transactions()

    def seed_transactions(self):


        products = list(InfoProduct.objects.all())

        if not products:
            self.stdout.write(self.style.WARNING("Aucun produit dans la base de données."))
            return

        year = 2025
        transactions_count = 0

        for month in range(1, 13): 
            for _ in range(30):
                product = random.choice(products)

                tig_id = product.tig_id
                name = product.name
                priceachat = round(product.price, 2)
                prixvente = round(product.prixvente, 2)
                quantity_in_stock = randint(-50, 100)

                
                day = randint(1, 28) 
                datetransaction = datetime(year, month, day)
                # self.stdout.write(self.style.SUCCESS(f"Date générée1: {date}"))
     
                if quantity_in_stock > 0:
                    transaction_type = "achat"
                    prixvente = 0
                elif quantity_in_stock < 0:
                    transaction_type = "vente"
                    prixvente = max(priceachat + 5, priceachat + random.uniform(1, 10))
                    prixvente = round(prixvente, 2)
                else:
                    transaction_type = "peremption"
                    prixvente = 0 

               
                transaction = Transaction.objects.create(
                    tig_id=tig_id,
                    name=name,
                    priceachat=priceachat,
                    prixvente=prixvente,
                    quantity_in_stock=quantity_in_stock,
                    type=transaction_type,
                    date=datetransaction
                )
                
                self.stdout.write(self.style.SUCCESS(f"Transaction créée: {transaction.date}"))

                transactions_count += 1

        self.stdout.write(self.style.SUCCESS(f"{transactions_count} transactions ajoutées sur toute l'année."))
