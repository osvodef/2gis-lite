(function() {
    angular.module('dgLite', [
        'filialListDirectives',
        'ngAnimate',
        'ngSanitize',
        'dgliteMap',
        'dgliteSidebar',        
        'apiRequest'
    ]);

    angular.module('apiRequest', []);

    angular.module('dgliteSidebar', ['apiRequest']);
    angular.module('dgliteMap', []);
    angular.module('filialListDirectives', ['ngSanitize']);
})();
