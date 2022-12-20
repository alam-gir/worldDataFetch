// ! API URL
const COUNTRIES_URL = "https://restcountries.com/v3.1/all";

// ! select element
const mainContainer = document.querySelector(".main-container");
const populationBtn = document.getElementById("population-btn");
const languageBtn = document.getElementById("language-btn");
const btns = document.querySelectorAll(".btns button");

const info = document.querySelector(".info");
const totalCountries = document.querySelector(".total-countries");
console.log(mainContainer);

const showTopCountry = 20;
// ! functions
async function countriesInfo() {
  return fetch(COUNTRIES_URL).then((res) => res.json());
}

async function totalCountriesCount() {
  let countries = await countriesInfo();
  totalCountries.innerHTML = countries.length;
}
async function ascendingCountries() {
  let countries = await countriesInfo();
  // make copy of global countries
  let newCountriesInfo = [...countries];
  // sort by ascending
  newCountriesInfo.sort((a, b) => {
    if (a.population > b.population) return -1;
    else if (a.population < b.population) return 1;
    else return 0;
  });

  return newCountriesInfo;
}

// create country list based on population
async function countryList(num) {
  let countries = await ascendingCountries();

  // *1 create total world element -----------------
  // get total population of the whole world
  let totalWorldPopulation = 0;
  for (let x of countries) totalWorldPopulation += x["population"];
  //element set
  createDataElements("whole world", "100%", "#ff8800", totalWorldPopulation);

  // *2 get n sonkok countries element -----------------
  let nCountries = [];
  // store n sonkok country in array
  for (let i = 0; i < num; i++) nCountries.push(countries[i]); // loop wil run maximum num time,
  // now mapping country to get HTML element for showing in list
  nCountries.forEach((country) => {
    let name = country["name"]["common"];
    let population = country["population"];
    let progressBarPercent = Math.floor(
      (100 * population) / totalWorldPopulation
    );
    // Element
    createDataElements(name, progressBarPercent + "%", "#f2a93b", population);
  });
}

// create element function
function createDataElements(title, barParcent, barColor, totalCount) {
  //  create element
  let dataContainer = document.createElement("div");
  let name = document.createElement("h4");
  let progressBarContainer = document.createElement("div");
  let progressBar = document.createElement("div");
  let total = document.createElement("h4");
  // add class inner text setup
  dataContainer.classList.add("data-container");

  name.classList.add("name");
  name.textContent = title;

  progressBarContainer.classList.add("progress-bar-container");
  progressBar.classList.add("progress-bar");
  progressBar.style.width = barParcent;
  progressBar.style.background = barColor;

  total.classList.add("total-count");
  total.textContent = totalCount;

  // append elemetns
  progressBarContainer.appendChild(progressBar);

  dataContainer.appendChild(name);
  dataContainer.appendChild(progressBarContainer);
  dataContainer.appendChild(total);

  mainContainer.appendChild(dataContainer);
}

// show how much country have
totalCountriesCount();
//show info that what type of chart showing
info.innerHTML = `${showTopCountry} most populated countries in the world`;
// call the show function for show top population country
countryList(showTopCountry);

// show population list when click population
const showPopulation = () => {
  // remove previous element from mainContainer
  mainContainer.innerHTML = "";

  //show info that what type of chart showing
  info.innerHTML = `${showTopCountry} most populated countries in the world`;
  // again show top countries
  countryList(showTopCountry);
};

// create language list base on max used languages in the whole world
async function languageList(num) {
  let countries = await countriesInfo();

  // get all languages
  let allLanguages = [];
  countries.forEach((country) => {
    let languages = country.languages;
    for (let lang in languages) allLanguages.push(languages[lang]);
  });

  // get unique languages
  let totalLanguages = new Set(allLanguages);
  totalLanguages = [...totalLanguages];

  // count languages and store as an object
  let languagesInfo = [];
  for (let i = 0; i < num; i++) {
    // loop wil run maximum num time,

    // set initial object of every language
    languagesInfo.push({ language: totalLanguages[i], count: 1 });

    // check lagnuage, if match count++
    let count = 1;
    for (let x of allLanguages) {
      if (languagesInfo[i].language === x) languagesInfo[i].count = count++;
    }
  }

  // sort language info of ascending on count
  languagesInfo.sort((a, b) => {
    if (a.count > b.count) return -1;
    else if (a.count < b.count) return 1;
    else return 0;
  });

  // create data element base on language  for every languageInfo
  let maxLanguage = languagesInfo[0];
  languagesInfo.forEach((language) => {
    let progressBarPercent = Math.floor(
      (100 / maxLanguage.count) * language.count
    );
    createDataElements(
      language.language,
      progressBarPercent + "%",
      "#f2a93b",
      language.count
    );
  });
}

// show language list when click language
function showLanguage() {
  // remove previous element from mainContainer
  mainContainer.innerHTML = "";
  // show the language list
  languageList(showTopCountry);
  //show info that what type of chart showing
  info.innerHTML = `${showTopCountry} most spoken languages in the world`;
}

//activate btn
function activateBtn() {
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btns.forEach((btn) => btn.classList.remove("active-btn"));
      e.currentTarget.classList.add("active-btn");
    });
  });
}
activateBtn();
// ! eventListener
populationBtn.addEventListener("click", showPopulation);
languageBtn.addEventListener("click", showLanguage);
