import json
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from AppPages.models import UserProfile, Schedule, Task, Meeting, HealthRecord, APIData, Notification, Location, Meal, Weather

class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        # Create users
        user1 = User.objects.create(username='user1', email='user1@example.com', password='password1')
        user2 = User.objects.create(username='user2', email='user2@example.com', password='password2')

        # Create user profiles
        user_profile1 = UserProfile.objects.create(user=user1, user_display_name='User 1', role='user')
        user_profile2 = UserProfile.objects.create(user=user2, user_display_name='User 2', role='user')

        # Create schedules
        schedule1 = Schedule.objects.create(user=user1, date=timezone.now(), description='Schedule 1')
        schedule2 = Schedule.objects.create(user=user2, date=timezone.now(), description='Schedule 2')

        # Create tasks
        task1 = Task.objects.create(schedule=schedule1, title='Task 1', start_time=timezone.now(), end_time=timezone.now(), status='pending')
        task2 = Task.objects.create(schedule=schedule2, title='Task 2', start_time=timezone.now(), end_time=timezone.now(), status='completed')

        # Create meetings
        meeting1 = Meeting.objects.create(schedule=schedule1, title='Meeting 1', start_time=timezone.now(), end_time=timezone.now(), location='Location 1')
        meeting2 = Meeting.objects.create(schedule=schedule2, title='Meeting 2', start_time=timezone.now(), end_time=timezone.now(), location='Location 2')

        # Create health records
        health_record1 = HealthRecord.objects.create(user=user1, date=timezone.now(), water_intake=2.5, calories_consumed=1500)
        health_record2 = HealthRecord.objects.create(user=user2, date=timezone.now(), water_intake=3.0, calories_consumed=1800)

        # Create API data
        api_data1 = APIData.objects.create(data_type='Type 1', content={}, timestamp=timezone.now())
        api_data2 = APIData.objects.create(data_type='Type 2', content={}, timestamp=timezone.now())

        # Create notifications
        notification1 = Notification.objects.create(user=user1, message='Message 1', status='pending', notification_time=timezone.now())
        notification2 = Notification.objects.create(user=user2, message='Message 2', status='completed', notification_time=timezone.now())

        # Create locations
        location1 = Location.objects.create(name='Location 1', address='Address 1', type='Type 1')
        location2 = Location.objects.create(name='Location 2', address='Address 2', type='Type 2')

        # Create meals
        meal1 = Meal.objects.create(health_record=health_record1, description='Meal 1', calories=500)
        meal2 = Meal.objects.create(health_record=health_record2, description='Meal 2', calories=600)

        # Create weather
        weather1 = Weather.objects.create(api_data=api_data1, temperature=25.0, description='Weather 1', date=timezone.now())
        weather2 = Weather.objects.create(api_data=api_data2, temperature=28.0, description='Weather 2', date=timezone.now())

        self.stdout.write(self.style.SUCCESS('Database seeded successfully.'))

