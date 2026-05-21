from django import forms
from .models import FoodSelection

class FoodSelectionForm(forms.ModelForm):
    class Meta:
        model = FoodSelection
        fields = ['foodchoice']


    def __init__(self, *args, **kwargs): # These are the label names
        super().__init__(*args, **kwargs)
        self.fields['foodchoice'].label = 'Enter the food of your choice'

