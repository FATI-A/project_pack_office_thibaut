# Generated by Django 5.1.7 on 2025-03-14 09:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('monTiGMagasin', '0002_remove_transaction_price_infoproduct_prixvente_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='prixcht',
            new_name='priceachat',
        ),
    ]
