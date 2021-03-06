var app = angular.module("ethics-app");


// University create controller
app.controller("universityCreateController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $authenticationService, $universityService) {

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
     * [send description]
     * @return {[type]} [description]
     */
    $scope.send = function(){
        // Validate input
        if($scope.createUniversityForm.$invalid) {
            // Update UI
            $scope.createCourseForm.university_name.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('CREATING_NEW_UNIVERSITY') };

            // Create new University
            $universityService.create($scope.new_university)
            .then(function onSuccess(response) {
                var university = response.data;

                // Redirect
                $scope.redirect("/universities/" + university.university_id);
            })
            .catch(function onError(response) {
                $window.alert(response);
            });
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.new_university = $universityService.init();

});
