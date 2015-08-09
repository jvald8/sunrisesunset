angular.module('weather', ['ui.bootstrap'])
.controller('WeatherController', function($scope, $http) {
  // toggle defaults

  $scope.firstDate = '';
  $scope.secondDate = '';

  $scope.millisecondsInADay = 86400000;

  ($scope.today = function() {
    $scope.secondDate = new Date();
  })();

  ($scope.lastWeek = function() {
    $scope.firstDate = new Date(Date.parse($scope.secondDate) - ($scope.millisecondsInADay * 6));
  })();

  $scope.dayData = [];

  $scope.dateRange = [];

  $scope.getDateRange =  function(firstDate, secondDate){

    var days = Math.round((secondDate - firstDate)/$scope.millisecondsInADay);

    for(var i = 0; i <= days; i++) {
      var newDate = new Date(Date.parse(firstDate) + ($scope.millisecondsInADay * (i))).toFormattedString();
      $scope.dateRange.push(newDate);
    }

  }

  // init geocoder
  $scope.geocoder = new google.maps.Geocoder();

  // default is my address
  $scope.address = '3580 SE Tibbets Rd.';

  $scope.latAndLong = {};

  // getting and setting the longitudes and latitudes.
  $scope.fetchInfo = function(address, firstDate, secondDate) {
    $scope.geocoder.geocode({'address':$scope.address}, function(results, status) {
      $scope.latAndLong.longitude = results[0].geometry.location.G;
      $scope.latAndLong.latitude = results[0].geometry.location.K;

      $scope.getDateRange(firstDate, secondDate);

      var dateRange = $scope.dateRange;

      $scope.dayData = [];

      for(var i = 0; i < dateRange.length; i++) {
        var url = 'http://api.sunrise-sunset.org/json?lat=' + $scope.latAndLong.latitude + '&lng=' + $scope.latAndLong.longitude + '&date='+ $scope.dateRange[i] +'&callback=JSON_CALLBACK';
        var date = dateRange[i];
        $scope.getDay(url, date);
      }

      $scope.dateRange = [];
    })
  };


  $scope.getDay = function(url, date) {
    $http.jsonp(url)
    .success(function(data, status, headers, config) {
      var nautical_twilight_end = data.results.nautical_twilight_end;
      var solar_noon = data.results.solar_noon;

      var rfNauticalAfternoon = getTimeDifference(solar_noon,nautical_twilight_end)

      $scope.dayData.push({data: data, date: date, rfNauticalAfternoon: rfNauticalAfternoon})
    })
    .error(function(data, status, headers, config) {
      console.log('theres been an error calling /days')
    })
  }

  // instantiate with a past week of stuff
  $scope.fetchInfo($scope.address, $scope.firstDate, $scope.secondDate);

  //toggle function
  $scope.showDays = true;
  $scope.showOneDay = false;

  $scope.toggleDays = function() {
    $scope.showDays = !$scope.showDays;
    $scope.showOneDay = !$scope.showOneDay;
  }

  $scope.getCurrentDay = function(day) {
    $scope.currentDay = day;

  }

  $scope.goToDay = function(day) {
    $scope.getCurrentDay(day);
    $scope.toggleDays();
  }

  // table sorting!!!
  $scope.predicate = 'date';
  $scope.reverse = false;
  $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
  };
})

// modifying object prototypes to get formatted dates.

String.prototype.padLeft = function (length, character) {
    return new Array(length - this.length + 1).join(character || ' ') + this;
};

Date.prototype.toFormattedString = function () {
    return [String(this.getMonth()+1).padLeft(2, '0'),
            String(this.getDate()).padLeft(2, '0'),
            String(this.getFullYear()).substr(2, 2)].join("/");
};


// helper functions
function getSecondsElapsed(timeString) {
  var indexOfFirstColon = timeString.indexOf(':', 0);
  var indexOfSecondColon = timeString.indexOf(':', indexOfFirstColon + 1);
  var indexOfFirstSpace = timeString.indexOf(' ', 0);

  var hours = parseInt(timeString.substring(0, indexOfFirstColon));
  var minutes = parseInt(timeString.substring(indexOfFirstColon + 1, indexOfSecondColon))
  var seconds = parseInt(timeString.substring(indexOfSecondColon + 1, indexOfFirstSpace))

  var secondElapsed = seconds + (minutes * 60) + (hours * 60 * 60);

  var secondsIn12Hours = 12 * 60 * 60;

  if(timeString.substring(timeString.length - 2, timeString.length) === 'PM') {
    secondElapsed += secondsIn12Hours;
  }
  return secondElapsed;
}

function getTimeDifference(time1, time2) {
  var seconds = Math.abs(getSecondsElapsed(time2) - getSecondsElapsed(time1));
  var hours = Math.floor(seconds/3600);
  var seconds = seconds % 3600;
  var minutes = Math.floor(seconds/60);
  var seconds = seconds % 60;

  if(hours < 10) {
    hours = '0' + hours;
  }

  if(minutes < 10) {
    minutes = '0' + minutes;
  }

  if(seconds < 10) {
    seconds = '0' + seconds;
  }

  var result = hours + ':' + minutes + ':' + seconds;

  return result;

}


