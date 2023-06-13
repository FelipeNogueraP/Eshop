from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from apitocuraduria.models import Product
from apitocuraduria.serializers import ProductSerializer


@api_view(['GET'])
def getProducts(request):  # Get all Products
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):  # Get a single Product
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):  # Delete a single Product
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')
