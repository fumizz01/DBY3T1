from django.shortcuts import render
from django.http.response import HttpResponse
from django.http import HttpResponseRedirect
from django.urls import reverse

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

def login(request):
    return render(request, 'login.html')

def reserve(request):
    return render(request, 'reserve.html')
