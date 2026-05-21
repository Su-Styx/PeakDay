from rest_framework import viewsets
import os
import json
import datetime
from datetime import datetime, timedelta,date
import random
from .forms import FoodSelectionForm
from django.middleware.csrf import get_token
import requests
from django.shortcuts import render, HttpResponse
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.utils.translation import gettext as _
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from functools import wraps
from rest_framework.permissions import AllowAny
from django.http import JsonResponse

# view to show home page
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from rest_framework import generics

from rest_framework import generics
from rest_framework.permissions import AllowAny
# from .models import UserHydration
from django.shortcuts import get_object_or_404
from django.http import JsonResponse


from django.http import JsonResponse
current_date = date.today().isoformat()

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access for this viewset

    def get_queryset(self):
        # Retrieve the userId from the query parameters
        user_id = self.request.query_params.get('event_creator')
        
        # Check if userId is provided
        if user_id:
            # Filter the queryset to retrieve only the items with the same event_creator as the userId
            return Event.objects.filter(event_creator=user_id)
        else:
            # If userId is not provided, return the default queryset
            return self.queryset

def show_home(request):
    context = {}
    return render(request, 'home.html', context)


def show_about(request):
    context = {}
    return render(request, 'about.html', context)


def show_wellness(request):
    context = {}
    return render(request, 'wellness.html', context)


def show_settings(request):
    context = {}
    return render(request, 'settings.html', context)


@login_required
def show_timetable(request):
    context = {}
    return render(request, 'timetable.html', context)


def show_pocweather(request):
    context = {}
    return render(request, 'pocweather.html', context)


class ReactView(APIView):
    def get(self, request):
        output_list = [{"employee": item.employee,
                        "department": item.department}
                       for item in React.objects.all()]

        # print(output_list)
        return Response(output_list)

    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


@login_required
def profile(request):
    return render(request, 'profile.html')

def get_notifications(request):
    notifications = Notification.objects.all().values()
    print(notifications)
    return JsonResponse(list(notifications), safe=False)


def get_all_recipes(keywords):
    api_url = 'https://api.api-ninjas.com/v1/recipe'
    all_recipes = []
    for keyword in keywords:
        response = requests.get(f'{api_url}?query={keyword}', headers={
                                'X-Api-Key': 'sPfQpzB3c5DNO15z39yxsB5hKaPojXzreLzzNlsg'})
        if response.status_code == 200:
            recipes = response.json()
            all_recipes.extend(recipes)
        else:
            print("Error:", response.status_code, response.text)
    return all_recipes


def get_recipe(request):
    if request.method == 'POST':
        try:
            request_data = json.loads(request.body)
            food_choice = request_data.get('foodChoice', '')
            api_url = f'https://api.api-ninjas.com/v1/recipe?query={food_choice}'
            response = requests.get(api_url, headers={'X-Api-Key': 'sPfQpzB3c5DNO15z39yxsB5hKaPojXzreLzzNlsg'})
            response.raise_for_status()
            if response.status_code == 200:
                recipes = response.json()
                return JsonResponse({'recipes': recipes, 'csrfToken': get_token(request)})
            else:
                return JsonResponse({'error': 'Failed to fetch recipes'}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method', 'csrfToken': get_token(request)}, status=405)

def get_recommended_meals():
    try:
        with open('selected_recipes.json', 'r') as file:
            data = json.load(file)
            last_recommendation_time = data.get('last_recommendation_time')
            recommend_time = datetime.fromisoformat(last_recommendation_time)

            current_time = datetime.now()
            time_difference = current_time - recommend_time

            hours = time_difference.total_seconds() // 3600
            minutes = (time_difference.total_seconds() % 3600) // 60
            seconds = time_difference.total_seconds() % 60

            threshold = timedelta(seconds=24)
            if time_difference > threshold:
                with open('selected_recipes.json', 'w') as file:
                    os.remove('selected_recipes.json')
                    get_recommended_meals()

    except (json.JSONDecodeError, FileNotFoundError):
        categories = {
            'meat': ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'seafood'],
            'vegetarian': ['vegetarian', 'vegan'],
            'salad': ['salad'],
            'soup': ['soup'],
            'sandwich': ['sandwich'],
            'pasta': ['pasta'],
            'pizza': ['pizza'],
            'burger': ['burger'],
            'dessert': ['cake', 'cookie', 'cupcake', 'pie', 'ice cream', 'smoothie'],
            'breakfast': ['bread', 'muffin', 'pancake', 'waffle'],
            'rice': ['rice', 'noodle', 'quinoa', 'couscous'],
            'other': ['lasagna', 'fajita', 'omelette', 'crepe', 'burrito', 'enchilada', 'casserole', 'stew', 'grill', 'barbecue', 'roast', 'bake', 'fry', 'saute', 'steam', 'boil', 'stir-fry', 'fried rice']

        }

        selected_categories = random.sample(list(categories.keys()), 3)

        selected_foods = []

        for category in selected_categories:
            food = random.choice(categories[category])
            selected_foods.append(food)

        # print("Selected Foods:")
        # for food in selected_foods:
        #    print(food)

        current_time = datetime.now()
        all_recipes = get_all_recipes(selected_foods)
        # print(all_recipes)
        if all_recipes:
            selected_recipes = random.sample(all_recipes, 3)
            last_selection_time = current_time
            # print(last_selection_time)

            data = {
                **{'selected_recipes': selected_recipes},
                'last_recommendation_time': last_selection_time.isoformat()
            }

            with open('selected_recipes.json', 'w') as file:
                json.dump(data, file)


