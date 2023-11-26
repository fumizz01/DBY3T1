from django.shortcuts import render, redirect
from django.http.response import HttpResponse
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.db import transaction
from django.http import JsonResponse


from django.views.generic import View
from django.http import JsonResponse
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.db.models import Max, Min, Sum, Count
from django.db import transaction
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import *
from .forms import *
import json
import re

def home(request):
    return HttpResponseRedirect(reverse('home'))
# Create your views here.
def index(request):
    return render(request, 'hotelpage.html')

def register(request):
    if request.POST:
        print (request.POST)
        firstname = request.POST.get('firstname')
        lastname = request.POST.get('lastname')
        birthday = request.POST.get('birthday')
        tol = request.POST.get('tol')
        id_number = request.POST.get('id_number')
        email = request.POST.get('email')
        password = request.POST.get('password')
        print(firstname)
        print(lastname)
        print(birthday)
        print(tol)
        print(id_number)
        print(email)
        print(password)
        return HttpResponseRedirect(reverse('login'))
    return render(request, 'register.html')

""" def login_page(request):
    return render(request, 'login.html') """

def reserve(request):
    if request.POST:
        print(request.POST)
    return render(request, 'reserve.html')

def em_login(request):
    if request.POST:
        return HttpResponseRedirect(reverse('employee_reserve'))
    return render(request, 'em_login.html')

def em_register(request):
    return render(request, 'em_register.html')

def em_reserve(request):
    return render(request, 'em_reserve.html')

def em_room_status(request):
    return render(request, 'em_room_status.html')

def my_reserve(request):
    return render(request, 'my_reserve.html')

def change_password(request):
    return render(request, 'change_password.html')

#-----------------------------GET-----------------------------------#
class CustomerAccountInformationList(View):
    def get(self, request):
        user_info = list(Customer.objects.select_related('user_code').all().values(
            'customer_id', 'user_code', 'identification_number', 'first_name', 'last_name', 'age', 'email'
            ,'phone_number', 'user_code__role'))
        
        #print(user_info)
        
        username_info = list(User.objects.all().values())
        
        data = dict()
        data['user_info'] = user_info
        
        for i, line_item in enumerate(data['user_info']):
            line_item['username'] = username_info[i]['username']
            
        print("OH YEAH")
        
        #print(data)
        return JsonResponse(data)   
    
class ReservationInfo(View):
    
    def get(self, request):
        
        reservation_info = list(Room.objects.select_related('room_type').filter(status='available').values('room_type' ,'room_type__room_price', 'room_type__room_capacity_adult', 'room_type__room_capacity_child').annotate(room_type_count=Count("room_type")))
        #print(reservation_info)
        
        data = dict()
        data['reservation_info'] = reservation_info
        print(data['reservation_info'])
        return JsonResponse(data)
    
class RoomStatusInfo(View):
    def get(self, request):
        room_status_info = list(Room.objects.select_related('').filter(status='available').values('room_type','room_type__room_price').annotate(room_type_count=Count("room_type")))
        #print(room_status_info)
        
        data = dict()
        data['room_status_info'] = room_status_info
        print(data['room_status_info'])
        return JsonResponse(data)

"""class CustomerRegister(View):
    @transaction.atomic
    def post(self, request):
        if (not request.POST):
            form = UserCreationForm()
            return render(request, 'register_user.html', {'form': form})
        
        
        if Customer.objects.count() != 0:        
            customer_id_max = Customer.objects.aggregate(Max('customer_id'))['customer_id__max']   
            customer_id_temp = [re.findall(r'\d+', customer_id_max)[0]][0]   
            next_customer_id = str(int(customer_id_temp)+1) + "CS"
            next_customer_id = next_customer_id.rjust(8, '0')
            #print(customer_id_temp)
        else:
            next_customer_id = "000000CS"
        
        if Account.objects.count() != 0:        
            user_id_max = Account.objects.aggregate(Max('user_id'))['user_id__max']   
            user_id_temp = [re.findall(r'\d+', user_id_max)[0]][0]   
            next_user_id = str(int(user_id_temp)+1) + "UA"
            next_user_id = next_user_id.rjust(8, '0')
            #print(user_id_temp)
        else:
            next_user_id = "000000UA"
        
        # Copy POST data and correct data type Ex 1,000.00 -> 1000.00
        request.POST = request.POST.copy()
        request.POST['customer_id'] = next_customer_id
        #request.POST['user_id'] = next_user_id
        request.POST['role'] = 'customer'
        
        if request.POST['age'] == '':
            request.POST['age'] == '0'
            
        #print(request.POST)

        data = dict()
        # Insert correct data to invoice
        form = UserForm(request.POST)
        if form.is_valid():
            print("FUCK YEAH BRO")
            account = form.save()
            

            # Insert correct data to invoice_line_item
            form_customer = CustomerForm(request.POST)
            try:
                form_customer.save()
            except :
                # Check something error to show and rollback transaction both invoice and invoice_line_item table
                data['error'] = form_customer.errors
                print (form_customer.errors)
                transaction.set_rollback(True)

            # if insert invoice and invoice_line_item success, return invoice data to caller
            data['account'] = model_to_dict(account)
        else:
            # if invoice from is not valid return error message
            data['error'] = form.errors
            print (form.errors)

        return JsonResponse(data)
        """
        
