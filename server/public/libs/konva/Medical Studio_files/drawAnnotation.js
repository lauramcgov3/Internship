app.directive("drawing", function(){
    return {
        scope : {
            can : "="
        },
        template: "<canvas id='canvas' width='500' height='300'/> <button id='can'>{{can}}</button>",
        restrict: "E",
        link: function(scope, element, attributes){
            
            
        
//            //console.log(element);
//            scope.canvas = element.find('canvas')[0];
//            var bouton = element.find('#can');
//            var ctx = scope.canvas.getContext('2d');
//            
//            //var ctx = element[0].getContext('2d');
//
//            // variable that decides if something should be drawn on mousemove
//            var drawing = false;
//            // the last coordinates before the current move
//            var lastX;
//            var lastY;
//            
//            var mousePos;
//            
//            angular.element(element.find('#canvas')).bind('mousedown', function(event){
//            if(event.offsetX!==undefined){
//                lastX = event.offsetX;
//                lastY = event.offsetY;
//
//                 var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
//            } else {
//                lastX = event.layerX - event.currentTarget.offsetLeft;
//                lastY = event.layerY - event.currentTarget.offsetTop;
//            }
//
//            // begins new line
//            ctx.beginPath();
//            if (scope.can) {
//                drawCircle(mousePos.x, mousePos.y);
//            }
////            if (scope.can == true) {
////                
////                drawing = true;
////            }
//        });
//            
//                
//        angular.element(element.find('#canvas')).bind('mousemove', function(event){
//            mousePos = getMousePos(scope.canvas, event);
//            if(drawing){
//                // get current mouse position
//                if(event.offsetX!==undefined){
//                    currentX = event.offsetX;
//                    currentY = event.offsetY;
//                } else {
//                    currentX = event.layerX - event.currentTarget.offsetLeft;
//                    currentY = event.layerY - event.currentTarget.offsetTop;
//                }
//
//                draw(lastX, lastY, currentX, currentY);
//
//                // set current coordinates to last one
//                lastX = currentX;
//                lastY = currentY;
//            }
//        });
//        angular.element(element.find('#canvas')).bind('mouseup', function(event){
//        // stop drawing
//        drawing = false;
//        });
//            
//            
//        angular.element(element.find('#can')).bind('click', function(event){
//            scope.can = !scope.can;
//            scope.$apply();
//        });
//
//        // canvas reset
////        scopereset(){
////            ctx.clearRect ( 0 , 0 , scope.canvas.width, scope.canvas.height );
////        }
//
//        function draw(lX, lY, cX, cY){
//            // line from
//            ctx.moveTo(lX,lY);
//            // to
//            ctx.lineTo(cX,cY);
//            // color
//            ctx.strokeStyle = "#4bf";
//            // draw it
//            ctx.stroke();
//            
//            console.log(ctx.getImageData(0,0,500,300));
//        }
//            
//        function drawCircle(mouseX, mouseY) {
//            var centerX = mouseX
//            var centerY = mouseY;
//            var radius = 70;
//
//            ctx.beginPath();
//            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//            ctx.fillStyle = 'green';
//            ctx.fill();
//            ctx.lineWidth = 5;
//            ctx.strokeStyle = '#003300';
//            ctx.stroke();
//        }
//
//        function make_base()
//        {
//              var base_image = new Image();
//              base_image.src = 'img/base.png';
//              base_image.onload = function(){
//                context.drawImage(base_image, 100, 100);
//          }
//        }
//            
//      function getMousePos(canvas, evt) {
//        var rect = canvas.getBoundingClientRect();
//        return {
//          x: evt.clientX - rect.left,
//          y: evt.clientY - rect.top
//        };
//      }
//        
    }
}});
