(function() {
angular.module('dgliteSidebar').directive('sidebar', ['apiRequest', '$timeout', function(apiRequest, $timeout) {
    var controller = function($scope) {
        var pageSize = 25;

        var isWaitingForResponse = function() {
            return $scope.isLoading || $scope.isLoadingNewPage || $scope.isChangingSort;
        }

        var resetSearchResult = function() {
            $scope.searchResult = [];
            $scope.apiTotal = 0;

            $scope.loadedPagesCnt = 0;
            $scope.isPageLoadingEnabled = true;
        }

        var updateSearchResult = function(apiData, mode) {
            if(mode === 'replace') {
                $scope.apiTotal = apiData.total;
                $scope.searchResult = apiData.result;
                $scope.loadedPagesCnt = 1;
            }

            if(mode === 'append') {
                $scope.apiTotal = apiData.total;
                $scope.searchResult = $scope.searchResult.concat(apiData.result);
                $scope.loadedPagesCnt += 1;
            }

            if($scope.searchResult.length >= $scope.apiTotal) {
                $scope.isPageLoadingEnabled = false;
            } else {
                $scope.isPageLoadingEnabled = true;
            }
        }

        $scope.search = function() {
            if(isWaitingForResponse()) {
                return;
            }

            $scope.usedQuery = $scope.formQuery;
            $scope.usedProjectName = $scope.mapProjectName;
            
            $scope.isLoading = true;
            apiRequest('search', {
                    what: $scope.usedQuery,
                    where: $scope.usedProjectName,
                    page: '1',
                    pagesize: pageSize,
                    sort: $scope.sort
                })
                .atFirst(function() {
                    $scope.isLoading = false;    

                    $scope.isResultsPanelClosed = false;
                    $scope.isResultsPanelCollapsed = false;

                    angular.element('.scroller').scrollTop(0);            
                })
                .ifSuccess(function(data) {
                    $scope.searchStatus = 'ok';
                    updateSearchResult(data, 'replace');
                })
                .ifNothingFound(function() {
                    $scope.searchStatus = 'nothingFound';
                    resetSearchResult();
                })
                .ifIncorrectParams(function() {
                    $scope.searchStatus = 'nothingFound';
                    resetSearchResult();
                })
                .ifError(function() {
                    $scope.searchStatus = 'error';
                    resetSearchResult();
                })
                .call();
        }


        $scope.setSort = function(sort) {
            if($scope.sort === sort || isWaitingForResponse()) {
                return;
            }
            $scope.sort = sort;

            $scope.isChangingSort = true;
            apiRequest('search', {
                    what: $scope.usedQuery,
                    where: $scope.usedProjectName,
                    page: '1',
                    pagesize: pageSize,
                    sort: $scope.sort
                })
                .atFirst(function() {
                    $scope.isChangingSort = false;
                })
                .ifSuccess(function(data) {
                    $scope.searchStatus = 'ok';
                    updateSearchResult(data, 'replace');
                })
                .ifNothingFound(function() {
                    $scope.searchStatus = 'nothingFound';
                    resetSearchResult();
                })
                .ifIncorrectParams(function() {
                    $scope.searchStatus = 'nothingFound';
                    resetSearchResult();
                })
                .ifError(function() {
                    $scope.searchStatus = 'error';
                    resetSearchResult();
                })
                .call();
        }


        $scope.addPage = function() {
            if(!$scope.isPageLoadingEnabled || isWaitingForResponse()) {
                return;
            }

            var nextPage = $scope.loadedPagesCnt + 1;

            $scope.isLoadingNewPage = true;
            apiRequest('search', {
                    what: $scope.usedQuery,
                    where: $scope.usedProjectName,
                    page: nextPage,
                    pagesize: pageSize,
                    sort: $scope.sort
                })
                .atFirst(function() {
                    $scope.isLoadingNewPage = false;
                })
                .ifSuccess(function(data) {
                    $scope.searchStatus = 'ok';
                    updateSearchResult(data, 'append');
                })
                .otherwise(function() {
                    $scope.isPageLoadingEnabled = false;
                })
                .call();
        }



        $scope.toggleViewportFiltering = function() {
            $scope.isViewportFilteringEnabled = !$scope.isViewportFilteringEnabled;
        }

        $scope.showResultsPanel = function() {
            $scope.isResultsPanelCollapsed = false;
        }

        $scope.hideResultsPanel = function() {
            $scope.isResultsPanelCollapsed = true;
        }

        $scope.closeResultsPanel = function() {
            $scope.isResultsPanelClosed = true;
            $scope.isResultsPanelCollapsed = false;

            $scope.sort = 'relevance';
            $scope.isViewportFilteringEnabled = false;

            $scope.formQuery = '';
            $scope.usedQuery = '';

            resetSearchResult();
        }

        $scope.setHoverIndex = function(index) {
            $scope.hoverIndex = index;
        }

    };


    return {
        restrict: 'E',
        scope: false,
        templateUrl: 'templates/sidebar.html',
        replace: true,
        controller: ['$scope', controller]
    }

}]);
})();
