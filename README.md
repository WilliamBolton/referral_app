Overview

This web application is built using Django for the backend server and React for the frontend client side. It serves as a platform for medical professionals allowing users to chat to each other, send referrals to each other, action those referrals and chat to an AI assistant.

Setup Instructions

Backend (Django)
Navigate to the backend directory: cd backend
Create a virtual environment: conda create --name <env_name> --file environment.yaml
Activate the virtual environment: conda activate <env_name>
Install dependencies: pip install -r requirements.txt
Run migrations: python manage.py makemigrations
Run migrations: python manage.py migrate
Start the Django development server: python manage.py runserver

Frontend (React)
Navigate to the frontend directory: cd frontend
Install dependencies: npm install
Start the React development server: npm start

Usage
When both server are running:
Access the backend Django admin at http://127.0.0.1:8000/.
Access the frontend React client at http://localhost:3000/.