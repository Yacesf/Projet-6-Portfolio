class Article{
  constructor(jsonArticle){
    jsonArticle && Object.assign(this, jsonArticle)
  }
}
fetch('http://localhost:5678/api/works')
  .then(r => 
    { if(r.ok){r.json()
  .then(jsonListArticle => {
    for(let jsonArticle of jsonListArticle){
    let article = new Article(jsonArticle)
    document.querySelector('.gallery').innerHTML += `<figure>
                                                          <img src="${article.imageUrl}" alt="${article.title}">
                                                          <figcaption>${article.title}</figcaption>
                                                      </figure>`
    }
  })
  }})

fetch('http://localhost:5678/api/categories')
  .then(r => r.json())
  .then(jsonListCategories => {
    for(let jsonCategorie of jsonListCategories){}
  })