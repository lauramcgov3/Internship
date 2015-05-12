angular.module('RptMammographieCtrl', []).controller('RptMammographieController', ['$scope', '$routeParams', function($scope, $routeParams) {


 $scope.patient = {};
    var seriesInstanceUID;
    var causesList = [
        {
            title: "Positionnement",
            checked: false
        },
        {
            title: "Artéfact",
            checked: false
        },
        {
            title: "Contraste",
            checked: false
        },
        {
            title: "Compression",
            checked: false
        },
        {
            title: "Problème tech/physique",
            checked: false
        },
        {
            title: "Autre",
            checked: false
        }
    ];
    $scope.acrNegativConclusions = ["Pas d'anomalie","Anomalie bénigne"];
    $scope.acrPositivConclusions = ["Probablement bénin","Suspect","Très suspect de malignité"];
    $scope.acrOthersConclusions = ["Ininterprétable, raison technique","Sein avec prothèse","Mastectomie","Sein dense, échographie"];
    $scope.recommendations = ["Pas d'examen complémentaire", "Investigation complémentaire"];
    
    $scope.question1 = {
        answer1: false,
        answer2: false,
        answer3: false,
        answer4: false
    };
    var answers = [];
    var exitAfterSurvey = false;
    
    //Default report values
    $scope.causesR = JSON.parse(JSON.stringify(causesList));//Deep copy/clone
    $scope.causesL = JSON.parse(JSON.stringify(causesList));//Deep copy/clone
    $scope.acrDensityR = 'type1';$scope.acrDensityL = 'type1';
    $scope.qualityR = 'yes';$scope.qualityL = 'yes';
    $scope.acrConclusionR = 'type1';$scope.acrConclusionL = 'type1';
    $scope.currentAcrConclusionCauseR = $scope.acrNegativConclusions[0];
    $scope.currentAcrConclusionCauseL = $scope.acrNegativConclusions[0];
    $scope.globalAcr = 'type1';
    $scope.currentRecommendation = $scope.recommendations[0];
    $scope.miniScreens = {};
    $scope.annotationsR = [];
    $scope.annotationsL = [];
    $scope.annotationsRInfo = [];
    $scope.annotationsLInfo = [];
    $scope.showStudy = false;
    
    $scope.chooseRecommendation = function(recommendation){
        $scope.currentRecommendation = recommendation;
        $scope.status.isopen = !$scope.status.isopen;
    };
    
    $scope.changeDensityOrRecommendation = function(){
        if ($scope.qualityL == "no2" | $scope.qualityR == "no2"){
            $scope.recommendations = ["A refaire pour raisons techniques"];
            $scope.currentRecommendation = $scope.recommendations[0];
            $scope.globalAcr = "type0";
            ($scope.qualityL == "no2") ? $scope.acrConclusionL = "type0" : $scope.acrConclusionR = "type0";

        }
        else{
            if ($scope.acrDensityR == "type3" | $scope.acrDensityR == "type4" | $scope.acrDensityL == "type3" | $scope.acrDensityL == "type4"){
                $scope.recommendations = ["Pas d'examen complémentaire","Echographie pour sein dense/prothèse",
                          "Investigation complémentaire"];
                $scope.currentRecommendation = $scope.recommendations[1];
            }
            else{
                $scope.recommendations = ["Pas d'examen complémentaire",
                          "Investigation complémentaire"];
                if (parseInt($scope.globalAcr.replace('type','')) > 2)
                    $scope.currentRecommendation = $scope.recommendations[1];
                else
                    $scope.currentRecommendation = $scope.recommendations[0];
            }
        }
        
        selectACRTitle(true, $scope.acrConclusionR.replace('type',''));
        selectACRTitle(false, $scope.acrConclusionL.replace('type',''));
    };
    
    $scope.selectCause = function(causes, cause){
//        Stats.log({
//            origin: "ViewerCtrl",
//            action: "Select image quality degradation cause",
//            description: "Cause : " + cause.title
//        });
        _.findWhere(causes, {title: cause.title}).checked = !cause.checked;
    };
    
    $scope.resetCauses = function(right){
        if(right)
            $scope.causesR = JSON.parse(JSON.stringify(causesList));
        else
            $scope.causesL = JSON.parse(JSON.stringify(causesList));
    };
    
    $scope.selectAcrConclusionCause = function(right, conclusion){
        if(right){
//            Stats.log({
//                origin: "ViewerCtrl",
//                action: "Select ACR conclusion",
//                description: "Conclusion for right breast : " + conclusion
//            });
            $scope.currentAcrConclusionCauseR = conclusion;
            switch(conclusion){
                case "Pas d'anomalie": $scope.acrConclusionR = "type1";
                break;
                case "Anomalie bénigne": $scope.acrConclusionR = "type2";
                break;
                case "Probablement bénin": $scope.acrConclusionR = "type3";
                break;
                case "Suspect": $scope.acrConclusionR = "type4";
                break;
                case "Très suspect de malignité": $scope.acrConclusionR = "type5";
                break;
            }
            $scope.globalAcr = 'type' + $scope.acrConclusionR.replace('type','');
            selectACRTitle(right, $scope.acrConclusionR.replace('type',''));
        }
        else{
//            Stats.log({
//                origin: "ViewerCtrl",
//                action: "Select ACR conclusion",
//                description: "Conclusion for left breast : " + conclusion
//            });
            $scope.currentAcrConclusionCauseL = conclusion;
            switch(conclusion){
                case "Pas d'anomalie": $scope.acrConclusionL = "type1";
                break;
                case "Anomalie bénigne": $scope.acrConclusionL = "type2";
                break;
                case "Probablement bénin": $scope.acrConclusionL = "type3";
                break;
                case "Suspect": $scope.acrConclusionL = "type4";
                break;
                case "Très suspect de malignité": $scope.acrConclusionL = "type5";
                break;         
            }
            $scope.globalAcr = 'type' + $scope.acrConclusionL.replace('type','');
            selectACRTitle(right, $scope.acrConclusionL.replace('type',''));
        }
        
        if (parseInt($scope.acrConclusionR.replace('type','')) == 0 | parseInt($scope.acrConclusionL.replace('type','')) == 0 ){
            $scope.globalAcr = 'type' + 0;
        }
        if (parseInt($scope.acrConclusionR.replace('type','')) > parseInt($scope.globalAcr.replace('type','')))
            $scope.globalAcr = $scope.acrConclusionR;
        if (parseInt($scope.acrConclusionL.replace('type','')) > parseInt($scope.globalAcr.replace('type','')))
            $scope.globalAcr = $scope.acrConclusionL;
        
        if (parseInt($scope.acrConclusionR.replace('type','')) > 2 | parseInt($scope.acrConclusionL.replace('type','')) > 2 ){
            $scope.currentRecommendation = $scope.recommendations[$scope.recommendations.length-1];
        }
    };
    
    $scope.acrGlobalChange = function(acr) {
//        Stats.log({
//            origin: "ViewerCtrl",
//            action: "ACR global change",
//            description: "Open modal window ACR conclusions"
//        });
        
        if (parseInt(acr) > 2){
            $scope.currentRecommendation = $scope.recommendations[$scope.recommendations.length-1];
        }
        else
            $scope.currentRecommendation = $scope.recommendations[0];
        
        if ($scope.acrDensityR == "type3" | $scope.acrDensityR == "type4" | $scope.acrDensityL == "type3" | $scope.acrDensityL == "type4"){
                $scope.recommendations = ["Pas d'examen complémentaire","Echographie pour sein dense/prothèse",
                          "Investigation complémentaire"];
                $scope.currentRecommendation = $scope.recommendations[1];
            }
    };
    
    $scope.acrConclusionsChange = function(right) {
//        Stats.log({
//            origin: "ViewerCtrl",
//            action: "ACR conclusions change",
//            description: "Open modal window ACR conclusions"
//        });
        
        if (right){
            $scope.globalAcr = 'type' + $scope.acrConclusionR.replace('type','');
            selectACRTitle(right, $scope.acrConclusionR.replace('type',''));
        }
        else{
            $scope.globalAcr = 'type' + $scope.acrConclusionL.replace('type','');
            selectACRTitle(right, $scope.acrConclusionL.replace('type',''));
        }
        
        if (parseInt($scope.acrConclusionR.replace('type','')) == 0 | parseInt($scope.acrConclusionL.replace('type','')) == 0 ){
            $scope.globalAcr = 'type' + 0;
        }
        if (parseInt($scope.acrConclusionR.replace('type','')) > parseInt($scope.globalAcr.replace('type','')))
            $scope.globalAcr = $scope.acrConclusionR;
        if (parseInt($scope.acrConclusionL.replace('type','')) > parseInt($scope.globalAcr.replace('type','')))
            $scope.globalAcr = $scope.acrConclusionL;
        
        if (parseInt($scope.acrConclusionR.replace('type','')) > 2 | parseInt($scope.acrConclusionL.replace('type','')) > 2 ){
            $scope.currentRecommendation = $scope.recommendations[$scope.recommendations.length-1];
        }
        $('#acrConclusionsModal').show();
    };
    
    $scope.validateAcrConclusions = function() {
//        Stats.log({
//            origin: "ViewerCtrl",
//            action: "Validate ACR conclusions",
//            description: "Close modal window ACR conclusions"
//        });
        $('#acrConclusionsModal').hide();
    };
    
    
    openPatient();
    
    $scope.href = function(path){
        $location.path(path);
    };
    
    function openPatient(){
        if ($routeParams.id !== undefined){
//            Stats.log({
//                origin: "PatientCtrl",
//                action: "Open patient",
//                description: "Open a patient from patients list"
//            });
            
        }
    };
    
    function selectACRTitle(right, acr){
        if (right){
            switch(acr){
                    case "0": $scope.currentAcrConclusionCauseR = "";
                    break;
                    case "1": $scope.currentAcrConclusionCauseR = "Pas d'anomalie";
                    break;
                    case "2": $scope.currentAcrConclusionCauseR = "Anomalie bénigne";
                    break;
                    case "3": $scope.currentAcrConclusionCauseR = "Probablement bénin";
                    break;
                    case "4": $scope.currentAcrConclusionCauseR = "Suspect";
                    break;
                    case "5": $scope.currentAcrConclusionCauseR = "Très suspect de malignité";
                    break;
            }
            
        }
        else{
            switch(acr){
                    case "0": $scope.currentAcrConclusionCauseL = "";
                    break;
                    case "1": $scope.currentAcrConclusionCauseL = "Pas d'anomalie";
                    break;
                    case "2": $scope.currentAcrConclusionCauseL = "Anomalie bénigne";
                    break;
                    case "3": $scope.currentAcrConclusionCauseL = "Probablement bénin";
                    break;
                    case "4": $scope.currentAcrConclusionCauseL = "Suspect";
                    break;
                    case "5": $scope.currentAcrConclusionCauseL = "Très suspect de malignité";
                    break;
            }
            
        }
    }
    
    $scope.openStudy = function openStudy(study){
//        Stats.log({
//            origin: "HomeCtrl",
//            action: "Open study",
//            description: "Study path : " + study.path
//        });
        $location.path("/viewer/" + encodeURIComponent(study.path) + "/patient/" + $routeParams.id);
    };
    
    $scope.quit = function quit(){
        if ($scope.studies.length > 0 && $scope.showStudy == true && ($scope.checked0 == undefined | $scope.checked0 == false)){
            $('.container').addClass("blur");
            $('#checked_report').show();
        }
        else if (($cookieStore.get('surveyMammonote') == undefined) | ($cookieStore.get('surveyMammonote') != undefined && new Date($cookieStore.get('surveyMammonote').expires) <  new Date(Date.now()))){
            $cookieStore.remove('surveyMammonote');
            answers = [];
            $('.container').addClass("blur");
//            console.log("SUCCESS");
            $('#survey_1').show();
            exitAfterSurvey = true;
        }
        else
            $location.path("/");
        
        $('[data-toggle="tooltip"]').tooltip('hide');
    }
    
    $scope.cancel = function cancel(){
        $('.container').removeClass("blur");
        $('#checked_report').hide();
        $('#checked_report_print').hide();
    }
    
    $scope.check = function check(exit){
        var causesR = [], causesL = [];
        _.where($scope.causesR, {checked: true}).forEach(function(cause){
            causesR.push(cause.title);
        });
        _.where($scope.causesL, {checked: true}).forEach(function(cause){
            causesL.push(cause.title);
        });

        Report.addUpdate({
            patientID: $routeParams.id,
            seriesInstanceUID: seriesInstanceUID,
            annotationsR: $scope.annotationsR,
            annotationsL: $scope.annotationsL,
            causesR: causesR,
            acrDensityR: $scope.acrDensityR.replace('type',''),
            qualityR: $scope.qualityR,
            acrConclusionR: $scope.acrConclusionR.replace('type',''),
            acrConclusionCauseR: $scope.currentAcrConclusionCauseR, 
            leftCC: $scope.miniScreens.leftCC,
            leftMLO : $scope.miniScreens.leftMLO,
            causesL: causesL,
            acrDensityL: $scope.acrDensityL.replace('type',''),
            qualityL: $scope.qualityL,
            acrConclusionL: $scope.acrConclusionL.replace('type',''),
            acrConclusionCauseL: $scope.currentAcrConclusionCauseL,
            globalAcr: $scope.globalAcr.replace('type',''),
            recommendation: $scope.currentRecommendation,
            checked: true
        }).success(function(data) {
            if (exit){
                $('#checked_report').hide();
                exitAfterSurvey = true;
            }
            else
                $scope.checked0 = true;
            
            if (($cookieStore.get('surveyMammonote') == undefined) | ($cookieStore.get('surveyMammonote') != undefined && new Date($cookieStore.get('surveyMammonote').expires) <  new Date(Date.now()))){
                $cookieStore.remove('surveyMammonote');
                answers = [];
                $('.container').addClass("blur");
    //            console.log("SUCCESS");
                $('#survey_1').show();
            }
        });
    }
    
    $scope.print = function print(checked){
        if (checked != true && ($scope.checked0 == undefined | $scope.checked0 == false)){
            $('#checked_report_print').show();
        }
        else{
            $('#checked_report_print').hide();
            var causesR = [], causesL = [];
            _.where($scope.causesR, {checked: true}).forEach(function(cause){
                causesR.push(cause.title);
            });
            _.where($scope.causesL, {checked: true}).forEach(function(cause){
                causesL.push(cause.title);
            });

            Report.addUpdate({
                patientID: $routeParams.id,
                seriesInstanceUID: seriesInstanceUID,
                causesR: causesR,
                acrDensityR: $scope.acrDensityR.replace('type',''),
                qualityR: $scope.qualityR,
                acrConclusionR: $scope.acrConclusionR.replace('type',''),
                acrConclusionCauseR: $scope.currentAcrConclusionCauseR, 
                causesL: causesL,
                acrDensityL: $scope.acrDensityL.replace('type',''),
                qualityL: $scope.qualityL,
                acrConclusionL: $scope.acrConclusionL.replace('type',''),
                acrConclusionCauseL: $scope.currentAcrConclusionCauseL,
                globalAcr: $scope.globalAcr.replace('type',''),
                recommendation: $scope.currentRecommendation,
                checked: true
            }).success(function(data) {
                $scope.checked0 = true;
    //            console.log("SUCCESS");
                Report.createPDF({
                    patientID: $routeParams.id,
                    seriesInstanceUID: seriesInstanceUID,
                    annotationsRInfo: $scope.annotationsRInfo,
                    annotationsLInfo: $scope.annotationsLInfo
                }).success(function(data) {
                    window.open(data.path);
                    if (($cookieStore.get('surveyMammonote') == undefined) | ($cookieStore.get('surveyMammonote') != undefined && new Date($cookieStore.get('surveyMammonote').expires) <  new Date(Date.now()))){
                        $cookieStore.remove('surveyMammonote');
                        answers = [];
                        $('#survey_1').show();
                        $('.container').addClass("blur");
                    }
                })
                .error(function(err){
                    console.log(err);
                });
            });
        }
    }
    
    $scope.answerQuestion = function(question, answer){
        if (question == "6"){
            answers.push({question : question,
                         answer : $("#img1")[0].checked});
            answers.push({question : question,
                         answer : $("#img2")[0].checked});
            answers.push({question : question,
                         answer : $("#img3")[0].checked});
            answers.push({question : question,
                         answer : $("#img4")[0].checked});
            answers.push({question : question,
                         answer : $("#img5")[0].checked});
        }
        else{
            answers.push({question : question,
                             answer : answer});
        }
        $('#survey_'+ question).hide();
        $('#survey_'+ (question+1)).show();
//        if($('#survey_'+ (question+1)).length == 0){
//            $('.container').removeClass("blur");
//            
//        }
    }
    
    $scope.sendSurvey = function(name, email, tel){
        answers.push({
            name : name,
            email : email,
            tel : tel
        });
        $('#survey_8').hide();
        $('.container').removeClass("blur");
        Survey.addResponses(answers)
            .success(function(data){
            if ($cookieStore.get('surveyMammonote') == undefined){
                $cookieStore.put('surveyMammonote', { expires: new Date(Date.now() + (3600000 * 24))});
            }
            if (exitAfterSurvey == true)
                $location.path("/");
            })
            .error(function(err){
                console.log(err);
            });
    }
    
    function loadAnnotations(accessionNumber){
        $scope.annotationsRCC = [];
        $scope.annotationsRMLO = [];
        $scope.annotationsLCC = [];
        $scope.annotationsLMLO = [];
        
//        Annotation.getListOfAnnotations({
//            patientID: $routeParams.id,
//            accessionNumber: accessionNumber,
//            starMenu: false
//        }).then(function(annotations) {
//            console.log(annotations);
//            Patient.getStudyByAccessionNumber({
//            accessionNumber: accessionNumber
//            }).then(function(data) {
////                console.log(data);
//                seriesInstanceUID = data.study.images[0].seriesInstanceUID;
//                if (data.study != null){
//                    Report.getReport({
//                        patientID: $routeParams.id,
//                        siuid: data.study.images[0].seriesInstanceUID
//                    }).then(function(report) {
////                        console.log(report);
//                        if (report != 'null'){
//                            $scope.checked0 = report.checked;
//                            $scope.showStudy = true;
//                            // For refreshing Firefox's cache (new Date)
//                            $scope.miniScreens.rightCC = report.rightCC.replace("./public/",'') + '?t=' + new Date().getTime();
//                            $scope.miniScreens.leftCC = report.leftCC.replace("./public/",'') + '?t=' + new Date().getTime();
//                            $scope.miniScreens.rightMLO = report.rightMLO.replace("./public/",'') + '?t=' + new Date().getTime();
//                            $scope.miniScreens.leftMLO = report.leftMLO.replace("./public/",'') + '?t=' + new Date().getTime();
//    //                        if ($scope.acrDensityR == "type1")
//                                $scope.acrDensityR = "type" + report.acrDensityR;
//    //                        if ($scope.acrDensityL == "type1")
//                                $scope.acrDensityL = "type" + report.acrDensityL;
//                            $scope.qualityR = report.qualityR;
//                            $scope.qualityL = report.qualityL;
//                            $scope.acrConclusionR = 'type' + report.acrConclusionR;
//                            $scope.acrConclusionL = 'type' + report.acrConclusionL;
//                            $scope.globalAcr = 'type' + report.globalAcr;
//                            if (report.globalAcr > 2){
//                                $scope.currentRecommendation = $scope.recommendations[$scope.recommendations.length-1];
//                                }
//                            
//                            $scope.annotationsR = report.annotationsR;
//                            $scope.annotationsL = report.annotationsL;
//                            report.annotationsR.forEach(function(annotation){
//                                Annotation.getAnnotation({
//                                    id: annotation
//                                })
//                                .then(function(info){
//                                    $scope.annotationsRInfo.push(info);
//                                });
//                            });
//                            
//                            report.annotationsL.forEach(function(annotation){
//                                Annotation.getAnnotation({
//                                    id: annotation
//                                })
//                                .then(function(info){
//                                    $scope.annotationsLInfo.push(info);
//                                });
//                            });
//                            
//                            report.causesR.forEach(function(cr){
//                                switch(cr){
//                                        case "Positionnement":
//                                            $scope.causesR[0].checked=true;
//                                        break;
//                                        case "Artéfact":
//                                            $scope.causesR[1].checked=true;
//                                        break;
//                                        case "Contraste":
//                                            $scope.causesR[2].checked=true;
//                                        break;
//                                        case "Compression":
//                                            $scope.causesR[3].checked=true;
//                                        break;
//                                        case "Problème tech/physique":
//                                            $scope.causesR[4].checked=true;
//                                        break;
//                                        case "Autre":
//                                            $scope.causesR[5].checked=true;
//                                        break;
//                                }
//                            });
//                            
//                            report.causesL.forEach(function(cl){
//                                switch(cl){
//                                        case "Positionnement":
//                                            $scope.causesL[0].checked=true;
//                                        break;
//                                        case "Artéfact":
//                                            $scope.causesL[1].checked=true;
//                                        break;
//                                        case "Contraste":
//                                            $scope.causesL[2].checked=true;
//                                        break;
//                                        case "Compression":
//                                            $scope.causesL[3].checked=true;
//                                        break;
//                                        case "Problème tech/physique":
//                                            $scope.causesL[4].checked=true;
//                                        break;
//                                        case "Autre":
//                                            $scope.causesL[5].checked=true;
//                                        break;
//                                }
//                            });
//                            
//                            $scope.changeDensityOrRecommendation();
//                        }
//                        else{
//                            $scope.showStudy = false;
////                            console.log("No report");
//                        }
//                    });
//                }
//                else
//                    console.log("Wrong directory name");
//
//            });
//        });
    };
    
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    
    $(document).ready(function() {
        $('#pop').popover('show');
    });

    $(document).on('click', function(e) {
        $('#pop').popover('hide');
    });
    
    $(function() {
        $("#img1").change(function() {
            if ($("#img1")[0].checked)
                $('#divbck1').addClass("bckgrd");
            else
                $('#divbck1').removeClass("bckgrd");
        });
        $("#img2").change(function() {
            if ($("#img2")[0].checked)
                $('#divbck2').addClass("bckgrd");
            else
                $('#divbck2').removeClass("bckgrd");
        });
        $("#img3").change(function() {
            if ($("#img3")[0].checked)
                $('#divbck3').addClass("bckgrd");
            else
                $('#divbck3').removeClass("bckgrd");
        });
        $("#img4").change(function() {
            if ($("#img4")[0].checked)
                $('#divbck4').addClass("bckgrd");
            else
                $('#divbck4').removeClass("bckgrd");
        });
        $("#img5").change(function() {
            if ($("#img5")[0].checked)
                $('#divbck5').addClass("bckgrd");
            else
                $('#divbck5').removeClass("bckgrd");
        });
    });
    
    $scope.$on('$locationChangeStart', function(event) {
        $('[data-toggle="tooltip"]').tooltip('hide');
    });
    

}]);
