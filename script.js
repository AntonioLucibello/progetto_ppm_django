const BASE_URL = 'http://127.0.0.1:8000/api/';
const TOKEN_URL = BASE_URL + 'token/';
const POSTS_URL = BASE_URL + 'posts/';
const USERS_URL = BASE_URL + 'users/';
const CURRENT_USER_URL = BASE_URL + 'current_user/';

let accessToken = localStorage.getItem('ppm_django_access_token');
let currentUser = {};

if (accessToken) {
    fetchCurrentUser().then(() => {
        showSections();
        fetchPosts();
        fetchUsers();
    }).catch(() => {
        localStorage.removeItem('ppm_django_access_token');
        accessToken = '';
        hideSections();
    });
}

function showSections() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('post-section').style.display = 'block';
    document.getElementById('posts-section').style.display = 'block';
    document.getElementById('users-section').style.display = 'block';
}

function hideSections() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('post-section').style.display = 'none';
    document.getElementById('posts-section').style.display = 'none';
    document.getElementById('users-section').style.display = 'none';
}

document.getElementById('login-button').addEventListener('click', (event) => {
    event.preventDefault();
    login();
});

document.getElementById('create-post-button').addEventListener('click', (event) => {
    event.preventDefault();
    createPost();
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.access) {
            accessToken = data.access;
            localStorage.setItem('ppm_django_access_token', accessToken);
            fetchCurrentUser().then(() => {
                showSections();
                fetchPosts();
                fetchUsers();
            });
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function fetchCurrentUser() {
    return fetch(CURRENT_USER_URL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data['code'] === 'token_not_valid') {
            throw new Error('invalid token!');
            
        } else {
            currentUser = data;
        }
    });
}

function createPost() {
    const content = document.getElementById('post-content').value;

    fetch(POSTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('post-content').value = '';
        fetchPosts();
    })
    .catch(error => console.error('Error:', error));
}

function fetchPosts() {
    fetch(POSTS_URL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <p><strong>${post.author.username}</strong>: ${post.content}</p>
                <p>${new Date(post.created_at).toLocaleString()}</p>
                <p>Likes: ${post.likes_count}</p>
                <button onclick="toggleLike(${post.id}, ${post.user_has_liked})">${post.user_has_liked ? 'Unlike' : 'Like'}</button>
                ${post.author.id === currentUser.id ? `<button onclick="deletePost(${post.id})">Delete</button>` : ''}
                <hr>
            `;
            postsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error:', error));
}

function fetchUsers() {
    fetch(USERS_URL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(users => {
        const usersContainer = document.getElementById('users-container');
        usersContainer.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.innerHTML = `
                <p><strong>${user.username}</strong> (Followers: ${user.followers_count})</p>
                <button onclick="${user.is_following ? `unfollowUser(${user.id})` : `followUser(${user.id})`}">
                    ${user.is_following ? 'Unfollow' : 'Follow'}
                </button>
                <hr>
            `;
            usersContainer.appendChild(userElement);
        });
    })
    .catch(error => console.error('Error:', error));
}

function followUser(userId) {
    fetch(`${USERS_URL}${userId}/follow/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        fetchUsers();
        fetchPosts();
    })
    .catch(error => console.error('Error:', error));
}

function unfollowUser(userId) {
    fetch(`${USERS_URL}${userId}/unfollow/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        fetchUsers();
        fetchPosts();
    })
    .catch(error => console.error('Error:', error));
}

function deletePost(postId) {
    fetch(`${POSTS_URL}${postId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => {
        if (response.ok) {
            fetchPosts();
        } else {
            alert('Failed to delete post.');
        }
    })
    .catch(error => console.error('Error:', error));
}

function toggleLike(postId, userHasLiked) {
    const url = `${POSTS_URL}${postId}/${userHasLiked ? 'unlike' : 'like'}/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        fetchPosts();
    })
    .catch(error => console.error('Error:', error));
}
