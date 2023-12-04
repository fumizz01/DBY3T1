from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import *


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = "__all__"


class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = "__all__"


class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = "__all__"


class ReservationLineItemForm(forms.ModelForm):
    class Meta:
        model = ReservationLineItem
        fields = "__all__"


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("username", "password")


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ("user_code", "role")
