from django.contrib import messages
from django.shortcuts import redirect, render

from apps.contato.forms import LeadForm


def home(request):
    return render(request, 'paginas/home.html')


def sobre(request):
    return render(request, 'paginas/sobre.html')


def servicos(request):
    return render(request, 'paginas/servicos.html')


def contato(request):
    if request.method == 'POST':
        form = LeadForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Mensagem enviada com sucesso! Em breve entraremos em contato.')
            return redirect('contato')
    else:
        form = LeadForm()

    return render(request, 'paginas/contato.html', {'form': form})
