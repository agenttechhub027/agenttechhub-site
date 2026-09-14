from django.shortcuts import render


def projeto_exemplo(request):
    return render(request, 'portfolio/projeto_exemplo.html')
