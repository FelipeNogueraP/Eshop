from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.Response import Response

# Create your views here.

@api_view
def getRoutes(request):
    routes = [
    'api/products/',

    ]
    return Response(routes)