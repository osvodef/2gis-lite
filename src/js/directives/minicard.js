(function() {
angular.module('filialListDirectives')
    .directive('minicard', function() {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'templates/minicard.html',
            replace: true,
        }
    })
})();