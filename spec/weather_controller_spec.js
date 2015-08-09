describe('WeatherController', function() {
  beforeEach(module('weather'));

  var weatherController;
  var httpBackend;
  var scope;

  beforeEach(
    inject(function($injector, $controller, $rootScope, $httpBackend) {
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      weatherController = $controller('WeatherController', {
        $scope: scope
      })
  }));

  afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
  });

  it('weather controller isn\'t null!', function() {
    expect(weatherController).not.toBe(null);
  });

  it('checking default 7 day date range', function() {
    expect(scope.dateRange).toEqual([]);
    var firstDate = scope.firstDate;
    var secondDate = scope.secondDate;
    scope.getDateRange(firstDate, secondDate);
    expect(scope.dateRange.length).toEqual(7);
  });

  it('checking getDateRange with 2 day date range', function() {
    expect(scope.dateRange).toEqual([]);
    var firstDate = new Date();
    var secondDateDay = firstDate.getDate() + 1;
    var secondDate = new Date(new Date().setDate(secondDateDay));
    scope.getDateRange(firstDate, secondDate);
    expect(scope.dateRange.length).toEqual(2);
  });

  it('checking getDateRange with 20 day date range', function() {
    expect(scope.dateRange).toEqual([]);
    var firstDate = new Date();
    var secondDateDay = firstDate.getDate() + 19;
    var secondDate = new Date(new Date().setDate(secondDateDay));
    scope.getDateRange(firstDate, secondDate);
    expect(scope.dateRange.length).toEqual(20);
  });

  // test getdays function

});
