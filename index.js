async function fetchUniName(country) {
    const resp = await fetch(`http://universities.hipolabs.com/search?country=${country}`);
    const data = await resp.json();
    return data;
}

// ######            The function to clear all the table               ########
function deleteChild(id) {
    while (id.hasChildNodes()) {
        id.removeChild(id.firstChild);
    }
}
// #######################################################################

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('uni-search');
    
    // ###### To add an event to open a new window to show the selected universities ONLY ######
    const addFavourite = document.getElementById('favourite');
        addFavourite.addEventListener('click', (e) => {
            e.preventDefault();
            window.open("myList.html")       
    })
    // #######################################################################

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const countryName = document.getElementById('country-name').value;
        sessionStorage.setItem('myCountry', countryName); // Store the searched country name for myList.html
        const tableMain = document.getElementById('table-Main');
        deleteChild(tableMain); // Clear the result-table before creating a new result-table for another search

        fetchUniName(countryName)
        .then(uniNames => {
            // ### The Main Code to Get List of Names of Universities around the world ###
            // ############################################################################

            // ##### When invalid name of country is used in the search box, the eternal API returns an empty #######
            // ##### array. If so, this notifies the user to try other names.    ######
            if (uniNames.length === 0) {
                window.alert("Please try another name of the country. e.g. Russia => Russian Federation");
            }

            let objFav = {}; // Create an empty object to store the selected universities.
            
            uniNames.forEach(element => {
                // uniNames === [{object},{object},{object}, ...., {object}]
                // element === {key1: "", key2: "", ...}
                const tableRow = document.createElement('tr');
                
                // ######      Getting wanted values from external public API     #######
                const wPage = element.web_pages;
                const university = element.name;
                const country = element.country;
                // #######################################################################
                
                // #######Create an object in a specific style to store the wanted values for each element########
                let tempObj = {};
                tempObj[wPage] = {name: university, country: country, web_pages: wPage};
                //tempObj === {"web address":{name: university, country: country, web_pages: wPage}}
        
                // #######To add a table row for the search result  ##############
                tableRow.innerHTML = `<td class="tableName">${university}</td><td class="tableCountry">${country}</td><td class="tableWeb"><a href="${wPage}" target="_blank">${wPage}<a></td>`;

                // #######################################################################

                // ######Creating a checkbo-column in the result-table. letting user to select uni######
                // ###### and update the object of lists uni if checked/unchecked.                ######
                const checkbox = document.createElement('INPUT');
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("value", "uninterested"); //To check Checkbox. Initial value for unchecked
                
                // ##### Adding an event when the user check each checkbox #####
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked === true) {
                        checkbox.value = "interested"; // Checking the checkbox is working properly
                        // Add the checked uni to "objFav" {name: , country: , web_page: , interested: }
                        Object.assign(objFav, tempObj);

                    } else if (e.target.checked === false) {
                        checkbox.value = "uninterested"; // Checking the checkbox is working properly
                        delete objFav[wPage]; // remove unchecked uni from the object
                    }

                // #######################################################################

                    // ##### Storing the object of selected universities #####
                    sessionStorage.setItem('myList', JSON.stringify(objFav));
                    // #######################################################################

                    // ##### Creating a new object for saving true list in a local drive #####
                     const mySaveList = {};
                     localStorage.setItem('mySave', JSON.stringify(mySaveList));
                    // #######################################################################
                })

                // ##### Creating the checkbox in the result-table #####
                const checkboxContainer = document.createElement('td');
                //checkboxContainer.className = "tableCheckbox";
                checkboxContainer.append(checkbox);
                // #######################################################################
                
                tableRow.append(checkboxContainer);
                
                tableMain.append(tableRow);
                
            });
        })
        .catch(error => {
            alert(`Error: ${error}. Cannot obtain any data...`);
        })
    })
})