(function() {
angular.module('dgliteMap').directive('map', ['$timeout', '$window', function($timeout, $window) {
    var map, shrooms = [];



    var link = function(scope, element, attrs) {
        var createShroom = function(filial, index, isAnimated) {
            return DG.marker([filial.lat, filial.lon], {
                    riseOnHover: true,
                    bounceOnAdd: isAnimated,
                    bounceOnAddOptions: {duration: 500}
                })
                .addTo(map)
                .bindLabel(filial.name)
                .bindPopup(filial.name + '<br>' + filial.address)
                .on('mouseover', function(index) {
                    return function() {
                        $timeout(function() {
                            scope.setHoverIndex(index);
                        });
                    };
                }(index))
                .on('mouseout', function() {
                    $timeout(function() {
                        scope.setHoverIndex(null);
                    });
                });
        };


        DG.then(function () {
            return DG.plugin('js/leaflet-plugins/bouncemarker.js');
        }).then(function() {
            map = DG.map(element[0], {
                    "center": [55.004598, 82.878113],
                    "zoom": 11,
                    fullscreenControl: false,
                    zoomControl: false
                })
                .addControl(DG.control.zoom({position: 'topright'}))
                .addControl(DG.control.ruler({position: 'topright'}))
                .addControl(DG.control.scale())
                .on('moveend', function() {
                    $timeout(function() {
                        scope.updateShroomVisibility();
                    });
                })
                .on('zoomend', function() {
                    $timeout(function() {
                        scope.updateShroomVisibility();
                    });
                }).on('projectchange', function(e) {
                    $timeout(function() {
                        scope.setProject(e.getProject().code);
                    });
                });

            scope.$watchCollection('searchResult', function(newFilials, oldFilials, scope) {
                var i, newShrooms = new Array(newFilials.length);

                var isAnimated = (oldFilials.length === 0);

                for(i = 0; i < newFilials.length; i++) {
                    var newFilial = newFilials[i],
                        oldFilial = oldFilials[i];

                    if(!oldFilial || newFilial.id !== oldFilial.id) {

                        if(shrooms[i]) {
                            shrooms[i].remove();
                        }

                        if(newFilial.lon && newFilial.lat) {
                            newShrooms[i] = createShroom(newFilial, i, isAnimated);
                        } else {
                            newShrooms[i] = null;
                        }   

                    } else {                    
                        newShrooms[i] = shrooms[i];
                    }
                }

                for(; i < shrooms.length; i++) {
                    if(shrooms[i]) {
                        shrooms[i].remove();
                    }
                }

                shrooms = newShrooms;
                scope.updateShroomVisibility();
            });

            scope.updateShroomVisibility = function() {
                var i,
                    shroom,
                    inViewportCnt = 0,
                    outOfViewportCnt = 0,
                    southWest = map.getBounds().getSouthWest(),
                    northEast = map.getBounds().getNorthEast(),
                    degInPixel = (northEast.lng - southWest.lng) / map.getSize().x;

                southWest.lng = southWest.lng + degInPixel * angular.element('.sidebar').width();
                var bound = DG.latLngBounds(southWest, northEast);
                             
                for(i = 0; i < shrooms.length; i++) {
                    shroom = shrooms[i];

                    scope.isVisibleOnMap[i] = shroom && bound.contains(shroom.getLatLng());

                    if(scope.isVisibleOnMap[i]) {
                        inViewportCnt++;
                    } else {
                        outOfViewportCnt++;
                    }
                }
            
                scope.inViewportCnt = inViewportCnt;
                scope.outOfViewportCnt = outOfViewportCnt;
            };




            scope.$watch('hoverIndex', function(newIndex, oldIndex) {
                if(oldIndex !== null && shrooms[oldIndex] !== null) {
                    angular.element(shrooms[oldIndex]._icon).removeClass('hover-shroom');
                }

                if(newIndex !== null && shrooms[newIndex] !== null) {
                    angular.element(shrooms[newIndex]._icon).addClass('hover-shroom');
                }
            });


            scope.setProject = function(code) {
                var i, newProjectName = null;
                
                for(i = 0; i < scope.projectList.length; i++) {
                    if(scope.projectList[i].code === code) {
                        newProjectName = scope.projectList[i].name;
                        break;
                    }
                }

                scope.mapProjectName = (newProjectName !== null) ? newProjectName : scope.mapProjectName;
            }



            scope.selectItem = function(index) {
                if(angular.element('.sidebar').width() >= angular.element($window).width()) {
                    scope.isResultsPanelCollapsed = true;
                }
                map.setView(shrooms[index].getLatLng(), 17);
                shrooms[index].openPopup();
            }

        });
    };

    return {
        restrict: 'E',
        scope: false,
        replace: true,
        link: link,
        template: '<div class="map"></div>'
    };

}]);
})();
