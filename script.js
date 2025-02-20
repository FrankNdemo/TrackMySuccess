// Function to get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {}; // Retrieve users or default to an empty object
}

// Function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users)); // Store users in localStorage
}

// Show Login Popup and Hide Register Popup
function showLoginPopup() {
    document.getElementById('registerOverlay').style.display = 'none';
    document.getElementById('loginOverlay').style.display = 'flex';
}

// Show Register Popup and Hide Login Popup
function showRegisterPopup() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('registerOverlay').style.display = 'flex';
}

// Hide both popups
function hidePopups() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('registerOverlay').style.display = 'none';
}

// Register Function
function register() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const newRole = document.getElementById('newRole').value;

    if (newUsername && newPassword && newRole) {
        let users = getUsers(); // Get current users

        if (users[newUsername]) {
            alert("Username already exists!");
        } else {
            users[newUsername] = { role: newRole, password: newPassword };
            saveUsers(users); // Save updated users to localStorage
            alert("Registration successful! Please login.");
            
            // Hide register popup and show login popup
            hidePopups();
            showLoginPopup();
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Login Function
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const users = getUsers(); // Get stored users

    if (users[username] && users[username].password === password && users[username].role === role) {
        localStorage.setItem("user", JSON.stringify({ name: username, role: role }));
        alert("Login successful!");
        hidePopups();
        location.reload();
    } else {
        alert("Invalid credentials! Please check your username, password, or role.");
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully 🖐");
    location.reload();
}

// Check if user is logged in
const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest", role: "" };

if (user.name !== "Guest") {
    alert(`Welcome back, ${user.role} ${user.name}!`);
    document.getElementById("hero").style.display = "none"; // Hide hero section for logged-in users
}

// Load Dashboard
function loadDashboard() {
    let dashboardContent = "";
    if (user.role === "Teacher") {
        dashboardContent = `
            <section class="cards">
                <div class="card">Total Students: <strong>120</strong></div>
                <div class="card">Average Score: <strong>82%</strong></div>
                <div class="card">Subjects Tracked: <strong>6</strong></div>
            </section>
            <section class="chart-container">
                <canvas id="performanceChart"></canvas>
            </section>`;
    } else if (user.role === "Parent") {
        dashboardContent = `
            <section class="cards">
                <div class="card">Child's Name: <strong>John Doe</strong></div>
                <div class="card">Current Performance: <strong>85%</strong></div>
                <div class="card">Next PTA Meeting: <strong>March 10</strong></div>
            </section>`;
    } else if (user.role === "Student") {
        dashboardContent = `
            <section class="cards">
                <div class="card">My Grades: <strong>A-</strong></div>
                <div class="card">Upcoming Exams: <strong>April 15</strong></div>
                <div class="card">Attendance Rate: <strong>95%</strong></div>
            </section>`;
    }
    document.getElementById("dashboard").innerHTML = dashboardContent;
}

document.getElementById('welcomeMessage').textContent = `Welcome, ${user.role ? user.role + ' ' : ''}${user.name}`;
loadDashboard();

// Initialize Chart for Teachers
if (user.role === "Teacher") {
    const ctx = document.getElementById('performanceChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Math', 'Science', 'English', 'History', 'ICT', 'PE'],
                datasets: [{
                    label: 'Student Performance',
                    data: [85, 78, 92, 75, 88, 80],
                    backgroundColor: 'blue'
                }]
            }
        });
    }
}
