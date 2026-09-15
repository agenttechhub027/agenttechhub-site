from django.urls import path

from . import views

urlpatterns = [
    path('', views.lista, name='portfolio_lista'),
    path('projeto-exemplo/', views.projeto_exemplo, name='portfolio_projeto_exemplo'),
    path('condogestao/', views.condogestao, name='portfolio_condogestao'),
]
