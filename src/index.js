import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearchBoxEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputSearchBoxEl.addEventListener(
  'input',
  debounce(onDataInput, DEBOUNCE_DELAY)
);

function onDataInput() {
  const countryNameInput = refs.inputSearchBoxEl.value.trim();
  clearData();
  if (countryNameInput !== '') {
    fetchCountries(countryNameInput)
      .then(countriesArray => {
        if (countriesArray.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (countriesArray.length >= 2 && countriesArray.length <= 10) {
          renderCountriesList(countriesArray);
        }
        if (countriesArray.length === 1) {
          renderCountryInfo(countriesArray);
        }
        if (countriesArray.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      })
      .catch(error => {
        console.log(`This is error`, error);
      });
  }
}

function clearData() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}

function renderCountriesList(countries) {
  countries.map(country => {
    refs.countryListEl.insertAdjacentHTML(
      'beforeend',
      `<li class="country-item">
        <img src=${country.flags.svg} alt="country_flag" width="50px">
        ${country.name.official}
        <li>`
    );
  });
}

function renderCountryInfo(country) {
  refs.countryInfoEl.insertAdjacentHTML(
    'beforeend',
    `<div class='country-header'>
  <img src=${country[0].flags.svg} alt="country_flag" width="100px">
  <h2>${country[0].name.official}</h2>
</div>
<ul class='country-info-list'>
    <li>capital:<span class='country-info-item'>&nbsp${
      country[0].capital
    }</span></li>
    <li>population:<span class='country-info-item'>&nbsp${
      country[0].population
    }</span></li>
    <li>languages:<span class='country-info-item'>&nbsp${Object.values(
      country[0].languages
    ).join(', ')}</span></li>
</ul>`
  );
}
