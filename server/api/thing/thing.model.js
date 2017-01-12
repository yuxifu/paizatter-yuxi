'use strict';

import mongoose from 'mongoose';

var ThingSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  stars: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
});

ThingSchema.index({name: 'text'});

ThingSchema.pre('find', function(next) {
  this.populate('user', 'name');
  next();
});

ThingSchema.pre('findOne', function(next) {
  this.populate('user', 'name');
  next();
});

export default mongoose.model('Thing', ThingSchema);
