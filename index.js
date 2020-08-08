const apiKey = 'TbPYfvKiKNjV9FJjju8YECOgqgf5ylJ0PhKijNnA'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].name}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>Park Address:<br> ${responseJson.data[i].addresses[0].line1}<br>
      ${responseJson.data[i].addresses[0].line2}<br>
      ${responseJson.data[i].addresses[0].city}
      ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}</p>
      <p><a href='${responseJson.data[i].url}'>Check out their website</p>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getParksInfo(query, maxResults=10, stateSearch) {
  const params = {
    q: query,
    stateCode: stateSearch,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const stateSearch = $('#js-state-search-term').val();
    getParksInfo(searchTerm, maxResults, stateSearch);
  });
}

$(watchForm);