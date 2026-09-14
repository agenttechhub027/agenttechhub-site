from django.urls import path

from . import views

urlpatterns = [
    path('projeto-exemplo/', views.projeto_exemplo, name='portfolio_projeto_exemplo'),
]