#-----------------------------POST-----------------------------------#
class CustomerRegister(View):
    @transaction.atomic
    def post(self, request):
        if (not request.POST):
            print("Da fuk?!?!? No request.POST")
            form = UserCreationForm()
            return render(request, 'register_user.html', {'form': form})
        
        print("Running Register")
        if Customer.objects.count() != 0:        
            customer_id_max = Customer.objects.aggregate(Max('customer_id'))['customer_id__max']   
            print(customer_id_max)
            customer_id_temp = [re.findall(r'\d+', customer_id_max)[0]][0]   
            next_customer_id = str(int(customer_id_temp)+1) + "CS"
            next_customer_id = next_customer_id.rjust(8, '0')
            #print(customer_id_temp)
        else:
            next_customer_id = "000000CS"
        

        if Profile.objects.count() != 0:        
            user_code_max = Profile.objects.aggregate(Max('user_code'))['user_code__max']   
            user_code_temp = [re.findall(r'\d+', user_code_max)[0]][0]   
            next_user_code = str(int(user_code_temp)+1) + "UA"
            next_user_code = next_user_code.rjust(8, '0')
            #print(user_code_temp)
        else:
            next_user_code = "000000UA"
            
        if Profile.objects.count() != 0:        
            user_id_max = Profile.objects.aggregate(Max('user_id'))['user_id__max']   
            user_id_temp = [re.findall(r'\d+', str(user_id_max))[0]][0]   
            next_user_id = str(int(user_id_temp)+1)
            #next_user_id = next_user_id.rjust(8, '0')
            #print(user_id_temp)
        else:
            next_user_id = "0"

        
        request.POST = request.POST.copy()
        request.POST['customer_id'] = next_customer_id
        request.POST['user_code'] = next_user_code
        request.POST['user_id'] = next_user_id
        request.POST['role'] = 'customer'
        
        if request.POST['age'] == '':
            request.POST['age'] == '0'

        #print(request.POST)

        data = dict()
        # Insert correct data to invoice
        
        print(request.POST)
        
        
        #----------------------------------------------------------------#
        
        
        
        form_user = UserCreationForm(request.POST)
        if form_user.is_valid():
            user = form_user.save()
            username = form_user.cleaned_data['username']
            password = form_user.cleaned_data['password1']
            
            user = authenticate(username=username, password=password)
            login(request, user)
            print('yay'*50)
            
        else:
            # if invoice from is not valid return error message
            data['error'] = form_user.errors
            print (form_user.errors)
            return JsonResponse(data)
            
        #----------------------------------------------------------------#
        
        # Insert correct data to invoice_line_item
        form_profile = ProfileForm(request.POST)
        if form_profile.is_valid():
            profile = form_profile.save(commit=False)
            profile.user = user
            
            profile.save()
        else :
            # Check something error to show and rollback transaction both invoice and invoice_line_item table
            data['error'] = form_profile.errors
            print (form_profile.errors)
            transaction.set_rollback(True)
            return JsonResponse(data)
        
        #----------------------------------------------------------------#
        form = CustomerForm(request.POST)
        if form.is_valid():
            print("Customer successfully")
            customer = form.save()
        
        else:
            data['error'] = form.errors
            print (form.errors)
            transaction.set_rollback(True)
            return JsonResponse(data)
        

        #----------------------------------------------------------------#
            
        
        
        #data['account'] = model_to_dict(customer)
        #data['profile'] = model_to_dict(profile)
        
        
        return JsonResponse(data)
        


def login_user(request):
    print(request.POST)
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            print("Login successful")
            return redirect('home')
        else:
            messages.success(request, ("ไม่สามารถล็อคอินด้วย username และ password ที่กรอกได้. กรุณาลองใหม่อีกครั้ง..."))
            print("Login failed")
            return redirect('login')
    else:
        return render(request, 'login.html', {})
    
def logout_user(request):
    logout(request)
    return redirect('login')
