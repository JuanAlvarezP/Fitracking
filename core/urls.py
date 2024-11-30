from django.urls import path
from .views import (register_user, login_user, user_info, crear_usuario, listar_usuarios,
                    editar_usuario, eliminar_usuario, listar_ejercicios, crear_ejercicio,
                    editar_ejercicio, eliminar_ejercicio, listar_rutinas, crear_rutina,
                    editar_rutina, eliminar_rutina, registrar_progreso, listar_progreso_usuario,
                    generar_recomendaciones_view, listar_recomendaciones)

urlpatterns = [
    path("register/", register_user, name="register_user"),
    path("login/", login_user, name="login_user"),
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
    path("progreso/registrar/", registrar_progreso, name="registrar_progreso"),
    path('progreso/listar/', listar_progreso_usuario, name='listar_progreso_usuario'),
    path("recomendaciones/generar/", generar_recomendaciones_view, name="generar_recomendaciones"),
    path("recomendaciones/", listar_recomendaciones, name="listar_recomendaciones"),
]
