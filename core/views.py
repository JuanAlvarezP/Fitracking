from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication

@api_view(['POST'])
def register_user(request):
    """
    Vista para registrar un nuevo usuario.
    """
    try:
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El nombre de usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            password=make_password(password),
            email=email,
        )
        user.save()

        return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    """
    Vista para obtener una lista de todos los usuarios (requiere autenticación).
    """
    users = User.objects.all().values('id', 'username', 'email')
    return Response(list(users))