get_recommended_meals()

# Create your views here.


def home(request):
    form = FoodSelectionForm()
    if request.method == 'POST':
        form = FoodSelectionForm(request.POST)
        if form.is_valid():
            api_url = 'https://api.api-ninjas.com/v1/recipe?query='
            choiceOfFood = form.cleaned_data['foodchoice']
            response = requests.get(
                api_url + choiceOfFood, headers={'X-Api-Key': 'sPfQpzB3c5DNO15z39yxsB5hKaPojXzreLzzNlsg'})
            # print(response)
            try:
                api = json.loads(response.content)
                # print(response.content)
                food = api[0]['title']
            except Exception as e:
                api = "oops, there is an error"
                food = ""
            # print(food)
            return render(request, 'welcomepage.html', {'form': form, 'api': api, 'food': food})

    return render(request, 'welcomepage.html', {'form': form})


def meal_recommendations(request):
    form = FoodSelectionForm()
    get_recommended_meals()
    with open('selected_recipes.json', 'r') as file:
        data = json.load(file)
        gotten_recipes = data.get('selected_recipes')
    return render(request, 'meal_recommendations.html', {'form': form, 'api': gotten_recipes})


def add_recipe(request, food):
    form = FoodSelectionForm()
    print(food)
    if request.method == 'POST':
        form = FoodSelectionForm(request.POST)
        if form.is_valid():
            api_url = 'https://api.api-ninjas.com/v1/recipe?query='
            choiceOfFood = form.cleaned_data['foodchoice']
            response = requests.get(
                api_url + choiceOfFood, headers={'X-Api-Key': 'sPfQpzB3c5DNO15z39yxsB5hKaPojXzreLzzNlsg'})
            # print(response)
            try:
                api = json.loads(response.content)
                # print(response.content)
                food = api[0]['title']
            except Exception as e:
                api = "oops, there is an error"
                food = ""
            # print(food)
            return render(request, 'meal_recommendations.html', {'form': form, 'api': api, 'food': food})

    get_recommended_meals()
    with open('selected_recipes.json', 'r') as file:
        data = json.load(file)
        gotten_recipes = data.get('selected_recipes')
    return render(request, 'meal_recommendations.html', {'form': form, 'api': gotten_recipes})



##user mood tracking
def mood_view(request):
    if request.method == 'POST':
        serializer = MoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#hydration tracking  

import datetime as dt
class UserHydrationCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = UserHydration.objects.all()
    serializer_class = UserHydrationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        return UserHydration.objects.filter(user=user_id)

    def create(self, request, *args, **kwargs):
        # Retrieve the user ID from the request data
        user_id = request.data.get('user')

        # Check if a UserHydration instance already exists for the user
        existing_user_hydration = UserHydration.objects.filter(user=user_id).first()

        # If an instance exists, append the current date to the hydration_dates field
        if existing_user_hydration:
            current_date = dt.date.today().isoformat()  # Get the current date using dt instead of datetime
            existing_user_hydration.hydration_dates.append(current_date)
            existing_user_hydration.save()

            # Return the updated instance
            serializer = self.get_serializer(existing_user_hydration)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If no instance exists, create a new one
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		clean_data = custom_validation(request.data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)



from rest_framework.authtoken.models import Token

class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            # Generate or retrieve token for user
            token, _ = Token.objects.get_or_create(user=user)
            # Serialize user data including the token and user id
            user_data = {
                'token': token.key,
                'userId': user.user_id,  # Corrected attribute name
                'email': user.email,  # Include other necessary fields here
                # Include other necessary fields here
            }
        return Response(user_data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)
