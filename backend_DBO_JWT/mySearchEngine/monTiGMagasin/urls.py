from django.urls import path
from monTiGMagasin import views

urlpatterns = [
    path('infoproducts/', views.InfoProductList.as_view()),
    path('infoproduct/<int:tig_id>/', views.InfoProductDetail.as_view()),
    path('products/update_multiple/', views.UpdateMultipleProducts.as_view(), name='update-multiple-products'),
    
    path('transactions/', views.TransactionList.as_view(), name='transaction-list'),
    path('transactions/<int:tig_id>/', views.TransactionList.as_view(), name='transaction-detail'),
        
    path('transactions/month/<int:month>/', views.TransactionList.as_view(), name='transactions-by-month'),
    path('total-per-day/<str:month>/', views.TotalPerDay.as_view(), name='total_per_day'),
    path('total-per-month/', views.TotalPerMonth.as_view(), name='total_per_month'),
    path('total-per-week/<str:month>/', views.TotalPerWeek.as_view(), name='total_per_week'),
    path('total-per-day-achat/<str:month>/', views.TotalPerDayAchat.as_view(), name='total_per_dayachat'),
    path('month-margin/<str:month>/', views.TotalPerMonthMargin.as_view(), name='total_per_month_margin'),
    path('year-margin/', views.TotalYearlyMargin.as_view(), name='marge'),
]
