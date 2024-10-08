# Generated by Django 5.1 on 2024-08-31 18:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_remove_favoritemovielist_cover_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favoritemovielist',
            name='movieId',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='favoritemovielist',
            name='release_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='favoritemovielist',
            name='title',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
