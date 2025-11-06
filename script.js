const form = document.getElementById("userForm");
const tableBody = document.getElementById("userTable");
const message = document.getElementById("message");
const API_URL = "http://localhost:7000/api";

// Load all users
async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/viewAll`);
        const data = await res.json();
        tableBody.innerHTML = "";
        if(data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6">No users yet</td></tr>`;
        } else {
            data.forEach((user, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.role === "Donor" ? user.donationAmount || 0 : "-"}</td>
                        <td><button onclick="deleteUser('${user._id}')">Delete</button></td>
                    </tr>
                `;
            });
        }
    } catch(err) {
        console.error(err);
    }
}

// Add new user
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const donationAmount = document.getElementById("donationAmount").value;

    try {
        const res = await fetch(`${API_URL}/addNew`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, role, donationAmount })
        });
        const result = await res.json();
        message.textContent = result.status;
        form.reset();
        loadUsers();
    } catch(err) {
        console.error(err);
    }
});

// Delete user
async function deleteUser(id) {
    try {
        const res = await fetch(`${API_URL}/deleteUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        message.textContent = result.status;
        loadUsers();
    } catch(err) {
        console.error(err);
    }
}

// Initial load
loadUsers();
