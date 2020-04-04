'use strict';

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const PlayerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	lastUpdate: { type: Date },
	points: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', PlayerSchema);
