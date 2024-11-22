/* В начале кода получаем ссылки на элементы DOM,
которые понадобятся для работы с формой и отображением данных:*/
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

/* Эта функция выполняет основной запрос к API GitHub,
чтобы получить информацию о пользователе по его имени. */
async function getUser(username) {
  try {
    // Используется axios для упрощённой работы с HTTP-запросами.
    const response = await axios.get(`https://api.github.com/users/${username}`);// Отправляется GET-запрос к API GitHub.
    const user = response.data;
    //  Обработка ответа
    createUserCard(user);
    getRepos(username);
  } catch (err) { // <== Обработка ошибок
    createErrorCard("No profile with this username");
  }
}

/* Эта функция используется для получения списка репозиториев пользователя. */
async function getRepos(username) {
  try {
    // Эта функция загружает репозитории пользователя с помощью API GitHub.
    // Отправляется запрос для получения репозиториев, отсортированных по дате создания (самые новые первыми).
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=created`);
    
    /* Полученные данные (repos) передаются в функцию addReposToCard(repos), 
    которая добавляет репозитории в интерфейс. */
    const repos = response.data;
    addReposToCard(repos);
  } catch (err) { // <== Обработка ошибок
    createErrorCard("Problem fetching repos");
  }
}

/* Эта функция создает карточку пользователя на основе полученных данных. */
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
  // Отображение в main
  main.innerHTML = cardHTML;
}

function dateAttritubenullcheck(item, att) {
  // Проверяет наличие даты, форматирует её и возвращает HTML:
  if (item) {
    const formattedDate = moment(item).format("MMMM Do, YYYY");
    return `<li><strong>${att}</strong> - ${formattedDate} </li>`;
  } else return "";
  // Используется библиотека moment.js для форматирования даты.
}

function attritubenullcheck(item, att) {
  // Проверяет наличие данных и возвращает HTML:
  if (item) {
    return `<li><strong>${att}</strong> - ${item} </li>`;
  } else return "";
}


// Создаёт и отображает карточку с сообщением об ошибке:
function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

// Добавляет список репозиториев в карточку пользователя.
function addReposToCard(repos) {
  // Создание элемента div для репозиториев
  const reposEl = document.createElement("div");
  reposEl.classList.add("repos");
  // Создаётся div с классом repos.

  // Создание ссылок на репозитории
  // Отображаются первые 10 репозиториев (slice(0, 10)).
  // Для каждого репозитория создаётся элемент <a> с ссылкой на GitHub.
  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
  // Добавление репозиториев в карточку
  main.appendChild(reposEl);
}

// Обработчик отправки формы
// Событие submit предотвращает стандартное поведение формы.
// Считывается введённое имя пользователя.
// Вызывается функция getUser(user) для загрузки данных.
// Поле search очищается.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
