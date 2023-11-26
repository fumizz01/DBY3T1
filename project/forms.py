from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import *


""" class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = Account
        fields = UserCreationForm.Meta.fields """
        
""" class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields """
        
class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'

class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = '__all__'
        
class ReservationLineItemForm(forms.ModelForm):
    class Meta:
        model = ReservationLineItem
        fields = '__all__'
        
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'password')

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('user_code', 'role')

"""class UserForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = '__all__'"""