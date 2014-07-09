(function() {
angular.module('filialListDirectives')
    .directive('baronScroller', ['$timeout', function($timeout) {

        return {
            restrict: 'A',
            scope: false,

            link: function(scope, element, attrs) {
                var baron = element.baron({
                    barOnCls: 'baron',
                    bar: '.scroller__bar'
                });

                scope.$watch('searchResult', function() {
                    $timeout(function() {
                        baron.update();
                    });
                });
            }
        };
    }]);
})();