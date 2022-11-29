const BASE_URL = "http://localhost:8080/api";

loadAllListings();


function loadAllListings(){
    fetch(BASE_URL + "/listings")
    .then((data) =>  data.json())
    .then((listings) => renderListings(listings.reverse()))
  }


  function renderListings(listings) {
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
                    ${listing.saved ? "Remove From Saved" : "🤍 Save"}</button></td>
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

      listingToggleBtnEl.style.backgroundColor = "#a1233c";
    } else {
      listingEl.style.display = 'none';
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
    .then(() => loadAllListings());
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
      .then(() => loadAllListings());
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
      }).then(() => loadAllListings());
  }