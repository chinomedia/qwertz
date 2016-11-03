'use strict';

var express = require('express');
var controller = require('./profile.controller');

var router = express.Router();

router.get('/postal/:postal', controller.index);
router.get('/:id', controller.show);
router.get('/tags/:tags', controller.byTags);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/image', controller.postImage);

module.exports = router;
