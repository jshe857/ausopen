var host = "http://168.1.79.218:9080";
var HTTP_TIMEOUT = 10000; //10s
var start_date = new Date(2015, 0, 19);
var end_date = new Date(2015,1,1);

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}