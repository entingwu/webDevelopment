(function() {
    "use strict";
    angular
        .module("FormBuilderApp")
        .factory("FieldService", fieldService);

    function fieldService($http, $q) {
        var service = {
            createFieldForForm : createFieldForForm,
            getFieldsForForm : getFieldsForForm,
            getFieldForForm : getFieldForForm,
            updateField : updateField,
            deleteFieldFromForm : deleteFieldFromForm
        };
        return service;

        function createFieldForForm(formId, field) {
            var deferred = $q.defer();
            $http
                .post('/api/assignment/forms/' + formId + '/field', field)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getFieldsForForm(formId) {//retrieve fields
            var deferred = $q.defer();
            $http
                .get('/api/assignment/forms/' + formId + '/field')
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function getFieldForForm(formId, fieldId) {
            var deferred = $q.defer();
            $http
                .get('/api/assignment/forms/' + formId + '/field/' + fieldId)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function updateField(formId, fieldId, field) {
            var deferred = $q.defer();
            $http
                .put('/api/assignment/forms/' + formId + '/field/' + fieldId, field)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteFieldFromForm(formId, fieldId) {
            var deferred = $q.defer();
            $http
                .delete('/api/assignment/forms/' + formId + '/field/' + fieldId)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
    }
})();
