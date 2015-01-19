
var app = angular.module('app', [])

app.controller('KiaOpsController',function($scope,$http) {
    $scope.kia = {};
    $scope.utils = {};

    if (new Date() <= end_date) {
        $scope.dates = getDates(start_date, new Date());
    } else {
        $scope.dates = getDates(start_date, end_date);
    }

    //make selected date the latest one
    $scope.selectedDate = $scope.dates[$scope.dates.length - 1];

    $scope.utils.getKiaData = function() {
     var date = $scope.selectedDate;
     var dateStr = date.getFullYear() + "-" + date.getMonth()+1 + "-" + date.getDate();
     var url = '/AusOpenSocialWEB/ausopenSocial/ausopenStats?date='+dateStr+'&time=23:57';
     var jsonCallback = "&callback=JSON_CALLBACK";
     var myUrl = host+url+jsonCallback;    

     $http.jsonp(myUrl, {timeout: HTTP_TIMEOUT}).
     success(function(data, status, headers, config) {
        if (data){
            var nodes = data.nodedata;
            var kia_data = {};
            for (var i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].node === "KIA X-Car Display") {
                    kia_data = nodes[i];
                    $scope.kia = kia_data;
                    break;
                }
            };
        } else {
            $scope.kia.uuid_dwell = "n/a";
            $scope.kia.uuid_site_busy_hour_nbr = "0";
            console.log("Can't find data");
            alert("The service is currently unavailable. Please try again later.");
        }

    }).
    error(function(data, status, headers, config) {
        console.log("Error can't retrieve data");
    });

    }

    $scope.utils.getKiaData();


    $scope.utils.formatDate = function(date){
        var yyyy = date.getFullYear().toString();                                    
        var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based         
        var dd  = date.getDate().toString();             
        return  (dd[1]?dd:"0"+dd[0]) + '/' + (mm[1]?mm:"0"+mm[0]) + '/' + yyyy;
    };
})




