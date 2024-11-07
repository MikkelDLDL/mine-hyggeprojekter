/**
 * Constructor-function to create album-objects. Note that the name of the constructor function
 * is capitalised! - this is to distinguish it from other function just by looking at its name.
 * The function takes 3 parameters:
 * @param {string} artist : The artist name for the album
 * @param {string} album : The album name
 * @param {integer} totalTracks : The total number of tracks for the album
 */

/*Konstruktor funktion til at oprette album-objekter. 
Nu kan Album bruges til at oprette flere nye objekter.
*/
function Album(artist, album, totalTracks, year, genre, tracks) {
  this.artist = artist;
  this.album = album;
  this.totalTracks = totalTracks;
  this.year = year;
  this.genre = genre;
  this.tracks = tracks;
}

/*Deklarerer en funktion med parametrene album og parentid, der opretter
html-indholdet for et album og tilføjer det til et eksisterende html-element.
*/
function addDivWithAlbum(album, parentid) {
  /*variablen parentElement deklareres - højre side søger efter elementet med id(parentid),
  som returneres som objekt. parentElement vil være lig dette objet.
  */
  let parentElement = document.getElementById(parentid);
  //tracksHTML deklareres til at være en HTML-unordered-liste, som der kan tilføjes punkter til
  let tracksHTML = "<ul>";
  /*
Her laves et for-each loop, der går ind i først album og så tracks, og laver en liste af objekter med tracks.
forEach loopet iterer gennem hvert punkt(track) i denne liste så hvert track kan tilføjes til tracksHTML listen.
  */
  album.tracks.forEach((track) => {
  /*
+= operatoren tilføjer både noget til variablen og gemmer det, der bliver tilføjet, for hver iteration.
Det der bliver tilføjet er listepunkter <li> med trackNumber, trackTitle og trackTime.
Backticks og ${} gør det muligt at indsætte variabler og javascript udtryk direkte i HTML strengen.
  */
    tracksHTML += `<li>${track.trackNumber}. ${track.trackTitle} - ${track.trackTimeInSeconds} sek.</li>`;
  });
  //Når alle tracks er kørt igennem sluttes listen.
  tracksHTML += "</ul>";

  /*
  Her genereres et unikt id til hvert album. Sidste del af udtrykket erstatter mellemrum med bindestreger,
  så vi får et id-der overholder HTML standard.
  */
  const trackListId = `tracklist-${album.album.replace(/\s+/g, "-")}`;

  /*
Her skabes den HTML blok, der skal tilføjes til hvert album når funktionen addDivWithAlbum kaldes.
Derudover oprettes en knap til at vise og skjule tracklisten for hvert album.
Til det bruges ´onclick´ attributen, så når der trykkes på knappen kaldes toggleTracklList funktionen,
 med argumentet trackListId, som er variabel vi har oprette ovenfor til hver albums trackliste.
 Der oprettes også en div til hver trackliste med et unikt id baseret på albumtitlen, som har style="display: none;"
hvilket skjuler tracklisten som udgangspunkt. Dermed har vi defineret, hvilken trackliste det præcis er vi skal hente.
{tracksHTML}, som vi definerede ovenover, tilføjer så en HTML blok med tracknumber, title og tracktime.
Nederst tilføjer vi det HTML vi har defineret i elementToAdd til det HTML indhold, der findes i variablen parentElement,
som vi højere oppe har defineret med vores DOM, hvor vi henter indholdet fra blokken med id´et: parentid
  */
  let elementToAdd =
    `<div class="album-card">` +
    `<h3>${album.artist} - ${album.album}</h3>` +
    `<p>År: ${album.year} | Genre: ${album.genre}</p>` +
    `<p>Antal numre: ${album.totalTracks}</p>` +
    `<button onclick="toggleTrackList('${trackListId}')">Vis/skjul trackliste</button>` +
    `<div id="${trackListId}" style="display: none;">${tracksHTML}</div>` +
    `</div>`;
    parentElement.innerHTML = parentElement.innerHTML + elementToAdd;
}
/*
Her oprettes en funktion til at vise/skjule tracklisten, med ét parameter, som først søger på elementet, 
hvor tracklistid skal indsættes og deklarerer det i en variabel. Først tjekker style.display om tracklistElement er sat til "none",
altså, at det ikke vises. Hvis det er sandt, eksekveres næste del af koden, som ændrer værdien til "block", hvilket gør listen synlig.
Hvis tracklistElement ikke er "none", og listen dermed er synlig, så eksekveres ´else´ delen af koden og værdien ændres til "none" igen.
*/
function toggleTrackList(trackListId) {
  const trackListElement = document.getElementById(trackListId);
  if (trackListElement.style.display === "none") {
    trackListElement.style.display = "block";
  } else {
    trackListElement.style.display = "none";
  }
}

