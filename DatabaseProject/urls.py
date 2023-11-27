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
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')),
    path('', views.home,name='to_home'),
    path('home', views.index, name='home'),
    path('register', views.register, name='register'),
    path('reserve', views.reserve, name='reserve'),
    path('em/reserve',views.em_reserve, name='employee_reserve'),
    #path('my-reserve',views.my_reserve, name='my_reserve'),
    
    #get
    path('customer/list',views.CustomerAccountInformationList.as_view(), name='customer_info'),
    path('reservation/price',views.ReservationInfo.as_view(), name='reservation_price'),
    path('room/status',views.RoomStatusInfo.as_view(), name='room_status'),
    path('username/list',views.UsernameList.as_view(), name='username_list'),
    #path('reservation/list',views.ReservationList.as_view(), name='reservation_list'),
    
    
    #post
    #path('customer/register',views.register_user, name='register_user'),
    path('customer/register',views.CustomerRegister.as_view(), name='customer_register'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('create/reserve',views.CreateReserve.as_view(), name='create_reserve'),
    path('my-reserve',views.MyReservationInfo.as_view(), name='my_reserve'),
    
    path('em/register',views.em_register, name='employee_register'),
    path('em/login',views.em_login, name='em_login'),
    path('em/logout',views.em_logout, name='em_logout'),
    path('em/room-status',views.RoomStatusInfo.as_view(), name='employee_room_status'),
    #path('em/reserve',views.RoomStatusInfo.as_view(), name='employee_reserve'),
    
    #path('customer/login',views.login_customer, name='login_customer'),
    
    path('change-password',views.change_password, name='change_password')
]
