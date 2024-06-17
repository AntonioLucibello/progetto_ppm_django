const BASE_URL = 'http://127.0.0.1:8000/api/';
const TOKEN_URL = BASE_URL + 'token/';
const POSTS_URL = BASE_URL + 'posts/';
const USERS_URL = BASE_URL + 'users/';

let accessToken = '';

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
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('post-section').style.display = 'block';
            document.getElementById('posts-section').style.display = 'block';
            document.getElementById('users-section').style.display = 'block';
            fetchPosts();
            fetchUsers();
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => console.error('Error:', error));
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
                <button onclick="followUser(${user.id})">Follow</button>
                <button onclick="unfollowUser(${user.id})">Unfollow</button>
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
