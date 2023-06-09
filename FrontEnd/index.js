let categories = new Set();
categories.add({ id: 0, name: "Tous" });
let filters = document.querySelector(".filters");
let articles = [];

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    articles = data;
    for (let article of articles) {
      document.querySelector(
        ".gallery"
      ).innerHTML += `<figure class="${article.categoryId}">
                                                        <img src="${article.imageUrl}" alt="${article.title}">
                                                        <figcaption>${article.title}</figcaption>
                                                      </figure>`;
    }
    for (let i = 0; i < 3 && i < articles.length; i++) {
      const article = articles[i];
      const category = article.category;
      categories.add(category);
    }
    for (let item of categories) {
      filters.innerHTML += `<div class="filter ${item.id}">${item.name}</div>`;
    }
    const categoryFilters = document.querySelectorAll(".filter");
    categoryFilters[0].classList.add("filter__selected");
    categoryFilters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const categoryId = parseInt(filter.classList[1]);
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
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (let article of filteredArticles) {
    gallery.innerHTML += `<figure class="${article.categoryId}">
                            <img src="${article.imageUrl}" alt="${article.title}">
                            <figcaption>${article.title}</figcaption>
                          </figure>`;
  }
}
