(function() {
angular.module('apiRequest').factory('apiRequest', ['$http', '$timeout', function($http, $timeout) {
    var apiUrl = 'http://catalog.api.2gis.ru/',
        apiParams = {
            'version': '1.3',
            'key': 'rubmnl3474'
        };

    return function(method, params) {
        params = params ? params : {};

        var firstlyFn = null,                
            nothingFoundFn = null,
            incorrectParamsFn = null,
            errorFn = null,
            successFn = null,
            lastlyFn = null,
            defaultFn = function() {};

        var sendRequest = function() {
            for(var key in apiParams) {
                params[key] = apiParams[key];
            }

            $http.get(apiUrl + method, {params: params})
                .success(function(data) {
                    if(firstlyFn) firstlyFn();

                    if(data.response_code === '404') {
                        nothingFoundFn ? nothingFoundFn(data.error_code) : defaultFn();
                    } else if(data.response_code === '400') {
                        incorrectParamsFn ? incorrectParamsFn(data.error_code) : defaultFn();
                    } else if(data.response_code === '200') {
                        successFn ? successFn(data) : defaultFn();
                    } else {
                        errorFn ? errorFn() : defaultFn();
                    }

                    if(lastlyFn) lastlyFn();
                }).error(function() {
                    if(firstlyFn) firstlyFn();

                    if(errorFn) errorFn();

                    if(lastlyFn) lastlyFn();
                });
        }

        sendRequest.atFirst = function(callback) {
            firstlyFn = callback;
            return sendRequest;
        }

        sendRequest.ifNothingFound = function(callback) {
            nothingFoundFn = callback;
            return sendRequest;
        }

        sendRequest.ifIncorrectParams = function(callback) {
            incorrectParamsFn = callback;
            return sendRequest;
        }

        sendRequest.ifError = function(callback) {
            errorFn = callback;
            return sendRequest;
        }

        sendRequest.ifSuccess = function(callback) {
            successFn = callback;
            return sendRequest;
        }

        sendRequest.atLast = function(callback) {
            lastlyFn = callback;
            return sendRequest;
        }

        sendRequest.otherwise = function(callback) {
            defaultFn = callback;
            return sendRequest;
        }

        return sendRequest;
    }
}]);
})();
