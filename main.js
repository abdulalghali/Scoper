import {fetchAllListings, listings, search} from "./search.js"

const BASE_URL = "http://localhost:8080/api";

init();

async function init() {
  await fetchAllListings();
}

// init variables
const createTemplate = document.querySelector('.main-body');
const createBtn = document.querySelector('#create-listing-btn');
const closeBtn = document.querySelector('#cancel-listing-btn');
const searchBtn = document.querySelector('#search-btn');

const minBedsInput = document.getElementById('min-beds');
let sortByEl = document.getElementById('sort-select');


// Event listeners
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let minBeds = minBedsInput.value;
  let sortByElText = sortByEl.options[sortByEl.selectedIndex].text;
  const searchDetails = {
    minBeds: minBeds,
    sortByElText: sortByElText,
    searchTerm: null
  }
  search(searchDetails);
})






const newListingBody = document.querySelector('.main-body');
newListingBody.style.display = 'none';

const createListingBtn = document.querySelector('#new-listing-btn');
createListingBtn.addEventListener('click', (e) => {
  e.preventDefault();
  toggleCreateListingBtn();
})

function toggleCreateListingBtn() {
    const createListingDiv = document.querySelector('#new-listing-div');
    createListingDiv.style.display = 'none';

    newListingBody.style.display = 'block';

    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createListing();
    })

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createTemplate.style.display = 'none';
      createListingDiv.style.display = 'block';
    })
}

export function renderListings(listings) {
  let tableData = "";
    listings.map((listing) =>  {
      tableData += ` 
              <tr id="listing-${listing.id}" class="listing-temp">
                  <td><img class="listing-img" src="${listing.imageUrl}"/> <h3 id="saved-icon"></h3> </td>
                  <td id="main-desc">£${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${listing.houseType}</td>
                  <td><img id="location-pic" src="./images/location.jpg"/> ${listing.address}, ${listing.city}</td>
                  <td id="bed-desc"> <img id="bed-pic" src="./images/bed.png"/> ${listing.bedrooms} beds</td>
                  <td id="bed-desc"> <img id="bath-pic" src="./images/bath.png"/> ${listing.bathrooms} baths</td>
                  <td class="search"><button id="listing-save-btn" data-listing='${JSON.stringify(listing)}'>
                  ${listing.saved ? "❤️ Saved" : "🤍 Save"}</button></td>
                  <td><button class="toggle-listing-availability-btn" data-listing='${JSON.stringify(listing)}'><img id="tick-pic" src="./images/tick.png"/>
                      ${listing.sold ? "Mark As Available" : "Mark As Sold"}
                  </button></td>
                  <td id="confirm-row"><button id="cancel-delete-btn">Cancel</button> <button id="confirm-delete-btn">Confirm</button></td>
                  <td ><button id="listing-delete-btn" data-listing='${JSON.stringify(listing)}'> <img id="delete-pic" src="./images/delete.png"/> Delete</button></td>
              </tr>
          `
          })
      document.getElementById("template-body").innerHTML = tableData;

      setMarkAsSoldButtonEventListeners();
      setDeleteButtonEventListeners();
      setSaveButtonEventListeners();
}


function setSaveButtonEventListeners() {
    document.querySelectorAll('#listing-save-btn').forEach( btn => {
    const listing = JSON.parse(btn.dataset.listing);
    const listingEl = document.querySelector(`#listing-${listing.id}`);
    const listingToggleBtnEl = listingEl.querySelector('#listing-save-btn');

    if (listing.saved) {

      listingToggleBtnEl.style.backgroundColor = "#918250";
    } else {
      listingToggleBtnEl.style.backgroundColor = "#a1233c";
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSavedListing(listing);
    })
  })
}

function toggleSavedListing(listing) {
  listing.saved = !listing.saved;

  fetch(BASE_URL +"/listings", {
    method: "PUT",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(listing)
  }).then( res => res.json())
  .then(() => fetchAllListings());


}


function setMarkAsSoldButtonEventListeners() {
    document.querySelectorAll('.toggle-listing-availability-btn').forEach( btn => {
      const listing = JSON.parse(btn.dataset.listing);
      const listingEl = document.querySelector(`#listing-${listing.id}`);
      const listingImgEl = listingEl.querySelector(".listing-img");
      const listingToggleBtnEl = listingEl.querySelector(".toggle-listing-availability-btn");
      if (listing.sold) {
        listingToggleBtnEl.style.backgroundColor = "#f59116";
        listingImgEl.style.opacity = "0.5";
      } else {
        listingToggleBtnEl.style.backgroundColor = "#4a9918";
        listingImgEl.style.opacity = "0.8";
      }
      
      btn.addEventListener('click', (e) => {
      const listing = JSON.parse(btn.dataset.listing);
          e.preventDefault();
         toggleListingAvailability(listing)
      })
    })
}

function toggleListingAvailability(listing) {

  listing.sold = !listing.sold;

    fetch(BASE_URL +"/listings", {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(listing)
    }).then( res => res.json())
    .then(() => fetchAllListings());
}



function createListing() {
  const imageUrl = document.querySelector('#img-input').value;

  const imageUrlInp = imageUrl.slice(12);
  //deletes "fakepath//" from file directory

  const priceInp = document.querySelector('#price-input').value;

  const houseInp = document.querySelector('#houseType-input').value;
  const addressInp = document.querySelector('#address-input').value;

  const cityInp = document.querySelector('#city-input').value;
  const bedroomInp = document.querySelector('#bedroom-input').value;
  const bathroomInp = document.querySelector('#bathroom-input').value;


  if (imageUrlInp.length != 0 && priceInp.length != 0 && houseInp.length != 0 && addressInp.length != 0 && cityInp.length != 0 && bedroomInp.length != 0 && bathroomInp.length != 0) {
   const listingData = {imageUrl:`images/${imageUrlInp}`,
                        price:`${priceInp}`,
                        houseType:`${houseInp}`,
                        address:`${addressInp}`,
                        city:`${cityInp}`,
                        bedrooms:`${bedroomInp}`,
                        bathrooms:`${bathroomInp}`
                      };

  fetch(BASE_URL +"/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(listingData),
  }).then( res => res.json())
  .then(() => fetchAllListings());
 } else {
  alert("fields cannot be null");
 }
}



function setDeleteButtonEventListeners() {
  document.querySelectorAll('#listing-delete-btn').forEach( btn => {

    const listing = JSON.parse(btn.dataset.listing);
    const listingEl = document.querySelector(`#listing-${listing.id}`);

    const cancelBtn = listingEl.querySelector('#cancel-delete-btn');
    const confirmBtn = listingEl.querySelector('#confirm-delete-btn');

    const listingDltBtn = listingEl.querySelector('#listing-delete-btn');
    const confirmDltRow = listingEl.querySelector('#confirm-row');

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const listing = JSON.parse(btn.dataset.listing);
      listingDltBtn.style.display = 'none';
      confirmDltRow.style.display = 'block';

      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        listingDltBtn.style.display = 'block';
        confirmDltRow.style.display = 'none';
      })


      confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        deleteListing(listing);
      })
    })  

    })
}


function deleteListing(listing) {
    fetch(BASE_URL +"/listings", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify(listing),
    }).then(() => fetchAllListings());
}

