const http = require("http");

// Sample data
let users = [
    { id: 1, name: "ahmed", age: 23 },
    { id: 2, name: "ashraf", age: 22 },
    { id: 3, name: "ali", age: 21 },
];

let posts = [
    { id: 1, text: "post1" },
    { id: 2, text: "post2" },
    { id: 3, text: "post3" },
];

// Utility functions
const parseRequestBody = (req) =>
    new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject("Invalid JSON");
            }
        });
    });

const sendJSON = (res, data, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
};

const sendText = (res, message, status = 200) => {
    res.writeHead(status, { "Content-Type": "text/plain" });
    res.end(message);
};

// Route Handlers
const handleUsers = async (req, res) => {
    switch (req.method) {
        case "GET":
            return sendJSON(res, users);

        case "POST":
            try {
                const newUser = await parseRequestBody(req);
                const exists = users.some((u) => u.id === newUser.id);
                if (exists) return sendText(res, `User with ID ${newUser.id} already exists`, 400);
                users.push(newUser);
                return sendText(res, "User added successfully", 201);
            } catch (err) {
                return sendText(res, err, 400);
            }

        case "PUT":
            try {
                const updatedUser = await parseRequestBody(req);
                const index = users.findIndex((u) => u.id === updatedUser.id);
                if (index === -1) return sendText(res, `User with ID ${updatedUser.id} not found`, 404);
                users[index] = { ...users[index], ...updatedUser };
                return sendText(res, `User with ID ${updatedUser.id} updated successfully`);
            } catch (err) {
                return sendText(res, err, 400);
            }

        case "DELETE":
            try {
                const { id } = await parseRequestBody(req);
                const index = users.findIndex((u) => u.id === id);
                if (index === -1) return sendText(res, `User with ID ${id} not found`, 404);
                users.splice(index, 1);
                return sendText(res, `User with ID ${id} deleted successfully`);
            } catch (err) {
                return sendText(res, err, 400);
            }

        default:
            return sendText(res, "Method Not Allowed", 405);
    }
};

const handlePosts = async (req, res) => {
    switch (req.method) {
        case "GET":
            return sendJSON(res, posts);

        case "POST":
            try {
                const newPost = await parseRequestBody(req);
                const exists = posts.some((p) => p.id === newPost.id);
                if (exists) return sendText(res, `Post with ID ${newPost.id} already exists`, 400);
                posts.push(newPost);
                return sendText(res, "Post added successfully", 201);
            } catch (err) {
                return sendText(res, err, 400);
            }

        case "PUT":
            try {
                const updatedPost = await parseRequestBody(req);
                const index = posts.findIndex((p) => p.id === updatedPost.id);
                if (index === -1) return sendText(res, `Post with ID ${updatedPost.id} not found`, 404);
                posts[index] = { ...posts[index], ...updatedPost };
                return sendText(res, `Post with ID ${updatedPost.id} updated successfully`);
            } catch (err) {
                return sendText(res, err, 400);
            }

        case "DELETE":
            try {
                const { id } = await parseRequestBody(req);
                const index = posts.findIndex((p) => p.id === id);
                if (index === -1) return sendText(res, `Post with ID ${id} not found`, 404);
                posts.splice(index, 1);
                return sendText(res, `Post with ID ${id} deleted successfully`);
            } catch (err) {
                return sendText(res, err, 400);
            }

        default:
            return sendText(res, "Method Not Allowed", 405);
    }
};

// Main server logic
const server = http.createServer((req, res) => {
    if (req.url === "/users") {
        return handleUsers(req, res);
    } else if (req.url === "/posts") {
        return handlePosts(req, res);
    } else {
        return sendText(res, "Not Found", 404);
    }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
