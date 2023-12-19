const { getPhoto } = require('../../controllers/photos/photos')

const router = require('express').Router()

router.route('/:photoId')
    .get(getPhoto)

module.exports = router