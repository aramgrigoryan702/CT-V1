# Generated by Django 2.0.3 on 2019-06-16 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_collection_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='uuid',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
