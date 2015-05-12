/**
* Reads a file in BASE64 an links it with the scope variable set.
*/
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                //On va charger si on a des fichiers. Sinon on va mettre à null
                if (changeEvent.target.files.length > 0) {
                    reader.readAsDataURL(changeEvent.target.files[0]);
                }
                else {
                    scope.$apply(function () {
                        scope.fileread = null
                    });
                }
            });
        }
    }
}]);