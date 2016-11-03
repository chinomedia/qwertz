/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/profiles           ->  index
 * POST    /api/profiles             ->  create
 * GET     /api/profiles/:id          ->  show
 * PUT     /api/profiles/:id          ->  update
 * DELETE  /api/profiles/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Profile from './profile.model';

var uuid = require('node-uuid'),
  multiparty = require('multiparty'),
  fs = require('fs'),
  Jimp = require('jimp')
,https = require('https'),
  q = require("q")
;

function findLocation(postal){
  var deferred = q.defer();


  var location= {};



  var request = {

    host: 'maps.googleapis.com'
    ,path: '/maps/api/geocode/json?address='+postal.params.postal+',Germany&key=AIzaSyDrajnPKhkQ-UIGODUrfgOI8Mo7mTkle8o' //AIzaSyAhMxfa_6At3U0VVfTF1Gj5N8xpo96c76Y
  };


  var req = https.get(request, function(res) {


    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);

      var result = JSON.parse(body);

      console.log(result);

      location = result.results[0].geometry.location;

      deferred.resolve(location);


      });

    });



  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
    deferred.reject( entities);
  });


  return deferred.promise;


}


    function filterClosest(entities, postal){
        var deferred = q.defer();

        var distances = [];
        var locations= '';

        for(var i = 0; i<entities.length;i++ ){
          if(locations.length < 1800) {
            locations = locations.concat(entities[i].location.lat);
            locations = locations.concat(',');
            locations = locations.concat(entities[i].location.lng);
            locations = locations.concat('|');

          }
        }
        locations= locations.slice(0,-1);

        var request = {

          host: 'maps.googleapis.com'
          ,path: '/maps/api/distancematrix/json?origins='+locations+'&destinations='+postal.params.postal+',Germany&key=AIzaSyCHRUCzSHu5GAKKeEB_kceFKotWKoZnA6k'
           };


        var req = https.get(request, function(res) {


          // Buffer the body entirely for processing as a whole.
          var bodyChunks = [];
          res.on('data', function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
          }).on('end', function() {
            var body = Buffer.concat(bodyChunks);

            var result = JSON.parse(body);



            for(var i = 0; i<entities.length;i++ ){
              entities[i].distance= result.rows[i].elements[0].distance;

            }

            deferred.resolve(entities);
          });

        });

        req.on('error', function(e) {
          console.log('ERROR: ' + e.message);
          deferred.reject( entities);
        });


        return deferred.promise;


    }


exports.postImage = function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {

    var file = files.file[0];
    var contentType = file.headers['content-type'];
    var tmpPath = file.path;
    var extIndex = tmpPath.lastIndexOf('.');
    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
    // uuid is for generating unique filenames.
    var fileName = uuid.v4() + extension;
    console.log(__dirname);
    // /var/www/virtual/chino/html/server/api/profile
    // var destPath = 'server/files/img/' + fileName;
    var destPath = __dirname + '/../../files/img/' + fileName;
    var smallPath = __dirname + '/../../files/img/'+'x' + fileName;

    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
      fs.unlink(tmpPath);
      return res.status(400).send('Unsupported file type.');
    }

    fs.rename(tmpPath, destPath, function(err) {
      if (err) {
        console.log(err);
        return res.status(400).send('Image is not saved:'+ err);
      }
      Jimp.read(destPath, function (err, lenna) {
        if (err) throw err;
        lenna.resize(150, 150)            // resize
          .write(smallPath); // save
        console.log('image scaled')
      });
      console.log('image saved');
      return res.json({path:'/server/files/img/' + fileName, smallPath:'/server/files/img/'+'x' + fileName });
    });
  });
};

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  console.log('responding');
  return function(entity) {
    if (entity) {

      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    //var updated = updates;
    console.log(updated);
    console.log(updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}
function filterTags(tags) {
  return function(entities) {
    console.log(entities);
    var temp = [];
    console.log(tags);
    var tagList = tags.tags;
    _.forEach(tagList.split(","),(t)=>{
      console.log(t);
      temp= temp.concat(_.filter(entities, (p)=>{
        console.log(p.tags);
        return (_.includes(p.tags,t));
      }))
    });

    temp = _.uniq(temp);
console.log(temp);
    return temp;

  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;

  return function(err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}
export function byTags(req, res) {
console.log(req.params);
  Profile.findAsync()
    .then(filterTags(req.params))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Gets a list of Things
export function index(req, res) {
  var delta = 0.3; // ~33km

  findLocation(req).then(function(location){

    var latDeltaPlus = location.lat+delta;
    var latDeltaMinus = location.lat-delta;
    var lngDeltaPlus = location.lng+delta;
    var lngDeltaMinus = location.lng-delta;


    Profile.findAsync({"location.lat":{$gte:latDeltaMinus, $lte:latDeltaPlus},"location.lng":{$gte:lngDeltaMinus, $lte:lngDeltaPlus}}).then(function(result){
    console.log(result.length);
   filterClosest(result, req).then(function(dis){
     console.log('done');
     dis = _.orderBy(dis, function(entry){
       return entry.distance.value;
     });
     if(dis.length > 10) {
       dis = _.slice(dis, 0, 10);
     }
     res.send({'profiles': dis});
   }, function(){
     console.log('ohoh');
   });

  });
  //console.log(profiles);
  })

}

// Gets a single Thing from the DB
export function show(req, res) {

  Profile.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {

  Profile.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  Profile.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  Profile.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
