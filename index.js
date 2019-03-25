const fs = require ('fs'); 
const http = require('http');
const url = require('url'); 

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'); //sync function is okay because once do it once
const countryData = JSON.parse(json); 
console.log(countryData);

// Creating a server method with a callback function that will be fired each time someone accesses the web server (opens the page on the web server)
// callback function gets access to the request and response objects

const server = http.createServer((req, res) => {
    // URL routing for each
    // Images need routing also because Node.js takes in requests so we need to have a way to response to the request in order to display
    const pathName = url.parse(req.url, true).pathname;  
    const id = url.parse(req.url, true).query.id; 
    // MAIN PAGE
    if (pathName === '/favoritecountries' || pathName === '/') {
        res.writeHead(200, {'Content-type': 'txt.html'}); 
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            // Creating a template for each country 
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = countryData.map (el => replaceTemplate(data, el)).join(''); 
                // Different array for different card (one card for each country). Simple just array of HTML 
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput); 
                res.end(overviewOutput); 
            });
        });
    } 
    // DETAILS PAGE
    else if (pathName === '/country' && id < countryData.length) {
        res.writeHead(200, {'Content-type': 'text.html'}); 
        fs.readFile(`${__dirname}/templates/template-countries.html`, 'utf-8', (err, data) => {
            const country = countryData[id];
            const output = replaceTemplate(data, country);
            res.end(output); 
        })
    } 
    // IMAGES 
    else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-tye': 'image/jpg'}); 
            res.end(data);
        })
    }
    
    // URL NOT FOUND
    else {
        res.writeHead(404, {'Content-type': 'txt.html'}); 
        res.end('URL was not found on the server!');
    }
});

server.listen(8081, '127.0.0.1', () => {

});

function replaceTemplate(originalHTML, country) {
    let output = originalHTML.replace(/{%COUNTRYNAME%}/g, country.countryName); //regular expression is added here (/ and g)
    output = output.replace(/{%IMAGE%}/g, country.image); // output here instead of data because we don't want to just replace the orginal but chaining them all together
    output = output.replace(/{%PRICE%}/g, country.price);
    output = output.replace(/{%PLACESVISITED%}/g, country.placesVisited);
    output = output.replace(/{%SUGGESTEDDURATION%}/g, country.suggestedDuration);
    output = output.replace(/{%RATING%}/g, country.rating);
    output = output.replace(/{%PLACESTOSTAY%}/g, country.placesToStay);
    output = output.replace(/{%COUNTRYDESCRIPTION%}/g, country.description);
    output = output.replace(/{%ID%}/g, country.id);
    return output; 

}
