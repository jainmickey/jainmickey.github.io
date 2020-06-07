
(function() {
  'use strict';

  var injectedFlickr = {
    photoset: {
      title: "Showcase",
      pages: 1,
      photo: [
        {
          ispublic:1,
          title: "Taj Mahal",
          isprimary:"0",
          isfamily:0,
          height_h:1067,
          height_o:3093,
          width_h:1600,
          height_m:333,
          url_m:"https://live.staticflickr.com/4265/35162519866_82e112f40d.jpg",
          height_k:1365,
          views:"291",
          isfriend:0,
          secret:"82e112f40d",
          ownername:"jainmickey",
          dateupload:"1497039549",
          id:"35162519866",
          url_h:"https://live.staticflickr.com/4265/35162519866_5f4d9ff2f3_h.jpg",
          width_o:4640,
          farm:5,
          width_m:500,
          server:"4265",
          width_k:2048,
          url_o:"https://live.staticflickr.com/4265/35162519866_9f5167f010_o.jpg",
          url_k:"https://live.staticflickr.com/4265/35162519866_116057958f_k.jpg"
        }
      ],
      per_page:500,
      owner:"141478774@N06",
      primary:"34816157580",
      total:109,
      page:1,
      id:"72157684767758226",
      perpage:500,
      ownername:"jainmickey"
    },
    stat:"ok"
  };

  var apiUrlBase = 'https://jainmickey-web.herokuapp.com/api/';

  var app = {
    isLoading: true,
    visiblePhotos: {},
    spinner: document.querySelector('.loader'),
    photos: document.querySelector('#photos'),
    container: document.querySelector('.container'),
  };


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  app.updatePhotos = function(data) {
    for (var i = 0; i < data.photoset.photo.length; i++) {
      var photo = data.photoset.photo[i];
      var photoCard = app.visiblePhotos[photo.id];
      if (!photoCard) {
        photoCard = '<img src="' + photo.url_m + '" alt="' + photo.title + '">'
        app.photos.append(photoCard)
        app.visiblePhotos[photo.id] = photoCard;
      }
    }
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a list of photos
  app.getPhotos = function() {
    var url = apiUrlBase + 'flickr';
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            app.updatePhotos(json);
          });
        }
      });
    }
    // Make the XHR to get the data, then update the card
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          app.updatePhotos(response);
        }
      }
    };
    request.open('GET', url);
    request.send();
  };

  app.saveFlickrPhotos = function() {
    window.localforage.setItem('flickrPhotos', app.visiblePhotos);
  };

  document.addEventListener('DOMContentLoaded', function() {
    window.localforage.getItem('flickrPhotos', function(err, imagesList) {
      if (imagesList) {
        app.flickrPhotos = imagesList;
        app.updatePhotos(app.flickrPhotos)
        app.getPhotos();
      } else {
        app.getPhotos();
        app.saveFlickrPhotos();
      }
    });    
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function() { 
        console.log('Service Worker Registered'); 
      });
  }

})();
