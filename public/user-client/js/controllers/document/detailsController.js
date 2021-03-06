var app = angular.module("ethics-app");


// Document details controller
app.controller("documentDetailsController", function($scope, $rootScope, $routeParams, $filter, $translate, $location, config, $window, $q, $timeout, $authenticationService, $documentService, $revisionService, $descriptionService, $concernService, $commentService, $reviewerService, $fileService) {

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


    /*************************************************
        INIT
     *************************************************/

    $timeout(function(){
        $scope.$parent.loading = { status: true, message: $filter('translate')('CHECKING_AUTHENTICATION') };

        $timeout(function(){
            // Authentication
            $authenticationService.loginByDocumentId($routeParams.document_id)
            .then(function onSuccess(response) {
                $authenticationService.set(response.data);
                $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_DOCUMENT') };

                $timeout(function(){
                    // Load document
                    $documentService.retrieve($routeParams.document_id)
                    .then(function onSuccess(response) {
                        $documentService.set(response.data);
                        $scope.$parent.loading = { status: true, message: $filter('translate')('LOADING_REVISIONS') };

                        $timeout(function(){
                            // Load revisions
                            $revisionService.listByDocument($documentService.getId())
                            .then(function onSuccess(response) {
                                $documentService.setRevisions(response.data);

                                // Prepare main-promises
                                var checkout_revisions_deferred = $q.defer();
                                var revision_promises = [];

                                // Checkout description, concerns, comments and reviewers for each revision
                                angular.forEach($documentService.getRevisions(), function(revision, key){

                                    // Prepare sub-promises
                                    var checkout_descriptions_deferred = $q.defer();
                                    var checkout_concerns_deferred = $q.defer();
                                    var checkout_comments_deferred = $q.defer();
                                    var checkout_reviewers_deferred = $q.defer();

                                    // Checkout descriptions
                                    $descriptionService.getByRevision(revision.revision_id)
                                    .then(function onSuccess(response) {
                                        $documentService.setDescriptions(revision.revision_id, response.data);
                                        // Resolve sub-promise
                                        checkout_descriptions_deferred.resolve();
                                    })
                                    .catch(function onError(response) {
                                        $window.alert(response.data);
                                    });

                                    // Checkout concerns
                                    $concernService.getByRevision(revision.revision_id)
                                    .then(function onSuccess(response) {
                                        $documentService.setConcerns(revision.revision_id, response.data);
                                        // Resolve sub-promise
                                        checkout_concerns_deferred.resolve();
                                    })
                                    .catch(function onError(response) {
                                        $window.alert(response.data);
                                    });

                                    // Checkout comments
                                    $commentService.getByRevision(revision.revision_id)
                                    .then(function onSuccess(response) {
                                        $documentService.setComments(revision.revision_id, response.data);
                                        // Resolve sub-promise
                                        checkout_comments_deferred.resolve();
                                    })
                                    .catch(function onError(response) {
                                        $window.alert(response.data);
                                    });

                                    // Checkout reviewers
                                    $reviewerService.getByRevision(revision.revision_id)
                                    .then(function onSuccess(response) {
                                        $documentService.setReviewers(revision.revision_id, response.data);
                                        // Resolve sub-promise
                                        checkout_reviewers_deferred.resolve();
                                    })
                                    .catch(function onError(response) {
                                        $window.alert(response.data);
                                    });

                                    // Sub-promises
                                    checkout_descriptions_deferred.promise.then(function(){
                                        return;
                                    });
                                    checkout_concerns_deferred.promise.then(function() {
                                        return;
                                    });
                                    checkout_comments_deferred.promise.then(function() {
                                        return;
                                    });
                                    checkout_reviewers_deferred.promise.then(function() {
                                        return;
                                    });

                                    // Start parallel sub-requests
                                    $q.all([
                                        checkout_descriptions_deferred.promise,
                                        checkout_concerns_deferred.promise,
                                        checkout_comments_deferred.promise,
                                        checkout_reviewers_deferred.promise
                                    ]).then(function(){
                                        // Resolve main-promises
                                        revision_promises.push(checkout_revisions_deferred.resolve());
                                    });

                                });

                                // Start parallel requests for each revision
                                $q.all(revision_promises).then(function(){

                                    // Update navbar
                                    $scope.$parent.authenticated_user = $authenticationService.get();
                                    $scope.$parent.document = $documentService.get();
                                    $scope.$parent.loading = { status: true, message: $filter('translate')('GENERATING_FILES') };

                                    // Check status of document to generate files
                                    if($documentService.getStatus()===2 || $documentService.getStatus()===6){

                                        // Check if files were already created and cached
                                        if($fileService.get()){
                                            $documentService.setFiles($fileService.get());
                                            $scope.$parent.loading = { status: false, message: "" };

                                            // Redirect
                                            $scope.redirect("/documents/" + $documentService.getId() + "/status/" + $documentService.getStatus());
                                        } else {
                                            // Generate files on server
                                            $documentService.generateFiles($documentService.getId())
                                            .then(function onSuccess(response) {
                                                $fileService.set(response.data);
                                                $documentService.setFiles($fileService.get());
                                                $scope.$parent.loading = { status: false, message: "" };

                                                // Redirect
                                                $scope.redirect("/documents/" + $documentService.getId() + "/status/" + $documentService.getStatus());
                                            })
                                            .catch(function onError(response) {
                                                $window.alert(response.data);
                                            });
                                        }
                                    } else {
                                        $scope.$parent.loading = { status: false, message: "" };

                                        // Redirect
                                        $scope.redirect("/documents/" + $documentService.getId() + "/status/" + $documentService.getStatus());
                                    }
                                });
                            })
                            .catch(function onError(response) {
                                $window.alert(response.data);
                                $scope.redirect("/");
                            });
                        }, 400);
                    })
                    .catch(function onError(response) {
                        $window.alert(response.data);
                        $scope.redirect("/");
                    });
                }, 400);
            })
            .catch(function onError(response) {
                $window.alert(response.data);
                $scope.redirect("/");
            });
        }, 400);
    }, 1000);

});
