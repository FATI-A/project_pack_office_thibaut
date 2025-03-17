from django.db import models

# Create your models here.
class InfoProduct(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    tig_id = models.IntegerField(default='-1')
    name = models.CharField(max_length=100, blank=True, default='')
    category = models.IntegerField(default='-1')
    price = models.FloatField(default='0')
    prixvente = models.FloatField(default='0')
    unit = models.CharField(max_length=20, blank=True, default='')
    availability = models.BooleanField(default=True)
    sale = models.BooleanField(default=False)
    discount = models.FloatField(default='0')
    comments = models.CharField(max_length=100, blank=True, default='')
    owner = models.CharField(max_length=20, blank=True, default='tig_orig')
    quantityInStock = models.IntegerField(default='0')

    class Meta:
        ordering = ('name',)
class Transaction(models.Model):
    TIG_CHOICES = [
        ('achat', 'Achat'),
        ('vente', 'Vente'),
        ('peremption', 'Péremption'),
    ]
    
    tig_id = models.IntegerField()
    name = models.CharField(max_length=100)
    priceachat = models.FloatField()
    prixvente = models.FloatField()
    quantity_in_stock = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20, choices=TIG_CHOICES, default='achat')

    def __str__(self):
        return f"{self.name} - {self.type} - {self.date}"
