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
from django.urls import path, include

from project import views

urlpatterns = [
    # redirect
    path("admin/", admin.site.urls),
    path("", include("django.contrib.auth.urls")),
    path("", views.redirectHome, name="to_home"),
    path("home", views.index, name="home"),
    path("login", views.loginUser, name="login"),
    path("logout", views.logoutUser, name="logout"),
    path("register", views.renderRegister, name="register"),
    path("reserve", views.renderReserve, name="reserve"),
    path("em/login", views.loginEm, name="em_login"),
    path("em/logout", views.logoutEm, name="em_logout"),
    # get
    path("customer/list", views.CustomerAccountInformationList.as_view(), name="customer_info"),
    path("reservation/price", views.ReservationInfo.as_view(), name="reservation_price"),
    path("username/list", views.UsernameList.as_view(), name="username_list"),
    path("my_reserve", views.MyReservationInfo.as_view(), name="my_reserve"),
    path("em/room_status", views.RoomStatusInfo.as_view(), name="employee_room_status"),
    # post
    path("em/reserve", views.updateReserveEm, name="employee_reserve"),
    path("em/register", views.registerEm, name="employee_register"),
    path("customer/register", views.registerCustomer, name="customer_register"),
    path("create/reserve", views.createReservation, name="create_reserve"),
    path("change_password", views.changePassword, name="change_password"),
]
