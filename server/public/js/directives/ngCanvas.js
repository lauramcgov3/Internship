// Exemple du code dans la vue : <ng-canvas id="'l'" image="{images[0]}">

// Dans la directive il n'aura aucun contact direct avec la librairie Konva, nous allons nous servir de différents
// services pour intéragir avec elle.
app.directive('ngCanvas', ['Drawer', 'Tool', 'Annotation', 'ZoomAndPan', 'CanvasImage', '$timeout', '$modal', function(Drawer, Tool, Annotation, ZoomAndPan, CanvasImage, $timeout, $modal) {
    return {
        restrict: 'E',
        // On met dans notre variable scope les paramètres passés dans la vue.
        scope: {
            id: '=',
            image: '=',
            nbScreens: '=',
            position: '=',
            view: '='
        },
        //
        templateUrl: '/views/directives/viewer/canvas.html',
        controller: function($scope) {
            $scope.width = window.innerWidth;
            $scope.height = window.innerHeight;
            if ($scope.nbScreens % 2 === 0) {
                $scope.width = innerWidth / 2;
                $scope.height = ($scope.nbScreens == 4) ? window.innerHeight / 2 : window.innerHeight;
            }
            $scope.annotations = [];
            $scope.points = [];
            $scope.currentGroup = {};
            $scope.basicZoomLevel = {};
            $scope.utils = {
                saveTimout: null
            }

            $scope.createAnnotation = function(type) {
                var annotation = {
                    message: "",
                    image_id: $scope.image.id,
                    type: type,
                    points: $scope.points,
                    isVisible: true,
                    attrs : {width: 50, height: 50}
                };

                $scope.points = [];
                Annotation.save(annotation).success($scope.addAnnotation);
            },

            $scope.loadCanvas = function() {
                $scope.stage = Drawer.createStage($scope.id, $scope.width, $scope.height);
                $scope.imgLayer = new Konva.Layer(); 
                $scope.stage.add($scope.imgLayer);
                $scope.annotationsLayer = new Konva.Layer();
                $scope.stage.add($scope.annotationsLayer);
                $scope.element.css('float', ($scope.position == 1 || $scope.position == 3) ? 'left' : 'right');
                $scope.element.css('float', ($scope.position == 2 || $scope.position == 4) ? 'left' : 'right');

                $scope.menuLayer = new Konva.Layer();
                $scope.stage.add($scope.menuLayer);

                var menu = new Konva.Rect({
                    name: "annotation",
                    width: 100,
                    height: $scope.stage.height() * $scope.nbScreens,
                    fill: "white",
                    transformsEnabled : 'position',
                    draggable: false
                });


                ZoomAndPan.addImageToLayer($scope.imgLayer, $scope.image.base64, $scope.width, $scope.height, $scope.id, function(scale) {
                    $scope.basicZoomLevel = scale;

                    ZoomAndPan.reinitializeZoomAndPan($scope.stage, $scope.basicZoomLevel);

                    Annotation.getAllByImage($scope.image.id).success(function(annotations) {
                        $scope.loadAnnotations(annotations);
                        $scope.useTool();
                    }); 
                });

            },

            $scope.loadAnnotations = function(annotations) {
                var img = $scope.imgLayer.findOne('Image');
                var imgRelativePosition = img.position();
                var scale = $scope.imgLayer.scale().x;

                for (var i = 0 ; i < annotations.length ; i++) {
                    var group = Drawer.drawAnnotation(annotations[i], $scope.annotationsLayer, $scope.stage, $scope.findAnchorAnnotation);
                    $scope.assignEventsToGroup(group);
                }
               $scope.annotations = annotations;
            },

            $scope.addAnnotation = function(annotation) {
                var img = $scope.imgLayer.findOne('Image');
                var imgRelativePosition = img.position();
                var scale = $scope.imgLayer.scale().x;
                var group = Drawer.drawAnnotation(annotation, $scope.annotationsLayer, $scope.stage, $scope.findAnchorAnnotation);
                $scope.assignEventsToGroup(group);
                $scope.annotations.push(annotation);
            },

            $scope.updateAnnotation = function(figure) {
                var group = figure.parent;

                var point = {x: group.attrs.x + (figure.attrs.x||0), y: group.attrs.y + (figure.attrs.y || 0)};
                var id = $scope.findAnnotationIndexById(group.attrs.id)

                var annotation = $scope.annotations[id];

                annotation.points[0] = point.x;
                annotation.points[1] = point.y;

                annotation.attrs.width = figure.attrs.width;
                annotation.attrs.height = figure.attrs.height;
                Annotation.save(annotation).success(function(result) {
                });
            },

            $scope.removeAnnotation = function(annotation) {
                if (!_.isEmpty($scope.currentGroup) && $scope.currentGroup.attrs.id == annotation._id) {
                    $scope.currentGroup = {};
                }
                // $scope.points = [];
                // if (!_.isEmpty($scope.currentGroup)) {
                //     var id = $scope.currentGroup.attrs.id;
                    Annotation.delete(annotation._id).success(function(result) {
                        var indexToRemove = $scope.findAnnotationIndexById(annotation._id);
                        $scope.annotations.splice(indexToRemove, 1);
                        $scope.annotationsLayer.findOne('#' + annotation._id).destroy();
                        $scope.annotationsLayer.draw();  
                    });
                
            }
            $scope.findAnnotationIndexById = function(id) {
                for (var i = 0; i < $scope.annotations.length; i++) {
                    if ($scope.annotations[i]._id === id) {
                        return i;
                    } 
                }
                return -1;
            };

            $scope.assignEventsToGroup = function(group) {
                group.on('mousedown', function(e) {
                    var action = Tool.getTool().action;
                    if (action == "selection" || action == "erase") {
                        var group = e.target.getParent();
                        var previousCurrent = $scope.currentGroup;
                        if (!_.isEmpty($scope.currentGroup)) {
                            Drawer.unselectCurrent(previousCurrent, $scope.annotationsLayer, $scope.stage);
                        }
                        $scope.currentGroup = group;
                    }
                });

                group.on('mouseup', function(e) {
                    if (Tool.getTool().action == "selection") {
                        $scope.updateAnnotation(e.target);
                    }
                });
            }

            $scope.findAnchorAnnotation = function(figure) {
                var group = figure.parent;
                var figure = group.findOne('.annotation');
                $scope.updateAnnotation(figure);
            }

            $scope.useTool = function(layer) {
                $scope.stage.on('mousedown', function(e) {
                    $scope.points = [];

                    var pointer = $scope.stage.getPointerPosition();
                    pointer = ZoomAndPan.getRelativePosition(pointer, $scope.imgLayer);
                    $scope.points.push(pointer.x);
                    $scope.points.push(pointer.y);
                    // Drawer.unselectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage); 
                    // $scope.currentGroup = {};
                    // $scope.$apply();
                    var tool = Tool.getTool();
                    switch (tool.category) {
                        case 'hand':
                            Drawer.setAllDraggable($scope.stage.find('Group'), false);
                            ZoomAndPan.zoomAndPan($scope.stage, $scope.basicZoomLevel);
                            break;

                        case 'annotation':
                            $scope.annotationAction(tool);
                            break;
                    }
                });
            }

            $scope.init = function() {
                // Add the reset function of this directive to the service, to be executed when the reinitializeButton is called
                ZoomAndPan.addResetFunctionForDirective($scope.resetZoom);
                ZoomAndPan.addResizeFunctionForDirective($scope.resize);
                ZoomAndPan.addChangeScreenFunctionForDirective($scope.id, $scope.changeScreen);
            }

            $scope.resize = function() {
                var oldHeight = $scope.stage.getHeight();
                if ($scope.nbScreens == 1) {
                    $scope.stage.setAttr('width', window.innerWidth);
                    $scope.stage.setAttr('height', window.innerHeight);
                } else if ($scope.nbScreens == 2) {
                    $scope.stage.setAttr('width', window.innerWidth / 2);
                    $scope.stage.setAttr('height', window.innerHeight);
                    $scope.element.css('float', ($scope.position == 1) ? 'left' : 'right'); 
                } else if ($scope.nbScreens == 4 && $scope.view != 'ws') {
                    $scope.stage.setAttr('width', window.innerWidth / 2);
                    $scope.stage.setAttr('height', window.innerHeight / 2);     
                    $scope.element.css('float', ($scope.position == 1 || $scope.position == 3) ? 'left' : 'right');
                    $scope.element.css('float', ($scope.position == 2 || $scope.position == 4) ? 'left' : 'right');
                } else {
                     if ($scope.position == 1) {
                        $scope.stage.width(2 * (window.innerWidth / 3));
                        $scope.stage.height(window.innerHeight);
                        $scope.element.css('width', '66,6%');
                        $scope.element.css('height', '100%');
                        $scope.element.css('float', 'left');
                        $scope.element.css('background-color', '#000');
                     } else {
                        $scope.stage.width(window.innerWidth / 3);
                        $scope.stage.height(window.innerHeight / 3);
                        $scope.element.css('width', '33,3%');
                        $scope.element.css('height', '33%');
                        $scope.element.css('display', 'block');
                        $scope.element.css('float', 'right');
                        $scope.element.css('background-color', '#000');
                     }
                }
                ZoomAndPan.resizeCanvas($scope.stage, oldHeight, function(newBasicZoom) {
                    $scope.basicZoomLevel = newBasicZoom;
                });     
            }

            $scope.resetZoom = function() {
                ZoomAndPan.reinitializeZoomAndPan($scope.stage, $scope.basicZoomLevel);  
            }

            $scope.changeScreen = function(view, nbScreens, position) {
                $scope.view = view;
                $scope.nbScreens = nbScreens;
                $scope.position = position;
                $scope.resetZoom();
                $scope.resize();
            }

            /**
            * All the actions related to annotations are regrouped here. This allows us to make some actions in case it's an annotation related modification that has occured.
            */
            $scope.annotationAction = function(tool)
            {
                CanvasImage.stageModified($scope.stage);
                ZoomAndPan.disableZoomAndPan($scope.stage);

                switch(tool.action) {
                    case 'selection':
                        Drawer.setAllDraggable($scope.stage.find('.Group'), true);
                        Drawer.selectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage);
                        $scope.points = [];
                        break;

                    case 'rectangle':
                    case 'circle':
                        Drawer.setAllDraggable($scope.stage.find('.Group'), false);
                        $scope.createAnnotation(tool.action);
                        break;

                    case 'line' :
                        Drawer.setAllDraggable($scope.stage.find('.Group'), false);
                        // start drawing
                        // ajoute un 
                        break;

                    case 'freeDraw' :
                        Drawer.setAllDraggable($scope.stage.find('.Group'), false);

                        // Start drawing
                        // donne les evenements necessaires
                        break;

                    case 'erase':
                        Drawer.setAllDraggable($scope.stage.find('.Group'), false);

                        $scope.removeAnnotation();
                        break;
                }
            },

            $scope.selectElement = function(id) {
                if (_.isEmpty($scope.currentGroup)) {
                    Drawer.unselectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage);
                    $scope.currentGroup = $scope.annotationsLayer.findOne('#' + id);
                    Drawer.selectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage);
                }
                else if ($scope.currentGroup.attrs.id == id) {
                    Drawer.unselectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage);
                    $scope.currentGroup = {};
                  
                }
                else {
                    Drawer.unselectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage); 
                    $scope.currentGroup = $scope.annotationsLayer.findOne('#' + id);
                    Drawer.selectCurrent($scope.currentGroup, $scope.annotationsLayer, $scope.stage);
                }
            }

            $scope.showAnnotation = function(annotation) {
                var group = $scope.annotationsLayer.findOne('#' + annotation._id);
                group.visible(annotation.isVisible);

                Annotation.save(annotation).success(function(test) {
                    $scope.annotationsLayer.draw();
                }); 
            },

            $scope.addText = function(annotation) {
                var group = $scope.annotationsLayer.findOne('#' + annotation._id);
           

                var modalInstance = $modal.open({
                   templateUrl: '/views/modal/messageAnnotation.html',
                   controller: 'MessageAnnotationController',
                   resolve: {
                       message: function() {
                           return annotation.message;
                       }
                   }
                });

                modalInstance.result.then(function (message) {
                    var label = group.findOne('Label');
                    annotation.message = message;
                  
                    if (typeof label !== 'undefined') {
                        label.destroy();
                    }


                    if (message.length > 0) {
                        var figure = group.findOne('.annotation');
                      
                        var label = Drawer.createLabel(figure, annotation.message);
                        group.add(label);

                        label.on('mousedown', function(e) {
                            var action = Tool.getTool().action;
                            if (action == "selection" || action == "erase") {
                                var group = e.target.getParent().getParent();
                                var previousCurrent = $scope.currentGroup;
                                if (!_.isEmpty($scope.currentGroup)) {
                                    Drawer.unselectCurrent(previousCurrent, $scope.annotationsLayer, $scope.stage);
                                }
                                $scope.currentGroup = group;
                            }
                        });

                    }

                   Annotation.save(annotation).success(function(annotation) {
                       $scope.annotationsLayer.draw();
                   });
               });
           }
        },

        link: function($scope, element, attrs) {  
            setTimeout(function() {
                $scope.element = element;
                $scope.init();
                $scope.loadCanvas();
            });
        }
    }
}]);