from django.shortcuts import render


def home(request):
    return render(request, 'paginas/home.html')


def sobre(request):
    return render(request, 'paginas/sobre.html')


def servicos(request):
    return render(request, 'paginas/servicos.html')


def contato(request):
    return render(request, 'paginas/contato.html')
