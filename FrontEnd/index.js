let categories = new Set();
categories.add({ id: 0, name: "Tous" });
let filters = document.querySelector(".filters");
let articles = [];
const gallery = document.querySelector(".gallery");
const galleryModal =document.querySelector("#gallery-modal")
let modal = null

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    articles = data;
    for (let article of articles) {
      gallery.innerHTML += `<figure class="${article.categoryId}">
                                                        <img src="${article.imageUrl}" alt="${article.title}">
                                                        <figcaption>${article.title}</figcaption>
                                                      </figure>`;
    }
    for (let article of articles) {
      galleryModal.innerHTML += `<figure class="item-modal" data-id="${article.id}">
                                                        <img class="image-modal" src="${article.imageUrl}" alt="${article.title}">
                                                        <div class="delete-gallery-modal"><i class="trash-modal fa-solid fa-trash-can"></i></div><figcaption>éditer</figcaption>
                                                      </figure>`;
    }
    for (let i = 0; i < 3 && i < articles.length; i++) {
      const article = articles[i];
      const category = article.category;
      categories.add(category);
    }
    for (let category of categories) {
      filters.innerHTML += `<div class="filter ${category.id}">${category.name}</div>`;
    }
    const categoryFilters = document.querySelectorAll(".filter");
    categoryFilters[0].classList.add("filter__selected");
    categoryFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const categoryId = parseInt(filter.classList[1]);
        categoryFilters.forEach((categoryFilters) =>
          categoryFilters.classList.remove("filter__selected")
        );
        categoryFilters[categoryId].classList.add("filter__selected");
        let filteredArticles;
        if (categoryId === 0) {
          filteredArticles = articles;
        } else {
          filteredArticles = articles.filter(
            (article) => article.categoryId === categoryId
          );
        }
        updateGallery(filteredArticles);
      });
    });
  } catch (error) {
    console.error(error);
  }
}
fetchWorks();

function updateGallery(filteredArticles) {
  gallery.innerHTML = "";
  for (let article of filteredArticles) {
    gallery.innerHTML += `<figure class="${article.categoryId}">
                            <img src="${article.imageUrl}" alt="${article.title}">
                            <figcaption>${article.title}</figcaption>
                          </figure>`;
  }
}

const openModal = function (e) {
  e.preventDefault();
  const targetId = e.target.getAttribute('href');
  const target = document.querySelector(targetId);
  target.style.display = 'flex';
  target.removeAttribute('aria-hidden');
  target.setAttribute('aria-modal', 'true');
  modal = target
  modal.addEventListener("click", closeModal)
  modal.querySelector('#modal-xmark').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault();
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener("click", closeModal)
  modal.querySelector('#modal-xmark').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

const loginUser = async (email, password) => {
  const user = {
    email: email,
    password: password
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      return result;
    } else if (response.status === 401) {
      throw new Error("Mot de passe incorrect");
    } else if (response.status === 404) {
      throw new Error("Utilisateur non trouvable");
    } else {
      throw new Error("Une erreur inattendue s'est produite");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

document.querySelectorAll('.jsModal').forEach(a => {
  a.addEventListener('click', openModal);
});

const buttonLogin = document.getElementById("login");
const caseEmail = document.querySelector("#email");
const casePassword = document.querySelector("#password");
const errorLogin = document.querySelector("#error-login");

const updateLoginLink = () => {
  const linkLogin = document.getElementById("linkLogin");
  console.log(linkLogin);
  if (localStorage.getItem("token")) {
    linkLogin.innerHTML = "logout";
  } else {
    linkLogin.innerHTML = "login";
  }
};

const loginResult = async (e) => {
  e.preventDefault();
  try {
    const result = await loginUser(caseEmail.value, casePassword.value);
    localStorage.setItem("token", result.token);
    window.location.href = "index.html";
  } catch (error) {
    errorLogin.innerHTML = error.message;
  }
};

buttonLogin.addEventListener("click", (e) => loginResult(e));

updateLoginLink();