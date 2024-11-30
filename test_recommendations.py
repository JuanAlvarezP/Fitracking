from core.models import HistorialProgreso, Recomendacion
from django.contrib.auth.models import User

# Obtener el primer usuario
usuario = User.objects.first()

# Filtrar los progresos ordenados por fecha
progresos = HistorialProgreso.objects.filter(rutina__usuario=usuario).order_by('fecha')

# Variables para almacenar recomendaciones
recomendaciones = []
ejercicios = {}

# Agrupar los progresos por ejercicio
for progreso in progresos:
    if progreso.ejercicio.nombre_ejercicio not in ejercicios:
        ejercicios[progreso.ejercicio.nombre_ejercicio] = []
    ejercicios[progreso.ejercicio.nombre_ejercicio].append(progreso)

# Generar recomendaciones basadas en mejoras o estancamientos
for ejercicio, datos in ejercicios.items():
    if len(datos) < 2:
        continue

    mejoras = 0
    estancamiento = 0

    for i in range(1, len(datos)):
        anterior = datos[i - 1]
        actual = datos[i]

        if actual.repeticiones > anterior.repeticiones or actual.peso_usado > anterior.peso_usado:
            mejoras += 1
        elif actual.repeticiones == anterior.repeticiones and actual.peso_usado == anterior.peso_usado:
            estancamiento += 1

    if mejoras >= 2:
        recomendaciones.append(
            f"Has mejorado consistentemente en {ejercicio}. Considera aumentar el peso o la dificultad."
        )
    elif estancamiento >= 3:
        recomendaciones.append(
            f"Pareces estancado en {ejercicio}. Prueba una variación para romper la rutina."
        )

# Imprimir las recomendaciones
print("Recomendaciones generadas:")
for rec in recomendaciones:
    print(rec)
