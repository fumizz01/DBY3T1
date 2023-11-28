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
from django.db.models import Max, Min, Sum, Count, F
from django.db import transaction
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import *
from .forms import *
import json
import re

from itertools import chain
from operator import attrgetter

def home(request):
    return HttpResponseRedirect(reverse('home'))
# Create your views here.
def index(request):
    if request.user.is_authenticated and request.user.profile.role == 'employee':
        logout(request)
        return redirect('login')
    
    return render(request, 'hotelpage.html')

def register(request):
    """if request.POST and not request.user.is_authenticated:
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
    return HttpResponseRedirect(reverse('login')) """

    if  request.user.is_authenticated:
        logout(request)
        return redirect('register')
        
    else:
        return render(request, 'register.html')
    

""" def login_page(request):
    return render(request, 'login.html') """

def reserve(request):
    #if request.POST:
    #    print(request.POST)
    if request.user.is_authenticated and request.user.profile.role == 'employee':
        logout(request)
        return redirect('login')
    
    return render(request, 'reserve.html')

def em_login(request):
    print(request.POST)
    if request.POST:
        
        username = request.POST['username']
        password = request.POST['password']
        

        user = authenticate(request, username=username, password=password)
        if user is not None:
            u = User.objects.get(username=username)
            print(u.profile.role)
            if u.profile.role == 'employee':
                login(request, user)
                print("Login successful")
                return redirect('employee_room_status')
            
        messages.success(request, ("ไม่สามารถล็อคอินด้วย username และ password ที่กรอกได้. กรุณาลองใหม่อีกครั้ง..."))
        print("Login failed")
        return redirect('em_login')
    
    elif request.user.is_authenticated:
        logout(request)
        return redirect('em_login')
    
    else:
        return render(request, 'em_login.html', {})

def em_logout(request):
    logout(request)
    return redirect('em_login')

@transaction.atomic
def em_register(request):
    if request.user.is_authenticated:
        logout(request)
        return redirect('em_login')
    
    if not request.POST:
        return render(request, 'em_register.html')
    
    
    if Employee.objects.count() != 0:        
            employee_id_max = Employee.objects.aggregate(Max('employee_id'))['employee_id__max']   
            print(employee_id_max)
            employee_id_temp = [re.findall(r'\d+', employee_id_max)[0]][0]   
            next_employee_id = str(int(employee_id_temp)+1) + "EM"
            next_employee_id = next_employee_id.rjust(8, '0')
            #print(employee_id_temp)
    else:
        next_employee_id = "000000EM"
        
    
    if Profile.objects.count() != 0:        
            user_code_max = Profile.objects.aggregate(Max('user_code'))['user_code__max']   
            user_code_temp = [re.findall(r'\d+', user_code_max)[0]][0]   
            next_user_code = str(int(user_code_temp)+1) + "UA"
            next_user_code = next_user_code.rjust(8, '0')
            #print(user_code_temp)
    else:
        next_user_code = "000000UA"
    
    print(request.POST)
    
    request.POST = request.POST.copy()
    request.POST['employee_id'] = next_employee_id
    request.POST['user_code'] = next_user_code
    request.POST['role'] = 'employee'
    data = dict()
    
    """ form_user = UserCreationForm(request.POST)
    form_profile = ProfileForm(request.POST)
    
    if form_user.is_valid() and form_profile.is_valid():
        user = form_user.save()
        username = form_user.cleaned_data['username']
        password = form_user.cleaned_data['password1']
        
        user = authenticate(username=username, password=password)
        login(request, user)
        
        user = form_user.save()
        username = form_user.cleaned_data['username']
        password = form_user.cleaned_data['password1']
        
        user = authenticate(username=username, password=password)
        login(request, user)
    
        profile = form_profile.save(commit=False)
        profile.user = user
        profile.save()
    else:
        
        if form_profile.errors:
            print('profile')
            data['error'] = form_user.errors
        else:
            print('user')
            data['error'] = form_profile.errors
        
        print("Empoyee register failed")
        return JsonResponse(data)"""
    
    form_user = UserCreationForm(request.POST)
    if form_user.is_valid():
        user = form_user.save()
        username = form_user.cleaned_data['username']
        password = form_user.cleaned_data['password1']
        
        user = authenticate(username=username, password=password)
        login(request, user)
        print("User Created Success")
        
    else:
        # if invoice from is not valid return error message
        data['error'] = form_user.errors
        print (form_user.errors)
        print('fail at User create...')
        return JsonResponse(data)
        
    #----------------------------------------------------------------#
    
    # Insert correct data to invoice_line_item
    form_profile = ProfileForm(request.POST)
    if form_profile.is_valid():
        profile = form_profile.save(commit=False)
        profile.user = user
        
        profile.save()
        print("Profile Created Success")
    else :
        # Check something error to show and rollback transaction both invoice and invoice_line_item table
        data['error'] = form_profile.errors
        print (form_profile.errors)
        print('fail at Profile create...')
        transaction.set_rollback(True)
        return JsonResponse(data)
    
    #----------------------------------------------------------------#
    form = EmployeeForm(request.POST)
    if form.is_valid():
        print("Employee successfully")
        employee = form.save()
        
    else:
        data['error'] = form.errors
        print (form.errors)
        print('fail at Employee create...')
        transaction.set_rollback(True)
        return JsonResponse(data)
    

    #----------------------------------------------------------------#
        
    
    
    #data['account'] = model_to_dict(customer)
    #data['profile'] = model_to_dict(profile)
    
    #print("User Created Successfully without problems")
    
    print("Empoyee register successful")
    return redirect('employee_room_status')

