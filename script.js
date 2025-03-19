// Global state for current user
let currentUser = null;

// Function to get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

// Function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
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
        let users = getUsers();

        if (users[newUsername]) {
            alert("Username already exists!");
        } else {
            users[newUsername] = {
                role: newRole,
                password: newPassword,
                email: `${newUsername.toLowerCase()}@example.com`,
                fullName: newUsername,
                joinDate: new Date().toISOString()
            };
            saveUsers(users);
            alert("Registration successful! Please login.");
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
    const sidebar = document.getElementById("sidebar");
    const hero = document.getElementById("hero");
    const homeLink = document.getElementById("homeLink");
    const aboutLink = document.getElementById("aboutLink");
    const analyticsLink = document.getElementById("analyticsLink");
    const contactLink = document.getElementById("contactLink");
    const contentArea = document.querySelector(".content-area");
    const headerControls = document.querySelector(".header-controls");

    currentUser = JSON.parse(localStorage.getItem("user"));

    if (currentUser) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        sidebar.style.display = "flex";
        hero.style.display = "none";
        homeLink.style.display = "none";
        aboutLink.style.display = "none";
        analyticsLink.style.display = "none";
        contactLink.style.display = "none";
        contentArea.style.display = "block";
        if (headerControls) headerControls.style.display = "flex";
    } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        sidebar.style.display = "none";
        hero.style.display = "block";
        homeLink.style.display = "block";
        aboutLink.style.display = "block";
        analyticsLink.style.display = "block";
        contactLink.style.display = "block";
        contentArea.style.display = "block";
        if (headerControls) headerControls.style.display = "none";
    }
}

// Login Function
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const users = getUsers();

    if (users[username] && users[username].password === password && users[username].role === role) {
        currentUser = {
            name: username,
            role: role,
            email: users[username].email || `${username.toLowerCase()}@example.com`,
            fullName: users[username].fullName || username
        };
        localStorage.setItem("user", JSON.stringify(currentUser));
        alert("Login successful!");
        hidePopups();
        toggleAuthButtons();
        setupDashboard();
        location.reload();
    } else {
        alert("Invalid credentials! Please check your username, password, or role.");
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("user");
    currentUser = null;
    alert("Logged out successfully 🖐");
    toggleAuthButtons();
    location.reload();
}

// Setup Dashboard based on user role
function setupDashboard() {
    if (!currentUser) return;

   
    // Update sidebar user info
    document.getElementById('sidebarUsername').textContent = currentUser.name;
    document.getElementById('sidebarRole').textContent = currentUser.role;

    // Update profile information
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileEmail').textContent = currentUser.email || `${currentUser.name.toLowerCase()}@example.com`;
    document.getElementById('profileFullName').textContent = currentUser.fullName || currentUser.name;

    // Show role-specific elements
    toggleRoleSpecificElements();

    // Load dashboard content
    loadDashboardContent();

    // Initialize charts
    initializeCharts();
}

// Toggle visibility of role-specific elements
function toggleRoleSpecificElements() {
    // Hide all role-specific elements first
    const allRoleElements = document.querySelectorAll('.student-only, .teacher-only, .parent-only, .admin-only');
    allRoleElements.forEach(elem => elem.style.display = 'none');

    // Show elements specific to the current user's role
    if (currentUser) {
        const roleClass = `${currentUser.role.toLowerCase()}-only`;
        const roleElements = document.querySelectorAll(`.${roleClass}`);
        roleElements.forEach(elem => elem.style.display = 'block');
    }
}

