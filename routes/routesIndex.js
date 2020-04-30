const express = require('express');
const userController = require('../controller/userController');
const groupController = require('../controller/groupController');
const expenseController=require('../controller/expenseController');
const activityHelper=require('../controller/activityHelper');
const router = express.Router();
const decodeToken = require('../security/middleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/all', decodeToken, userController.allUser);
router.get('/user/:id', decodeToken, userController.userById);
router.get('/profile', decodeToken, userController.getUserProfile);
router.post('/invite', decodeToken, userController.inviteFriends);
router.post('/group', decodeToken, groupController.createGroups);
router.get('/myFriends',decodeToken,userController.getMyFriends);
router.get('/myGroups',decodeToken,userController.getMyGroups);
router.post('/myGroupMembers',decodeToken,groupController.getGroupMembers);
router.post('/addExpense',decodeToken,expenseController.addExpense);
router.get('/allActivities/:category',decodeToken,activityHelper.allActivities);

module.exports = router;