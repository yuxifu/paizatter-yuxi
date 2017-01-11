'use strict';

var express = require('express');
var controller = require('./thing.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
//router.put('/:id', controller.upsert);    //unused
//router.patch('/:id', controller.patch);   //unused
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
