/**
 The MIT License (MIT)

 Copyright (c) 2015 Mike Godfrey

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

angular.module('piechart', [])

  .constant('piechartConfig', {
    radius: 10
  })

  .controller('PiechartController', ['$scope', '$attrs', 'piechartConfig', function($scope, $attrs, piechartConfig) {
    var slices;
    var getArc = function(startAngle, endAngle) {
      function convertToRadians(angle) {
        return angle * (Math.PI / 180);
      };

      function getPointOnCircle(angle) {
        return {
          x: Math.cos(angle),
          y: Math.sin(angle)
        };
      };

      var midAngle = startAngle + (((endAngle || 360) - startAngle) / 2);

      return {
        start: getPointOnCircle(convertToRadians(startAngle)),
        mid: getPointOnCircle(convertToRadians(midAngle)),
        end: getPointOnCircle(convertToRadians(endAngle))
      };
    };

    this.slices = slices = [];

    this.addSlice = function(sliceScope) {
      var that = this;

      slices.push(sliceScope);
      sliceScope.$on('$destroy', function() {
        that.removeSlice(sliceScope);
      })

    };

    this.removeSlice = function(sliceScope) {
      slices.splice(slices.indexOf(sliceScope), 1);
      this.setArcs();
    };

    this.setArcs = function() {
      var prevStartAngle = 0;
      var totalValue = 0;

      $scope.radius = angular.isDefined($attrs.radius) ? $scope.$eval($attrs.radius) : piechartConfig.radius;

      angular.forEach(slices, function(slice) {
        totalValue += slice.value;
      });

      angular.forEach(slices, function(slice) {
        slice.arc = getArc(
          prevStartAngle,
          prevStartAngle = (prevStartAngle + (360 / (totalValue / slice.value))) % 360
        );
        slice.arc.large = slice.value > (totalValue / 2);
      });
    };
  }])

  .directive('piechart', function() {
    return {
      restrict: 'EA',
      replace: true,
      controller: 'PiechartController',
      templateUrl: 'templates/piechart.html',
      transclude: true,
      scope: {
        radius: '@'
      }
    };
  })

  .directive('piechartSlice', function() {
    return {
      restrict: 'EA',
      require: '^piechart',
      replace: true,
      templateNamespace: 'svg',
      templateUrl: 'templates/piechart-slice.html',
      scope: {
        value: '@'
      },
      link: function(scope, element, attrs, ctrl) {
        scope.value = parseInt(scope.value, 10);
        ctrl.addSlice(scope);

        attrs.$observe('value', function(value) {
          scope.value = parseInt(value, 10);
          ctrl.setArcs();
        });
      }
    };
  });
