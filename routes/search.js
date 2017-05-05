var express = require('express');
var router = express.Router();
var isAuthenticated = require('../server.js').isAuthenticated;

var search_documents = require('../controllers/documents/search');
//var search_documents_by_user = require('../controllers/documents/search_by_user');
//var search_documents_by_course = require('../controllers/documents/search_by_course');
var search_universities = require('../controllers/universities/search');
var search_institutes = require('../controllers/institutes/search');
var search_institutes_by_university = require('../controllers/institutes/search_by_university');
var search_working_groups = require('../controllers/working_groups/search');
var search_working_groups_by_institute = require('../controllers/working_groups/search_by_institute');
var search_courses = require('../controllers/courses/search');
var search_courses_by_institute = require('../controllers/courses/search_by_institute');


// SEARCH ALL DOCUMENTS (ONLY MEMBERS)
router.post('/search/documents', isAuthenticated, search_documents.request);

// SEARCH ALL DOCUMENTS BY USER (ONLY MEMBERS)
//router.post('/search/users/:user_id/documents', isAuthenticated, search_documents_by_user.request);

// SEARCH ALL DOCUMENTS BY COURSE (ONLY MEMBERS)
//router.post('/search/courses/:course_id/documents', isAuthenticated, search_documents_by_course.request);


// SEARCH ALL MEMBERS


// SEARCH ALL USERS


// SEARCH ALL UNIVERSITIES
router.post('/search/universities', search_universities.request);


// SEARCH ALL INSTITUTES
router.post('/search/institutes', search_institutes.request);

// SEARCH ALL INSTITUTES BY UNIVERSITY
router.post('/search/universities/:university_id/institutes', search_institutes_by_university.request);


// SEARCH ALL WORKING GROUPS
router.post('/search/working_groups', search_working_groups.request);

// SEARCH ALL WORKING GROUPS BY INSTITUTE
router.post('/search/institutes/:institute_id/working_groups', search_working_groups_by_institute.request);


// SEARCH ALL COURSES
router.post('/search/courses', search_courses.request);

// SEARCH ALL COURSES BY INSTITUTE
router.post('/search/institutes/:institute_id/courses', search_courses_by_institute.request);


module.exports = router;
