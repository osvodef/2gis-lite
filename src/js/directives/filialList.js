(function() {
angular.module('filialListDirectives')
    .directive('filialList', function() {
        return {
            restrict: 'E',
            scope: false,
            replace: true,
            templateUrl: 'templates/filial-list.html'
        };
    });
})();