def em_reserve(request):
    
    if not request.user.is_authenticated:
        return redirect('em_login')
    
    elif request.user.profile.role == 'customer':
        logout(request)
        return redirect('em_login')
    
    if request.POST:
        with transaction.atomic():   
            
            room_number_update = ReservationLineItem.objects.filter(reservation_id=request.POST['reservation_id']).values()
                
            if request.POST['submit-as'] == 'cancel':
                Reservation.objects.filter(reservation_id=request.POST['reservation_id']).update(status='cancelled')
                for item in room_number_update:
                    Room.objects.filter(room_number=item['room_number_id']).update(status='available')
                    
            elif request.POST['submit-as'] == 'confirm':
                Reservation.objects.filter(reservation_id=request.POST['reservation_id']).update(status='confirmed')
                
            return redirect('employee_reserve')
                
    reserve_info = list(ReservationLineItem.objects.select_related('reservation_id').filter(reservation_id__status='unpaid').values(
        'reservation_id', 'reservation_id__customer_id', 'reservation_id__check_in', 'reservation_id__check_out',
        'reservation_id__total_price').order_by('reservation_id').annotate(room_count = Count('room_number')))
    
    data = dict()
    data['reserve_info'] = reserve_info
    
    print(data['reserve_info'])
    
    return render(request, 'em_reserve.html', data)

""" def em_room_status(request):
    
    if not request.user.is_authenticated:
        return redirect('em_login')
    
    elif request.user.profile.role == 'customer':
        logout(request)
        return redirect('em_login')
    
    return render(request, 'em_room_status.html') """

""" def my_reserve(request):
    return render(request, 'my_reserve.html') """

def change_password(request):
    return render(request, 'change_password.html')

#-----------------------------GET-----------------------------------#
class CustomerAccountInformationList(View):
    def get(self, request):
        print("Get Customer Info")
        user_info = list(Customer.objects.select_related('user_code').all().values(
            'customer_id', 'user_code', 'identification_number', 'first_name', 'last_name', 'age', 'email'
            ,'phone_number', 'user_code__role'))
        
        #print(user_info)
        
        username_info = list(User.objects.all().values('username'))
        
        data = dict()
        data['user_info'] = user_info
        
        """ for i, line_item in enumerate(data['user_info']):
            line_item['username'] = username_info[i]['username'] """
        
        data['username_list'] = username_info
            
        
        print(data)
        return JsonResponse(data)   
    
class UsernameList(View):
    def get(self, request):
        username_list = list(User.objects.select_related('profile').all().values('username', 'profile__user_code'))
        
        print(username_list)
        
        data = dict()
        data['username_list'] = username_list
        return JsonResponse(data)  
    
class ReservationInfo(View):
    
    def get(self, request):
        
        reservation_info = list(RoomDetail.objects.all().values('room_type' ,'room_price', 'room_capacity_adult', 'room_capacity_child').distinct())
        #print(reservation_info)
        data = dict()
        data['reservation_info'] = reservation_info
        for res in data['reservation_info']:
            res['room_type_count'] = Room.objects.filter(status='available', room_type=res['room_type']).count()
            
        print(data['reservation_info'])
        return JsonResponse(data)
    

