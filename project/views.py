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


# หากเข้า domain แบบไม่มี path ให้ redirect ไปหน้า home
def redirectHome(request):
    return HttpResponseRedirect(reverse("home"))


# หน้า home สำหรับจองห้องพัก
def index(request):
    # เข้าได้แค่คนที่ไม่ล็อคอิน หรือ คนที่ล็อคอินเป็น customer
    if request.user.is_authenticated and request.user.profile.role == "employee":
        logout(request)
        return redirect("login")

    return render(request, "homepage.html")


# redirect ไปหน้า register สำหรับ customer
def renderRegister(request):
    # เข้าได้แค่คนที่ไม่ล็อคอิน
    if request.user.is_authenticated:
        logout(request)
        return redirect("register")

    else:
        return render(request, "register.html")


# หน้ากดจองห้องพัก
def renderReserve(request):
    # เข้าได้แค่คนที่ไม่ล็อคอิน หรือ คนที่ล็อคอินเป็น customer
    if request.user.is_authenticated and request.user.profile.role == "employee":
        logout(request)
        return redirect("login")

    return render(request, "reserve.html")


# หน้าล็อคอินสำหรับ employee
def loginEm(request):
    print(request.POST)
    # กรณีกดปุ่ม submit การล็อคอิน
    if request.POST:
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
        # ตรวจสอบว่ามี user อยู่ในระบบไหม
        if user is not None:
            u = User.objects.get(username=username)
            print(u.profile.role)
            # ตรวจสอบว่า user เป็น employee ไหม
            if u.profile.role == "employee":
                login(request, user)
                print("Login successful")
                return redirect("employee_room_status")

        # ข้อความ error
        messages.success(
            request,
            (
                "ไม่สามารถล็อคอินด้วย username และ password ที่กรอกได้. กรุณาลองใหม่อีกครั้ง..."
            ),
        )
        print("Login failed")
        return redirect("em_login")

    # กรณีคนที่ล็อคอินอยู่แล้วพยายามเข้ามาหน้านี้ (เข้าได้แค่คนที่ไม่ล็อคอิน)
    elif request.user.is_authenticated:
        logout(request)
        return redirect("em_login")

    # กรณีคนที่ไม่ล็อคอินเข้าหน้านี้
    else:
        return render(request, "em_login.html", {})


# เมื่อกดปุ่มล็อคเอ้าท์ในฝั่ง employee
def logoutEm(request):
    logout(request)
    return redirect("em_login")

# หน้าล็อคอินสำหรับ customer
def loginUser(request):
    print("Enter login page")
    # กรณีกดปุ่ม submit การล็อคอิน
    if request.POST:
        print("Loging in....")

        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
        # ตรวจสอบว่ามี user อยู่ในระบบไหม
        if user is not None:
            u = User.objects.get(username=username)
            print(u.profile.role)
            # ตรวจสอบว่า user เป็น employee ไหม
            if u.profile.role == "customer":
                login(request, user)
                print("Login successful")
                return redirect("home")

        messages.success(
            request,
            (
                "ไม่สามารถล็อคอินด้วย username และ password ที่กรอกได้. กรุณาลองใหม่อีกครั้ง..."
            ),
        )
        print("Login failed")
        return redirect("login")
    
    # กรณีคนที่ล็อคอินอยู่แล้วพยายามเข้ามาหน้านี้ (เข้าได้แค่คนที่ไม่ล็อคอิน)
    elif request.user.is_authenticated:
        logout(request)
        return redirect("login")
    
    # กรณีคนที่ไม่ล็อคอินเข้าหน้านี้
    else:
        return render(request, "login.html", {})

# เมื่อกดปุ่มล็อคเอ้าท์ในฝั่ง customer
def logoutUser(request):
    logout(request)
    return redirect("login")

# กดปุ่มเปลี่ยนรหัสผ่าน
def changePassword(request):
    return render(request, "change_password.html")


# -----------------------------GET-----------------------------------#
# ข้อมูลบัญชีของลูกค้า
class CustomerAccountInformationList(View):
    def get(self, request):
        print("Get Customer Info")
        user_info = list(
            Customer.objects.select_related("user_code")
            .all()
            .values(
                "customer_id",
                "user_code",
                "identification_number",
                "first_name",
                "last_name",
                "age",
                "email",
                "phone_number",
                "user_code__role",
            )
        )

        # print(user_info)

        username_info = list(User.objects.all().values("username"))

        data = dict()
        data["user_info"] = user_info

        """ for i, line_item in enumerate(data['user_info']):
            line_item['username'] = username_info[i]['username'] """

        data["username_list"] = username_info

        print(data)
        return JsonResponse(data)

