const BASE_URL = 'http://127.0.0.1:8000/api/';
const TOKEN_URL = BASE_URL + 'token/';
const POSTS_URL = BASE_URL + 'posts/';

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

    console.log('Attempting to log in with', username, password); // Debug log

    fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        console.log('Response status:', response.status); // Debug log
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data); // Debug log
        if (data.access) {
            accessToken = data.access;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('post-section').style.display = 'block';
            document.getElementById('posts-section').style.display = 'block';
            fetchPosts();
        } else {
            console.error('Login failed:', data); // Debug log
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error); // Debug log
    });
}

function createPost() {
    const content = document.getElementById('post-content').value;

    console.log('Creating post with content:', content); // Debug log

    fetch(POSTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
    })
    .then(response => {
        console.log('Create post response status:', response.status); // Debug log
        return response.json();
    })
    .then(data => {
        console.log('Create post response data:', data); // Debug log
        document.getElementById('post-content').value = '';
        fetchPosts();
    })
    .catch(error => {
        console.error('Error:', error); // Debug log
    });
}

function fetchPosts() {
    console.log('Fetching posts'); // Debug log

    fetch(POSTS_URL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => {
        console.log('Fetch posts response status:', response.status); // Debug log
        return response.json();
    })
    .then(posts => {
        console.log('Fetched posts:', posts); // Debug log
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <p><strong>${post.author.username}</strong>: ${post.content}</p>
                <p>${new Date(post.created_at).toLocaleString()}</p>
                <hr>
            `;
            postsContainer.appendChild(postElement);
        });
    })
    .catch(error => {
        console.error('Error:', error); // Debug log
    });
}
