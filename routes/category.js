/**
 * Created by vijanny on 2016-08-15.
 */
var express = require('express');
var router = express.Router();
var devDb = require('../models/dev').devEntity;
var cateDb = require('../models/category').categoryEntity;
var masterAppDb = require('../models/masterApp').masterAppEntity;
var util = require('../util/util');


module.exports = router;