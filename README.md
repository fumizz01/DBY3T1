<h1 align="center">DBY3T1</h1>
<p align="center">
  <img alt="" src="https://img.shields.io/github/contributors/fumizz01/DBY3T1.svg">
  <img alt="" src="https://img.shields.io/github/last-commit/fumizz01/DBY3T1.svg">
</p>

# Require
Download & Install [PostgresSQL](https://www.postgresql.org/download/)   
> ➕PostgreSQL Server (database engine)      
> ➕pgAdmin 4 (Web interface for Administations)          
> ➕Command Line Tool

Install postgresql driver for python: psycopg2
```sh
pip install psycopg2
```
Django
```sh
pip install Django
```
Live server for Django
```sh
pip install django-livereload-server
```
# Edit Data Base for PostgreSQL
edit [setting.py](DatabaseProject/settings.py)
```py
DATABASES = {
  'default': {
  'ENGINE': 'django.db.backends.postgresql_psycopg2',
  'NAME': 'name_database',
  'USER': 'postgres',
  'PASSWORD': 'password',
  'HOST': 'localhost',
  'PORT': '',
  }
}
```
# Create Database
make migration files
```sh
python manage.py makemigrations
```
migrate database
```sh
python manage.py migrate
```

# Run Server
Optional run Liveserver
```sh
python manage.py livereload
```
start server
```sh
python manage.py runserver
#defualt to port 8000 or edit port
python manage.py runserver [port]
```
Then open Browser to http://localhost:8000/
