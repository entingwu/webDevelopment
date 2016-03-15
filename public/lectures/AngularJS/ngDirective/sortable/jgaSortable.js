(function(){
    angular
        .module("jgaSortable", [])
        .directive("jgaSortable", jgaSortable);

    function jgaSortable() {
        var start = null;
        var end = null;
        function link(scope, element, attributes) {
            var jgaAxis = attributes.jgaAxis;
            $(element).sortable({
                axis: jgaAxis,
                start: function(event, ui) {
                    start = ui.item.index();
                },
                stop: function(event, ui) {
                    end = ui.item.index();
                    /* swap : modify array */
                    var temp = scope.users[start];
                    scope.users[start] = scope.users[end];
                    scope.users[end] = temp;
                    /* notify anyone who is rendering the array change, update dom */
                    scope.$apply();
                }
            });
        }
        return {
            link: link
        }
    }
})();