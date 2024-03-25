import express from "express";
import Event from "../modal/event.js";

const route = express.Router();

// function to calculate the distace between the latitude and longitude

async function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

route.get("/find", async (req, res) => {
  try {
    let lat = req.query.lat,
      lon = req.query.lon,
      pageNumber = req.query.page;

    let totalEvent = 0;
    const givenDate = new Date(req.query.date);

    const endDate = new Date(givenDate);
    endDate.setDate(givenDate.getDate() + 14);

    try {
      totalEvent = await Event.countDocuments({
        date: { $gte: givenDate, $lte: endDate },
      });

      if (totalEvent < pageNumber) {
        pageNumber = 1;
      }
      if (pageNumber < 0) {
        pageNumber = 1;
      }
    } catch (e) {
      throw new Error("Something went wrong");
    }

    const eventData = await Event.find({
      date: { $gte: givenDate, $lte: endDate },
    })
      .sort({ date: 1 })
      .skip((pageNumber - 1) * 10)
      .limit(10);

    const processedData = await Promise.all(
      eventData.map(async (obj) => {
        // const wether =
        //   await fetch(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code=Kf
        // QnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${obj.city_name}&date=${req.query.date}`);

        const wether = await fetch(
          `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=4d76b2cb9d0047fa8a53ae08fa758311&include=minutely1`
        );

        const wetherData = await wether.json();

        // const distance =
        //   await fetch(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=I
        // AKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=40
        // .7128&longitude1=-74.0060&latitude2=25.5169968004073&longitude2=-173
        // .22570039222800`);
        // const distanceData = await distance.json();

        const distace = await calculateDistance(
          lat,
          lon,
          obj.latitude,
          obj.longitude
        );

        const newObj = {
          event_name: obj.event_name,
          city_name: obj.city_name,
          date: obj.date.toISOString().split("T")[0],
          weather: wetherData.data[0].weather.description,
          distace_km: distace,
        };
        return newObj;
      })
    );

    res.send({
      processedData,
      page: pageNumber,
      pageSize: 10,
      totalEvents: totalEvent,
      totalPages: Math.ceil(totalEvent / 10),
    });
  } catch (e) {
    res.status(500).send({ error: "message" + e });
  }
});

route.post("/create-new-event", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.send({ message: " New Event Addedd" });
  } catch (e) {
    res.status(500).send({ error: " Something went wrong" });
  }
});

export default route;
