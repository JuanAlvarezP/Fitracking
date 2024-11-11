#!/bin/bash
cd frontend
npm install
npm run build

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python3 manage.py migrate

# Crear archivos estáticos
python3 manage.py collectstatic --noinput
apt-get update && apt-get install -y libmysqlclient-dev
