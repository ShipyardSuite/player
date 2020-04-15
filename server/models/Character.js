'use strict';

const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
	name: { type: String, required: true },
	created: { type: Date }
});

module.exports = mongoose.model('Character', CharacterSchema);
