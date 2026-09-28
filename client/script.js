const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        try {
            const response = await fetch(
                "https://crud-auth-flame.vercel.app/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirmPassword
                    })
                }
            );

            const data = await response.json();

            document.getElementById("message").textContent =
                data.message;

            if (response.ok) {
                registerForm.reset();

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            }

        } catch (error) {
            document.getElementById("message").textContent =
                "Something went wrong";
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(
                "https://crud-auth-flame.vercel.app/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();
console.log(data)
            document.getElementById("message").textContent =
                data.message;

            if (response.ok) {
                localStorage.setItem(
                    "accessToken",
                    data.data.accessToken
                );

                window.location.href = "products.html";
            }

        } catch (error) {
            console.error(error);

            document.getElementById("message").textContent =
                "Something went wrong";
        }
    });
}

const productsContainer = document.getElementById("products");
const productForm = document.getElementById("productForm");


// ================= GET PRODUCTS =================

async function getProducts() {
const token = await getAccessToken();

    try {
        const response = await fetch(
            "https://crud-auth-flame.vercel.app/api/products",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data);
            return;
        }

        productsContainer.innerHTML = "";

        data.products.forEach(product => {
            productsContainer.innerHTML += `
                <div class="product">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price}</p>
                    <p>${product.description}</p>

                    <button onclick="editProduct('${product._id}')">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct('${product._id}')"
                    >
                        Delete
                    </button>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}


// Load products when products page opens

if (productsContainer) {
    getProducts();
}


// ================= CREATE PRODUCT =================

if (productForm) {

    productForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("productName").value;

        const price =
            document.getElementById("productPrice").value;

        const description =
            document.getElementById("productDescription").value;

      const token = await getAccessToken();

        try {

            const response = await fetch(
                "https://crud-auth-flame.vercel.app/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name,
                        price,
                        description
                    })
                }
            );

            const data = await response.json();

            document.getElementById("productMessage").textContent =
                data.message;

            if (response.ok) {

                productForm.reset();

                getProducts();
            }

        } catch (error) {

            console.error(error);

            document.getElementById("productMessage").textContent =
                "Something went wrong";
        }
    });
}

async function deleteProduct(id) {

  const token = await getAccessToken();

    try {

        const response = await fetch(
            `https://crud-auth-flame.vercel.app/api/products/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        document.getElementById("productMessage").textContent =
            data.message;

        if (response.ok) {
            getProducts();
        }

    } catch (error) {

        console.error(error);

        document.getElementById("productMessage").textContent =
            "Something went wrong";
    }
}

async function editProduct(id) {

    const name = prompt("Enter product name:");
    const price = prompt("Enter product price:");
    const description = prompt("Enter product description:");

    if (!name || !price || !description) {
        return;
    }

    const token = await getAccessToken();
    try {

        const response = await fetch(
            `https://crud-auth-flame.vercel.app/api/products/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    price,
                    description
                })
            }
        );

        const data = await response.json();

        document.getElementById("productMessage").textContent =
            data.message;

        if (response.ok) {
            getProducts();
        }

    } catch (error) {

        console.error(error);

        document.getElementById("productMessage").textContent =
            "Something went wrong";
    }
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            const response = await fetch(
                "https://crud-auth-flame.vercel.app/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const data = await response.json();

            console.log(data);

            // Remove access token
            localStorage.removeItem("accessToken");

            // Go to login page
            window.location.href = "index.html";

        } catch (error) {

            console.error(error);

        }

    });

}

async function refreshAccessToken() {

    const response = await fetch(
        "https://crud-auth-flame.vercel.app/api/auth/refresh",
        {
            method: "POST",
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        return null;
    }

    const newAccessToken = data.data.accessToken;

    localStorage.setItem(
        "accessToken",
        newAccessToken
    );

    return newAccessToken;
}

function isTokenExpired(token) {

    if (!token) {
        return true;
    }

    const payload = JSON.parse(
        atob(token.split(".")[1])
    );

    return payload.exp * 1000 < Date.now();
}

async function getAccessToken() {

    let token = localStorage.getItem("accessToken");

    if (isTokenExpired(token)) {
        token = await refreshAccessToken();
    }

    return token;
}