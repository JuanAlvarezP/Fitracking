from django.contrib import admin
from .models import Rol, Usuario, Ejercicio, Rutina, HistorialProgreso, Recomendacion

admin.site.register(Rol)
admin.site.register(Usuario)
admin.site.register(Ejercicio)
admin.site.register(Rutina)
admin.site.register(HistorialProgreso)
admin.site.register(Recomendacion)
