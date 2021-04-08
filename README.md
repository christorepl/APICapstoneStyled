# CovidPovertyLink

An app for users to research and compare the COVID-19 rates and poverty rates of US states.

Users can select one or more US states and view data related to poverty and COVID-19 rates.

This app is currently hosted on [GitHub](https://christorepl.github.io/CovidPovertyLink/).

Here is a sample screenshot of what a user's results should look like when they make a request:
![screenshot](https://raw.githubusercontent.com/christorepl/CovidPovertyLink/master/screenshots/screen1.png)

Users can select and deselect states using the form as shown below:

![selectionGif](https://raw.githubusercontent.com/christorepl/CovidPovertyLink/master/screenshots/howToSelectDeselect.gif)
As you can see, you can remove states from the "Selected States" list by either clicking the name of the state in the "States" list or the "Selected States" list.

The Population Estimates API tends to be the most problematic. Errors appear to be returned in an HTML format as opposed to a JSON object. Users only need to pause their submissions for a moment before the API will start successfully responding again.

Languages/ Libaries used:

1. Javascript
2. HTML
3. CSS
4. jQuery

API's used:

1. [coronavirus-us-api](https://rapidapi.com/Spiderpig86/api/coronavirus-us-api?endpoint=apiendpoint_bf2347c9-63f3-41f0-ade7-8a493512f99c)
2. [SAIPE](https://www.census.gov/programs-surveys/saipe/data/api.html)
3. [Population Estimates](https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html)

Plugins used:

1. [multi.js](https://github.com/Fabianlindfors/multi.js)

Plans for improvement in V2:

1. Add a select all button to the selection form
2. Add a remove all button to the selection form
3. Add data about race
4. Make tab button easier to use in form
5. Alter functions so that error messages are displayed on the page [not with alerts]
