# Django REST API for Simple Social Media Site

[![Railway](https://img.shields.io/badge/Deployment-000000?style=for-the-badge&logo=railway&logoColor=white)](https://web-production-079b.up.railway.app/static/index.html)

This project implements a simple social media site using Django REST framework. Users can create, delete, comment, and like posts, as well as follow or unfollow other users to see their posts.

## Site URL
[Simple Social Media Site](https://web-production-079b.up.railway.app/static/index.html)

## Features
- Create a post
- Delete a post
- Comment on a post
- Like/unlike a post
- Follow/unfollow users to see their posts

## User Credentials
To log in to the site, you can use any of the following credentials:

- **user1:** password1
- **user2:** password2
- **user3:** password1
- **user4:** password2

## Project Structure

### Client
The client code is located in:
- `./static/index.html`
- `./static/script.js`

### API

#### Models
The `models.py` file defines the following models:
- **User:** Extends Django's `AbstractUser`, includes a bio and a many-to-many relationship for following other users.
- **Post:** Represents a post created by a user, includes content and a timestamp.
- **Comment:** Represents a comment on a post, includes content and a timestamp.
- **Like:** Represents a like on a post by a user.
- **Follow:** Represents a following relationship between users.

#### Views
The `views.py` file includes viewsets for managing users, posts, comments, and likes. Key functionalities include:
- User follow/unfollow actions.
- Post create, delete, like, and unlike actions.
- Retrieve comments for a specific post.
- Permissions to ensure only authors can modify their own posts.

### Authentication
The project uses token-based authentication with JWT, storing tokens in local storage on the client side.

## Usage

### Running the Server
0. Rename .env.example to .env:
   ```sh
   mv .env.example .env
   ```
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Apply migrations:
   ```sh
   python manage.py migrate
   ```
3. Run the development server:
   ```sh
   python manage.py runserver
   ```

### API Endpoints

#### Authentication
- `POST /api/token/`: Obtain JWT token.
- `POST /api/token/refresh/`: Refresh JWT token.

#### Users
- `GET /api/users/`: List all users.
- `GET /api/users/{id}/`: Retrieve a user by ID.
- `POST /api/users/{id}/follow/`: Follow a user.
- `POST /api/users/{id}/unfollow/`: Unfollow a user.

#### Posts
- `GET /api/posts/`: List all posts from followed users.
- `POST /api/posts/`: Create a new post.
- `GET /api/posts/{id}/`: Retrieve a post by ID.
- `DELETE /api/posts/{id}/`: Delete a post by ID.
- `POST /api/posts/{id}/like/`: Like a post.
- `POST /api/posts/{id}/unlike/`: Unlike a post.
- `GET /api/posts/{id}/comments/`: List comments on a post.

#### Comments
- `POST /api/comments/`: Create a new comment on a post.
- `GET /api/comments/{id}/`: Retrieve a comment by ID.

#### Likes
- `POST /api/likes/`: Create a new like on a post.
- `GET /api/likes/{id}/`: Retrieve a like by ID.

## Additional Information
For more detailed information about the project structure and the functionalities provided, refer to the source code in the respective files:

- `./api/models.py`
- `./api/views.py`
