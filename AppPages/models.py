from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.models import User

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not username:
            raise ValueError('A username is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = AppUserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='appuser_groups',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='appuser_permissions',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        created = not self.pk  # Check if the user is being created for the first time
        super().save(*args, **kwargs)
        if created:
            UserHydration.objects.create(user=self)



class FoodSelection(models.Model):
    foodchoice = models.CharField(max_length=100)

class APIData(models.Model):
    data_type = models.CharField(max_length=100)
    content = models.JSONField()
    timestamp = models.DateTimeField()


class Event(models.Model):
    event_name = models.CharField(max_length=18)
    event_date = models.DateField()
    event_time = models.TimeField()
    event_location = models.CharField(max_length=100)
    event_description = models.TextField()
    event_duration = models.IntegerField(default=60)
    event_urgency = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(3)])
    event_creator = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='created_events', default=1)

    def __str__(self):
        return self.event_name

class Mood(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    date = models.DateField()
    mood = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.user}'s mood on {self.date}: {self.mood}"
    


class UserHydration(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, primary_key=True)
    hydration_dates = models.JSONField(default=list)

    def add_date(self, date):
        self.hydration_dates.append(date)
        self.save()

