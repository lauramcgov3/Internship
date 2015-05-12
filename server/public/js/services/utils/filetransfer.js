angular.module('FileTransferUtilsService', []).factory('FileTransferUtils', ['$http', '$window', '$modal', function($http, $window, $modal) {
    
        
    /** 
    * Transforms a Base64 file into a Blob or a byte array
    * @param base64File {String} Base64 file to transform
    * @param type {String} Output type (default blob)
    */
    var base64ToBlobOrByteArray = function(base64File, type)
    {
        var b64Data = base64File.substr(base64File.indexOf(',') + 1);
        var contentType = base64File.substr(base64File.indexOf(':') + 1, base64File.indexOf(';'));
        sliceSize = 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        if(type === "byteArray")
        {
            return byteArrays;
        }
        
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
    
    /** 
    * Transforms a Base64 file into a Blob
    * @param base64File {String} Base64 file to transform as Blob
    */
    var base64ToBlob = function (base64File) {
        return base64ToBlobOrByteArray(base64File, "blob");
    }
    
    /** 
    * Transforms a Base64 file into a Byte Array
    * @param base64File {String} Base64 file to transform as Blob
    */
    var base64ToByteArray = function(base64File){
        return base64ToBlobOrByteArray(base64File, 'byteArray');
    }
    
    /** 
    * Transforms a Base64 file into a big or a big Uint8Array byte array
    * @param base64File {String} Base64 file to transform
    */
    var base64ToBigByteArray = function(base64File)
    {
        var b64Data = base64File.substr(base64File.indexOf(',') + 1);

        var byteCharacters = atob(b64Data);
        var byteArrays = [];


        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);


        return byteArray;
    }
    
    /** 
    * Transform the file into a Base64 string
    * @param file {File} File to transfer
    * @param callback {Function(Base64)} Callback function
    */
    var fileToBase64 = function(file, callback){
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
            var base64File = loadEvent.target.result;
            return callback(base64File);
        }
        reader.readAsDataURL(file);        
    }
    
    /** 
    * Prompts a file save window for a base64 file
    * @param base64File {String} Base64 file to save
    */
    var promptDownloadFile = function(base64File)
    {
        var blob = this.base64ToBlob(base64File);
        var blobUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        url = window.URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = "TEST.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    /** 
    * Prompts a file save window from a blob url
    * @param base64File {String} Base64 file to save
    */
    var promptDownloadFileFromBlobUrl = function(blobUrl)
    {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
//        url = window.URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = "TEST.pdf";
        a.click();
//        window.URL.revokeObjectURL(url);
    }
    
    /** 
    * Open the PDF directly in the browser in a new tab/window
    * @param base64File {String} Base64 file to save
    */
    var openPDFInBrowser = function(base64File)
    {
        $window.open("data:application/pdf;base64," + base64File);
    }
    
    /** 
    * Open the PDF directly in the browser in a new tab/window using a <a></a>
    * @param base64File {String} Base64 file to save
    * @param isNewWindow {Boolean} Open the PDF in a new window
    */
    var openPDFInBrowserViaA = function(base64File, isNewWindow)
    {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = "data:application/pdf;base64," + base64File;
        
        if(isNewWindow)
        {
            a.target = "_blank";
        }
        
        a.click();  
    }
    
    /** 
    * Open the PDF in our PDF Viewer
    * @param base64File {String} Base64 file to save
    * @param study {Study} Report's study
    */
    var openPDFViaPDFjs = function(base64File, study){
        var blob = this.base64ToBlob(base64File);
        var blobUrl = URL.createObjectURL(blob);
        
        var modalInstance = $modal.open({
            templateUrl: '/views/modal/pdfJSViewer.html',
            controller: 'PDFJSViewerController',
            windowClass: 'PDFViewerPopup',
            resolve: {
                pdfUrl: function() {
                    return blobUrl;
                },
                study: function(){
                    return study;
                }
            }
        });

        modalInstance.result.then(function () {
        });
    }
        
    return{
        base64ToBlob: base64ToBlob
        ,base64ToByteArray: base64ToByteArray
        ,base64ToBigByteArray: base64ToBigByteArray
        ,fileToBase64: fileToBase64
        ,promptDownloadFile: promptDownloadFile
        ,promptDownloadFileFromBlobUrl: promptDownloadFileFromBlobUrl
        ,openPDFInBrowser: openPDFInBrowser
        ,openPDFInBrowserViaA: openPDFInBrowserViaA
        ,openPDFViaPDFjs: openPDFViaPDFjs
    }
    
}]);