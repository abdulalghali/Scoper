import { renderListings } from "./main.js";

const BASE_URL = "http://localhost:8080/api";


const showingResultCountEl = document.getElementById("result-count-text");

let allListings = [];
let listings = [];

async function fetchAllListings(){
    await fetch(BASE_URL + "/listings")
    .then((data) =>  data.json())
    .then((_listings) => allListings = _listings)
    setDisplayedListings(allListings);    
}

function filterListings(minBeds, sortByElText) {
    listings = allListings.filter(listing => listing.bedrooms >= minBeds && listing.houseType == sortByElText)
}


function search(searchDetails) {
    filterListings(searchDetails.minBeds, searchDetails.sortByElText);
    setDisplayedListings(listings);
}


function setDisplayedListings(_listings) {
    listings = _listings;
    renderListings(listings.reverse());

    const numOfListings = listings.length;
    showingResultCountEl.innerText = `Showing ${numOfListings > 1 ? numOfListings + " listings" : numOfListings + " listing"}`
}



export {BASE_URL, listings, fetchAllListings, filterListings, search}