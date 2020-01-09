const Router = require("express");
const router = Router();
const cors = require("cors");
const _ = require("underscore");
const Feed = require("rss-to-json");

router.use(cors());

let urlFeed = "https://www.infobae.com/feeds/rss/sites";

router.get("/:category", (req, res) => {
  const { category } = req.params;

  Feed.load(`${urlFeed}/${category}`, function(err, rss) {
    /* console.log(rss); */

    res.json(rss);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  _.each(restaurantsList, (restaurant, i) => {
    if (restaurant.id == id) {
      res.json(restaurant);
    }
  });
});

router.get("/stars/:searchValue", (req, res) => {
  const searchValue = parseInt(req.params.searchValue);

  const restaurantsFilteredByStars = _.map(restaurantsList, restaurant => {
    if (restaurant.stars === searchValue) {
      return restaurant;
    }
  }).filter(restaurant => restaurant != null);

  res.json(restaurantsFilteredByStars);
});

router.get("/name/:searchName", (req, res) => {
  const searchName = req.params.searchName;

  const restaurantsFilteredByName = _.map(restaurantsList, restaurant => {
    if (restaurant.name.toLowerCase().includes(searchName.toLowerCase())) {
      return restaurant;
    }
  }).filter(restaurant => restaurant != null);

  res.json(restaurantsFilteredByName);
});

router.post("/", (req, res) => {
  const { name, stars, price, image } = req.body;

  if (name && stars && price && image) {
    const id = restaurantsList.length + 1;
    const newrestaurant = { ...req.body, id };
    console.log(newrestaurant);
    res.send("saved");
    restaurantsList.push(newrestaurant);
    res.json(restaurantsList);
  } else {
    res.send("wrong request");
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, stars, price, image } = req.body;

  if (name && stars && price && image) {
    _.each(restaurantsList, (restaurant, i) => {
      if (restaurant.id == id) {
        restaurant.name = name;
        restaurant.stars = stars;
        restaurant.price = price;
        price.image = image;
      }
    });
    res.json(restaurantsList);
  } else {
    res.status(500).send("wrong request");
  }
});

module.exports = router;
