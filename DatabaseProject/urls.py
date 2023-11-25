"""DatabaseProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from project import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='Index'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('reserve', views.reserve, name='reserve'),
    path('em',views.em_login, name='employee_login'),
    path('em/reserve',views.em_reserve, name='employee_reserve'),
    path('em/my-reserve',views.em_my_reserve, name='employee_my_reserve'),
    path('em/room-status',views.em_room_status, name='employee_room_status'),
]
