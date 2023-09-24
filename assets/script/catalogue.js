import{livres} from "./livres.js";

let listeLivres = document.getElementById("listeLivres"); //Section comprenant les vignettes de livres
let pagination = document.getElementById("pagination"); //Section contenant la pagination
let selectNbLivres = document.getElementById("nbLivres"); //Select du nombre de livres par pages
let html = "";
let page = "";
let pageCourante, pagePrecedente, nbParPage, nbPages;

//S'occupe de l'affichage initial
function initPage() {
      pageCourante = 1;
      nbParPage = 12; //Nombre initial de première visite
      if (window.localStorage.nbLivresParPage) { //Établir le nombre de livres par page selon le localStorage
            nbParPage = window.localStorage.nbLivresParPage;
            selectNbLivres.value = window.localStorage.nbLivresParPage; //Afficher la bonne valeur dans le select
            if (nbParPage == livres.length)
                  selectNbLivres.value = 0; //Cas du choix d'affichage de tous les livres
      }
      selectNbLivres.addEventListener("change", setNombreParPage);
      afficherPage();
};

initPage();

//Change le nombre de vignettes par page selon le select
function setNombreParPage() {
      nbParPage = this.value;
      if (nbParPage == 0) //Choix d'afficher tous les livres
            nbParPage = livres.length;
      window.localStorage.nbLivresParPage = nbParPage; //Sauvegarde du nombre par page en localStorage
      pageCourante = 1;
      afficherPage();
}

//Change la page selon la valeur du clic
function changerPage() {
      pagePrecedente = pageCourante; //Ancienne valeur de pageCourante
      pageCourante = this.value; //Nouvelle valeur de pageCourante
      if (this.value == "«")
            pageCourante = pagePrecedente - 1;      
      if (this.value == "»")
            pageCourante = ++pagePrecedente;
      afficherPage();
}

//Gestion de l'affichage des livres et pagination
function afficherPage() {
      html = "";
      page = "";
      listeLivres.innerHTML = "";
      pagination.innerHTML = "";

      //Vignettes de livres
      let premierAffiche = (nbParPage * pageCourante) - nbParPage;
      let dernierAffiche = nbParPage * pageCourante;
      if (dernierAffiche > livres.length)
            dernierAffiche = livres.length; //S'assurer de ne pas dépasser le tableau de livres
      
      for (let i = premierAffiche; i < dernierAffiche; i++) {
            html += "<article class='livre'><header class='titre'>";
            html += `${livres[i].titre}</header>`;
            html += `<p class="imageCouverture"><img src="assets/images/${livres[i].imageCouverture}"></p>`;
            html += `<p class="auteur">${livres[i].auteur}</p>`;
            html += `<p class="prix">${livres[i].prix} €</p>`;
            html += `<p class="genre">${livres[i].genre}</p>`;
            html += "<input type='button' class='btn_achat' value='Ajouter au panier'></input>";
            html += "</article>";
      }
      listeLivres.insertAdjacentHTML("beforeend", html);

      //Pagination
      nbPages = Math.ceil(livres.length/nbParPage);

      page += `<input type="button" value="&laquo;">`;
      for (let i = 1; i <= nbPages; i++) {
            page += `<input type="button" value="${i}">`;
      }
      page += `<input type="button" value="&raquo;">`;
      pagination.insertAdjacentHTML("beforeend", page);

      if (pageCourante == 1)
            pagination.firstChild.style.display = "none"; //Faire disparaître le "«" en première page
      if (pageCourante == nbPages)
            pagination.lastChild.style.display = "none"; //Faire disparaître le "»" en dernière page

      let boutons = pagination.children;
      for (let bouton of boutons) {
            bouton.addEventListener("click", changerPage);
            bouton.classList.remove("btn_page_active");
            if(bouton.value == pageCourante)
                  bouton.classList.add("btn_page_active");
      }
}