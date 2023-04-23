const router = require("express").Router();
const verifyToken = require("../verifyToken");
const List = require("../models/List");

router.post("/create-list", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You don't have access to create list");
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedList = await List.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedList);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You don't have access to edit this movie!");
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("The list has been deleted successfully!!!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you don't have access to delete list!");
  }
});

router.get("/", verifyToken, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.params.type;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
