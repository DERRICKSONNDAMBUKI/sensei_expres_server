const { users, userById, updateUser, deleteUser, profilePhotoUpload, profilePhoto } = require('../../controllers/user/user.controller')
const { requireSignin, hasAuthorization } = require('../../middlewares/auth.middleware')
const { photoUpload } = require('../../services/photoUpload')
const router = require('express').Router()

router.get('/', users)

router.route('/:userId') // add hasAuthorization
    .get(requireSignin,
        //  hasAuthorization,
        userById)
    .put(requireSignin,
        photoUpload.single("photoUrl"),
        // hasAuthorization, 
        updateUser
    )
    .delete(requireSignin,
        //  hasAuthorization,
        // hasAuthorization('admin'), // ricky has bugs - on hasAuhorization
        deleteUser)

router.route('/profilephoto/:userId')
    // .post(
    //     // requireSignin, 
    //     // hasAuthorization,
    //       profilePhotoUpload)
    .get(profilePhoto)
// todo strengthen authorization

module.exports = router