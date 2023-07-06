let categories = new Set();
categories.add({ id: 0, name: "Tous" });
let filters = document.querySelector(".filters");
let articles = [];

// Ajout de la galerie de façon dynamique //

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    const data = await response.json();
    articles = data;
    updateWorksDOM(articles, "init");
    loadCategories();
    registerWorksFilter();
  } catch (error) {
    console.error(error);
  }
}

function updateWorksDOM(articles, type) {
  const gallery = document.querySelector(".gallery");
  const galleryModal = document.querySelector("#gallery-modal");

  if(type === "init") {
  for (let article of articles) {
    gallery.innerHTML += `<figure class="item-gallery ${article.categoryId}" data-id="${article.id}">
                            <img src="${article.imageUrl}" alt="${article.title}">
                            <figcaption>${article.title}</figcaption>
                          </figure>`;
    galleryModal.innerHTML += `<figure class="item-modal" data-id="${article.id}">
                          <img class="image-modal" src="${article.imageUrl}" alt="${article.title}">
                          <div class="delete-gallery-modal"><i class="trash-modal fa-solid fa-trash-can"></i></div>
                          <figcaption>éditer</figcaption>
                      </figure>`;
  }
}
  if(type === "filter") {
    gallery.innerHTML = "";
  for (let article of articles) {
    gallery.innerHTML += `<figure class="${article.categoryId}">
                              <img src="${article.imageUrl}" alt="${article.title}">
                              <figcaption>${article.title}</figcaption>
                            </figure>`;
  }
  }
}

// Récuperation des filtres puis ajout des filtres pour la gallerie //

function loadCategories() {
  for (let i = 0; i < 3 && i < articles.length; i++) {
    const article = articles[i];
    const category = article.category;
    categories.add(category);
  }
  for (let category of categories) {
    filters.innerHTML += `<div class="filter ${category.id}">${category.name}</div>`;
  }
}

function registerWorksFilter() {
  const categoryFilters = document.querySelectorAll(".filter");
  categoryFilters[0].classList.add("filter__selected");
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const categoryId = parseInt(filter.classList[1]);
      categoryFilters.forEach((categoryFilter) => {
        categoryFilter.classList.remove("filter__selected");
      });
      filter.classList.add("filter__selected");
      let filteredArticles;
      if (categoryId === 0) {
        filteredArticles = articles;
      } else {
        filteredArticles = articles.filter(
          (article) => article.categoryId === categoryId
        );
      }
      updateWorksDOM(filteredArticles, "filter")
    });
  });
}

fetchWorks();

// Apparition du mode administrateur lors de la connexion //

const linkLogin = document.querySelector("#linkLogin");
let isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

const logoutAction = (e) => {
  e.preventDefault();

  if (isLoggedOut === false) {
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedOut", true);
    location.reload();
  } else {
    isLoggedOut = true;
    console.log("Déconnexion");
    window.location.href = "login.html";
  }
};

linkLogin.addEventListener("click", logoutAction);

const edit = document.querySelector("#edit");
const editPicture = document.querySelector("#edit-picture");
const editGallery = document.querySelector("#edit-gallery");

const updateLoginLink = () => {
  if (localStorage.getItem("token")) {
    linkLogin.innerHTML = "logout";
    editPicture.style.display = "flex";
    editGallery.style.display = "flex";
    edit.style.display = "flex";
  } else {
    linkLogin.innerHTML = "login";
    editPicture.style.display = "none";
    editGallery.style.display = "none";
    edit.style.display = "none";
  }
};

const token = localStorage.getItem("token");
console.log(token);

// Ajout de la modale (ouvrir, fermer, retour en arrière ect...)

let modal = null;
const buttonModal = document.querySelectorAll(".jsModal");
const xmarks = document.querySelectorAll(".js-modal-xmark");

