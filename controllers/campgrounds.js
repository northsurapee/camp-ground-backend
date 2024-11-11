const Campground = require("../models/Campground");

//@desc     Get all campgrounds
//@route    GET /api/v1/campgrounds
//@access   Public
exports.getCampgrounds = async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery).replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // Finding resource
  let query = Campground.find(JSON.parse(queryStr));
  // Select
  if (req.query.select) {
    query = query.select(req.query.select.split(",").join(" "));
  }
  // Sort
  query = req.query.sort
    ? query.sort(req.query.sort.split(",").join(" "))
    : query.sort("-createdAt");
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Campground.countDocuments();
  query = query.skip(startIdx).limit(limit);
  try {
    // Executing query
    const campgrounds = await query;
    // Pagination result
    const pagination = {};
    if (endIdx < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIdx > 0) {
      pagination.prev = { page: page - 1, limit };
    }
    res.status(200).json({
      success: true,
      count: campgrounds.length,
      pagination,
      data: campgrounds,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get single campground
//@route    GET /api/v1/campgrounds/:id
//@access   Public
exports.getCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: campground });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc     Create single campground
//@route    POST /api/v1/campgrounds
//@access   Private
exports.createCampground = async (req, res, next) => {
  console.log(req.body);
  try {
    const campground = await Campground.create(req.body);
    res.status(201).json({ success: true, data: campground });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Update single campground
//@route    PUT /api/v1/campgrounds/:id
//@access   Private
exports.updateCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campground) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: campground });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete single campground
//@route    DELETE /api/v1/campgrounds/:id
//@access   Private
exports.deleteCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      res.status(400).json({ success: false });
    }
    campground.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
