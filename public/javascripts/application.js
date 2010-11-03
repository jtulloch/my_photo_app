var photo_app = (function() {
  var statusContainer,
      mainImage,
      activeNode,
      _photoCollection,
      thumbsContainer,
      loading = false;

  var photoUnSelected = function( target ) {
  };

  var getActiveNode = function() {
    return (activeNode || null);
  };

  var setActiveNode = function( node ) {
    if( activeNode ) {
      $(activeNode).removeClass('active');
    }
    activeNode = node;
    $(activeNode).addClass('active');
  };

  var photoSelected = function( target ) {
    setActiveNode( target );

    if( !mainImage ) {
      mainImage = document.createElement('img');
      $("#main").append(mainImage);
    }
    mainImage.src = getUri(target.id,'standard');
  };

  var getUri = function( id, photoType /* standard,high_res,thumb */) {
    var uri = 'photo/' + id + '/' + photoType;
    return uri; 
  };

  var addThumb = function( photo ) {
    thumbsContainer = thumbsContainer || $("#thumbs #photos");
    var imageDiv = $("<div>").addClass('imageContainer').attr('id',photo.uid);
    thumbsContainer.append(imageDiv);

    var image = document.createElement('img');
    imageDiv.append(image);
    image.src = getUri(photo.uid,'thumb');
  };

  return {
    highResClick: function( event ) {
      var id = getActiveNode().id;
      location.href = getUri(id,'high_res');
    },

    containerClick: function( event ) {
      var target = event.target;
      if( target.tagName === 'IMG' ) {
        target = target.parentElement || target.parentNode;
      } 

      if( target.id ) {
        photoSelected( target );
      }
    },
    onScroll: function( event ) {
      var target = event.target;

      if( (target.scrollTop > (target.scrollHeight - (target.offsetHeight + 160))) && !loading ) {
        loading = true;
        photo_app.addNextThumbs();
        loading = false;
      }
    },

    updateStatus: function( message ) {
      statusContainer = statusContainer || $("#status")[0];
      statusContainer.innerHTML = message;
    },

    getPhotos: function() {
      $.get('photos',photo_app.processResponse);
    },

    processResponse: function( response ) {
      photo_app.photoCollection.setPhotos( response );
      photo_app.addNextThumbs();
    },

    addNextThumbs: function() {
      var photos = photo_app.photoCollection.getPhotos();
      if( photos ) {
        for( var i = 0,length = photos.length; i < length; i++ ) {
          var photo = photos[i];
          var id = photo.uid;
          if( !_photoCollection[id] ) {
            _photoCollection[id] = photo;
            addThumb(photo);
          }
        }
      }
    },

    appStart: function() {
      _photoCollection = _photoCollection || {};

      photo_app.getPhotos();

      $("#downloadLink").click(photo_app.highResClick);
      $("#photos").click(photo_app.containerClick);
      $("#thumbs").scroll(photo_app.onScroll);
    }
  }
})();

photo_app.photoCollection = (function() {
    var _limit = 10,_offset = 0,_photos;

    return {
      setLimit: function( limit ) {
        _limit = limit;
      },

      setOffset: function( offset ) {
        _offset = offset;
      },

      getPhotos: function( args ) {
        var photosLength = _photos.length;
        if( _photos.length === _offset ) {
          return null;
        }

        if( args ) {
          var limit = args.limit || _limit;
          var offset = args.offset || _offset;
        }
        limit = limit || _limit;
        offset = offset || _offset;

        var secondIndex = limit + offset;
        var returnArray = _photos.slice(offset,secondIndex);

        if( offset === _offset ) {
          _offset = ( _photos.length > secondIndex ) ? secondIndex : _photos.length;
        }

        return returnArray;
      },

      setPhotos: function( photos ) {
        _photos = photos;
      }
    };
})();

$(document).ready(photo_app.appStart);

