"use strict";

 // Get a list of items in inventory based on the classification_id 
const classificationList = document.querySelector("#classificationList");


classificationList.addEventListener("change", function () { 
    const classification_id = classificationList.value ;
    console.log(`classification_id is: ${classification_id}`);
    const classIdURL = `/inv/getInventory/${classification_id}`;
    
    fetch(classIdURL) 
    .then(function (response) { 
        if (response.ok) { 
            return response.json(); 
    
        }throw Error("Network response was not OK"); 
    
    }).then(function (data) {  
        buildInventoryList(data); 
    
    }).catch(function (error) { 
        console.log('There was a problem: ', error.message) 
  }) 
 })


//  Build inventory items into HTML table components and injects into the DOM

const buildInventoryList = function (data) {
    const inventoryDisplay = document.querySelector("#inventoryDisplay");

    let dataTable = `<thead>
                        <tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>
                    </thead>
                    <tbody>`
    data.forEach(element => {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable +=`<tr><td>${element.inv_make} ${element.inv_model}</td>
                    <td class="edit-btn btn"><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
                    <td class="delete-btn btn"><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>
                    `;
    });
    dataTable += `</tbody>`;

    // Display the contents in the Inventory Management View
    inventoryDisplay.innerHTML = dataTable;

}