class RoomStatusInfo(View):
    def get(self, request):
        
        if not request.user.is_authenticated:
            return redirect('em_login')
        
        elif request.user.profile.role == 'customer':
            logout(request)
            return redirect('em_login')
        
        room_status_info = list(Room.objects.select_related(
            'room_type').filter(status='available').values('room_number', 'room_type__room_price', 'status'))
        #print(room_status_info)


        reserve_info = list(ReservationLineItem.objects.select_related(
            'reservation_id', 'room_number', 'room_number__room_type').all()
                                .values('room_number', 'reservation_id__check_in', 'reservation_id__check_out', 
                                        'reservation_id__customer_id', 'room_number__room_type__room_price',
                                        'room_number__status').order_by('room_number'))

        #print(data['room_status_info'])
        

        """for item in data['room_status_info']:
            if item['status'] == 'unavailable': """
        
        temp_data = dict()
        
        temp_data['rs'] = room_status_info
        
        for rs_item in temp_data['rs']:
            rs_item['reservation_id__check_in'] = '-'
            rs_item['reservation_id__check_out'] = '-'
            rs_item['reservation_id__customer_id'] = '-'
            rs_item['room_number__room_type__room_price'] = rs_item['room_type__room_price']
            rs_item['room_number__status'] = rs_item['status']
            
        data = dict()
            
        result_list = list(chain(room_status_info, reserve_info))
        
        
        data['room_status'] = result_list
        
        data['room_status'] = sorted(data['room_status'], key=lambda x: x['room_number'])
        print(data['room_status'])
        
        return render(request, 'em_room_status.html', data)

    
""" 
class RoomStatusInfo(View):
    def get(self, request):
        room_status_info = list(ReservationLineItem.objects.select_related(
            'reservation_id', 'reservation_id__customer_id', 
            'room_number', 'room_number__room_type').all()
                                .values('room_number', 'reservation_id__check_in', 'reservation_id__check_out', 
                                        'room_number__room_type__room_price', 'reservation_id__customer_id', 
                                        'reservation_id__status').order_by('room_number'))
        
        room_no_info = list(Room.objects.all().values('room_number').order_by('room_number'))
        #print(room_status_info)
        
        max_room_number = ReservationLineItem.objects.aggregate(Max('room_number'))['room_number__max']
        
        data = dict()
        data['room_status'] = room_no_info
        #print(room_no_info)
        #print('ayyayayayay')
        #print(room_status_info)
        
        if not room_status_info:
            for item in (data['room_status']):
                item['check_in'] = ''
                item['check_out'] = ''
                item['room_price'] = ''
                item['customer_id'] = ''
                item['status'] = '' 
            return render(request, 'em_room_status.html', data)
        #print(max_room_number)
        i = 0
        #print(room_status_info)
        for item in (data['room_status']):
            #print(room_status_info[i])
            
            #print(item['room_number'] <= max_room_number)
            #print(i, item['room_number'], room_status_info[i]['room_number'])
            if (item['room_number'] <= max_room_number) and item['room_number'] == room_status_info[i]['room_number']:
                item['check_in'] = room_status_info[i]['reservation_id__check_in']
                item['check_out'] = room_status_info[i]['reservation_id__check_out']
                item['room_price'] = room_status_info[i]['room_number__room_type__room_price']
                item['customer_id'] = room_status_info[i]['reservation_id__customer_id']
                item['status'] = room_status_info[i]['reservation_id__status']
                i += 1
            else:
                item['check_in'] = ''
                item['check_out'] = ''
                item['room_price'] = ''
                item['customer_id'] = ''
                item['status'] = ''     
            
        print(data['room_status'])
        return render(request, 'em_room_status.html', data) """
        
        
    