# ข้อมูลชื่อและรหัสผู้ใช้ทั้งหมด
class UsernameList(View):
    def get(self, request):
        username_list = list(
            User.objects.select_related("profile")
            .all()
            .values("username", "profile__user_code")
        )

        print(username_list)

        data = dict()
        data["username_list"] = username_list
        return JsonResponse(data)

# ข้อมูลการจอง
class ReservationInfo(View):
    def get(self, request):
        reservation_info = list(
            RoomDetail.objects.all()
            .values(
                "room_type", "room_price", "room_capacity_adult", "room_capacity_child"
            )
            .distinct()
        )
        # print(reservation_info)
        data = dict()
        data["reservation_info"] = reservation_info
        for res in data["reservation_info"]:
            res["room_type_count"] = Room.objects.filter(
                status="available", room_type=res["room_type"]
            ).count()

        print(data["reservation_info"])
        return JsonResponse(data)

# ข้อมูลของห้องและสถานะ
class RoomStatusInfo(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return redirect("em_login")

        elif request.user.profile.role == "customer":
            logout(request)
            return redirect("em_login")

        room_status_info = list(
            Room.objects.select_related("room_type")
            .all()
            .values("room_number", "room_type__room_price", "status").order_by("room_number")
        )
        # print(room_status_info)

        reserve_info = list(
            ReservationLineItem.objects.select_related("reservation_id", "room_number").filter(room_number__status = "unavailable")
            .values(
                "room_number",
                "reservation_id",
                "room_number__status",
                "reservation_id__check_in",
                "reservation_id__check_out",
                "reservation_id__customer_id",
            )
            .order_by("room_number", "-reservation_id").distinct("room_number")
        )
        
        data = dict()
        data['room_status'] = room_status_info
        data['reserve_info'] = reserve_info
            
        i = 0
        for item in data["room_status"]:
            try:
                reserve_info = data["reserve_info"][i]
                if item["status"] == "unavailable" and item['room_number'] == reserve_info["room_number"]:
                    item["check_in"] = reserve_info["reservation_id__check_in"]
                    item["check_out"] = reserve_info["reservation_id__check_out"]
                    item["customer_id"] = reserve_info["reservation_id__customer_id"]
                    #item["customer_id"] = reserve_info["reservation_id"] ใช้สำหรับ debug
                    i += 1
                
                elif item["status"] == "available" and item['room_number'] == reserve_info["room_number"]:
                    item["check_in"] = "-"
                    item["check_out"] = "-"
                    item["customer_id"] = "-"
                    i += 1
                else:
                    item["check_in"] = "-"
                    item["check_out"] = "-"
                    item["customer_id"] = "-"
            except IndexError: # ถ้าเกิด IndexError แปลว่าห้องหมายเลขหลังจากนี้จะว่างเสมอ
                item["check_in"] = "-"
                item["check_out"] = "-"
                item["customer_id"] = "-"
                
        return render(request, "em_room_status.html", data)
    
# หน้าแสดงข้อมูลการจองของ user
class MyReservationInfo(View):
    def get(self, request):
        # เข้าได้แค่คนที่ล็อคอินเป็น customer
        if not request.user.is_authenticated:
            return redirect("login")

        elif request.user.profile.role == "employee":
            logout(request)
            return redirect("login")

        my_id = getCustomerId(request)

        my_reserve_info = list(
            ReservationLineItem.objects.select_related("reservation_id")
            .values(
                "reservation_id",
                "reservation_id__check_in",
                "reservation_id__check_out",
                "reservation_id__total_price",
                "reservation_id__status",
            )
            .filter(reservation_id__customer_id=my_id)
            .annotate(room_count=Count("room_number"))
        )

        data = {}
        data["my_reserve_info"] = my_reserve_info

        sum_total_price = Reservation.objects.filter(customer_id=my_id).aggregate(
            Sum("total_price")
        )["total_price__sum"]
        data["sum_total_price"] = sum_total_price

        print(data)
        return render(request, "my_reserve.html", data)


# -----------------------------POST-----------------------------------#

# บันทึกข้อมูลการจองของ customer
@transaction.atomic
def createReservation(self, request):
    
    # สร้างรหัสการจองหมายเลขต่อไป
    if Reservation.objects.count() != 0:
        reservation_id_max = Reservation.objects.aggregate(Max("reservation_id"))[
            "reservation_id__max"
        ]
        print(reservation_id_max)
        reservation_id_temp = [re.findall(r"\d+", reservation_id_max)[0]][0]
        next_reservation_id = str(int(reservation_id_temp) + 1) + "RS"
        next_reservation_id = next_reservation_id.rjust(8, "0")
        # print(reservation_id_temp)
    else:
        next_reservation_id = "000000RS"

    customer_id = getCustomerId(request)

    
    request.POST = request.POST.copy()
    request.POST["reservation_id"] = next_reservation_id
    request.POST["customer_id"] = customer_id
    request.POST["status"] = "unpaid"

    data = dict()

    form_reservation = ReservationForm(request.POST)
    if form_reservation.is_valid():
        # บันทึกข้อมูลการจองในตาราง reservation สำเร็จ
        reservation = form_reservation.save()
        
        # เปลี่ยนสถานะห้องที่จองให้เป็น unavailable 
        total_rooms = int(request.POST["num_single_room"]) + int(
            request.POST["num_double_room"]
        )
        available_rooms = list()

        available_single_room = Room.objects.filter(
            status="available", room_type="single bed"
        ).order_by("room_number")
        print(available_single_room)
        with transaction.atomic():
            for _ in range(int(request.POST["num_single_room"])):
                print(available_single_room[0].room_number)
                available_rooms.append(available_single_room[0].room_number)
                Room.objects.filter(
                    room_number=available_single_room[0].room_number
                ).update(status="unavailable")

        available_double_room = Room.objects.filter(
            status="available", room_type="double bed"
        ).order_by("room_number")
        print(available_double_room)
        with transaction.atomic():
            for _ in range(int(request.POST["num_double_room"])):
                print(available_double_room[0].room_number)
                available_rooms.append(available_double_room[0].room_number)
                Room.objects.filter(
                    room_number=available_double_room[0].room_number
                ).update(status="unavailable")
                
        # บันทึกข้อมูลรายละเอียดการจองในตาราง reservation_line_item
        for i in range(total_rooms):
            lineitem = dict()
            lineitem["reservation_id"] = next_reservation_id
            lineitem["item_no"] = i + 1
            lineitem["room_number"] = available_rooms[i]

            formlineitem = ReservationLineItemForm(lineitem)

            try:
                formlineitem.save()
                # บันทึกข้อมูลรายละเอียดการจองนั้นๆสำเร็จ
            except:
                # บันทึกข้อมูลรายละเอียดการจองไม่สำเร็จ
                data["error"] = formlineitem.errors
                print(formlineitem.errors)
                transaction.set_rollback(True) #ย้อนกลับการบันทึกข้อมูลก่อนหน้า
                return JsonResponse(data)

    else:
        # บันทึกข้อมูลการจองไม่สำเร็จ
        data["error"] = form_reservation.errors
        print(form_reservation.errors)
        return JsonResponse(data)

    print(request.POST)
    return redirect("my_reserve")

# บันทึกข้อมูลการสมัครใช้งานของ customer
@transaction.atomic
def registerCustomer(self, request):

    print("Registering.....")
    # สร้างรหัสลูกค้าหมายเลขต่อไป
    if Customer.objects.count() != 0:
        customer_id_max = Customer.objects.aggregate(Max("customer_id"))[
            "customer_id__max"
        ]
        print(customer_id_max)
        customer_id_temp = [re.findall(r"\d+", customer_id_max)[0]][0]
        next_customer_id = str(int(customer_id_temp) + 1) + "CS"
        next_customer_id = next_customer_id.rjust(8, "0")
        # print(customer_id_temp)
    else:
        next_customer_id = "000000CS"
        
    # สร้างรหัสผู้ใช้หมายเลขต่อไป
    if Profile.objects.count() != 0:
        user_code_max = Profile.objects.aggregate(Max("user_code"))[
            "user_code__max"
        ]
        user_code_temp = [re.findall(r"\d+", user_code_max)[0]][0]
        next_user_code = str(int(user_code_temp) + 1) + "UA"
        next_user_code = next_user_code.rjust(8, "0")
        # print(user_code_temp)
    else:
        next_user_code = "000000UA"
        
    # สร้างรหัส user id สำหรับเชื่อมตารางใน database เลขต่อไป
    if Profile.objects.count() != 0:
        user_id_max = Profile.objects.aggregate(Max("user_id"))["user_id__max"]
        user_id_temp = [re.findall(r"\d+", str(user_id_max))[0]][0]
        next_user_id = str(int(user_id_temp) + 1)
        # next_user_id = next_user_id.rjust(8, '0')
        # print(user_id_temp)
    else:
        next_user_id = "0"

    request.POST = request.POST.copy()
    request.POST["customer_id"] = next_customer_id
    request.POST["user_code"] = next_user_code
    request.POST["user_id"] = next_user_id
    request.POST["role"] = "customer"

    if request.POST["age"] == "":
        request.POST["age"] == "0"


    data = dict()

    print(request.POST)

    # ----------------------------------------------------------------#

    form_user = UserCreationForm(request.POST)
    if form_user.is_valid():
        # บันทึกข้อมูลผู้ใช้สำเร็จ
        user = form_user.save()
        username = form_user.cleaned_data["username"]
        password = form_user.cleaned_data["password1"]

        user = authenticate(username=username, password=password)
        login(request, user)
        print("User Created Success")

    else:
        # บันทึกข้อมูลผู้ใช้ไม่สำเร็จ, เก็บข้อความ error ไว้
        data["error"] = form_user.errors
        print(form_user.errors)
        print("fail at User create...")
        return JsonResponse(data)

    # ----------------------------------------------------------------#

    # Insert correct data to invoice_line_item
    form_profile = ProfileForm(request.POST)
    if form_profile.is_valid():
        # บันทึกข้อมูลผู้ใช้สำเร็จ
        profile = form_profile.save(commit=False)
        profile.user = user

        profile.save()
        print("Profile Created Success")
    else:
        # บันทึกข้อมูลผู้ใช้ไม่สำเร็จ, เก็บข้อความ error ไว้
        data["error"] = form_profile.errors
        print(form_profile.errors)
        print("fail at Profile create...")
        transaction.set_rollback(True) # ย้อนกลับการบันทึกข้อมูลก่อนหน้านี้
        return JsonResponse(data)

    # ----------------------------------------------------------------#
    form = CustomerForm(request.POST)
    if form.is_valid():
        # บันทึกข้อมูล customer สำเร็จ
        print("Customer successfully")
        customer = form.save()

    else:
        # บันทึกข้อมูล customer ไม่สำเร็จ, เก็บข้อความ error ไว้
        data["error"] = form.errors
        print(form.errors)
        print("fail at Customer create...")
        transaction.set_rollback(True) # ย้อนกลับการบันทึกข้อมูลก่อนหน้านี้
        return JsonResponse(data)

    # ----------------------------------------------------------------#

    # data['account'] = model_to_dict(customer)
    # data['profile'] = model_to_dict(profile)

    print("User Created Successfully without problems")

    return JsonResponse(data)
    
# หน้าสมัครสมาชิกสำหรับ employee
@transaction.atomic
def registerEm(request):
    # เข้าได้แค่คนที่ไม่ล็อคอิน
    if request.user.is_authenticated:
        logout(request)
        return redirect("em_login")

    # กรณีกดเข้าหน้าสมัครสมาชิกเฉยๆ
    if not request.POST:
        return render(request, "em_register.html")

    # กรณีกดปุ่ม submit การสมัครสมาชิก

    # สร้างรหัสพนักงานหมายเลขต่อไป
    if Employee.objects.count() != 0:
        employee_id_max = Employee.objects.aggregate(Max("employee_id"))[
            "employee_id__max"
        ]
        print(employee_id_max)
        employee_id_temp = [re.findall(r"\d+", employee_id_max)[0]][0]
        next_employee_id = str(int(employee_id_temp) + 1) + "EM"
        next_employee_id = next_employee_id.rjust(8, "0")
        # print(employee_id_temp)
    else:
        next_employee_id = "000000EM"

    # สร้างรหัส user หมายเลขต่อไป
    if Profile.objects.count() != 0:
        user_code_max = Profile.objects.aggregate(Max("user_code"))["user_code__max"]
        user_code_temp = [re.findall(r"\d+", user_code_max)[0]][0]
        next_user_code = str(int(user_code_temp) + 1) + "UA"
        next_user_code = next_user_code.rjust(8, "0")
        # print(user_code_temp)
    else:
        next_user_code = "000000UA"

    print(request.POST)

    request.POST = request.POST.copy()
    request.POST["employee_id"] = next_employee_id
    request.POST["user_code"] = next_user_code
    request.POST["role"] = "employee"
    data = dict()

    form_user = UserCreationForm(request.POST)
    if form_user.is_valid():
        # บันทึกข้อมูลผู้ใช้สำเร็จ
        user = form_user.save()
        username = form_user.cleaned_data["username"]
        password = form_user.cleaned_data["password1"]

        user = authenticate(username=username, password=password)
        login(request, user)
        print("User Created Success")

    else:
        # บันทึกข้อมูลผู้ใช้ไม่สำเร็จ, เก็บข้อความ error ไว้
        data["error"] = form_user.errors
        print(form_user.errors)
        print("fail at User create...")
        return JsonResponse(data)

    # ----------------------------------------------------------------#

    form_profile = ProfileForm(request.POST)
    if form_profile.is_valid():
        # บันทึกข้อมูลผู้ใช้สำเร็จ
        profile = form_profile.save(commit=False)
        profile.user = user

        profile.save()
        print("Profile Created Success")
    else:
        # บันทึกข้อมูลผู้ใช้ไม่สำเร็จ, เก็บข้อความ error ไว้
        data["error"] = form_profile.errors
        print(form_profile.errors)
        print("fail at Profile create...")
        transaction.set_rollback(True)  # ย้อนกลับการบันทึกข้อมูลก่อนหน้านี้
        return JsonResponse(data)

    # ----------------------------------------------------------------#
    form = EmployeeForm(request.POST)
    if form.is_valid():
        # บันทึกข้อมูล employee สำเร็จ
        print("Employee successfully")
        employee = form.save()

    else:
        # บันทึกข้อมูล employee ไม่สำเร็จ, เก็บข้อความ error ไว้
        data["error"] = form.errors
        print(form.errors)
        print("fail at Employee create...")
        transaction.set_rollback(True)  # ย้อนกลับการบันทึกข้อมูลก่อนหน้านี้
        return JsonResponse(data)

    # ----------------------------------------------------------------#

    print("Empoyee register successful")
    return redirect("employee_room_status")


# หน้าดูการจองของ employee และอัพเดตสถานะการจอง
def updateReserveEm(request):
    # เข้าได้แค่คนที่ล็อคอินเป็น employee
    if not request.user.is_authenticated:
        return redirect("em_login")

    elif request.user.profile.role == "customer":
        logout(request)
        return redirect("em_login")

    # เมื่อกด ยืนยัน หรือ ยกเลิก การจอง
    if request.POST:
        with transaction.atomic():
            room_number_update = ReservationLineItem.objects.filter(
                reservation_id=request.POST["reservation_id"]
            ).values()

            # กรณีกด ยกเลิก
            if request.POST["submit-as"] == "cancel":
                Reservation.objects.filter(
                    reservation_id=request.POST["reservation_id"]
                ).update(status="cancelled")
                for item in room_number_update:
                    Room.objects.filter(room_number=item["room_number_id"]).update(
                        status="available"
                    )

            # กรณีกด ยืนยัน
            elif request.POST["submit-as"] == "confirm":
                Reservation.objects.filter(
                    reservation_id=request.POST["reservation_id"]
                ).update(status="confirmed")

            return redirect("employee_reserve")
        
    reserve_info = list(
        ReservationLineItem.objects.select_related("reservation_id")
        .filter(reservation_id__status="unpaid")
        .values(
            "reservation_id",
            "reservation_id__customer_id",
            "reservation_id__check_in",
            "reservation_id__check_out",
            "reservation_id__total_price",
        )
        .order_by("reservation_id")
        .annotate(room_count=Count("room_number"))
    )

    data = dict()
    data["reserve_info"] = reserve_info

    print(data["reserve_info"])

    return render(request, "em_reserve.html", data)

#----------------------- ฟังก์ชั่นทั่วไป ---------------------#

def getCustomerId(request):
    field_name = "customer_id"
    field_object = Customer._meta.get_field(field_name)
    customer_id = Customer.objects.get(user_code=request.user.profile.user_code)
    customer_id = getattr(customer_id, field_object.attname)
    return customer_id
