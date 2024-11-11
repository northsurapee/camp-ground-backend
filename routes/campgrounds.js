/**
* @swagger
* components:
*   schemas:
*     Campground:
*       type: object
*       required:
*         - name
*         - address
*         - district
*         - province
*         - postalcode
*         - picture
*       properties:
*         name:
*           type: string
*           description: Name of the campground
*         address:
*           type: string
*           description: House No., Street, Road
*         district:
*           type: string
*           description: District
*         province:
*           type: string
*           description: province
*         postalcode:
*           type: string
*           description: 5-digit postal code 
*         tel:
*           type: string
*           description: telephone number
*         picture:
*           type: string
*           description: picture
*/

const express = require("express");
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");

/**
* @swagger
* tags:
*   name: Campgrounds
*   description: The campgrounds managing API
*/

// Include other resource routers
const bookingRouter = require("./bookings");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers

/**
* @swagger
* /campgrounds:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new campground
*     tags: [Campgrounds]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Campground'
*     responses:
*       201:
*         description: The campground was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Campground'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /campgrounds:
*   get:
*     summary: Returns the list of all the campgrounds
*     tags: [Campgrounds]
*     responses:
*       200:
*         description: The list of the campgrounds
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*               $ref: '#/components/schemas/Campground'
*/
router.use("/:campgroundId/bookings", bookingRouter);
router
  .route("/")
  .get(getCampgrounds)
  .post(protect, authorize("admin"), createCampground);

/**
* @swagger
* /campgrounds/{id}:
*   get:
*     summary: Get the campground by id
*     tags: [Campgrounds]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The campground id
*     responses:
*       200:
*         description: The campground description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Campground'
*       404:
*         description: The campground was not found
*/

/**
* @swagger
* /campgrounds/{id}:
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update the campground by id
*     tags: [Campgrounds]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The campground id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Campground'
*     responses:
*       200:
*         description: The campground was successfully updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Campground'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /campgrounds/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Delete the campground by id
*     tags: [Campgrounds]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The campground id
*     responses:
*       200:
*         description: The campground was successfully deleted
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Campground'
*       404:
*         description: The campground was not found
*/
router
  .route("/:id")
  .get(getCampground)
  .put(protect, authorize("admin"), updateCampground)
  .delete(protect, authorize("admin"), deleteCampground);

module.exports = router;
