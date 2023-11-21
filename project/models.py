from django.db import models

# Create your models here.

class Customer(models.Model):
    customer_id = models.CharField(max_length=50)
    identification_number = models.IntegerField()
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    age = models.IntegerField()
    email = models.CharField(max_length=50, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    class Meta:
        db_table = "customer"
        unique_together = ("customer_id", "identification_number")
        managed = True
    def __str__(self):
        return '{"receipt_no":"%s","item_no":"%s"}' % (self.customer_id, self.identification_number)
    
class Reservation(models.Model):
    reservation_id = models.IntegerField(primary_key=True)
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
    
class Account(models.Model):
    user_id = models.CharField(max_length=10)
    user_name = models.CharField(max_length=50)
    id = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='customer_id')
    role = models.CharField(max_length=50, null=True, blank=True)
    password = models.CharField(max_length=20, null=True, blank=True)
    class Meta:
        db_table = "account" 
        unique_together = ("user_id", "user_name")
        managed = True 
    def __str__(self):
        return '{"user_id":"%s","user_name":"%s"}' % (self.user_id, self.user_name)

class Room(models.Model):
    room_number = models.IntegerField(primary_key=True)
    reservation_id = models.ForeignKey(Reservation, on_delete=models.CASCADE, db_column='reservation_id')
    room_capacity = models.IntegerField()
    room_price = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True)
    room_type = models.CharField(max_length=20, null=True, blank=True)
    class Meta:
        db_table = "room"
        managed = True 
    def __str__(self):
        return self.room_number
    
class Employee(models.Model):
    employee_id = models.CharField(max_length=50)
    identification_number = models.IntegerField()
    first_name = models.CharField(max_length=30, null=True, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    sex = models.CharField(max_length=30, null=True, blank=True)
    birth_date = models.IntegerField()
    address = models.CharField(max_length=100, null=True, blank=True)
    position = models.CharField(max_length=20, null=True, blank=True)
    class Meta:
        db_table = "employee"
        unique_together = ("employee_id", "identification_number")
        managed = True 
    def __str__(self):
        return '{"employee_id":"%s","identification_number":"%s"}' % (self.employee_id, self.identification_number)