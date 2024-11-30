from django.db import models
from django.contrib.auth.models import User

def crear_rutina(request):
    # Obtener el usuario
    usuario = User.objects.get(id=usuario_id)
    # Crear la rutina
    rutina = Rutina.objects.create(
        nombre_rutina=nombre_rutina,
        objetivo=objetivo,
        tiempo_disponible=tiempo_disponible,
        usuario=usuario
    )


class Rol(models.Model):
    nombre_rol = models.CharField(max_length=50)

    def __str__(self):
        return str(self.nombre_rol)  # Convertir a str explícitamente

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=100)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    rol = models.OneToOneField(Rol, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.nombre)  # Convertir a str explícitamente

class Ejercicio(models.Model):
    nombre_ejercicio = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    dificultad = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return str(self.nombre_ejercicio)  # Convertir a str explícitamente

class Rutina(models.Model):
    nombre_rutina = models.CharField(max_length=100)
    objetivo = models.CharField(max_length=100)
    tiempo_disponible = models.IntegerField()
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)  # Relación con el modelo 'User'

    def __str__(self):
        return self.nombre_rutina

class HistorialProgreso(models.Model):
    rutina = models.ForeignKey(Rutina, on_delete=models.CASCADE)
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    repeticiones = models.IntegerField()
    tiempo = models.FloatField()  # En minutos
    peso_usado = models.FloatField()

    def __str__(self):
        return f"{str(self.ejercicio)} - {str(self.fecha)}"
    
    
class Recomendacion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)  # Cambiar a User
    recomendacion_texto = models.TextField()
    fecha = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Recomendación para {self.usuario.username} - {self.fecha}"


