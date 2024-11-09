from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Ejercicio, Rutina, Usuario, Rol
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate



@api_view(['POST'])
def register_user(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El nombre de usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        user.save()

        return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Credenciales incorrectas'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def crear_usuario(request):
    try:
        print("Solicitud autenticada. Usuario:", request.user)
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        usuario = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        return Response({'message': 'Usuario creado exitosamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Listar usuarios
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_usuarios(request):
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

    usuario.save()
    return Response({'message': 'Usuario actualizado exitosamente'})

# Eliminar usuario
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def eliminar_usuario(request, id):
    usuario = get_object_or_404(User, id=id)
    usuario.delete()
    return Response({'message': 'Usuario eliminado exitosamente'})

@api_view(['GET', 'POST'])
def ejercicios_list(request):
    if request.method == 'GET':
        ejercicios = Ejercicio.objects.all().values()
        return Response(list(ejercicios))
    elif request.method == 'POST':
        try:
            nombre_ejercicio = request.data.get('nombre_ejercicio')
            tipo = request.data.get('tipo')
            dificultad = request.data.get('dificultad')
            descripcion = request.data.get('descripcion')

            ejercicio = Ejercicio.objects.create(
                nombre_ejercicio=nombre_ejercicio,
                tipo=tipo,
                dificultad=dificultad,
                descripcion=descripcion
            )
            return Response({'message': 'Ejercicio creado exitosamente'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def listar_ejercicios(request):
    ejercicios = Ejercicio.objects.all().values()
    return Response(list(ejercicios))

@api_view(['POST'])
def crear_ejercicio(request):
    nombre = request.data.get('nombre_ejercicio')
    tipo = request.data.get('tipo')
    dificultad = request.data.get('dificultad')
    descripcion = request.data.get('descripcion')
    ejercicio = Ejercicio.objects.create(
        nombre_ejercicio=nombre,
        tipo=tipo,
        dificultad=dificultad,
        descripcion=descripcion
    )
    return Response({'message': 'Ejercicio creado exitosamente'}, status=status.HTTP_201_CREATED)

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
def crear_rutina(request):
    nombre_rutina = request.data.get('nombre_rutina')
    objetivo = request.data.get('objetivo')
    tiempo_disponible = request.data.get('tiempo_disponible')
    usuario_id = request.data.get('usuario_id')

    try:
        usuario = User.objects.get(id=usuario_id)
        rutina = Rutina.objects.create(
            nombre_rutina=nombre_rutina,
            objetivo=objetivo,
            tiempo_disponible=tiempo_disponible,
            usuario=usuario
        )
        return Response({'message': 'Rutina creada exitosamente'}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_400_BAD_REQUEST)

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
