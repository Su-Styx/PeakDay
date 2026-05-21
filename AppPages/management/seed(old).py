from django.core.management.base import BaseCommand
from django.core.files.images import ImageFile
import json
from datetime import date
from ..models import Employee
from django.contrib.auth.models import User
from pathlib import Path


ROOT_DIR = Path('app_module_management') / 'management' 


class Command(BaseCommand):
    def handle(self, *args, **options):
        Employee.objects.all().delete()

        #User.objects.all().delete()

        with open(ROOT_DIR / 'sample_data.json') as json_file:
            sample_data = json.load(json_file)


        for student in sample_data['students']:
            s = Employee(urn=student['urn'],
                        display_name=student['display_name'])
            s.save()

        print('Seeding done.')
