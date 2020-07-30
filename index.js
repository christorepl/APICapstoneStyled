'use strict';

const censusApiKey = 'e58359a5f0b6fe02b58b6c5cc56479b3f82d9918';
var covidSearchURL = 'https://coronavirus-us-api.herokuapp.com/api/state/all?source=nyt&fips=';
const povertySearchURL = 'https://api.census.gov/data/timeseries/poverty/saipe?time=2018&get=SAEPOVALL_PT,SAEPOVRTALL_PT&for=state:'
const populationSearchURL = 'https://api.census.gov/data/2019/pep/population?get=POP&for=state:'
//all three of the above API's will take fips codes for US states

function displayC19Results(covidResponse) {
  const htmlStrings = [];
  for (let i = 0; i < covidResponse.length; i++) {
    let covidData = new Intl.NumberFormat().format(covidResponse[i].locations[0].latest.confirmed)
    let covidState = covidResponse[i].locations[0].state
    const html = `
    <div class="stateContainer">
    <h3 class="stateResults" class="resultsFor${covidState}">
      Data for ${covidState} </h3> 
      <div class="populationResult${i}"></div> 
      <li class="covidResult${i}">Number of confirmed COVID-19 cases: <br> <span class="list-info" id="covidResultId${i}">${covidData}</span>
      </li>
      <div class="covidRateResults${i}"></div>
     </div>`;
    htmlStrings.push(html);
  }
  $('#results-list').prepend(htmlStrings);
};

function displayPopulationResults(populationResponse) {
  for (let i = 0; i < populationResponse.length; i++) {
    let populationNumber = parseInt(populationResponse[i][1][0])
    let covidNumber = document.getElementById(`covidResultId${i}`).innerHTML
    let covidRate = (parseInt(covidNumber) / parseInt(populationNumber))
    let covidPercent = (covidRate * 100000)
    let populationData = new Intl.NumberFormat().format(populationResponse[i][1][0])
    let populationHtml = `<li class="totalPopulation">Total population: <br> <span class="list-info">${populationData}</span></li>`
    let covidPercentHtml = `<li> Rate of COVID-19 diagnosis: <br> <span class="list-info"> ${covidPercent.toFixed(2)}%</span></li>`
    $(`.populationResult${i}`).append(populationHtml);
    $(`.covidRateResults${i}`).append(covidPercentHtml)
  }
}

function displayPovertyResults(povertyResponse) {
  for (let i = 0; i < povertyResponse.length; i++) {
    let povertyData = new Intl.NumberFormat().format(povertyResponse[i][1][0])
    let povertyRate = new Intl.NumberFormat().format(povertyResponse[i][1][1])
    const povertyHtml = `<li>
    Number of people living in poverty: <br> <span class="list-info"> ${povertyData}
    </span>
    </li>
      <li>Rate of population living in poverty: <br> <span class="list-info"> ${povertyRate}%
      </span>
      </li>`
    $(`.covidRateResults${i}`).append(povertyHtml);
  }
}

function getPopulationResults(query) {
  let populationURLs = []
  for (let i = 0; i < query.length; i++) {
    let populationURL = populationSearchURL + query[i] + "&key=" + censusApiKey;
    populationURLs.push(populationURL)
  }

  let requests = populationURLs.map(url => fetch(url))
  Promise.all(requests)
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }))
    })
    .then(populationResponseJson => {
      displayPopulationResults(populationResponseJson)
      getPovertyResults(query);
    })
    .catch(error => {
      $('#results').toggleClass('hidden')
      alert('Something went wrong with getting your information from the census database. Try again in a moment.')
      enableButton();
    });
}

function getPovertyResults(query) {
  let povertyURLs = []
  for (let i = 0; i < query.length; i++) {
    let povertyURL = povertySearchURL + query[i]
    povertyURLs.push(povertyURL)
  }
  let requests = povertyURLs.map(url => fetch(url))
  Promise.all(requests)
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }))
    })
    .then(povertyResponseJson => {
      displayPovertyResults(povertyResponseJson)
      enableButton();
    })
    .catch(error => {
      $('#results').toggleClass('hidden')
      alert('Something went wrong with getting your information from the poverty census database. Try again in a moment.')
      enableButton();
    });
}

function getC19Results(query) {
  let covidURLs = []
  for (let i = 0; i < query.length; i++) {
    let covidURL = covidSearchURL + query[i]
    covidURLs.push(covidURL)
  }
  let states = []
  let requests = covidURLs.map(url => fetch(url))
  Promise.all(requests)
    .then(function (responses) {
      return Promise.all(responses.map(function (response) {
        return response.json();
      }))
    })
    .then(covidResponseJson => {
      displayC19Results(covidResponseJson)
            getPopulationResults(query);
    })
.catch(error => {
      $('#results').toggleClass('hidden')
      alert('Something went wrong with getting your information from the COVID database. Try again in a moment.')
      enableButton();
    });
}

function disableButton() {
  $(".submitButton").prop("disabled", true)
}

function enableButton() {
  $(".submitButton").prop("disabled", false)
}

function watchForm() {
  $('form').submit(event => {
    let statesToSearch = $('#stateIds').val();
    if (statesToSearch.length === 0){
      event.preventDefault();
      alert("Please select one or more states from the menu.")
    } else {
    disableButton();
    $('#results-list').empty();
    $('#results').removeClass('hidden');
    event.preventDefault();
    getC19Results(statesToSearch);
    }
  });
}

$("#stateIds").multi({
	  non_selected_header: 'States',
	  selected_header: 'Selected States'
});

$(watchForm);
