(function(){
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("FormController", FormController);

    function FormController($scope, $location, $rootScope, FormService) {
        $scope.$location = $location;
        var currentUser = $rootScope.user;
        $scope.forms = [];

        $scope.getForms = getForms;
        if (currentUser != null) {
            getForms(currentUser._id);
        }

        $scope.addForm = addForm;
        $scope.selectForm = selectForm;
        $scope.updateForm = updateForm;
        $scope.deleteForm = deleteForm;

        $scope.saveFormId = function (form)
        {
            $rootScope.formId = form._id;
        };

        /* a.	Uses forms model and FormService to create a new forms
         * b.	Adds the new forms to the array of forms*/
        function addForm() {
            if($rootScope.user != null && $scope.form != null) {
                FormService
                    .createFormForUser(currentUser._id, $scope.form)
                    .then(function(newForm) {
                        $scope.forms.push(newForm);
                        console.log("added forms");
                        console.log($scope.forms);
                    });
            }
        }

        /* a.	Uses the index to mark the currently selected forms
         * b.	Updates the forms with the currently selected forms */
        function selectForm(index) {
            document.getElementById('formtitle').value = $scope.forms[index].title;
            $scope.currentForm = $scope.forms[index];
            $scope.isSelected = true;
            console.log("selected forms");
            console.log($scope.currentForm);
        }

        /* a.	Uses forms model and FormService to update the currently selected forms */
        function updateForm() {
            if($scope.currentForm != null) {//selected
                $scope.currentForm.title = $scope.form.title;
                console.log("start updating:");
                console.log($scope.currentForm);
                FormService
                    .updateFormById($scope.currentForm._id, $scope.currentForm)//userId, forms
                    .then(function(updatedForm) {
                        console.log("updated forms");
                    });
                $scope.currentForm = null;
            }
            getForms(currentUser._id);
        }

        /* a.	Uses the FormService to remove the forms by index */
        function deleteForm(index) {
            var formId = $scope.forms[index]._id;
            FormService
                .deleteFormById(formId)
                .then(function(forms) {
                    getForms(currentUser._id);
                    console.log("deleted forms");
                });
        }

        function getForms(userId){
            FormService
                .findAllFormsForUser(userId)
                .then(function(updateForms) {
                    $scope.forms = updateForms;
                    console.log($scope.forms);
                });
        }
    }
})();