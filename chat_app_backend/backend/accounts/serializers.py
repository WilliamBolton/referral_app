from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate 

class UserSerializer(serializers.ModelSerializer):
    """Serializes and deserializes User objects to and from JSON"""
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        """Creates new users"""
        user = get_user_model().objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data.get('last_name', ''),
        )
        return super().create(validated_data)
    
    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

class LoginSerializer(serializers.Serializer):
    """Serializes and deserializes login data to and from JSON"""
    email = serializers.EmailField()
    id = serializers.CharField(max_length=15, read_only=True)
    password = serializers.CharField(max_length=50, write_only=True)

    def validate(self, data):
        """Validates login credentials"""
        email = data.get("email", None)
        password = data.get("password", None)
        if email is None:
            raise serializers.ValidationError("An email address is required for login")
        if password is None:
            raise serializers.ValidationError("An password is required for login")

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid email or password")
        
        if not user.is_active:
            raise serializers.ValidationError("User is inactive")
        return {
            "email": user.email,
            "id": user.id,
        }
