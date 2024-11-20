from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user, crear_usuario, listar_usuarios, editar_usuario, eliminar_usuario, ejercicios_list, listar_ejercicios, crear_ejercicio, editar_ejercicio, eliminar_ejercicio, listar_rutinas, crear_rutina, editar_rutina, eliminar_rutina, user_info, login_user, registrar_progreso, listar_progreso_usuario

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", register_user, name="register_user"),
    path("login/", login_user, name="login_user"),  # Agrega esta línea para la ruta del login
    path("user-info/", user_info, name="user_info"),
    path("usuarios/crear/", crear_usuario, name="crear_usuario"),
    path("usuarios/", listar_usuarios, name="listar_usuarios"),
    path("usuarios/editar/<int:id>/", editar_usuario, name="editar_usuario"),
    path("usuarios/eliminar/<int:id>/", eliminar_usuario, name="eliminar_usuario"),
    path("ejercicios/", listar_ejercicios, name="listar_ejercicios"),
    path("ejercicios/crear/", crear_ejercicio, name="crear_ejercicio"),
    path("ejercicios/editar/<int:id>/", editar_ejercicio, name="editar_ejercicio"),
    path("ejercicios/eliminar/<int:id>/", eliminar_ejercicio, name="eliminar_ejercicio"),
    path("rutinas/", listar_rutinas, name="listar_rutinas"),
    path("rutinas/crear/", crear_rutina, name="crear_rutina"),
    path("rutinas/editar/<int:id>/", editar_rutina, name="editar_rutina"),
    path("rutinas/eliminar/<int:id>/", eliminar_rutina, name="eliminar_rutina"),
    path('progreso/registrar/', registrar_progreso, name='registrar_progreso'),
    path('progreso/listar/<int:usuario_id>/', listar_progreso_usuario, name='listar_progreso_usuario'),
]
