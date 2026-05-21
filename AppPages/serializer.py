from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from .models import AppUser as UserModel



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'event_name', 'event_date', 'event_time',
                  'event_location', 'event_description', 'event_duration', 'event_urgency','event_creator']


##mood tracker
class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['user', 'date', 'mood']

##hydration tracker


class UserHydrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHydration
        fields = ['user', 'hydration_dates']


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('User not found')
        return user

    def to_representation(self, instance):
        # Customize the response data to include user_id
        user_id = instance.id  # Assuming id is the user's primary key
        return {
            'user_id': user_id,
            'email': instance.email,
            # Include any other fields you want to return in the login response
        }

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['email', 'username', 'password']  # Include 'username' field here

    def create(self, validated_data):
        # Retrieve username and password from validated data
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        # Create user object
        user_obj = UserModel.objects.create_user(username=username, password=password, **validated_data)
        return user_obj

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username','user_id')
