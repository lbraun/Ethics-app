var app = angular.module("instituteService", []);


// Institute service
app.factory('$instituteService', function($http, $log, config, $authenticationService, _) {

    var institutes;
    var cached_filter = {
        offset: 0,
        limit: null,
        former: null,
        orderby: 'name.asc'
    };
    var full_count = 0;

    return {
        get: function(){
            return institutes;
        },
        getCachedFilter: function(){
            return cached_filter;
        },
        getByUniversity: function(university_id){ // DEPRECATED
            return _.where(institutes, {university_id: university_id});
        },
        set: function(data){
            institutes = data;
        },
        setCachedFilter: function(data){
            cached_filter = data;
        },
        list: function(filter) {
            var query = "?orderby=" + filter.orderby + "&";

            if(filter.offset && filter.offset !== null){
                query = query + "offset=" + filter.offset + "&";
            }
            if(filter.limit && filter.limit !== null){
                query = query + "limit=" + filter.limit + "&";
            }
            if(filter.former !== null){
                query = query + "former=" + filter.former + "&";
            }

            // Check if token exists
            if($authenticationService.getToken()){
                return $http.get(config.getApiEndpoint() + "/institutes" + query, {
                    headers: {
                        'Authorization': 'Bearer ' + $authenticationService.getToken()
                    }
                });
            } else {
                return $http.get(config.getApiEndpoint() + "/institutes" + query);
            }
        },
        listByUniversity: function(university_id, filter){ // DEPRECATED
            var query = "?orderby=" + filter.orderby + "&";

            if(filter.offset && filter.offset !== null){
                query = query + "offset=" + filter.offset + "&";
            }
            if(filter.limit && filter.limit !== null){
                query = query + "limit=" + filter.limit + "&";
            }
            if(filter.former !== null){
                query = query + "former=" + filter.former + "&";
            }

            query = query.slice(0, -1);

            // Check if token exists
            if($authenticationService.getToken()){
                return $http.get(config.getApiEndpoint() + "/universities/" + university_id + "/institutes" + query, {
                    headers: {
                        'Authorization': 'Bearer ' + $authenticationService.getToken()
                    }
                });
            } else {
                return $http.get(config.getApiEndpoint() + "/universities/" + university_id + "/institutes" + query);
            }
        },
        retrieve: function(institute_id) {
            return $http.get(config.getApiEndpoint() + "/institutes/" + institute_id);
        }
    };

});
