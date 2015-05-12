angular.module('DrawerService', []).factory('Drawer' , function() {
    return {
        getRandomColor:  function() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

        createStage: function(id, width, height) {
            var stage =  new Konva.Stage({
                container: id,   
                width: width,
                height: height
            });
            return stage;
        },
        
        /**
        *   Add the shape to the layer and render it on the canvas.
        *   @param shape {object} Object Shape added to the layer.
        */
       addToLayer: function(object, layer, stage) {
           // Sûr que ça va fonctionner ça reste à tester, pour les références
            layer.add(object);
            layer.setZIndex(1);
            stage.draw(); // P-e a bouger
        },
        
        /**
        *   Draw a rectangle and call addToLayer function.
        *   @param _id {String} id of the annotation. The rectangle will share the same id than the annotation.
        *   @param x {Integer} Center x of the rectangle.
        *   @param y {Integer} Center y of the rectangle.
        */
        createRect: function(id, points, width, height, name) {
            var rect = new Konva.Rect({
                name: "annotation",
                width: width,
                height: height,
                stroke: 'white',
                strokeWidth: 4, 
                transformsEnabled : 'position',
                draggable: false
            });
            
            return rect;
        },
        
        /**
        *   Draw a circle and call addToLayer function.
        *   @param _id {String} id of the annotation. The circle will share the same id than the annotation.
        *   @param x {Integer} Center x of the circle.
        *   @param y {Integer} Center y of the circle.
        */
        createCircle: function(id, points) {
            var circle = new Konva.Circle({
                id : id,
                name: 'annotation',
                x: points[0],
                y: points[1],
                radius: 70,
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 4,
                transformsEnabled : 'position',
                draggable: false
            });
            circle.shadowForStrokeEnabled(false);

            return circle;
        },

        createArrow: function(id, points) {
            var x1 = points[0];
            var y1 = points[1];
            var x2 = points[points.length - 2];
            var y2 = points[points.length - 1];

            var headlen = 10;
            var angle = Math.atan2(y2-y1,x2-x1);

            var arrow = new Konva.Line({
                id: id,
                name: 'annotation',
                points: [ 
                    x1, 
                    y1,
                    x2,
                    y2,
                    x2-headlen*Math.cos(angle-Math.PI/6),
                    y2-headlen*Math.sin(angle-Math.PI/6),
                    x2,
                    y2,
                    x2-headlen*Math.cos(angle+Math.PI/6),
                    y2-headlen*Math.sin(angle+Math.PI/6)
                ],
                shapeType: "line",
                stroke: this.getRandomColor(),
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round',
                draggable: false
            });
            
            return arrow;
        },

        freeDrawing: function(id, points) {           
            var line = new Konva.Line({
                id: id,
                name: 'annotation',
                points: points,
                stroke: this.getRandomColor(),
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round',
                tension : 1,
                transformsEnabled : 'position',
                draggable: false
               // draggable: 'false'
            });
            line.shadowForStrokeEnabled(false);
            //$scope.actualLine = redLine; A remplacer

            addToLayer(redLine);
        },

        drawAll: function(annotations, layer, stage) {
            for (var i = 0 ; i < annotations.length ; i++) {
                this.drawAnnotation(annotations[i], layer, stage);
            }
        },
        
        /** 
        *   Switch that call the appropriate drawing method depending the type of the annotation in parameter.
        *   @param annotation {object} Annotation that will be drew.
        */
        drawAnnotation: function(annotation, layer, stage, dragendCallback) {
            var shape = {};
            var label = {};
            switch (annotation.type) {
                case "circle" :
                    shape = this.createCircle(annotation._id, annotation.points);
                    break;
                case "rectangle" :

                    var group = this.createGroup(annotation.points, annotation._id);
                    group.visible(annotation.isVisible); 
                    layer.add(group);

                    shape = this.createRect(annotation._id, annotation.points, annotation.attrs.width, annotation.attrs.height); 
                    group.add(shape);

                 
                    var messageExist = annotation.message.length > 0;
                    if (messageExist) {
                        label = this.createLabel(shape, annotation.message);
                        group.add(label)
                    }
             
              
                  

                    // this.addAnchor(group, shape.x()/2, shape.y()/2, 'topLeft');
                    //var origin = {x :shape.width()  / 2 * -1, y: shape.height() / 2 * -1};

                    // label = this.createLabel(annotation._id, shape);
                    // group.add(label);
                    this.addAnchor(group, 0, 0, 'topLeft',dragendCallback);
                    this.addAnchor(group, shape.width(), 0, 'topRight', dragendCallback);
                    this.addAnchor(group, shape.width(), shape.height(), 'bottomRight', dragendCallback);
                    this.addAnchor(group, 0, 0 + shape.height(), 'bottomLeft', dragendCallback);
                    layer.draw();
                    break;   
                    
                case "arrow" :
                    shape = this.createArrow(annotation._id, annotation.points);
                    break;
//                case "freeDraw" : 
//                    this.freeDrawing(annotation._id, annotation.points);
//                    break; 
            }
            

            return shape;
        },
        
        selectCurrent: function(group, layer, stage) {
            if (_.isEmpty(group)) return;
            var shape = group.get('.annotation')[0];
            shape.setAttr('stroke', 'red');
            
            var topLeft = group.get('.topLeft')[0].visible(true);
            var topRight = group.get('.topRight')[0].visible(true);
            var bottomRight = group.get('.bottomRight')[0].visible(true);
            var bottomLeft = group.get('.bottomLeft')[0].visible(true);
            
           layer.draw();
            
        },
        
        unselectCurrent: function(group, layer, stage) {
            if (_.isEmpty(group)) return;
            var shape = group.get('.annotation')[0];
            shape.setAttr('stroke', 'white');
            
            var topLeft = group.get('.topLeft')[0].visible(false);
            var topRight = group.get('.topRight')[0].visible(false);
            var bottomRight = group.get('.bottomRight')[0].visible(false);
            var bottomLeft = group.get('.bottomLeft')[0].visible(false);
            
            layer.draw();
        },
        
        setAllDraggable: function(groups, state) {
            if (groups.length) {
                for (var i = 0 ; i < groups.length ; i++) {
                    groups[i].draggable(state);
                }
            }
            else {
                groups.draggable(state);
            }
            return groups;
        },
            
        updateAnchors: function(activeAnchor) {
            var group = activeAnchor.getParent();
            var topLeft = group.get('.topLeft')[0];
            var topRight = group.get('.topRight')[0];
            var bottomRight = group.get('.bottomRight')[0];
            var bottomLeft = group.get('.bottomLeft')[0];
            var annotation = group.get('.annotation')[0];

            var anchorX = activeAnchor.getX();
            var anchorY = activeAnchor.getY();

            // update anchor positions
            switch (activeAnchor.getName()) {
                case 'topLeft':
                    topRight.setY(anchorY);
                    bottomLeft.setX(anchorX);
                    break;
                case 'topRight':
                    topLeft.setY(anchorY);
                    bottomRight.setX(anchorX);
                    break;
                case 'bottomRight':
                    bottomLeft.setY(anchorY);
                    topRight.setX(anchorX);
                    break;
                case 'bottomLeft':
                    bottomRight.setY(anchorY);
                    topLeft.setX(anchorX);
                    break;
            }
            annotation.position(topLeft.position());

            var width = topRight.getX() - topLeft.getX();
            var height = bottomLeft.getY() - topLeft.getY();
            if(width && height) {
                annotation.width(width);
                annotation.height(height);
            }
            
            return activeAnchor;
        },

        updateLabel: function(label, figure) {
            if (figure.height() > 0) {
                label.setY(figure.getY() + figure.height());
            }
            else {
                label.setY(figure.getY());
            }

            // if (figure.height() > 0) {
            //     label.setY(figure.getY() - 50);
            // }
            // else {
            //     label.setY(figure.getY() + 50);
            // }
            
            // if (figure.width() < 0) {
            //     label.setX(figure.getX() + figure.width()/2 - label.width()/2);
            // }
            // else {
            label.setX(figure.getX() + figure.width()/2 - label.width()/2);
            // }

            label.parent.parent.draw();
        },
            
        addAnchor: function(group, x, y, name, dragendCallback) {
            var that = this;
            var stage = group.getStage();
            var layer = group.getLayer();

            var anchor = new Konva.Circle({
                x: x,
                y: y,
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: 2,
                radius: 6,
                name: name,
                draggable: true,
                dragroupgOnTop: false,
                
            });
            
            anchor.visible(false);
            
            anchor.on('dragmove', function(e) {
                var label = group.findOne('Label');
                that.updateAnchors(this);
                if (!_.isEmpty(label)) {
                    that.updateLabel(label, group.findOne('.annotation'));
                }
                layer.draw();
            });
            anchor.on('mousedown touchstart', function() {
                group.setDraggable(false);
                this.moveToTop();
            });
            anchor.on('dragend', function() {
                group.setDraggable(true);
                layer.draw();
                dragendCallback(this);
            });
            // add hover styling
            anchor.on('mouseover', function() {
                var layer = this.getLayer();
                document.body.style.cursor = 'pointer';
                this.setStrokeWidth(4);
                layer.draw();
            });
            anchor.on('mouseout', function() {
                var layer = this.getLayer();
                document.body.style.cursor = 'default';
                this.setStrokeWidth(2);
                layer.draw();
            });
            
            group.add(anchor);       
            return group;
        },
        
        createGroup: function(points, id) {
            var group = new Konva.Group({
                id: id,
                x: points[0],
                y: points[1],
                draggable: false,
                name : 'Group'
            });
            return group;
        },

        createLabel: function(figure, message) {
            var label = new Konva.Label({
                 x: 0,
                 y: 0,
                 draggable: false
             });
            label.add(new Konva.Tag({
                 fill: 'white',
                 draggable: false
             }));

             label.add(new Konva.Text({
                 text : message,
                 fontFamily: 'Calibri',
                 fontSize: 24,
                 padding: 5,
                 width: 200,
                 fill: 'black',
                 draggable: false
             }));

             label.setX(figure.getX() + figure.width()/2 - label.width()/2);
             if (figure.height() > 0) {
                 label.setY(figure.getY() + figure.height());
             }
             else {
                 label.setY(figure.getY());
             }

             label.draggable(false);

             return label;
        }   
    }       
});