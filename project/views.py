from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'hotelpage.html')

def register(request):
    return render(request, 'register.html')

def login(request):
    return render(request, 'login.html')

def reserve(request):
    return render(request, 'reserve.html')
