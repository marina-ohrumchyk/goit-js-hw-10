import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');
const searchBox = document.getElementById('search-box');

searchBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function fetchCountries(name) {
  const ENDPOINT = `https://restcountries.com/v3.1/name/${name}`;
  return fetch(
    `${ENDPOINT}?fields=name,capital,population,flags,languages`
  ).then(res => res.json());
}

function onInputChange(e) {
  e.preventDefault();
  let name = searchBox.value.trim();
  if (name !== '') {
    fetchCountries(name)
      .then(data => {
        if (data.status === 404) {
          throw new Error('Failure');
        } else if (data.length > 10) {
          Notiflix.Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          updateCountryList(createCountryList(data));
        } else if (data.length === 1) {
          updateCountryInfo(createMarkup(data[0]));
          document.querySelector('.country-list').innerHTML = '';
        }
      })
      .catch(onError);
  } else {
    document.querySelector('.country-info').innerHTML = '';
  }
}
function createMarkup({ flags, name, capital, languages, population }) {
  let languagesMarkup = Object.values(languages);
  return `
    <img class="flag-svg" src="${flags.svg}">
    <h2 class="country-title">${name.official}</h2>
    <h3 class="country-capital">Capital: ${capital}</h3>
   <h3 class="country-languages">Languages: ${languagesMarkup}</h3>
    <h3 class="country-population">Population: ${population}</h3>
    `;
}
function createCountryList(countries) {
  let countryListMarkup = '';

  for (let country of countries) {
    countryListMarkup += ` <li class="country-list-item">
        <img class="flag-svg" src="${country.flags.svg}">
        <span class="country-title">${country.name.official}</span>
        </li>`;
  }
  return `
    ${countryListMarkup}
    `;
}
function updateCountryInfo(markup) {
  document.querySelector('.country-info').innerHTML = markup;
}
function updateCountryList(markup) {
  document.querySelector('.country-list').innerHTML = markup;
}
function onError(err) {
  console.error(err);
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
