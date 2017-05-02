var app = angular.module("ethics-app");


// Document edit settings controller
app.controller("documentEditSettingsController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $documentService, $universityService, $instituteService, $courseService) {

    /*************************************************
        FUNCTIONS
     *************************************************/

    /**
     * [redirect description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    $scope.redirect = function(path){
        $location.url(path);
    };

    /**
     * [saveDocument description]
     * @return {[type]} [description]
     */
    $scope.save = function(){

        // Validate input
        if($scope.editDocumentForm.$invalid) {
            // Update UI
            $scope.editDocumentForm.document_title.$pristine = false;
            $scope.editDocumentForm.status.$pristine = false;
            $scope.editDocumentForm.course_id.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: "Saving document" };

            // Save document
            $documentService.edit($routeParams.document_id, $scope.updated_document)
            .then(function onSuccess(response) {
                $documentService.set(response.data);

                // Update navbar
                $scope.$parent.document = $documentService.get();
                $scope.$parent.loading = { status: false, message: "" };

                // Redirect
                $scope.redirect("/documents/" + $routeParams.document_id);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
            });
        }
    };


    /**
     * [description]
     * @param  {[type]} related_data [description]
     * @return {[type]}              [description]
     */
    $scope.load = function(related_data){
        // Check which kind of related data needs to be requested
        switch (related_data) {
            case 'universities': {
                $scope.$parent.loading = { status: true, message: "Loading universities" };

                // Load universities
                $universityService.list({ orderby: 'name.asc' })
                .then(function onSuccess(response) {
                    $scope.universities = response.data;
                    $scope.$parent.loading = { status: false, message: "" };
                })
                .catch(function onError(response) {
                    $window.alert(response.data);
                });
                break;
            }
            case 'institutes': {
                if($scope.university_id){
                    if($scope.university_id !== null){
                        $scope.$parent.loading = { status: true, message: "Loading institutes" };

                        // Load related institutes
                        $instituteService.listByUniversity($scope.university_id, { orderby: 'name.asc' })
                        .then(function onSuccess(response) {
                            $scope.institutes = response.data;
                            $scope.$parent.loading = { status: false, message: "" };
                        })
                        .catch(function onError(response) {
                            $window.alert(response.data);
                        });
                    } else {
                        // Reset institutes
                        $scope.institutes = [];
                        $scope.institute_id = null;
                        $scope.updated_document.course_id = null;
                    }
                } else {
                    // Reset institutes
                    $scope.institutes = [];
                    $scope.institute_id = null;
                    $scope.updated_document.course_id = null;
                }
                break;
            }
            case 'courses': {
                if($scope.institute_id){
                    if($scope.institute_id !== null){
                        $scope.$parent.loading = { status: true, message: "Loading courses" };

                        // Load related courses
                        $courseService.listByInstitute($scope.institute_id, { orderby: 'year.desc' })
                        .then(function onSuccess(response) {
                            $scope.courses = response.data;
                            $scope.$parent.loading = { status: false, message: "" };
                        })
                        .catch(function onError(response) {
                            $window.alert(response.data);
                        });
                    } else {
                        // Reset courses
                        $scope.courses = [];
                        $scope.updated_document.course_id = null;
                    }
                } else {
                    // Reset courses
                    $scope.working_groups = [];
                    $scope.updated_document.course_id = null;
                }
                break;
            }
        }

    };


    /*************************************************
        EVENTS
     *************************************************/
    $scope.$on("$destroy", function() {
        // Reset navbar
        delete $scope.document;
        delete $scope.$parent.document;
    });


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: "Loading document" };
    $scope.document = $documentService.get();
    $scope.updated_document = $documentService.copy($scope.document);
    $scope.authenticated_member = $authenticationService.get();

    // Update navbar
    $scope.$parent.document = $documentService.get();

    // Load universities
    $scope.load('universities');

    // Set default value by member
    $scope.university_id = $scope.authenticated_member.university_id;

    // Load related institutes
    $scope.load('institutes');

    // Set default value by member
    $scope.institute_id = $scope.authenticated_member.institute_id;

    // Load related working groups
    $scope.load('courses');

    // Load course
    $courseService.retrieveByDocument($routeParams.document_id)
    .then(function onSuccess(response) {
        var course = response.data;
        if(course === null){
            $scope.updated_document.course_id = null;
        } else {
            $scope.updated_document.course_id = course.course_id;
        }

        $scope.$parent.loading = { status: false, message: "" };
    })
    .catch(function onError(response) {
        $window.alert(response.data);
    });
});
