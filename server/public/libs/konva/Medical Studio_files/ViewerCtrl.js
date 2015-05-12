angular.module('ViewerCtrl', []).controller('ViewerController', ['$scope', '$routeParams', 'Image', 'Annotation', function($scope, $routeParams, Image, Annotation, Drawer) {
    
    $scope.selectedCircle = -1;
    $scope.annotations = [];
    $scope.idCount = 0;
    
    $scope.selectedType = "circle";
    $scope.position = {};
    
    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
    
    var stage =  new Konva.Stage({
        container: 'l',   // id of container <div>
        width: 500,
        height: 500,
    });
    
     var background = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.getWidth(),
        height: stage.getHeight(),
        fill: 'green'
    });
    
    var layer = new Konva.Layer();
    background.on('mousedown', function(e) {
        console.log(e.evt.x + "," + e.evt.y); 
        var position = {
            x: e.evt.x,
            y: e.evt.y
        };
        $scope.position = position;
        
        $scope.createAnnotation();
    });
    layer.add(background);
    stage.add(layer);
    
    $scope.createAnnotation = function() {
        var annotation = {
            message : "message",
            image_id : "imageDeBase",
            type: $scope.selectedType,
            left : $scope.position.x,
            top : $scope.position.y
        };
            
        Annotation.save(annotation).then(function(result) {
            console.log("sauvegarde terminée");
                 console.log(result.data);
            annotation._id = result.data;
       
            drawAnnotation(annotation);
        });  
    }
    
    function drawAnnotation(annotation) {
        switch (annotation.type) {
            case "circle" :
                console.log(annotation._id, "_id");
                $scope.drawCircle(annotation._id, annotation.left, annotation.top);
                break;
            default :
                alert("Veuillez choisir un type valide");
                break;
        }
    }

    $scope.drawCircle = function(_id, left, top) {
        var circle = new Konva.Circle({
            x: left,
            y: top,
            radius: 70,
            fill: Drawer.getRandomColor(),
            stroke: 'black',
            strokeWidth: 4,
            id : _id
        });
        
        circle.draggable('true');

        layer.add(circle);
        stage.add(layer);
        
        circle.on('mousedown', function() {
            $scope.selectedCircle = this;
            $scope.safeApply(function() {});        
        });
        
        $scope.annotations = stage.find('Circle');
        layer.draw();
        $scope.safeApply(function() {});
        console.log($scope.annotations);
    }
    
    $scope.removeCircle = function() {
        if ($scope.selectedCircle !== -1) {
            $scope.selectedCircle.remove();
            $scope.annotations = stage.find('Circle');
            $scope.selectedCircle = -1;
            layer.draw();     
            $scope.safeApply(function() {});
           
        
        }
    }
    
    $scope.selectById = function(id) {
        $scope.selectedCircle = stage.findOne('#'+id);

        $scope.safeApply(function() {});
    }
}]);