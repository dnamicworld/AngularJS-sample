'use strict';

/**
 * @ngdoc function
 * @name clickAndGambleWebApp.controller:AccountSettingsCtrl
 * @description
 * # AccountSettingsCtrl
 * Controller of the clickAndGambleWebApp
 */
angular.module('capilleira.clickAndGambleWebApp.controllers')
  .controller('AccountSettingsCtrl', function($scope, $location, $modal, $rootScope, SettingsFactory, AuthFactory) {
    var sanitizeCredentials = function(valueToSanitize) {
       return validator
         .stripLow(validator.escape(validator.trim(valueToSanitize)))
         .replace(/[^\x00-\x7F]/gi, '').replace(/[^\x00-\x80]/gi, '').replace(/\\u/gi, '')
         .replace(/%[0-9]+/gi, '');
     }, validateCredentials = function(credentials) {
       var credentialsValid = false;
       if (credentials.currentPassword.length ||
         credentials.newPassword.length ||
         credentials.confirmPassword.length) {
         if (credentials.newPassword === credentials.confirmPassword && credentials.confirmPassword.length > 0) {
           credentialsValid = true;
           $scope.error = null;
         }else {
           $scope.error = 'New password not confirmed';
         }
       }else {
         credentialsValid = true;
       }
       return credentialsValid;
     };

    $rootScope.$on('accountSettingsCtrl:loadsettings', function() {
       SettingsFactory.getUserSettings().then(function(settingsData) {
          $scope.error = '';
          $scope.feedback = '';
          $scope.settings = settingsData;
        }, function(err) {
          console.log(err);
        });
     });

    $scope.timeZones = [
      {
        value: 0,
        name: 'US/Eastern'
      },
      {
        value: -1,
        name: 'US/Central'
      },
      {
        value: -2,
        name: 'US/Mountain'
      },
      {
        value: -3,
        name: 'US/Pacific'
      },
      {
        value: -4,
        name: 'Alaska'
      },
      {
        value: -6,
        name: 'Hawaii'
      }
    ];

    $scope.takeOdds = function(odds) {
      $scope.settings.odds = odds;
    };

    $scope.saveSettingsChanges = function() {
      $scope.feedback = null;
      $scope.settings.currentPassword = sanitizeCredentials($scope.settings.currentPassword);
      $scope.settings.newPassword = sanitizeCredentials($scope.settings.newPassword);
      $scope.settings.confirmPassword = sanitizeCredentials($scope.settings.confirmPassword);
      if (validateCredentials($scope.settings)) {
        SettingsFactory.updateUserSettings($scope.settings).then(function(data) {
          if (data.passwordChanged) {
            _.assign($scope.settings, {
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            $scope.feedback = 'Settings successfully changed.';
          }
        }, function(err) {
          $scope.error = 'Invalid password.';
          console.log(err);
        });
      }
    };

  });
