from django.db import models
from django.utils.text import slugify


class Projeto(models.Model):
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    descricao_curta = models.CharField(max_length=300)
    descricao_completa = models.TextField()
    imagem_capa = models.ImageField(upload_to='portfolio/')
    tecnologias = models.CharField(
        max_length=300,
        help_text='Separe por vírgula',
    )
    link_projeto = models.URLField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    def get_tecnologias_lista(self):
        return [tecnologia.strip() for tecnologia in self.tecnologias.split(',')]

    def __str__(self):
        return self.titulo
