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
// Function to toggle Login and Logout visibility
function toggleAuthButtons() {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const user = JSON.parse(localStorage.getItem("user")); // Check if user is logged in

    if (user) {
        loginBtn.style.display = "none"; // Hide Login
        logoutBtn.style.display = "inline-block"; // Show Logout
    } else {
        loginBtn.style.display = "inline-block"; // Show Login
        logoutBtn.style.display = "none"; // Hide Logout
    }
}

// Call toggleAuthButtons when page loads
document.addEventListener("DOMContentLoaded", toggleAuthButtons);

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
        toggleAuthButtons(); // Update UI after login
        location.reload(); //refresh
    } else {
        alert("Invalid credentials! Please check your username, password, or role.");
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully 🖐");
    toggleAuthButtons(); // Update UI after logout
    location.reload(); //refresh the page
}
// Run on page load to set the correct state
toggleAuthButtons();

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
                    backgroundColor: 'green'
                }]
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let activeGroup = 1; // Start with the first group

    function switchFeatures() {
        const group1 = document.querySelector(".group-1");
        const group2 = document.querySelector(".group-2");

        if (activeGroup === 1) {
            group1.style.animation = "slide-left 1s forwards";
            group2.style.animation = "slide-right 1s forwards";
            activeGroup = 2;
        } else {
            group1.style.animation = "slide-right 1s forwards";
            group2.style.animation = "slide-left 1s forwards";
            activeGroup = 1;
        }

        setTimeout(() => {
            group1.style.transform = activeGroup === 1 ? "translateX(0)" : "translateX(-100%)";
            group2.style.transform = activeGroup === 1 ? "translateX(100%)" : "translateX(0)";
        }, 1000);
    }

    setInterval(switchFeatures, 18000); // Change every 18 seconds
});
