from datetime import datetime
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from referral.serializers import PatientSerializer, ReferralSerializer
from rest_framework.response import Response
from accounts.models import User
from .models import Referral, Patient
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.text import slugify
# Create your views here.

@api_view(['POST'])
def get_referrals(request):
    """Fetch all referrals for user"""
    user_email = request.data['user']
    user = User.objects.get(email=user_email)
    referrals = Referral.objects.filter(recipient=user)
    referrals = referrals.order_by('timestamp')
    serializer = ReferralSerializer(referrals, many=True)
    print('ReferralSerializer', serializer)
    return Response(serializer.data)

channel_layer = get_channel_layer()

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_referral(request):
    """API endpoint for creating a new Referral object from a POST request"""
    try:
        sender_email = request.data['sender']
        recipient_email = request.data['clinician']
        patient_hn = request.data['patient']
        reason = request.data['reason']
        sender = User.objects.get(email=sender_email)
        recipient = User.objects.get(email=recipient_email)
        patient = Patient.objects.get(hospital_number=patient_hn)
        Referral.objects.create(
            sender=sender,
            recipient=recipient,
            patient=patient,
            reason=reason,
        )
        print('Created Referral object')
        # Below code ensures the websocket updates
        referral_data = {
            'patient_hospital_number': patient_hn,
            'reason': reason,
            'recipient_email': recipient_email,
            'sender_email': sender_email,
        }
        print('Group name:', slugify(recipient_email))
        async_to_sync(channel_layer.group_send)(
            f"{slugify(recipient_email)}",
            {
                "type": "send.referral",
                "referral_data": referral_data
            }
        )
        print('Sent!')
        return Response(status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_patients(request):
    """Gets all patients"""
    try:
        patients = Patient.objects.all()
        patients = patients.order_by('name')
        patients_serializer = PatientSerializer(patients, many=True)
        return Response(patients_serializer.data)
    except:
        return Response({"error": "Error in getting list of users"}, status=400)

def create_patients(request):
    """Creates patients for the demo"""
    # Create a new patient object
    Patient.objects.create(
        name='Muhammad Khan',
        date_of_birth=datetime.strptime('1967-09-22', '%Y-%m-%d').date(),
        hospital_number='HN-12345'
    )

    Patient.objects.create(
        name='Maria Rodriguez',
        date_of_birth=datetime.strptime('1952-04-12', '%Y-%m-%d').date(),
        hospital_number='HN-58291'
    )

    Patient.objects.create(
        name='Olivia Johnson',
        date_of_birth=datetime.strptime('1995-10-25', '%Y-%m-%d').date(),
        hospital_number='HN-38625'
    )

    return HttpResponse("Patients created successfully!")

@permission_classes([IsAuthenticated])
@api_view(['POST'])
def mark_referral_as_completed(request):
    """API endpoint for marking a referral as completed"""
    # Mark a referral as completed
    referral_id = request.data['referral_id']
    referral = get_object_or_404(Referral, pk=referral_id)
    referral.status = 'completed'
    referral.save()
    print('Referral marked as complete')
    return JsonResponse({'success': True})

def export_data_to_text_file():
    """
    Exports user and patient data to a text file.
    Used to provide information to tohe OpenAI assistant 
    """
    users = User.objects.exclude(is_superuser=True)
    patients = Patient.objects.all()

    data = []
    for user in users:
        data.append(f"Clinician: {user.first_name} {user.last_name}, Email: {user.email}, Medical specialty: {user.medical_specialty}")

    for patient in patients:
        data.append(f"Patient: {patient.name}, Date of birth: {patient.date_of_birth}, Hospital number: {patient.hospital_number}")

    # Write the data to a text file
    file_path = 'data_export.txt'
    with open(file_path, 'w') as file:
        for line in data:
            file.write(line + '\n')
    print('Created data text file')