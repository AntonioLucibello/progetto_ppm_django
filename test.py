import requests

BASE_URL = 'http://127.0.0.1:8000/api/'
TOKEN_URL = BASE_URL + 'token/'

USERNAME = 'user1'
PASSWORD = 'password1'

def get_token():
    response = requests.post(TOKEN_URL, data={'username': USERNAME, 'password': PASSWORD})
    return response.json()

token_response = get_token()
print(token_response)