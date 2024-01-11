from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField("name", max_length=100)
    email = models.EmailField("email", unique=True)
    password = models.CharField("password", max_length=100)
    
    def __str__(self) -> str:
        return self.name