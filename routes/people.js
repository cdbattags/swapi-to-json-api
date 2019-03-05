const express = require('express')
const axios = require('axios')
const router = express.Router()
const smallsSwapiConsts = require('../smalls-swapi-constants')
const conversionService = require('../services/convert-to-json-api')

/* GET users listing. */
router.get('/:id', async (req, res, next) => {

  try {
    
    const response = (await axios.get(`${smallsSwapiConsts.swapiBase}/people/${req.params.id}`)).data

    res.status(200).json(conversionService.convertOne(response))

  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }

})

router.get('/', async (req, res, next) => {
  try {
    const response = (await axios.get(`${smallsSwapiConsts.swapiBase}/people`)).data
    res.status(200).json(conversionService.convertSome(response.results))
  } catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
})

module.exports = router
