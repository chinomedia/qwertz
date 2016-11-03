'use strict';

import mongoose from 'mongoose';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Thing', ThingSchema);

export class HelloWorld {
  constructor() {

  }
}

module.exports = function() {

}

require('')
