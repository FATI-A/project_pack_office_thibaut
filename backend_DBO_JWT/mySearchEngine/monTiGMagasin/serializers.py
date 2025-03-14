from rest_framework.serializers import ModelSerializer
from monTiGMagasin.models import InfoProduct, Transaction

class InfoProductSerializer(ModelSerializer):
    class Meta:
        model = InfoProduct
        fields = '__all__'
class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'