class MyReservationInfo(View):
    def get(self ,request):
        
        if not request.user.is_authenticated:
            return redirect('login')
        
        elif request.user.profile.role == 'employee':
            logout(request)
            return redirect('login')
        
        my_id = getCustomerId(request)
        
        my_reserve_info = list(ReservationLineItem.objects.select_related('reservation_id').values(
            'reservation_id', 'reservation_id__check_in', 'reservation_id__check_out', 
            'reservation_id__total_price', 'reservation_id__status').filter(reservation_id__customer_id=my_id).annotate(room_count=Count('room_number')))
        
        
        data={}
        data['my_reserve_info'] = my_reserve_info
        
        sum_total_price = Reservation.objects.filter(customer_id=my_id).aggregate(Sum('total_price'))['total_price__sum']
        data['sum_total_price'] = sum_total_price
        
        print(data)
        return render(request, 'my_reserve.html', data)

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
class CreateReserve(View):
    @transaction.atomic
    def post(self, request):
        
        if Reservation.objects.count() != 0:        
            reservation_id_max = Reservation.objects.aggregate(Max('reservation_id'))['reservation_id__max']   
            print(reservation_id_max)
            reservation_id_temp = [re.findall(r'\d+', reservation_id_max)[0]][0]   
            next_reservation_id = str(int(reservation_id_temp)+1) + "RS"
            next_reservation_id = next_reservation_id.rjust(8, '0')
            #print(reservation_id_temp)
        else:
            next_reservation_id = "000000RS"
        
        customer_id = getCustomerId(request)
        
        # reservation #
        request.POST = request.POST.copy()
        request.POST['reservation_id'] = next_reservation_id
        request.POST['customer_id'] = customer_id
        request.POST['status'] = 'unpaid'
        
        data = dict()
        
        form_reservation = ReservationForm(request.POST)
        if form_reservation.is_valid():
            reservation = form_reservation.save()
            
            total_rooms = int(request.POST['num_single_room']) + int(request.POST['num_double_room'])
            available_rooms = list()
            
            available_single_room = Room.objects.filter(status='available', room_type='single bed').order_by('room_number')
            print(available_single_room)
            with transaction.atomic():
                for _ in range(int(request.POST['num_single_room'])):
                    print(available_single_room[0].room_number)
                    available_rooms.append(available_single_room[0].room_number)
                    Room.objects.filter(room_number=available_single_room[0].room_number).update(status='unavailable')
                    #available_single_room[i].status = "unavailable"
                    #available_single_room[i].save()
                    #Room.objects.bulk_update(available_single_room, ["status"])
            
            available_double_room = Room.objects.filter(status='available', room_type='double bed').order_by('room_number')
            print(available_double_room)
            with transaction.atomic():   
                for _ in range(int(request.POST['num_double_room'])):
                    print(available_double_room[0].room_number)
                    available_rooms.append(available_double_room[0].room_number)
                    Room.objects.filter(room_number=available_double_room[0].room_number).update(status='unavailable')
                    
                    #available_double_room[i].status = "unavailable"
                    #available_double_room[i].save()
                    #Room.objects.bulk_update(available_double_room, ["status"])
                
            # reservation line item #
            for i in range(total_rooms):
                lineitem = dict()
                lineitem['reservation_id'] = next_reservation_id
                lineitem['item_no'] = i + 1
                lineitem['room_number'] = available_rooms[i]
                
                formlineitem = ReservationLineItemForm(lineitem)
                
                try:
                    formlineitem.save()
                    pass
                except :
                    # Check something error to show and rollback transaction both invoice and invoice_line_item table
                    data['error'] = formlineitem.errors
                    print (formlineitem.errors)
                    transaction.set_rollback(True)
                    return JsonResponse(data)
            
        else:
            data['error'] = form_reservation.errors
            print (form_reservation.errors)
            return JsonResponse(data)
        
        print(request.POST)
        return redirect('my_reserve')
        
        

class CustomerRegister(View):
    @transaction.atomic
    def post(self, request):
        if (not request.POST):
            print("Go to register page")
            form = UserCreationForm()
            return render(request, 'register_user.html', {'form': form})
        
        print("Registering.....")
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
            print("User Created Success")
            
        else:
            # if invoice from is not valid return error message
            data['error'] = form_user.errors
            print (form_user.errors)
            print('fail at User create...')
            return JsonResponse(data)
            
        #----------------------------------------------------------------#
        
        # Insert correct data to invoice_line_item
        form_profile = ProfileForm(request.POST)
        if form_profile.is_valid():
            profile = form_profile.save(commit=False)
            profile.user = user
            
            profile.save()
            print("Profile Created Success")
        else :
            # Check something error to show and rollback transaction both invoice and invoice_line_item table
            data['error'] = form_profile.errors
            print (form_profile.errors)
            print('fail at Profile create...')
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
            print('fail at Customer create...')
            transaction.set_rollback(True)
            return JsonResponse(data)
        

        #----------------------------------------------------------------#
            
        
        
        #data['account'] = model_to_dict(customer)
        #data['profile'] = model_to_dict(profile)
        
        print("User Created Successfully without problems")
        
        return JsonResponse(data)
        


def login_user(request):
    #print(request.POST)
    print("Enter login page")
    if request.POST:
        print("Loging in....")

        username = request.POST['username']
        password = request.POST['password']
        

        user = authenticate(request, username=username, password=password)
        if user is not None:
            u = User.objects.get(username=username)
            print(u.profile.role)
            if u.profile.role == 'customer':
                login(request, user)
                print("Login successful")
                return redirect('home')
            
        messages.success(request, ("ไม่สามารถล็อคอินด้วย username และ password ที่กรอกได้. กรุณาลองใหม่อีกครั้ง..."))
        print("Login failed")
        return redirect('login')
        
    elif request.user.is_authenticated:
        logout(request)
        return redirect('login')
    
    else:
        
        return render(request, 'login.html', {})
    
def logout_user(request):
    logout(request)
    return redirect('login')


def getCustomerId(request):
    field_name = 'customer_id'
    field_object = Customer._meta.get_field(field_name)
    customer_id = Customer.objects.get(user_code=request.user.profile.user_code)
    customer_id = getattr(customer_id, field_object.attname)
    return customer_id
    