/*
Herunder henter vi indholdet fra vores json fil som bruges til at repræsentere vores albums.
Under oprettes et tomt array til album objekter. Disse objekter bygges nedenunder ved at hente data fra json-filen.
Det sker ved, at et for-loop itererer gennem json-filen lige så mange gange som der er albums.
Kroppen i for-loopet skaber et nyt objekt, som det tilføjer en række værdier til.
albumObjects.push(album); Denne del skubber det nyoprettede album ind i albumObjects arrayen.
Efter alle albums er oprettet gennemgås alle album i arrayet med forEach metoden, der kalder funktionen
addDivWithAlbum for hvert album i arrayet, den funktion bliver så kørt, og indholdet indsættes i HTML elementet med
id: "content"
*/

fetchContent("albumsafl.json").then((albums) => {
  let albumObjects = [];

  for (let i = 0; i < albums.length; i++) {
    const album = new Album(
      albums[i].artistName,
      albums[i].albumName,
      albums[i].trackList.length,
      albums[i].productionYear,
      albums[i].genre,
      albums[i].trackList // tilføj tracklisten fra JSON
    );
    albumObjects.push(album);
  }

  albumObjects.forEach((a) => {
    addDivWithAlbum(a, "content");
  });
});

/**
 * Function to add a div to the html-page containg a description of an album.
 * @param {Album} album : The album-object to be displayed on the page
 * @param {string} parentid : The id of the html parent-element, where the div should be placed
 */
/*
function addDivWithAlbum(album, parentid) {
  let parentElement = document.getElementById(parentid);
  let elementToAdd =
    "<div>" +
    album.artist +
    ": " +
    album.album +
    " | Album contains " +
    album.totalTracks +
    " tracks" +
    " | Production year: " +
    album.year +
    " | Genre: " +
    album.genre +
    "</div>";
  parentElement.innerHTML = parentElement.innerHTML + elementToAdd;
}
*/
/**
 * fetchContent is called with the desired URL as an arguement. This will load in the JSON-data.
 * All code, that is relying on the JSON-data, called albums here, needs to be within the scope
 * starting at "=> {" in the code below
 */
/*
fetchContent("albumsafl.json").then((albums) => {
  //Log data to the console in order to inspect it and confirm load
  console.log("Original Data: ");
  console.log(albums);

  //Declaration of empty array to keep album-objects
  let albumObjects = [];

  //Log status in the console to keep track of progress in the code
  console.log("To be populated: ");
  console.log(albumObjects);

  //For-loop iterating through the json-data and picking the information needed to create a summary of the data
  for (let i = 0; i < albums.length; i++) {
    //Instantiation of a new album-object. Notice how the ARGUEMENTS fit the PARAMATERS of the constructor-function declared in the beginning of the script
    const album = new Album(
      albums[i].artistName,
      albums[i].albumName,
      //Number of tracks are derived by accessing the length-property of the tracjList-array in the json-data
      albums[i].trackList.length,
      albums[i].productionYear,
      albums[i].genre
    );
    //Array include a push-method, which will add whatever is put as an arguement into the array
    albumObjects.push(album);
  }*/

  /**
   * At this point in the script, we would expect the albumObjects-array to be populated with objects representing an
   * album. But they only contain the information we need to create an overview: Artist name, album name and number of
   * tracks for the album
   */

  //Log status in the console to keep track of progress in the code
  console.log("Object Data: ");
  console.log(albumObjects);

  //Small test to ensure we have what we need expected result is 13
  console.log("Test: ");
  console.log(albumObjects[7].totalTracks);

  /**
   * Call to the function adding a div to the html-page representing an album in ln10.
   * The call is placed inside a for-each loop, because we want to do the same
   * operation with all the entries in the albumObjects-array.
   */
/*/*
  albumObjects.forEach(
    /**
     * Callback function in the forEach-method
     * @param {Album} a : The current album, we are working on
     */
    //function (a) {
      //Call to the addDivWithAlbum()-function in ln 10
      //addDivWithAlbum(a, "content");
    //}
  //);
//});


//A magic spell - memorise it and use it EXACTLY like this :)
async function fetchContent(url) {
  let request = await fetch(url);
  let json = await request.json();
  return json;
}
