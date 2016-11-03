'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ProfileSchema = new mongoose.Schema({

  location:{},
  prio: String,
  adress: {},
  distance: {},
  phone: String,
  email: String,
  web: String,
  shortInfo: String,
  impressum: String,
  name: String,
  gmap: String,
  info: String


  },{ versionKey: false });

export default mongoose.model('Profile', ProfileSchema);
