from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Ejercicio, Rutina, User, Rol, HistorialProgreso, Recomendacion
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from datetime import timedelta, datetime
from django.utils.timezone import now
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db.models import Sum, F,Value, FloatField, IntegerField
from django.db.models.functions import Coalesce


@api_view(['POST'])
def register_user(request):
    try:
        # Obtener datos del request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Validar que todos los campos estén presentes
        if not username or not email or not password:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar el formato del correo electrónico
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'El correo electrónico tiene un formato inválido'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si el nombre de usuario ya existe
        if User.objects.filter(username=username).exists():
            return Response({'error': 'El nombre de usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar si el correo ya está registrado
        if User.objects.filter(email=email).exists():
            return Response({'error': 'El correo ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el usuario si todo es válido
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )

        return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)

    except ValidationError as ve:
        print(f"Error de validación: {ve}")
        return Response({'error': 'El correo electrónico tiene un formato inválido'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print(f"Error inesperado: {e}")  # Log de depuración
        return Response({'error': 'Ocurrió un error al registrar el usuario'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'is_staff': user.is_staff,
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
    })
    
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def crear_usuario(request):
    try:
        # Verificar si el usuario autenticado es administrador
        if not request.user.is_staff:
            return Response({'error': 'No tienes permisos para crear usuarios'}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        is_staff = request.data.get('is_staff', False)

        if not username or not email or not password:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        usuario = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            is_staff=is_staff
        )
        return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error al crear usuario:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Listar usuarios
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_usuarios(request):
    # Verificar si el usuario autenticado es administrador
    if not request.user.is_staff:
        return Response({'error': 'No tienes permiso para ver esta página.'}, status=status.HTTP_403_FORBIDDEN)

    # Si es administrador, listar los usuarios
    usuarios = User.objects.all().values('id', 'username', 'email', 'is_staff')
    return Response(list(usuarios))


# Editar usuario
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_usuario(request, id):
    usuario = get_object_or_404(User, id=id)
    usuario.username = request.data.get('username', usuario.username)
    usuario.email = request.data.get('email', usuario.email)
    if 'password' in request.data:
        usuario.set_password(request.data['password'])
    usuario.is_staff = request.data.get('is_staff', usuario.is_staff)
    usuario.save()
    return Response({'message': 'Usuario actualizado exitosamente'})

# Eliminar usuario
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_usuario(request, id):
    # Verificar si el usuario autenticado es administrador
    if not request.user.is_staff:
        return Response({'error': 'No tienes permisos para eliminar usuarios.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        # Verificar que el usuario a eliminar exista
        usuario = get_object_or_404(User, id=id)
        
        # Evitar que el administrador se elimine a sí mismo
        if usuario == request.user:
            return Response({'error': 'No puedes eliminar tu propia cuenta.'}, status=status.HTTP_400_BAD_REQUEST)

        usuario.delete()
        return Response({'message': 'Usuario eliminado exitosamente'}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def listar_ejercicios(request):
    ejercicios = Ejercicio.objects.all().values()
    return Response(list(ejercicios))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_ejercicio(request):
    nombre = request.data.get('nombre_ejercicio')
    tipo = request.data.get('tipo')
    dificultad = request.data.get('dificultad')
    descripcion = request.data.get('descripcion')

    # Lista de valores válidos para la dificultad
    DIFICULTADES_PERMITIDAS = ['Facil', 'Medio', 'Dificil']

    try:
        # Validar campos obligatorios
        if not all([nombre, tipo, dificultad]):
            return Response({'error': 'Los campos nombre, tipo y dificultad son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que el nombre del ejercicio sea único
        if Ejercicio.objects.filter(nombre_ejercicio=nombre).exists():
            return Response({'error': 'El nombre del ejercicio ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar dificultad
        if dificultad not in DIFICULTADES_PERMITIDAS:
            return Response({'error': f'La dificultad debe ser una de las siguientes: {", ".join(DIFICULTADES_PERMITIDAS)}'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Crear el ejercicio
        ejercicio = Ejercicio.objects.create(
            nombre_ejercicio=nombre,
            tipo=tipo,
            dificultad=dificultad,
            descripcion=descripcion
        )
        return Response({'message': 'Ejercicio creado exitosamente'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Error al crear el ejercicio: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def editar_ejercicio(request, id):
    ejercicio = get_object_or_404(Ejercicio, id=id)
    ejercicio.nombre_ejercicio = request.data.get('nombre_ejercicio', ejercicio.nombre_ejercicio)
    ejercicio.tipo = request.data.get('tipo', ejercicio.tipo)
    ejercicio.dificultad = request.data.get('dificultad', ejercicio.dificultad)
    ejercicio.descripcion = request.data.get('descripcion', ejercicio.descripcion)
    ejercicio.save()
    return Response({'message': 'Ejercicio actualizado exitosamente'})

@api_view(['DELETE'])
def eliminar_ejercicio(request, id):
    ejercicio = get_object_or_404(Ejercicio, id=id)
    ejercicio.delete()
    return Response({'message': 'Ejercicio eliminado exitosamente'})

@api_view(['GET'])
def listar_rutinas(request):
    rutinas = Rutina.objects.all().values()
    return Response(list(rutinas))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_rutina(request):
    nombre_rutina = request.data.get('nombre_rutina')
    objetivo = request.data.get('objetivo')
    tiempo_disponible = request.data.get('tiempo_disponible')
    usuario_id = request.data.get('usuario_id')

    try:
        # Validar campos obligatorios
        if not all([nombre_rutina, objetivo, tiempo_disponible, usuario_id]):
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar tiempo disponible
        try:
            tiempo_disponible = int(tiempo_disponible)
            if tiempo_disponible <= 0:
                return Response({'error': 'El tiempo disponible debe ser un número positivo'}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'El tiempo disponible debe ser un número válido'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar usuario
        usuario = get_object_or_404(User, id=usuario_id)

        # Verificar que el nombre de la rutina sea único para el usuario
        if Rutina.objects.filter(nombre_rutina=nombre_rutina, usuario=usuario).exists():
            return Response({'error': 'El usuario ya tiene una rutina con este nombre'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear la rutina
        rutina = Rutina.objects.create(
            nombre_rutina=nombre_rutina,
            objetivo=objetivo,
            tiempo_disponible=tiempo_disponible,
            usuario=usuario
        )
        return Response({'message': 'Rutina creada exitosamente'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Error al crear la rutina: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['PUT'])
def editar_rutina(request, id):
    rutina = get_object_or_404(Rutina, id=id)
    rutina.nombre_rutina = request.data.get('nombre_rutina', rutina.nombre_rutina)
    rutina.objetivo = request.data.get('objetivo', rutina.objetivo)
    rutina.tiempo_disponible = request.data.get('tiempo_disponible', rutina.tiempo_disponible)
    usuario_id = request.data.get('usuario_id', rutina.usuario.id)

    try:
        usuario = User.objects.get(id=usuario_id)
        rutina.usuario = usuario
        rutina.save()
        return Response({'message': 'Rutina actualizada exitosamente'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def eliminar_rutina(request, id):
    rutina = get_object_or_404(Rutina, id=id)
    rutina.delete()
    return Response({'message': 'Rutina eliminada exitosamente'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_progreso(request):
    try:
        usuario = request.user
        rutina_id = request.data.get('rutina_id')
        ejercicio_id = request.data.get('ejercicio_id')
        repeticiones = request.data.get('repeticiones')
        tiempo = request.data.get('tiempo')  # Tiempo en minutos
        peso_usado = request.data.get('peso_usado')
        fecha = request.data.get('fecha', datetime.now().date())  # Fecha opcional

        # Validar campos obligatorios
        if not all([rutina_id, ejercicio_id, repeticiones, tiempo, peso_usado]):
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        # Validar que los datos son numéricos donde corresponde
        try:
            repeticiones = int(repeticiones)
            tiempo = float(tiempo)  # Convertir tiempo a minutos
            peso_usado = float(peso_usado)
        except ValueError:
            return Response({'error': 'Repeticiones, tiempo y peso deben ser numéricos'}, status=status.HTTP_400_BAD_REQUEST)

        rutina = get_object_or_404(Rutina, id=rutina_id, usuario=usuario)
        ejercicio = get_object_or_404(Ejercicio, id=ejercicio_id)

        # Crear el progreso con los datos proporcionados
        progreso = HistorialProgreso.objects.create(
            rutina=rutina,
            ejercicio=ejercicio,
            repeticiones=repeticiones,
            tiempo=tiempo,  # En minutos
            peso_usado=peso_usado,
            fecha=fecha  # Asignar la fecha proporcionada
        )
        return Response({'message': 'Progreso registrado exitosamente'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_progreso_usuario(request):
    try:
        progreso = HistorialProgreso.objects.filter(rutina__usuario=request.user).values(
            'id', 'rutina__nombre_rutina', 'ejercicio__nombre_ejercicio', 'repeticiones', 'tiempo', 'peso_usado', 'fecha'
        )
        return Response(list(progreso), status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generar_recomendaciones_view(request):
    try:
        usuario = request.user  # Usuario autenticado de Django
        progresos = HistorialProgreso.objects.filter(rutina__usuario=usuario).order_by('fecha')
        recomendaciones = []
        
        
        ejercicios = {}

        # Agrupar por ejercicio
        for progreso in progresos:
            if progreso.ejercicio.nombre_ejercicio not in ejercicios:
                ejercicios[progreso.ejercicio.nombre_ejercicio] = []
            ejercicios[progreso.ejercicio.nombre_ejercicio].append(progreso)

        # Analizar los datos agrupados
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

        # Guardar  en la base de datos
        for recomendacion_texto in recomendaciones:
            Recomendacion.objects.create(usuario=usuario, recomendacion_texto=recomendacion_texto)

        return Response({'recomendaciones': recomendaciones}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error al generar recomendaciones: {e}")
        return Response({"message": "Error al generar recomendaciones."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_recomendaciones(request):
    usuario = request.user
    recomendaciones = Recomendacion.objects.filter(usuario__id=usuario.id).values('recomendacion_texto', 'fecha')
    return Response(list(recomendaciones))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reporte_progreso(request):
    try:
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')

        if not fecha_inicio or not fecha_fin:
            return Response({'error': 'Debe proporcionar fecha_inicio y fecha_fin'}, status=400)

        progresos = (
            HistorialProgreso.objects.filter(fecha__range=[fecha_inicio, fecha_fin])
            .values('ejercicio__nombre_ejercicio')
            .annotate(
                total_repeticiones=Coalesce(Sum('repeticiones', output_field=IntegerField()), Value(0, output_field=IntegerField())),
                total_tiempo=Coalesce(Sum('tiempo', output_field=FloatField()), Value(0, output_field=FloatField())),
                total_peso=Coalesce(Sum('peso_usado', output_field=FloatField()), Value(0, output_field=FloatField())),
                usuarios=F('rutina__usuario__username')
            )
            .order_by('-total_repeticiones')
        )

        if not progresos.exists():
            return Response({'message': 'No hay datos disponibles para este rango de fechas.'}, status=200)

        return Response(list(progresos), status=200)
    except Exception as e:
        print(f"Error en reporte_progreso: {str(e)}")
        return Response({'error': str(e)}, status=500)