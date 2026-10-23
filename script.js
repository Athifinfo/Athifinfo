// Credentials & Dual Security PIN Configuration (Username = athif, PIN 1 = 1971, PIN 2 = 2005)
let adminUsername = "athif";
let currentAdminPassword = "1234";
let securityPin1 = "1971";
let securityPin2 = "2005";
let isDeveloperLoggedIn = false;

// Submenu Dropdowns Toggle for Public Menus
const submenuToggles = document.querySelectorAll('.submenu-toggle');
submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const submenu = toggle.nextElementSibling;
        submenu.classList.toggle('open');
    });
});

// Protected Settings Click Listener
const settingsLockBtn = document.getElementById('settingsLockBtn');
const settingsSubmenu = document.getElementById('settingsSubmenu');

settingsLockBtn.addEventListener('click', () => {
    if (!isDeveloperLoggedIn) {
        alert("AthifInfo Developer Access Only! Please enter Username & Password.");
        document.getElementById('loginModal').classList.remove('hidden');
    } else {
        settingsSubmenu.classList.toggle('open');
    }
});

// Function to Switch Navigation Tabs
function switchToTab(targetTab) {
    const navButtons = document.querySelectorAll('.nav-btn[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(t => t.classList.remove('active'));

    const activeNavBtn = document.querySelector(`.nav-btn[data-tab="${targetTab}"]`);
    if (activeNavBtn) activeNavBtn.classList.add('active');

    const activeTabContent = document.getElementById(`${targetTab}-tab`);
    if (activeTabContent) activeTabContent.classList.add('active');
}

const navButtons = document.querySelectorAll('.nav-btn[data-tab]');
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchToTab(targetTab);
    });
});

// Home Page Clickable Cards Redirection
const clickableCards = document.querySelectorAll('.clickable-card');
clickableCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        const gotoTab = card.getAttribute('data-goto');
        switchToTab(gotoTab);
    });
});

// Login & Logout Modal Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const submitLogin = document.getElementById('submitLogin');

loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => loginModal.classList.add('hidden'));

// Login Logic
submitLogin.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === adminUsername && pass === currentAdminPassword) {
        isDeveloperLoggedIn = true;
        alert("AthifInfo Developer Login Successful! Settings unlocked.");
        
        loginModal.classList.add('hidden');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        
        // Show Settings Options and open submenu
        settingsSubmenu.classList.remove('hidden');
        settingsSubmenu.classList.add('open');

        // Remove Lock Icon from Settings
        const lockIcon = document.querySelector('.lock-icon');
        if (lockIcon) lockIcon.style.display = 'none';

        // Clear input fields
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";

        switchToTab('settings');
    } else {
        alert("Invalid Username or Password!");
    }
});

// Dual PIN Security Verification Logic (1971 & 2005)
function forgotPassword() {
    let userPin1 = prompt("ATHIFINFO SECURITY VERIFICATION - STEP 1:\nEnter First PIN:");
    
    if (userPin1 && userPin1.trim() === securityPin1) {
        let userPin2 = prompt("ATHIFINFO SECURITY VERIFICATION - STEP 2:\nEnter Second PIN:");
        if (userPin2 && userPin2.trim() === securityPin2) {
            let newPass = prompt("Both PINs Verified! Enter your New Password:");
            if (newPass && newPass.trim() !== "") {
                currentAdminPassword = newPass.trim();
                alert("Password updated successfully! Your new password is set.");
            } else {
                alert("Password cannot be empty!");
            }
        } else if (userPin2 !== null) {
            alert("Incorrect Second PIN! Access Denied.");
        }
    } else if (userPin1 !== null) {
        alert("Incorrect First PIN! Access Denied.");
    }
}

// Logout Logic
logoutBtn.addEventListener('click', () => {
    isDeveloperLoggedIn = false;
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');

    // Hide Settings submenu and re-enable lock icon
    settingsSubmenu.classList.add('hidden');
    settingsSubmenu.classList.remove('open');
    
    const lockIcon = document.querySelector('.lock-icon');
    if (lockIcon) lockIcon.style.display = 'inline-block';

    alert("Logged out successfully from AthifInfo.");
    switchToTab('home');
});

// Password Change Functionality in Settings
function updatePassword() {
    const currPass = document.getElementById('currPass').value;
    const newPass = document.getElementById('newPass').value;

    if (currPass === currentAdminPassword) {
        if (newPass.trim() !== "") {
            currentAdminPassword = newPass.trim();
            alert("Password updated successfully!");
            document.getElementById('currPass').value = "";
            document.getElementById('newPass').value = "";
        } else {
            alert("Please enter a valid new password!");
        }
    } else {
        alert("Current password does not match!");
    }
}

// File Upload & Direct Download Hub Sync Logic
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const category = document.getElementById('fileCategory').value;
    const title = document.getElementById('fileTitle').value;
    const version = document.getElementById('fileVersion').value;
    const desc = document.getElementById('fileDesc').value;
    const fileInput = document.getElementById('uploadFile').files[0];

    if (fileInput) {
        const sizeMB = (fileInput.size / (1024 * 1024)).toFixed(1);
        const fileUrl = URL.createObjectURL(fileInput);

        // Hide "No files" messages across grids
        const noAllMsg = document.getElementById('noAllFilesMsg');
        if (noAllMsg) noAllMsg.style.display = 'none';

        const card = document.createElement('div');
        card.className = 'item-card';

        if (category === 'apk') {
            const noMsg = document.getElementById('noApkMsg');
            if (noMsg) noMsg.style.display = 'none';

            card.innerHTML = `
                <i class="fa-brands fa-android item-icon apk-color"></i>
                <div class="item-info">
                    <h3>${title} <span class="tag">${version}</span></h3>
                    <p>${desc}</p>
                    <small>Size: ${sizeMB} MB</small>
                </div>
                <a href="${fileUrl}" download="${fileInput.name}" class="btn-download" onclick="downloadFile('${title}')"><i class="fa-solid fa-download"></i> Download APK</a>
            `;
            document.getElementById('apkGrid').prepend(card);
            
            // Automatically push to Direct Downloads Hub
            const allCard = card.cloneNode(true);
            document.getElementById('allDownloadsGrid').prepend(allCard);

            alert("APK File published successfully to AthifInfo!");
            switchToTab('apk');
        } else {
            const noMsg = document.getElementById('noSoftMsg');
            if (noMsg) noMsg.style.display = 'none';

            card.innerHTML = `
                <i class="fa-solid fa-desktop item-icon soft-color"></i>
                <div class="item-info">
                    <h3>${title} <span class="tag">${version}</span></h3>
                    <p>${desc}</p>
                    <small>Size: ${sizeMB} MB</small>
                </div>
                <a href="${fileUrl}" download="${fileInput.name}" class="btn-download soft-btn" onclick="downloadFile('${title}')"><i class="fa-solid fa-download"></i> Download Software</a>
            `;
            document.getElementById('softwareGrid').prepend(card);

            // Automatically push to Direct Downloads Hub
            const allCard = card.cloneNode(true);
            document.getElementById('allDownloadsGrid').prepend(allCard);

            alert("Software published successfully to AthifInfo!");
            switchToTab('software');
        }

        document.getElementById('uploadForm').reset();
    }
});

function downloadFile(fileName) {
    alert(`Starting direct download for ${fileName} from AthifInfo...`);
}