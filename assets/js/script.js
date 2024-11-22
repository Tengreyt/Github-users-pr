const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    const user = response.data;

    createUserCard(user);
    getRepos(username);
  } catch (err) {
    createErrorCard("No profile with this username");
  }
}

async function getRepos(username) {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=created`);
    const repos = response.data;

    addReposToCard(repos);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
}

function createUserCard(user) {
  const cardHTML = `
        <div class="card">
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio ? user.bio : "No bio available"}</p>
            <ul>
                ${dateAttritubenullcheck(user.created_at, "Account created")}
                ${attritubenullcheck(user.location, "Location")}
                ${attritubenullcheck(user.public_repos, "Repositories")}
            </ul>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function dateAttritubenullcheck(item, att) {
  if (item) {
    const formattedDate = moment(item).format("MMMM Do, YYYY");
    return `<li><strong>${att}</strong> - ${formattedDate} </li>`;
  } else return "";
}

function attritubenullcheck(item, att) {
  if (item) {
    return `<li><strong>${att}</strong> - ${item} </li>`;
  } else return "";
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.createElement("div");
  reposEl.classList.add("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });

  main.appendChild(reposEl);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
