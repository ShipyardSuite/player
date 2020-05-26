"use strict";

import mongoose from "mongoose";

const PlayerSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastUpdate: { type: Date },
    points: { type: Number, default: 0 }
}, { collection: "players" });

let PlayerModel = mongoose.model("Player", PlayerSchema);

export default PlayerModel;