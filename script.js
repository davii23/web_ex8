const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTable");
const message = document.getElementById("message");
const API_URL = "http://localhost:7000/api";

// Load all students
async function loadStudents() {
    try {
        const res = await fetch(`${API_URL}/viewAll`);
        const data = await res.json();
        tableBody.innerHTML = "";
        if(data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">No students yet</td></tr>`;
        } else {
            data.forEach((student, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.regno}</td>
                        <td>${student.cgpa}</td>
                        <td><button onclick="deleteStudent('${student._id}')">Delete</button></td>
                    </tr>
                `;
            });
        }
    } catch(err) {
        console.error(err);
    }
}

// Add new student
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const regno = document.getElementById("regno").value.trim();
    const cgpa = document.getElementById("cgpa").value.trim();

    try {
        const res = await fetch(`${API_URL}/addNew`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, regno, cgpa })
        });
        const result = await res.json();
        message.textContent = result.status;
        form.reset();
        loadStudents();
    } catch(err) {
        console.error(err);
    }
});

// Delete student
async function deleteStudent(id) {
    try {
        const res = await fetch(`${API_URL}/deleteUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        message.textContent = result.status;
        loadStudents();
    } catch(err) {
        console.error(err);
    }
}

// Initial load
loadStudents();
