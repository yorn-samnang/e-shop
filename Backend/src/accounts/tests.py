from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

User = get_user_model()


class AuthenticationValidationTests(APITestCase):
    def setUp(self):
        self.existing_user = User.objects.create_user(
            email='customer@example.com',
            username='customer',
            password='StrongPass!482',
        )

    def test_duplicate_email_is_rejected_case_insensitively(self):
        response = self.client.post(
            reverse('register'),
            {
                'email': 'Customer@Example.com',
                'username': 'another-user',
                'password': 'StrongPass!593',
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['email'][0],
            'An account with this email already exists. Please log in instead.',
        )

    def test_duplicate_username_is_rejected_case_insensitively(self):
        response = self.client.post(
            reverse('register'),
            {
                'email': 'another@example.com',
                'username': 'Customer',
                'password': 'StrongPass!593',
            },
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['username'][0],
            'This username is already taken. Please choose another one.',
        )

    def test_registration_normalizes_email(self):
        response = self.client.post(
            reverse('register'),
            {
                'email': 'NEW.USER@Example.COM',
                'username': 'new-user',
                'password': 'StrongPass!593',
            },
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], 'new.user@example.com')

    def test_login_email_is_case_insensitive(self):
        response = self.client.post(
            reverse('login'),
            {'email': 'Customer@Example.COM', 'password': 'StrongPass!482'},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    @patch('accounts.views.id_token.verify_oauth2_token')
    def test_google_sign_in_creates_and_then_reuses_account_by_subject(self, verify_token):
        verify_token.return_value = {
            'sub': 'google-account-123',
            'iss': 'https://accounts.google.com',
            'email': 'google.user@example.com',
            'email_verified': True,
            'given_name': 'Google',
            'family_name': 'User',
        }

        first_response = self.client.post(reverse('google_login'), {'credential': 'id-token'})
        second_response = self.client.post(reverse('google_login'), {'credential': 'new-id-token'})

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(google_sub='google-account-123').count(), 1)
        self.assertIn('token', first_response.data)
