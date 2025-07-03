
function validateUser() {

    let user = getUserData();
    if (user.name.length < 1 || user.name.length > 50 || !validName(user.name)) return alert("Invalid Username, Enter only letters and spaces");
    if (user.age < 1 || user.age > 100) return alert("Invalid Age, age should be less than 100 and more than 0");
    console.log("User is added successfully");
    document.getElementById("form").reset();
    addUser(user);
}

function validName(name) {
    return (/^[A-Za-z\s]+$/.test(name));
}

function getUserData() {
    const { name, email, age } = document.forms["form"];
    return {
        name: name.value.trim(),
        email: email.value.trim(),
        age: parseInt(age.value, 10)
    };
}


function addUser(user) {
    let usersTable = document.getElementById("users");
    let tableBody = usersTable.getElementsByTagName("tbody")[0];

    tableBody.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
            </tr>`;

}