const openModal = function (e) {
  e.preventDefault();
  const targetId = e.target.getAttribute("href");
  const target = document.querySelector(targetId);
  target.style.display = "flex";
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  Array.from(xmarks).forEach((xmark) => {
    xmark.addEventListener("click", closeModal);
  });
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  Array.from(xmarks).forEach((xmark) => {
    xmark.removeEventListener("click", closeModal);
  });
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

buttonModal.forEach((a) => {
  a.addEventListener("click", openModal);
});

const modalAdd = document.querySelector("#modal-add");
const modalDelete = document.querySelector("#modal-delete");
const buttonModalAddPicture = document.querySelector(
  "#button-modal-add-picture"
);

function changeModal() {
  modalDelete.style.display = "none";
  modalAdd.style.display = "flex";
}
buttonModalAddPicture.addEventListener("click", changeModal);

const backToModalDelete = document.querySelector("#back-to-modal-delete");

function changeModalBack() {
  modalAdd.style.display = "none";
  modalDelete.style.display = "flex";
}

backToModalDelete.addEventListener("click", changeModalBack);

// Fetch pour delete les articles de la galerie //

const galleryModal = document.querySelector("#gallery-modal");
galleryModal.addEventListener("click", async function (e) {
  if (e.target.classList.contains("trash-modal")) {
    const figure = e.target.closest("figure");
    const articleId = figure.dataset.id;
    console.log(articleId);
    try {
      const response = await fetch(
        `http://localhost:5678/api/works/${articleId}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        document.querySelector(`.item-modal[data-id="${articleId}"]`).remove();
        document
          .querySelector(`.item-gallery[data-id="${articleId}"]`)
          .remove();
      } else {
        throw new Error("La suppression a échoué.");
      }
    } catch (error) {
      const messageError = document.querySelector(".error-message").innerHTML = error.message;
      console.log(messageError);
      console.error(error);
    }
  }
});

// Apparition de l'image representant l'article ajouter a la gallerie //

const fileInput = document.querySelector("#button-add-picture-input");
const imagePreview = document.querySelector("#image-modal-add");
const imageSelected = document.querySelector("#image-selected");

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", function () {
    if (file) {
      imagePreview.style.display = "none";
      document.querySelector("#button-add-picture").style.display = "none";
      document.querySelector("#modal-add-picture p").style.display = "none";
      imageSelected.style.display = "flex";
      imageSelected.src = reader.result;
    } else {
      imagePreview.style.display = "flex";
      imageSelected.style.display = "none";
      document.querySelector("#button-add-picture").style.display = "flex";
      document.querySelector("#modal-add-picture p").style.display = "flex";
    }
  });
  if (file) {
    reader.readAsDataURL(file);
  }
});

// Ajout du fetch permettant d'ajouter des articles //

const buttonAddNewPicture = document.querySelector("#button-add-item");
const titlePictureCase = document.querySelector("#title-add-modal");
const categoryPictureCase = document.querySelector("#category-of-item");

async function fetchPost() {
  const file = fileInput.files[0];
  const blob = new Blob([file], { type: file.type });
  const formDatas = new FormData();
  formDatas.append("image", blob);
  formDatas.append("title", titlePictureCase.value);
  formDatas.append("category", categoryPictureCase.selectedIndex);

  console.log(file, titlePictureCase.value, categoryPictureCase.selectedIndex);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formDatas,
  });
  if (!response.ok) {
    throw new Error("Une erreur inattendue s'est produite");
  }
  return response.json();
}

// Function qui permet l'ajout dynamique des articles dans les galeries et reinitializer la modal d'ajout d'article //

async function postPicture() {
  try {
    const result = await fetchPost();
    const newArticle = await result;

    const gallery = document.querySelector(".gallery");
    const newArticleHTML = `<figure class="item-gallery ${newArticle.categoryId}" data-id="${newArticle.id}">
                              <img src="${newArticle.imageUrl}" alt="${newArticle.title}">
                              <figcaption>${newArticle.title}</figcaption>
                            </figure>`;

    const newArticleHTMLModal = `<figure class="item-modal" data-id="${newArticle.id}">
                                  <img class="image-modal" src="${newArticle.imageUrl}" alt="${newArticle.title}">
                                  <div class="delete-gallery-modal"><i class="trash-modal fa-solid fa-trash-can"></i></div>
                                  <figcaption>éditer</figcaption>
                                </figure>`;

    gallery.insertAdjacentHTML("beforeend", newArticleHTML);
    galleryModal.insertAdjacentHTML("beforeend", newArticleHTMLModal);
    imagePreview.style.display = "flex";
    imageSelected.style.display = "none";
    document.querySelector("#button-add-picture").style.display = "flex";
    document.querySelector("#modal-add-picture p").style.display = "flex";
    titlePictureCase.value = "";
    categoryPictureCase.selectedIndex = 0;

  } catch (error) {
    const messageError = document.querySelector(".error-message").innerHTML = error.message;
    console.log(messageError);
  }
}

buttonAddNewPicture.addEventListener("click", postPicture);

updateLoginLink();