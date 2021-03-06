/**
 * Created by entingwu on 2/18/16.
 */
// helloWorld.js
(function(){

    // add a directive called hello-world
    // to a module called HelloWorldDirective
    angular
        .module("HelloWorldDirective")
        .directive("helloWorld", HelloWorld);
    // helloWorld: one to one mapping to html

    // implement the directive in the following function
    function HelloWorld() {

        // configure the template attributes
        // to be the static "Hello World" string
        // the hello-world element will contain
        // the static string "Hello World"
        return {
            template: "Hello World"
        };
    }
})();