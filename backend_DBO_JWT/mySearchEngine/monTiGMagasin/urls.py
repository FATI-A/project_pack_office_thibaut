from django.urls import path
from monTiGMagasin import views

urlpatterns = [
    path('infoproducts/', views.InfoProductList.as_view()),
    path('infoproduct/<int:tig_id>/', views.InfoProductDetail.as_view()),
    path('products/update_multiple/', views.UpdateMultipleProducts.as_view(), name='update-multiple-products'),
    
    path('transactions/', views.TransactionList.as_view(), name='transaction-list'),
    path('transactions/<int:tig_id>/', views.TransactionList.as_view(), name='transaction-detail'),
        
    path('transactions/month/<int:month>/', views.TransactionList.as_view(), name='transactions-by-month'),
]
