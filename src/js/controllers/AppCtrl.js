(function() {
angular.module('dgLite').controller('AppCtrl', ['$scope', 'apiRequest', function($scope, apiRequest) {        
    $scope.formQuery = '';
    $scope.usedQuery = '';

    $scope.mapProjectName = 'Новосибирск';
    $scope.usedProjectName = 'Новосибирск';

    $scope.searchStatus = null;        

    $scope.searchResult = [];
    $scope.isVisibleOnMap = [];

    $scope.apiTotal = 0;

    $scope.loadedPagesCnt = 0;
    $scope.isPageLoadingEnabled = true;

    $scope.inViewportCnt = 0;
    $scope.outOfViewportCnt = 0;

    $scope.isResultsPanelClosed = true;
    $scope.isRusultsPanelCollapsed = false;

    $scope.isLoading = false;
    $scope.isLoadingNewPage = false;
    $scope.isChangingSort = false;

    $scope.sort = 'relevance';
    $scope.isViewportFilteringEnabled = false;

    $scope.hoverIndex = null;

    $scope.projectList = [];
    apiRequest('project/list')
        .ifSuccess(function(data) {
            $scope.projectList = data.result;
        })
        .call();
}]);
})();