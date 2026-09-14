from django import forms

from .models import Lead

INPUT_CLASSES = (
    'w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 '
    'text-sm text-foreground placeholder:text-foreground/40 transition-colors duration-300 '
    'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'
)


class LeadForm(forms.ModelForm):
    class Meta:
        model = Lead
        fields = ['nome', 'email', 'telefone', 'mensagem']
        labels = {
            'nome': 'Nome',
            'email': 'E-mail',
            'telefone': 'Telefone',
            'mensagem': 'Mensagem',
        }
        widgets = {
            'nome': forms.TextInput(attrs={
                'class': INPUT_CLASSES,
                'placeholder': 'Seu nome',
                'required': True,
            }),
            'email': forms.EmailInput(attrs={
                'class': INPUT_CLASSES,
                'placeholder': 'seu@email.com',
                'required': True,
            }),
            'telefone': forms.TextInput(attrs={
                'class': INPUT_CLASSES,
                'placeholder': '(00) 00000-0000',
                'required': True,
                'inputmode': 'numeric',
                'pattern': '[0-9]*',
            }),
            'mensagem': forms.Textarea(attrs={
                'class': INPUT_CLASSES,
                'placeholder': 'Conte um pouco sobre o seu projeto...',
                'rows': 5,
                'required': True,
            }),
        }

    # Todos os campos do model já são obrigatórios por padrão (nenhum tem
    # blank=True), mas deixamos explícito aqui pra não depender só do
    # comportamento implícito do ModelForm.
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = True

    def clean_telefone(self):
        telefone = self.cleaned_data['telefone']
        if not telefone.isdigit():
            raise forms.ValidationError('Digite apenas números.')
        return telefone
