from django.shortcuts import render

# Lista de cases publicados no portfólio, hardcoded (sem banco de dados),
# na mesma linha do resto do site — pra adicionar um novo case, basta
# incluir um dicionário novo nesta lista.
PROJETOS_PUBLICADOS = [
    {
        'nome': 'CondoGestão',
        'descricao_curta': 'Sistema de portaria condominial 100% digital — encomendas com assinatura digital, controle de veículos e agente de IA integrado, sem papel.',
        'imagem': 'portfolio/condogestao-capa.png',
        'url_detalhe': 'portfolio_condogestao',
    },
]


def lista(request):
    return render(request, 'portfolio/lista.html', {'projetos': PROJETOS_PUBLICADOS})


def projeto_exemplo(request):
    return render(request, 'portfolio/projeto_exemplo.html')


def condogestao(request):
    return render(request, 'portfolio/condogestao.html')
