from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'criado_em')
    readonly_fields = ('nome', 'email', 'telefone', 'mensagem', 'criado_em')
