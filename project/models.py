from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_code = models.CharField(max_length=10, primary_key=True)
    role = models.CharField(max_length=50, null=True, blank=True)

"""class Account(models.Model):
    #user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_code = models.CharField(max_length=10, primary_key=True)
    user_name = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=50, null=True, blank=True)
    password = models.CharField(max_length=20, null=True, blank=True)
    class Meta:
        db_table = "account" 
        managed = True 
    def __str__(self):
        return self.user_code"""
    


class Customer(models.Model):
    customer_id = models.CharField(max_length=10, primary_key=True)
    user_code = models.ForeignKey(Profile, on_delete=models.CASCADE, db_column='user_code')
    identification_number = models.CharField(max_length=13, unique=True)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    age = models.IntegerField()
    email = models.CharField(max_length=50, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    class Meta:
        db_table = "customer"
        managed = True
    def __str__(self):
        return self.customer_id 
    
class RoomDetail(models.Model):
    room_type = models.CharField(max_length=20, primary_key=True)
    room_capacity_adult = models.IntegerField()
    room_capacity_child = models.IntegerField()
    room_price = models.FloatField(null=True, blank=True)
    class Meta:
        db_table = "room_detail"
        managed = True 
    def __str__(self):
        return self.room_type
    
class Room(models.Model):
    room_number = models.CharField(max_length=10, primary_key=True)
    status = models.CharField(max_length=20, null=True, blank=True)
    room_type = models.ForeignKey(RoomDetail, on_delete=models.CASCADE, db_column='room_type')
    class Meta:
        db_table = "room"
        managed = True 
    def __str__(self):
        return self.room_number
    
    
class Reservation(models.Model):
    reservation_id = models.IntegerField(primary_key=True)
    room_number = models.ForeignKey(Room, on_delete=models.CASCADE, db_column='room_number')
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='customer_id')
    check_in = models.DateField(null=True, blank=True)
    check_out = models.DateField(null=True, blank=True)
    total_price = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, null=True, blank=True)
    class Meta:
        db_table = "reservation"
        managed = True
    def __str__(self):
        return self.reservation_id
    
class Employee(models.Model):
    employee_id = models.CharField(max_length=50, primary_key=True)
    user_code = models.ForeignKey(Profile, on_delete=models.CASCADE, db_column='user_code')
    identification_number = models.CharField(max_length=13, unique=True)
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    sex = models.CharField(max_length=30, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    position = models.CharField(max_length=20, null=True, blank=True)
    class Meta:
        db_table = "employee"
        managed = True 
    def __str__(self):
        return self.employee_id