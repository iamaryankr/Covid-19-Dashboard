const router = require('express').Router();
const {
  getGlobalSummary,
  getAllCountries,
  getCountryData
} = require('../controllers/covidController');

router.get('/summary', getGlobalSummary);
router.get('/countries', getAllCountries);
router.get('/country/:name', getCountryData);

module.exports = router;