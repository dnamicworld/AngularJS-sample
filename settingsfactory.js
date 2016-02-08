'use strict';

/**
 * @ngdoc service
 * @name clickAndGambleWebApp.SettingsFactory
 * @description
 * # SettingsFactory
 * Factory in the clickAndGambleWebApp.
 */
angular.module('capilleira.clickAndGambleWebApp.services')
  .factory('SettingsFactory', function($q, $http, CONSTANT_VARS) {

    return {

      updateUserSettings: function(settings) {
        var defer = $q.defer();
        $http.post(CONSTANT_VARS.BACKEND_URL + '/auth/settings',
          settings
        ).success(function(updatedSettings) {
          defer.resolve(updatedSettings);
        }).error(function(err) {
          defer.reject(err);
        });
        return defer.promise;
      },
      getUserSettings: function() {
        var defer = $q.defer();
        $http.get(CONSTANT_VARS.BACKEND_URL + '/auth/getsettings').success(function(settings) {
          defer.resolve(settings);
        }).error(function(err) {
          defer.reject(err);
        });
        return defer.promise;
      }

    };
  });
