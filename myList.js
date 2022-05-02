// ######            The function to clear all the table               ########
function deleteChild(id) {
    while (id.hasChildNodes()) {
        id.removeChild(id.firstChild);
    }
}
// #######################################################################

document.addEventListener('DOMContentLoaded', function() {
    
    const passedData = sessionStorage.getItem('myList'); // Get text data(string) of the selected uni's from sessionStorage 
    const myCountry = sessionStorage.getItem('myCountry'); // Get string of the country name searched
    const myRawList = JSON.parse(passedData); // Convert into JSON data to be used 
    const myList = Object.entries(myRawList); // Convert the JSON/object into an array for "forEach"

    const activeSave = localStorage.getItem('mySave'); // Get saved uni's from localStorage
    const tempSave = JSON.parse(activeSave); // Convert into JSON data to be used
    // let objSave = {}; // Temporary object to store objects of the keys/values in a specific style

    let titleCountry = document.getElementById("title-country");
    titleCountry.innerHTML = `Latest Country You have Selected - ${myCountry}`;

    myList.forEach(element => {
        //element style == "keyID(homepage)": {name: "", country: "", web_pages: ""}
        const tableList = document.getElementById('table-List');
        const tableRow = document.createElement('tr');

        // #######################################################################
        const wFav = element[1].web_pages;
        const uniFav = element[1].name;
        const countryFav = element[1].country;
        let tempObj = {};
        tempObj[wFav] = {name: uniFav, country: countryFav, web_pages: wFav};
        
        tableRow.innerHTML = `<td class="tableName">${uniFav}</td><td class="tableCountry">${countryFav}</td><td class="tableWeb"><a href="${wFav}">${wFav}<a></td>`;
        // #######################################################################
        // #######################################################################
        const checkbox = document.createElement('INPUT');
        checkbox.setAttribute("type", "checkbox");
        checkbox.id = `${wFav}-cb`; // Giving ID for each correspoding checkbox
        checkbox.addEventListener('change', (e) => {
            // ###### When checkbox is checked ######
            if (e.target.checked === true) { 
                // Add the checked uni to "tempSave" {name: , country: , web_page: , interested: }
                Object.assign(tempSave, tempObj);
            // ###### When checkbox is unchecked ######
            } else if (e.target.checked === false) {
                // Remove the unchecked uni from "tempSave"
                delete tempSave[wFav];
            }
            // ###### Update the list in the localStorage in text format ######
            localStorage.setItem('mySave', JSON.stringify(tempSave));
        })
        // #######################################################################
        const checkboxContainer = document.createElement('td');

        checkboxContainer.append(checkbox);
        tableRow.append(checkboxContainer);
        tableList.append(tableRow);
    
    })

    const openSave = document.getElementById('open-save');
    openSave.addEventListener('click', (e) => {
        e.preventDefault();
        const saveList = document.getElementById('save-list');
        deleteChild(saveList);
        
        const activeSave = localStorage.getItem('mySave'); // Get saved uni's from localStorage
        const tempSave = JSON.parse(activeSave);
        const mySave = Object.entries(tempSave);
        
        mySave.forEach(element => {
            
            const tableRow = document.createElement('tr');

            // #######################################################################
            const wFav = element[1].web_pages;
            const uniFav = element[1].name;
            const countryFav = element[1].country;
            let tempObj = {};
            tempObj[wFav] = {name: uniFav, country: countryFav, web_pages: wFav};
            tableRow.id = wFav;
            
            tableRow.innerHTML = `<td class="tableName">${uniFav}</td><td class="tableCountry">${countryFav}</td><td class="tableWeb"><a href="${wFav}">${wFav}<a></td>`;

            const removeButton = document.createElement('button');
            removeButton.innerHTML = "Remove";
            const buttonContainer = document.createElement('td');
            

            buttonContainer.append(removeButton);
            tableRow.append(buttonContainer);
            saveList.append(tableRow);
            removeButton.addEventListener('click', (e) => {
                e.preventDefault();
                let cbID = `${wFav}-cb`; // Set an instance for string of id for checkbox
                document.getElementById(cbID).checked = false; // making "unchecked" when pressed "Remove" button
                delete tempSave[wFav];
                let tableRowID = document.getElementById(`${wFav}`);
                tableRowID.remove()
                localStorage.setItem('mySave', JSON.stringify(tempSave));
            })


        })

        
    })

    
    

})