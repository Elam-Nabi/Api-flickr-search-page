const form = document.querySelector("form"); // Sparar formuläret i variabeln "form"

const searchFunction = e => {
  // Skapar en funktion som hanterar fetching från flickr API
  e.preventDefault(); // Hindrar formuläret från att uppdatera sidan.
  const keyword = document.querySelector("input").value; // Sparar undan värdet i variabeln "keyword" från det användaren skriver in i inputfältet
  const optionValue = document.querySelector("select").value; // Sparar värdet av det användaren väljer i drop down menyn ex 20 bilder, 30 bilder osv.
  removeContent(); // Kör funktionen nedan för att ta bort alla bilder efter varje ny sökning.
  fetchData(
    keyword,
    optionValue
  ); /* Kör funktionen nedan som tar emot 2 parametrar 
    Funktionen tar hand om fetchning av flickr API som sedan returnerar alla bilder som användaren söker efter.
  */
};

const fetchData = (keyword, optionValue) => {
  // Funktion som hanterar fetchnig av flickr api
  // Skapar en variabel "url" som har url-sträng från API:et. Denna url tar emot parametrar så att man kan välja antal bilder, och få resultat från det användaren söker efter.
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=b92fc3f1ed270df537e704819f542c8e&text=${keyword}&per_page=${optionValue}&format=json&nojsoncallback=1`;

  fetch(url) // Kör en javascript metod som fetchar url-strängen.
    .then(res => res.json()) // får tillbaka ett respons som är en json-sträng.
    .then(data => {
      // sedan kan jag använda mig av ett javascript object för att få fram nädvändig data från api:et.
      data.photos.photo.forEach(item => {
        // loopar igenom arrayen "photo" där varje bild är ett object
        document.querySelector(".close-btn").addEventListener("click", () => {
          // skapar en eventlistener för stäng-knappen innanför lightboxen som stänger när lightbosen när användaren klickar på stängknappen.
          document.querySelector("#light-box").style.display = "none"; // sätter display till none för lightboxen.
        });
        let url = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`; // bygger upp en url sträng med nödvändiga egenskaper från objektet för att bilden ska kunna visas
        // Varje img-tagg tar emot url variabeln i sin src attribut.
        let output = `
      <img src="${url}">        
    `;
        document.getElementById("output").innerHTML += output; // Skriver ut varje bild innanför container output.
        const imgArr = document.querySelectorAll("#output img"); // skapar en array med de bilder som visas på sidan.
        imgArr.forEach(img => img.addEventListener("click", handleLightbox));
        /*   loopar igenom arrayen så att jag kan ange en eventlistener som lyssnar efter ett click event.
         När man klickar på en bild så körs funktionen "handleLightbox"*/

        function handleLightbox(e) {
          // Deklarerar funktionen handleLightbox som tar emot ett event objekt
          let lightboxImage = document.querySelector("#light-box img"); // sparar img-taggen innanför lightboxen i variabeln "lightboxImage"
          let newSrc = e.target.getAttribute("src"); // hämtar src attributen från bilden man har clickat på
          lightboxImage.setAttribute("src", newSrc); //  sedan så sätter man src attributen från image tag inuti lightbox
          document.querySelector("#light-box").style.display = "flex"; // visar lightbox fönstret när användaren klickar på en bild
        }
      });
    });
};

const removeContent = () => {
  //  En funktion som avlägsnar bilder efter ny sök
  document.getElementById("output").innerHTML = ""; // tar bort innehållet från container output, alltså bilderna
};
form.addEventListener("submit", searchFunction); // Ett event som körs när användaren trycker på knappen märkt Submit. När knappen trycks startas sökfunktionen.
