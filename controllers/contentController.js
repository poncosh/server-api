const axiosSpaceX = require("../utils/axiosSpaceX");

const limit = 6;

async function spaceXHistory(req, res) {
  const { page } = req.query;

  const { data } = await axiosSpaceX.post("/history/query", {
    query: {},
    options: {
      page,
      limit,
    },
  });

  res.status(200).json(data);
}

async function spaceXDashboard(req, res, next) {
  let latest;
  let nextlaunch;
  let station;
  let totalStarlink;

  try {
    const { data } = await axiosSpaceX.get("/launches/latest");
    latest = data;
  } catch (error) {
    return next(error);
  }

  try {
    const { data } = await axiosSpaceX.get("/launches/next");
    nextlaunch = data;
  } catch (error) {
    return next(error);
  }

  try {
    const { data } = await axiosSpaceX.get("/landpads");

    station = data;
  } catch (error) {
    return next(error);
  }

  let stationData = [...new Set(station.map((el) => el.locality))];

  for (let i = 0; i < stationData.length; i++) {
    for (let j = 0; j < station.length; j++) {
      if (stationData[i] === station[j].locality) {
        stationData[i] = {
          locality: station[j].locality,
          images: station[j].images,
          region: station[j].region,
          full_name: station[j].full_name,
          details: station[j].details,
          name: station[j].name,
        };
        break;
      }
    }
  }

  try {
    const { data } = await axiosSpaceX.post("/starlink/query", {
      query: {},
      options: {},
    });

    totalStarlink = data.totalDocs;
  } catch (error) {
    next(error);
  }

  res.status(200).json({
    latest,
    next: nextlaunch,
    stations: stationData,
    satellites: totalStarlink,
  });
}

async function spaceXLaunches(req, res) {
  const { page } = req.query;

  const { data } = await axiosSpaceX.post("/launches/query", {
    query: {
      crew: {
        $exists: true,
        $not: { $size: 0 },
      },
      upcoming: false,
    },
    options: {
      page,
      limit,
      populate: [
        {
          path: "rocket",
        },
        {
          path: "crew",
        },
      ],
    },
  });

  res.status(200).json(data);
}

async function spaceXStarlinks(req, res) {
  let starlink;
  const { data } = await axiosSpaceX.get("/starlink");

  starlink = data
    .map((el, index) =>
      el.longitude
        ? {
            name: `starlink-${index + 1}`,
            longitude: el.longitude,
            latitude: el.latitude,
          }
        : false
    )
    .filter((el) => el !== false);

  res.status(200).json(starlink);
}

async function spaceXUpcoming(req, res) {
  const { page } = req.query;

  const { data } = await axiosSpaceX.post("/launches/query", {
    query: {
      upcoming: true,
    },
    options: {
      page,
      limit,
      populate: [
        {
          path: "rocket",
        },
        {
          path: "crew",
        },
      ],
    },
  });

  res.status(200).json(data);
}

module.exports = {
  spaceXHistory,
  spaceXDashboard,
  spaceXLaunches,
  spaceXStarlinks,
  spaceXUpcoming,
};