// Load dashboard content based on user role
function loadDashboardContent() {
    let dashboardContent = "";

    if (currentUser.role === "Teacher") {
        dashboardContent = `
            <h2>Teacher Dashboard</h2>
            <section class="cards">
                <div class="card">
                    <h3>Total Students</h3>
                    <strong>120</strong>
                </div>
                <div class="card">
                    <h3>Average Score</h3>
                    <strong>82%</strong>
                </div>
                <div class="card">
                    <h3>Classes</h3>
                    <strong>5</strong>
                </div>
                <div class="card">
                    <h3>Subjects</h3>
                    <strong>3</strong>
                </div>
            </section>
            <section class="chart-container">
                <h3>Class Performance Overview</h3>
                <canvas id="performanceChart"></canvas>
            </section>
            <section class="recent-activities">
                <h3>Recent Activities</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="activity-content">
                            <h4>Science Project Submitted</h4>
                            <p>Alice Johnson submitted the Science project</p>
                            <span class="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="activity-content">
                            <h4>Math Test Graded</h4>
                            <p>You graded Math test for Class 10A</p>
                            <span class="activity-time">Yesterday</span>
                        </div>
                    </div>
                </div>
            </section>`;
    } else if (currentUser.role === "Student") {
        dashboardContent = `
            <h2>Student Dashboard</h2>
            <section class="cards">
                <div class="card">
                    <h3>Current Grade</h3>
                    <strong>A-</strong>
                </div>
                <div class="card">
                    <h3>Attendance</h3>
                    <strong>95%</strong>
                </div>
                <div class="card">
                    <h3>Assignments</h3>
                    <strong>4</strong>
                    <p>2 pending</p>
                </div>
                <div class="card">
                    <h3>Next Exam</h3>
                    <strong>May 20</strong>
                    <p>Mathematics</p>
                </div>
            </section>
            <section class="upcoming-deadlines">
                <h3>UPCOMING DEADLINES</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-date">May 15</div>
                        <div class="timeline-content">
                            <h4>Mathematics Assignment</h4>
                            <p>Complete exercises on quadratic equations</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-date">May 18</div>
                        <div class="timeline-content">
                            <h4>History Report</h4>
                            <p>Submit research paper on World War II</p>
                        </div>
                    </div>
                </div>
            </section>
            <section class="chart-container">
                <h3>Performance by Subject</h3>
                <canvas id="subjectPerformanceChart"></canvas>
            </section>`;
    } else if (currentUser.role === "Parent") {
        dashboardContent = `
            <h2>Parent Dashboard</h2>
            <section class="cards">
                <div class="card">
                    <h3>Child's Name</h3>
                    <strong>John Doe</strong>
                </div>
                <div class="card">
                    <h3>Current Grade</h3>
                    <strong>A-</strong>
                </div>
                <div class="card">
                    <h3>Attendance</h3>
                    <strong>95%</strong>
                </div>
                <div class="card">
                    <h3>Next PTA Meeting</h3>
                    <strong>May 15</strong>
                </div>
            </section>
            <section class="chart-container">
                <h3>Academic Progress</h3>
                <canvas id="progressChart"></canvas>
            </section>
            <section class="recent-updates">
                <h3>Recent Updates</h3>
                <div class="updates-list">
                    <div class="update-item">
                        <div class="update-icon"><i class="fas fa-trophy"></i></div>
                        <div class="update-content">
                            <h4>Science Competition</h4>
                            <p>John won second place in the science competition</p>
                            <span class="update-time">3 days ago</span>
                        </div>
                    </div>
                    <div class="update-item">
                        <div class="update-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="update-content">
                            <h4>Math Test Result</h4>
                            <p>John scored 92% in the recent Math test</p>
                            <span class="update-time">1 week ago</span>
                        </div>
                    </div>
                </div>
            </section>`;
    } else if (currentUser.role === "Admin") {
        dashboardContent = `
            <h2>Admin Dashboard</h2>
            <section class="cards">
                <div class="card">
                    <h3>Total Users</h3>
                    <strong>350</strong>
                </div>
                <div class="card">
                    <h3>Teachers</h3>
                    <strong>25</strong>
                </div>
                <div class="card">
                    <h3>Students</h3>
                    <strong>250</strong>
                </div>
                <div class="card">
                    <h3>Parents</h3>
                    <strong>75</strong>
                </div>
            </section>
            <section class="chart-container">
                <h3>System Usage</h3>
                <canvas id="usageChart"></canvas>
            </section>
            <section class="system-status">
                <h3>System Status</h3>
                <div class="status-grid">
                    <div class="status-card">
                        <div class="status-icon healthy"><i class="fas fa-server"></i></div>
                        <div class="status-info">
                            <h4>Server Status</h4>
                            <p>Healthy</p>
                        </div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon healthy"><i class="fas fa-database"></i></div>
                        <div class="status-info">
                            <h4>Database</h4>
                            <p>Operational</p>
                        </div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon warning"><i class="fas fa-memory"></i></div>
                        <div class="status-info">
                            <h4>Memory Usage</h4>
                            <p>78% (Warning)</p>
                        </div>
                    </div>
                    <div class="status-card">
                        <div class="status-icon healthy"><i class="fas fa-shield-alt"></i></div>
                        <div class="status-info">
                            <h4>Security</h4>
                            <p>No Threats</p>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    document.getElementById("dashboard").innerHTML = dashboardContent;
}

// Initialize charts based on user role
function initializeCharts() {
    if (!currentUser) return;

    // Chart configuration by role
    const chartConfigs = {
        "Teacher": [
            {
                id: 'performanceChart',
                type: 'bar',
                data: {
                    labels: ['Math', 'Science', 'English', 'History', 'ICT', 'PE'],
                    datasets: [{
                        label: 'Class Average (%)',
                        data: [85, 78, 92, 75, 88, 80],
                        backgroundColor: '#4CAF50'
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            },
            {
                id: 'classPerformanceChart',
                type: 'pie',
                data: {
                    labels: ['A', 'B', 'C', 'D', 'F'],
                    datasets: [{
                        data: [30, 40, 20, 8, 2],
                        backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'right' },
                        title: { display: true, text: 'Grade Distribution' }
                    }
                }
            }
        ],
        "Student": [
            {
                id: 'subjectPerformanceChart',
                type: 'radar',
                data: {
                    labels: ['Math', 'Science', 'English', 'History', 'ICT', 'PE'],
                    datasets: [
                        {
                            label: 'Your Score',
                            data: [85, 90, 75, 80, 95, 85],
                            backgroundColor: 'rgba(76, 175, 80, 0.2)',
                            borderColor: '#4CAF50',
                            pointBackgroundColor: '#4CAF50'
                        },
                        {
                            label: 'Class Average',
                            data: [75, 82, 70, 65, 80, 75],
                            backgroundColor: 'rgba(33, 150, 243, 0.2)',
                            borderColor: '#2196F3',
                            pointBackgroundColor: '#2196F3'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: { r: { min: 0, max: 100 } }
                }
            },
            {
                id: 'gradesChart',
                type: 'line',
                data: {
                    labels: ['Term 1', 'Mid-Term', 'Term 2', 'Final'],
                    datasets: [
                        {
                            label: 'Mathematics',
                            data: [78, 82, 85, 88],
                            borderColor: '#4CAF50',
                            tension: 0.1
                        },
                        {
                            label: 'Science',
                            data: [85, 90, 92, 94],
                            borderColor: '#2196F3',
                            tension: 0.1
                        },
                        {
                            label: 'English',
                            data: [70, 75, 78, 84],
                            borderColor: '#9C27B0',
                            tension: 0.1
                        },
                        {
                            label: 'History',
                            data: [65, 70, 72, 75],
                            borderColor: '#FF9800',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            }
        ],
        "Parent": [
            {
                id: 'progressChart',
                type: 'line',
                data: {
                    labels: ['Term 1', 'Mid-Term', 'Term 2', 'Final'],
                    datasets: [{
                        label: 'Overall Performance (%)',
                        data: [75, 80, 83, 85],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: '#4CAF50',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            },
            {
                id: 'childPerformanceChart1',
                type: 'doughnut',
                data: {
                    labels: ['Math', 'Science', 'English', 'Others'],
                    datasets: [{
                        data: [85, 92, 78, 82],
                        backgroundColor: ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            }
        ],
        "Admin": [
            {
                id: 'usageChart',
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Active Users',
                        data: [250, 270, 310, 340, 350, 330],
                        backgroundColor: '#4CAF50'
                    }]
                },
                options: { responsive: true }
            }
        ]
    };

    // Create charts for current role
    const roleCharts = chartConfigs[currentUser.role] || [];
    roleCharts.forEach(config => {
        const ctx = document.getElementById(config.id)?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: config.type,
                data: config.data,
                options: config.options
            });
        }
    });
}

// Document Ready Function
document.addEventListener("DOMContentLoaded", function() {
    // Call toggleAuthButtons when page loads
    toggleAuthButtons();

    // Set welcome message and load dashboard based on user role
    if (currentUser) {
        setupDashboard();
    }

    // Setup sidebar navigation
    setupSidebarNavigation();

    // Feature Animation
    setupFeatureAnimation();

    // Setup class filter functionality for teacher
    setupClassFilter();

    // Setup navigation links
    const navLinks = {
        'homeLink': { section: 'hero', title: 'Home' },
        'aboutLink': { section: 'about', title: 'About Us' },
        'analyticsLink': { section: 'analytics', title: 'Analytics' },
        'contactLink': { section: 'contact', title: 'Contact Us' }
    };

    // Function to reset active state of all navbar links
    function resetNavLinks() {
        Object.keys(navLinks).forEach(linkId => {
            document.getElementById(linkId).classList.remove('active');
        });
    }

    // Add event listeners to all navigation links
    Object.keys(navLinks).forEach(linkId => {
        const link = document.getElementById(linkId);
        link.addEventListener('click', function() {
            resetNavLinks();
            this.classList.add('active');

            // Hide hero section
            document.getElementById('hero').style.display = 'none';

            // If user is logged in, show content area
            if (currentUser) {
                document.querySelector('.content-area').style.display = 'block';
            }

            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            if (linkId === 'homeLink') {
                // Home link behavior
                if (currentUser) {
                    // If logged in, show dashboard
                    const menuItems = document.querySelectorAll('.menu-item');
                    menuItems.forEach(mi => mi.classList.remove('active'));
                    document.querySelector('.menu-item[data-section="dashboard"]').classList.add('active');
                    document.getElementById('dashboardSection').classList.add('active');
                } else {
                    // If not logged in, show hero section
                    document.getElementById('hero').style.display = 'block';
                    // Hide all other content sections
                    document.querySelectorAll('.content-section').forEach(section => {
                        section.classList.remove('active');
                    });
                }
            } else {
                // For other links, show their respective sections
                const sectionId = navLinks[linkId].section + 'Section';
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');

                    // Make sure content area is visible if user is not logged in
                    if (!currentUser) {
                        document.querySelector('.content-area').style.display = 'block';
                    }
                }
            }
        });
    });
});

// Setup sidebar navigation
function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));

            // Add active class to clicked menu item
            this.classList.add('active');

            // Hide all content sections
            const contentSections = document.querySelectorAll('.content-section');
            contentSections.forEach(section => section.classList.remove('active'));

            // Show the selected content section
            const sectionId = this.getAttribute('data-section') + 'Section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Feature Animation
function setupFeatureAnimation() {
    // Create a single container with all features
    function initializeFeatureCarousel() {
        const featuresContainer = document.querySelector('.features-container');
        if (!featuresContainer) return;

        // Clear existing structure
        featuresContainer.innerHTML = '';

        // Create carousel container
        const carousel = document.createElement('div');
        carousel.className = 'feature-carousel';

        // Define all features in order they should appear
        const features = [
            {
                title: "Personalized Learning",
                text: "Tailored educational insights to track and improve student performance.",
                icon: "https://img.icons8.com/?size=100&id=67231&format=png&color=1A1A1A"
            },
            {
                title: "Real-Time Analytics",
                text: "Monitor academic progress with detailed reports and analytics.",
                icon: "https://cdn-icons-png.flaticon.com/512/1925/1925044.png"
            },
            {
                title: "Seamless Communication",
                text: "Bridge the gap between teachers, students, and parents for better learning outcomes.",
                icon: "https://cdn-icons-png.flaticon.com/512/6323/6323417.png"
            },
            {
                title: "Goal Tracking",
                text: "Set and achieve academic milestones with structured guidance.",
                icon: "https://cdn-icons-png.flaticon.com/512/4728/4728631.png"
            },
            {
                title: "Secure Platform",
                text: "Your data is safe, ensuring a reliable and protected learning environment.",
                icon: "https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
            }
        ];

        // Create initial features plus duplicates for seamless looping
        const allFeatures = [...features, ...features, ...features];

        // Create feature elements
        allFeatures.forEach(feature => {
            const featureElement = document.createElement('div');
            featureElement.className = 'feature';
            featureElement.innerHTML = `
                <img src="${feature.icon}" alt="${feature.title}">
                <h3>${feature.title}</h3>
                <p>${feature.text}</p>
            `;
            carousel.appendChild(featureElement);
        });

        featuresContainer.appendChild(carousel);

        // Set initial position
        carousel.style.transform = 'translateX(0)';

        return {
            carousel,
            featuresCount: features.length,
            featureWidth: 270 // Width + margin
        };
    }

    const carouselData = initializeFeatureCarousel();
    if (!carouselData) return;

    const { carousel, featuresCount, featureWidth } = carouselData;

    // Calculate animation duration based on number of features
    const animationDuration = featuresCount * 10; // 10 seconds per feature

    // Set animation to run continuously
    carousel.style.animation = `scrollFeatures ${animationDuration}s linear infinite`;

    // Reset position when animation completes one cycle
    carousel.addEventListener('animationiteration', () => {
        carousel.style.transform = 'translateX(0)';
    });
}


// Show Edit Profile Popup
function showEditProfilePopup() {
    const editOverlay = document.getElementById('editProfileOverlay');
    const fullNameInput = document.getElementById('editFullName');
    const emailInput = document.getElementById('editEmail');
    const dobInput = document.getElementById('editDob');
    const contactInput = document.getElementById('editContact');
    const addressInput = document.getElementById('editAddress');

    // Pre-fill the form with current user data
    fullNameInput.value = currentUser.fullName || currentUser.name;
    emailInput.value = currentUser.email || `${currentUser.name.toLowerCase()}@example.com`;
    dobInput.value = currentUser.dob || 'January 1, 2000';
    contactInput.value = currentUser.contact || '+123-456-7890';
    addressInput.value = currentUser.address || '123 School St, Education City';

    editOverlay.style.display = 'flex';
}

// Save Profile Changes
function saveProfileChanges() {
    const fullName = document.getElementById('editFullName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const dob = document.getElementById('editDob').value.trim();
    const contact = document.getElementById('editContact').value.trim();
    const address = document.getElementById('editAddress').value.trim();

    if (!fullName || !email) {
        alert('Name and Email are required!');
        return;
    }

    // Update current user object
    currentUser.fullName = fullName;
    currentUser.email = email;
    currentUser.dob = dob;
    currentUser.contact = contact;
    currentUser.address = address;

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(currentUser));

    // Update users in localStorage if the user exists
    let users = getUsers();
    if (users[currentUser.name]) {
        users[currentUser.name].fullName = fullName;
        users[currentUser.name].email = email;
        users[currentUser.name].dob = dob;
        users[currentUser.name].contact = contact;
        users[currentUser.name].address = address;
        saveUsers(users);
    }

    // Update profile display
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileFullName').textContent = fullName;
    document.getElementById('profileDob').textContent = dob;
    document.getElementById('profileContact').textContent = contact;
    document.getElementById('profileAddress').textContent = address;

    // Hide the popup
    hideEditPopups();

    alert('Profile updated successfully!');
}

// Show Change Password Popup
function showChangePasswordPopup() {
    document.getElementById('changePasswordOverlay').style.display = 'flex';
}

// Change Password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Get users from localStorage
    const users = getUsers();

    // Check if current password is correct
    if (!users[currentUser.name] || users[currentUser.name].password !== currentPassword) {
        alert('Current password is incorrect!');
        return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match!');
        return;
    }

    // Check if new password is not empty
    if (!newPassword.trim()) {
        alert('New password cannot be empty!');
        return;
    }

    // Update password in localStorage
    users[currentUser.name].password = newPassword;
    saveUsers(users);

    // Hide the popup
    hideEditPopups();

    alert('Password changed successfully!');
}

// Hide Edit Profile and Change Password Popups
function hideEditPopups() {
    document.getElementById('editProfileOverlay').style.display = 'none';
    document.getElementById('changePasswordOverlay').style.display = 'none';
}

// Setup class filter functionality for teacher
function setupClassFilter() {
    const filterBtn = document.querySelector('.class-filter button');
    const classFilter = document.getElementById('classFilter');

    if (filterBtn && classFilter) {
        filterBtn.addEventListener('click', function() {
            const selectedClass = classFilter.value;
            filterStudentsByClass(selectedClass);
        });
    }
}

// Filter students by selected class
function filterStudentsByClass(selectedClass) {
    const studentCards = document.querySelectorAll('.student-card');
    const studentsGrid = document.querySelector('.students-grid');
    let visibleCount = 0;

    // Filter student cards
    studentCards.forEach(card => {
        const studentClass = card.querySelector('p:nth-child(3)').textContent.split(': ')[1];
        const visible = selectedClass === 'all' || studentClass === selectedClass;
        card.style.display = visible ? 'block' : 'none';
        if (visible) visibleCount++;
    });

    // Handle "no results" message
    let noResultsMessage = document.getElementById('noResultsMessage');
    if (visibleCount === 0 && studentsGrid) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('p');
            noResultsMessage.id = 'noResultsMessage';
            noResultsMessage.textContent = `No students found in ${selectedClass}`;
            noResultsMessage.style.cssText = 'text-align: center; width: 100%; margin: 2rem 0; color: var(--text-gray);';
            studentsGrid.appendChild(noResultsMessage);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }

    // Set display name for filter
    const displayName = selectedClass === 'all' ? 'All Classes' : selectedClass;

    // Update filter button text
    const filterBtn = document.querySelector('.class-filter button');
    filterBtn.innerHTML = `Filter <span class="filter-status">${displayName}</span>`;
}
