import requests

BASE_URL = 'http://127.0.0.1:8000/api/'
TOKEN_URL = BASE_URL + 'token/'
POSTS_URL = BASE_URL + 'posts/'
COMMENTS_URL = BASE_URL + 'comments/'
LIKES_URL = BASE_URL + 'likes/'
FOLLOW_URL = BASE_URL + 'users/{}/follow/'
UNFOLLOW_URL = BASE_URL + 'users/{}/unfollow/'

USERNAME = 'user1'
PASSWORD = 'password1'

def get_token():
    response = requests.post(TOKEN_URL, data={'username': USERNAME, 'password': PASSWORD})
    return response.json()

def make_authenticated_request(url, method='GET', data=None):
    token_response = get_token()
    access_token = token_response['access']
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    if method == 'GET':
        response = requests.get(url, headers=headers)
    elif method == 'POST':
        response = requests.post(url, headers=headers, data=data)
    elif method == 'PUT':
        response = requests.put(url, headers=headers, data=data)
    elif method == 'DELETE':
        response = requests.delete(url, headers=headers)
    try:
        return response.json()
    except ValueError:
        return response.text

# Example operations
# Create a new post
post_data = {'content': 'This is another post from the API client'}
print(make_authenticated_request(POSTS_URL, 'POST', post_data))

# Add a comment to the post
comment_data = {'post': 1, 'content': 'This is a comment'}
print(make_authenticated_request(COMMENTS_URL, 'POST', comment_data))

# Like a post
like_data = {'post': 1}
print(make_authenticated_request(LIKES_URL, 'POST', like_data))

# Follow a user
print(make_authenticated_request(FOLLOW_URL.format(2), 'POST'))

# Unfollow a user
print(make_authenticated_request(UNFOLLOW_URL.format(2), 'POST'))
