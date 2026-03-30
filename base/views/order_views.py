# Django Import
from django.shortcuts import render
from datetime import datetime

from rest_framework import status

# Rest Framework Import
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response

# Local Import
from base.models import *
from base.serializers import OrderSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def addOrderItems(request):
    """
    Create an order. Works for both authenticated users and guests.
    Guest orders store contact info in the ShippingAddress model.
    """
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

    # Determine user (None for guests)
    user = request.user if request.user.is_authenticated else None

    # (1) Create Order
    order = Order.objects.create(
        user=user,
        taxPrice=data['taxPrice'],
        shippingPrice=data['shippingPrice'],
        totalPrice=data['totalPrice'],
    )

    # (2) Create Shipping Address with guest info
    shipping_data = data['shippingAddress']
    ShippingAddress.objects.create(
        order=order,
        address=shipping_data['address'],
        city=shipping_data['city'],
        postalCode=shipping_data['postalCode'],
        country=shipping_data['country'],
        guestName=shipping_data.get('guestName', ''),
        guestEmail=shipping_data.get('guestEmail', ''),
        guestPhone=shipping_data.get('guestPhone', ''),
    )

    # (3) Create order items
    for i in orderItems:
        product = Product.objects.get(_id=i['product'])

        item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=i['qty'],
            price=i['price'],
            image=product.image.url,
        )

        # (4) Update Stock
        product.countInStock -= item.qty
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all().order_by('-createdAt')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def getOrderById(request, pk):
    """
    Allow anyone with the order ID to view their order.
    This supports guest checkout where users aren't logged in.
    """
    try:
        order = Order.objects.get(_id=pk)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDeliver = True
    order.deliveredAt = datetime.now()
    order.save()
    return Response('Order was Delivered')