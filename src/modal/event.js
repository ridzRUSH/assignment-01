import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },

  city_name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Event = mongoose.model("event", eventSchema);

export default Event;
