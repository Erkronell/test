$(document).ready(function () {
  $(".slider").bxSlider({
    mode: "fade",
    auto: true,
    pager: false,
  });
});

$(function(){  
  var page = $('.categories');
  var pageOffsetTop = page.offset().top;
  $(window).resize(function(){
    pageOffsetTop = page.offset().top;
  });
  console.log(pageOffsetTop);
  $(window).on('scroll', function(){
    if($(window).scrollTop() >= pageOffsetTop) {
      page.addClass('shadow');
    } else {
      page.removeClass('shadow');
    }
  });
});

let mylatitude, mylongitude;
let distance;

function loadItems() {
  return fetch('data/db.json')
  .then(response => response.json())
  .then(json => json.restaurants_list);
}

function displayItems(restaurants_list) {
  const container = document.querySelector('.restaurants_list');
  restaurants_list.map(item => getDistance(item));
  restaurants_list.sort(function(a,b) {
    return parseFloat(a.distance) - parseFloat(b.distance);  
  });
  container.innerHTML = restaurants_list.map(item => createHTMLString(item)).join('');  
}

function getDistance(item) {
  distance = getDistanceFromLatLonInMi(mylatitude, mylongitude, item.location.latitude, item.location.longitude);
  item.distance = distance;    
}


function getDistanceFromLatLonInMi(lat1,lng1,lat2,lng2) {  
  function deg2rad(deg) { 
    return deg * (Math.PI/180) 
  } 
  var R = 3958.8; // Radius of the earth in miles 
  var dLat = deg2rad(lat2-lat1); // deg2rad below 
  var dLon = deg2rad(lng2-lng1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in miles
  return d.toFixed(1); 
}


function createHTMLString(item) {
  if(item.distance >= 10000) {
    return;
  } else {
  return `
  <li class="restaurant" id="${item.name_eng}">
  <div class="inner-box">
  <a href="${item.weblink}" target="blank">
  <div class="res_logo">
    <img src="${item.logo}" alt="Logo" />
  </div>
  <div class="res_information">
    <span class="name_eng">${item.name_eng}</span>
    <span class="name_kor">${item.name_kor}</span>
    <span class="city">${item.city}, ${item.state}</span>
    <span class="description"
      >${item.description}
    </span>
  </div>
  <div class="res_distance">
    <span class="distance">${item.distance}mi</span>
  </div></a></div>  
</li>
  `;}
}

function onButtonClick(event, restaurants_list){
  const dataset = event.target.dataset;
  const key = dataset.key;  
  const value = dataset.value;  
  if (key == null || value == null) {
    return;
  }
  
  const filtered = restaurants_list.filter(item => item[key].includes(value));
  displayItems(filtered);
}

function setEventListeners(restaurants_list) {
  const all = document.querySelector('.all');
  const buttons = document.querySelector('.category');
  all.addEventListener('click', () => displayItems(restaurants_list));
  buttons.addEventListener('click', event => onButtonClick(event, restaurants_list));
}

navigator.geolocation.getCurrentPosition(function(pos) {
  mylatitude = pos.coords.latitude;
  mylongitude = pos.coords.longitude;  

  loadItems()
  .then(restaurants_list => {    
    displayItems(restaurants_list);    
    setEventListeners(restaurants_list);
  })
  .catch(console.log);
});