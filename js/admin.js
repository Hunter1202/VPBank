// Retrieve existing user data from localStorage on page load
const storedUsers = localStorage.getItem('users');
const users = storedUsers ? JSON.parse(storedUsers) : [];

function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

// get the current user from sessionStorage
function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function register() {
    let username = document.getElementById('registerUsername').value;
    let password = document.getElementById('registerPassword').value;
    let passwordMatch = document.getElementById('registerPassword-2').value;
    let permit = 0;
    let type = 'user';
    if (username.toLowerCase() === "admin") {
        type = 'admin';
    } else {
        type = 'user';
    }

    // Check if the username is already taken
    if (users.find(user => user.username === username)) {
        alert('Tài khoản đã được sử dụng');
        return;
    } if (password !== passwordMatch) {
        alert('Mật khẩu không trùng khớp');
        return;
    } else {
        // Add the new user to the simulated database
        users.push({username, password, permit, type});

        // Update localStorage with the new user data
        localStorage.setItem('users', JSON.stringify(users));

        alert('Đăng ký tài khoản thành công! Xin mời đăng nhập.');
        window.location.href = "login.html";
    }
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.username === username);

    if (user && user.password === password) {
        // Set the current user in sessionStorage
        setCurrentUser(user);

        // Check if the username is "admin" and redirect accordingly
        if (username.toLowerCase() === "admin") {
            // Redirect to admin.html if the username is "admin"
            window.location.href = "admin.html";
        } else {
            // Redirect to index.html for other users
            window.location.href = "index.html";
        }
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Call the displayLoggedInUser function on loggedin.html page load
document.addEventListener('DOMContentLoaded', () => {
    displayLoggedInUser();
    updateLoginButton();
});


function displayLoggedInUser() {
    const loggedInUserDiv = document.getElementById('loggedInUser');
    const currentUser = getCurrentUser();

    if (currentUser) {
        // loggedInUserDiv.textContent = `Chào mừng, ${currentUser.username}`;
    } else {
        loggedInUserDiv.textContent = ''; // Clear the content if no user is logged in
    }
}
function updateLoginButton() {
    const loginButton = document.getElementById('loginButton');

    if (isLoggedIn()) {
        // If the user is logged in, change the button to "Đăng xuất"
        loginButton.innerHTML = '<button class="btn" onclick="logout()">Đăng xuất</button>';
    } else {
        // If the user is not logged in, keep the button as "Đăng nhập"
        loginButton.innerHTML = '<a href="login.html" class="btn">Đăng nhập</a>';
    }
}
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function displayUserConfiguration() {
    // Get the container element to display user information
    const userConfigContainer = document.getElementById('admConfiguration');

    // Clear existing content
    userConfigContainer.innerHTML = '';

    // Create a table element
    const userTable = document.createElement('table');
    userTable.className = 'table table-bordered table-striped';

    // Create table header
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th scope="col">Tên đăng nhập</th>
            <th scope="col">Mật khẩu</th>
            <th scope="col">Quyền truy cập</th>
            <th scope="col">Cấp User</th>
            <th scope="col">Thao tác</th>
        </tr>
    `;
    userTable.appendChild(tableHeader);

    // Create table body
    const tableBody = document.createElement('tbody');

    // Populate the table with user accounts
    users.forEach(user => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.permit}</td>
            <td>${user.type}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="editUser('${user.username}')">
                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.username}')">
                    <i class="fa-solid fa-trash"></i> Xóa
                </button>
            </td>
        `;
        tableBody.appendChild(tableRow);
    });

    userTable.appendChild(tableBody);

    // Append the table to the user configuration section
    userConfigContainer.appendChild(userTable);
    userConfigContainer.style.display = 'block';
}


function deleteUser(username) {
    // Find the index of the user in the array
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
        // Remove the user from the array
        users.splice(userIndex, 1);

        // Update the local storage with the modified user array
        localStorage.setItem('users', JSON.stringify(users));

        // After deleting, update the displayed user information
        displayUserConfiguration();
    } else {
        alert('User not found');
    }
}

function editUser(username) {
    // Find the user with the specified username
    const user = users.find(user => user.username === username);

    if (user) {
        // Populate the form fields with user information
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editPassword').value = user.password;
        document.getElementById('editUsername').value = user.permit;
        document.getElementById('editUsername').value = user.type;

        // Open the edit user modal
        $('#editUserModal').modal('show');
    } else {
        alert('Không tìm thấy người dùng');
    }
}

// Add a new function to handle updating the user
function updateUser() {
    // Get the updated user information from the form fields
    const updatedUsername = document.getElementById('editUsername').value;
    const updatedPassword = document.getElementById('editPassword').value;
    const updatedPermit = document.getElementById('editPermit').value;
    const updatedType = document.getElementById('editType').value;

    // Find the index of the user in the array
    const userIndex = users.findIndex(user => user.username === updatedUsername);

    if (userIndex !== -1) {
        // Update the user information in the array
        users[userIndex] = {
            username: updatedUsername,
            password: updatedPassword,
            permit: updatedPermit,
            type: updatedType,
        };

        // Update the local storage with the modified user array
        localStorage.setItem('users', JSON.stringify(users));

        // After updating, close the modal
        $('#editUserModal').modal('hide');

        // After updating, update the displayed user information
        displayUserConfiguration();
    } else {
        alert('Không tìm thấy người dùng ');
    }
}

function navigateToIndex() {
    window.location.href = 'index.html';
}

// document.addEventListener("DOMContentLoaded", function () {
//     // Dummy data (replace with actual data)
//     const dummyData = [
//         { image: "img/vanhoa1.jpeg", date: "22 Aug, 2020", title: "We have annnocuced our new product.", content: "Lorem Ipsum Dolor A Sit Ameti, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Sed Do Incididunt Sed." },
//         { image: "img/vanhoa2.jpeg", date: "15 Jul, 2020", title: "Top five way for solving teeth problems.", content: "Lorem Ipsum Dolor A Sit Ameti, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Sed Do Incididunt Sed." },
//         { image: "img/vanhoa3.jpeg", date: "15 Jul, 2020", title: "We provide highly business soliutions.", content: "Lorem Ipsum Dolor A Sit Ameti, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Sed Do Incididunt Sed." },
//     ];
//
//     // Populate the blogData array with dummy data
//     blogData = dummyData;
//
//     // Display the blogs on page load
//     displayBlogs();
// });










