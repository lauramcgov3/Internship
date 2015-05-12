angular.module('ZoomAndPanService', []).factory('ZoomAndPan',  function() {
    var resetFunctions = [];
    var resizeFunctions = [];
    var changeScreenFunctions = [];
    var minScale = 1, maxScale = 1.5;
    return {
        // Zoom on a precise point
        zoom: function(layer, scaleFactor, center) {
            var scale = layer.scaleX() * scaleFactor;
            
            var origin = {
                x: layer.x(),
                y: layer.y()
            };
            var distanceToOrigin = {
                x: center.x - origin.x,
                y: center.y - origin.y
            };

            layer.x(origin.x - (distanceToOrigin.x * (scaleFactor - 1)));
            layer.y(origin.y - (distanceToOrigin.y * (scaleFactor - 1)));

            layer.scale({
                x: scale,
                y: scale
            });
        },
        

        // Add an image on the layer and set zindex
        addImageToLayer: function(layer, imgSrc, layerWidth, layerHeight, layerPosition, callback) {
            // Basic zoom level
            var scale;
            var self = this;
            var img = document.createElement('img');

            var label = 
            img.onload = function() {
                var ratioImg = img.height / img.width;
                var imgHeight = img.height;
                var imgWidth = img.width;

                // if image is larger than long
                if (ratioImg <= 1) {
                    if (layerWidth > imgWidth) {
                        scale = imgWidth / layerWidth;
                    } else {
                        scale = layerWidth / imgWidth;
                    }
                } else {
                    if (layerHeight > imgHeight) {
                        scale = imgHeight / layerHeight;   
                    } else {
                        scale = layerHeight / imgHeight;
                    }
                }
                var image = new Konva.Image({
                    image: img,
                    x: (layerPosition === 'l') ? (layerWidth - (imgWidth * scale)) : 0, // Doesn't work
                    y: 0,
                    width: imgWidth,
                    height: imgHeight
                });
                
                minScale = scale;
                var scaleFactor = 1 * scale;
                self.zoom(layer, scaleFactor, {x: 0, y: 0});
                layer.add(image);
                layer.setZIndex(0);
                layer.getStage().draw();
                
                // Return the basic zoom level
                callback(scale);
            }
            img.src = imgSrc;
        }, 
        


        // Add listeners to zoom and pan the layers
        zoomAndPan: function(stage, basicZoom) {
            var self = this;
            var scale;
            var layers = stage.getChildren(); 
            var groups = layers[1].getChildren();
            var labels = layers[1].find('Label');
            stage.on('mousedown', function(e) {
                // if (layers[1].getChildren().length > 0) {
                //     layers[1].cache();
                // }

                var center = {
                    x: stage.getPointerPosition().x,
                    y: stage.getPointerPosition().y
                };
                
                var startPosition = [];
                startPosition.push({
                    x: layers[0].x(),
                    y: layers[0].y()
                });

                startPosition.push({
                    x: layers[1].x(),
                    y: layers[1].y()
                });
            
                
                // If right click, zoom
                if (e.evt.button == 2) {
                    stage.on('mousemove', function(e) {
                        labels.hide();
                        // layers[1].hide();
                        // layers[1].clearCache(); 
                        var pointer = {
                            x: stage.getPointerPosition().x,
                            y: stage.getPointerPosition().y
                        };
                        var diff = {
                            x: pointer.x - center.x,
                            y: pointer.y - center.y
                        };
                        
                        var oldScaleLevel = layers[0].scaleX();
                        var newScale = layers[0].scaleX();
                        
                        if (e.evt.movementY < 0) {
                            newScale += 0.01;
                        } else {
                            newScale -= 0.01;
                        }
                        
                        //currentZoom = basicZoom * (1 -6*(diff.y/stage.getHeight()));
                        
                        // Disable reducting zoom
                        newScale = Math.max(minScale, newScale);
                        newScale = Math.min(maxScale, newScale);

                        // Calculate difference between old scale level and new scale level
                        var scaleFactor = newScale / oldScaleLevel;
                        // Zoom on layers and not on stage.

                        self.zoom(layers[0], scaleFactor, center);
                        self.zoom(layers[1], scaleFactor, center);

    

                        stage.draw();
                         
                    });
                } else if (e.evt.button == 0) { // If left click, pan
                    stage.on('mousemove', function(e) {

                        layers[1].clearCache();   
                        var pointer = {
                            x: stage.getPointerPosition().x,
                            y: stage.getPointerPosition().y
                        };
                        
                        var diff = {
                            x: pointer.x - center.x,
                            y: pointer.y - center.y
                        };
                        
 
                        layers[0].x(startPosition[0].x + diff.x);
                        layers[0].y(startPosition[0].y + diff.y);

                        layers[1].x(startPosition[1].x + diff.x);
                        layers[1].y(startPosition[1].y + diff.y);
                      
                        
                        stage.draw();
                    });
                }
            });
            stage.on('mouseup mouseout', function(e) {
                stage.off('mousemove');
                // stage.off('mouseup');   
                // layers[1].removeChildren();
                labels.show();
                
                // layers[1].show();
                layers[1].draw();
                // groups.forEach(function(group) {
                //     layers[1].add(group);
                // })
                // layers[1].setZIndex(1);
                // stage.draw();
    

            });
        },


        // Disable zoom and pan
        disableZoomAndPan: function disableZoomAndPan(stage) {
            stage.on('mousedown', function(e) {
                stage.off('mousemove');
            });
        },


        // Reinitialise the stage zoom level and position
        reinitializeZoomAndPan: function reinitializeZoomAndPan(stage, basicZoom) {
            var layers = stage.getChildren();
            
            layers[0].scale({
                x: basicZoom,
                y: basicZoom
            });
            layers[0].x(0);
            layers[0].y(0);

            layers[1].scale({
                x: basicZoom,
                y: basicZoom
            });

            layers[1].x(0);
            layers[1].y(0);

            // Reset stage position that has been dragged
            stage.x(0);
            stage.y(0);
            stage.draw();
        },
        
        resizeCanvas: function(stage, oldHeight, callback) {
            var layers = stage.getChildren();
            var currentScale = layers[0].scale().y;
            var newScale = (stage.getHeight() / oldHeight) * currentScale;
            var scaleFactor = newScale / currentScale;
            var self = this;
            

            self.zoom(layers[0], scaleFactor, {x: 0, y: 0});
            self.zoom(layers[1], scaleFactor, {x: 0, y: 0});
            stage.draw();
            
            callback(newScale);
        },
        
        
        addResetFunctionForDirective: function(fct) {
            resetFunctions.push(fct);
        },
        
        execResetFunctions: function() {
            resetFunctions.forEach(function(fct) {
                fct(); 
            });
        },
        
        addResizeFunctionForDirective: function(fct) {
            resizeFunctions.push(fct);
        },
        
        resize: function() {
            resizeFunctions.forEach(function(fct) {
                fct();  
            });
        },
        
        addChangeScreenFunctionForDirective: function(idDir, fct) {
            changeScreenFunctions[idDir] = fct;
        },
        
        /*
        * ExecChangeScreen: execute the function of the Convercerned directive to be resized to fit the number of screens.
        *
        * Params: - idDir: string, determine the directive that has to be resized. If equals 'all', all directive are resized.
        *         - nbScreens: integer, determine the number of screens that have to be displayed.
        *         - position: integer, determine the position of the concerned screen on the panel. If all screens, equals 0.
        */
        execChangeScreen: function(view, nbScreens) {
            position = 1;
            if (view === 'all' || view == 'ws') {
                for (var key in changeScreenFunctions) {
                    var fct = changeScreenFunctions[key];
                    fct(view, nbScreens, position);
                    position++;
                }
            } else if (view === 'cc' || view === 'mlo') {
                for (var key in changeScreenFunctions) {
                    if (key.indexOf(view) > -1) {
                        var fct = changeScreenFunctions[key];
                        fct(view, nbScreens, position);
                        position++;
                    }
                }                
            } else {
                var fct = changeScreenFunctions[view];
                fct(view, nbScreens, position);
            }
        },

        getRelativePosition: function(point, layer) {
            var positionLayer = layer.position();
            var scale = layer.scaleX();
            var x = (point.x - positionLayer.x ) / scale;
            var y = (point.y - positionLayer.y ) / scale;   
            return {
                x : (0.5 + x) | 0, // Convert floating points to integer
                y : (0.5 + y) | 0   
            };
        }
    }

});