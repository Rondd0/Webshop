var webshopApp = angular.module('webshopApp', [
    'ngRoute',
    'webshopControllers'
]);

webshopApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'views/home.html',
                controller: 'ProductDetailCtrl'
            }).
            when('/products', {
                templateUrl: 'views/product-list.html',
                controller: 'ProductListCtrl'
            }).
            when('/products/:productId', {
                templateUrl: 'views/product-detail.html',
                controller: 'ProductDetailCtrl'
            }).
            when('/cart', {
                templateUrl: 'views/cart-empty.html'
            }).
            when('/cart/:cartId', {
                templateUrl: 'views/cart.html',
                controller: 'CartCtrl'
            }).
            when('/checkout', {
                templateUrl: 'views/checkout.html',
                controller: 'checkoutCtrl'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }
]);