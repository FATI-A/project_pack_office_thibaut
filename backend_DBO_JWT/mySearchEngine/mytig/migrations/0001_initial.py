# Generated by Django 5.1.7 on 2025-03-13 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProduitEnPromotion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('tigID', models.IntegerField(default='-1')),
            ],
            options={
                'ordering': ('tigID',),
            },
        ),
    ]
