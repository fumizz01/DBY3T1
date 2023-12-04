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
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')),
    path('', views.home,name='to_home'),
    path('home', views.index, name='home'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register, name='register'),
    path('reserve', views.reserve, name='reserve'),
    path('my_reserve',views.MyReservationInfo.as_view(), name='my_reserve'),
    
    path('em/reserve',views.em_reserve, name='employee_reserve'),
    path('em/room_status',views.RoomStatusInfo.as_view(), name='employee_room_status'),
    path('em/register',views.em_register, name='employee_register'),
    path('em/login',views.em_login, name='em_login'),
    path('em/logout',views.em_logout, name='em_logout'),
    
    
    #get
    path('customer/list',views.CustomerAccountInformationList.as_view(), name='customer_info'),
    path('reservation/price',views.ReservationInfo.as_view(), name='reservation_price'),
    path('username/list',views.UsernameList.as_view(), name='username_list'),
    
    
    #post
    path('customer/register',views.CustomerRegister.as_view(), name='customer_register'),
    path('create/reserve',views.CreateReserve.as_view(), name='create_reserve'),
    path('change_password',views.change_password, name='change_password')
]
