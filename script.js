const startLoader = elemento => {
    elemento.innerHTML = `<div class="loading-spinner"></div>`;
}

const stopLoader = (elemento, value) => {
    elemento.textContent = value;
}

class PacoteBuscador {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    get(endpoint) {
        return fetch(this.baseURL + endpoint)
            .then(response => response.json());
    }

    put(endpoint, body) {
        return this._send("put", endpoint, body);
    }

    post(endpoint, body) {
        return this._send("post", endpoint, body);
    }

    delete(endpoint, body) {
        return this._send("delete", endpoint, body);
    }

    _send(method, endpoint, body) {
        return fetch(this.baseURL + endpoint, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(response => response.json());
    }
}

const api        = new PacoteBuscador("https://jsonplaceholder.typicode.com/posts");
const inputTitle = document.querySelector("#input-title");
const inputPost  = document.querySelector("#input-post");
const button     = document.querySelector("#submit-button");
const ul         = document.querySelector("#list-posts");
const form       = document.querySelector("#form-input");

document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});

form.addEventListener("submit", event => {
    event.preventDefault();

    startLoader(button);
    const data = {
        title: inputTitle.value,
        body: inputPost.value,
        userId: 1
    };

    api.post("", data).then(post => {
        stopLoader(button, "Post");
        ul.insertAdjacentHTML("afterbegin", `
            <article class="comment-card">
                <li>
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                </li>
            </article>
        `);
        form.reset();
    })
    .catch(error => {
        stopLoader(button, "Post");
        alert("Erro ao criar o post. Tente novamente.");
    });
});

const loadPosts = () => {
    api.get("").then(posts => {
        posts.forEach(post => {
            ul.insertAdjacentHTML("beforeend", `
                <article class="comment-card">
                    <li>
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                    </li>
                </article>
            `);
        });
    });
}

