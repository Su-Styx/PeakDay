from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [


    path('timetable/moods', views.mood_view, name='page_moods'), 
     
    
    ]