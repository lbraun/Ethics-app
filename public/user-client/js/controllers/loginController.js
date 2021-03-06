var app = angular.module("ethics-app");

// Login controller
app.controller("loginController", function($scope, $rootScope, $filter, $translate, $location, config, $authenticationService, $userService, $documentService, $fileService, $window) {

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
        if($scope.loginForm.$invalid) {
            // Update UI
            $scope.loginForm.document_id.$pristine = false;
        } else {
            $scope.$parent.loading = { status: true, message: $filter('translate')('LOGGING_IN') };
            $scope.redirect("/documents/" + $scope.login.document_id);
        }
    };


    /*************************************************
        INIT
     *************************************************/
    $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_APPLICATION') };

    // Reset all services
    $authenticationService.set();
    $documentService.set();
    $userService.set();
    $fileService.set();

    // Reset navbar
    $scope.$parent.authenticated_user = $authenticationService.get();
    $scope.$parent.document = $documentService.get();

    // Reset login
    $scope.login = $authenticationService.init();
    $scope.$parent.loading = { status: false, message: "" };

});
