from django.core.management.base import BaseCommand
from core.models import Usuario, Rutina, Ejercicio, HistorialProgreso
from django.utils.timezone import now
import random

class Command(BaseCommand):
    help = "Genera datos de prueba para la base de datos."

    def handle(self, *args, **kwargs):
        self.stdout.write("Generando datos de prueba...")

        # Crear usuarios de prueba si no existen
        usuarios = Usuario.objects.all()
        if not usuarios.exists():
            for i in range(3):
                Usuario.objects.create(
                    nombre=f"Usuario {i + 1}",
                    email=f"user{i + 1}@example.com",
                    contraseña="password"
                )

        # Crear ejercicios de prueba si no existen
        ejercicios = Ejercicio.objects.all()
        if not ejercicios.exists():
            for i in range(5):
                Ejercicio.objects.create(
                    nombre_ejercicio=f"Ejercicio {i + 1}",
                    tipo="Cardio" if i % 2 == 0 else "Fuerza",
                    dificultad="Media",
                    descripcion="Descripción de prueba"
                )

        # Crear rutinas de prueba si no existen
        rutinas = Rutina.objects.all()
        if not rutinas.exists():
            usuarios = Usuario.objects.all()
            for i, usuario in enumerate(usuarios):
                Rutina.objects.create(
                    nombre_rutina=f"Rutina {i + 1}",
                    objetivo="Perder peso" if i % 2 == 0 else "Ganar músculo",
                    tiempo_disponible=30 + i * 10,
                    usuario=usuario
                )

        # Crear historial de progreso
        rutinas = Rutina.objects.all()
        ejercicios = Ejercicio.objects.all()
        for rutina in rutinas:
            for i in range(3):
                HistorialProgreso.objects.create(
                    rutina=rutina,
                    ejercicio=random.choice(ejercicios),
                    fecha=now().date(),
                    repeticiones=random.randint(8, 15),
                    tiempo=random.randint(30, 120),
                    peso_usado=random.uniform(5, 20)
                )

        self.stdout.write(self.style.SUCCESS("Datos de prueba generados correctamente."))
