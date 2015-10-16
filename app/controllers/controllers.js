var webshopControllers = angular.module('webshopControllers', []);

webshopControllers.service('cartService', function() {
    var cartId = '';
    var products = null;
    var items = null;
    var updated = false;

    return {
        getCartId: function () {
            return cartId;
        },
        setCartId: function(newCartId) {
            cartId = newCartId;
        },
        getProducts: function () {
            return products;
        },
        setProducts: function(updatedProducts) {
            products = updatedProducts;
        },
        getItems: function () {
            return items;
        },
        setItems: function(updatedItems) {
            items = updatedItems;
        },
        getUpdated: function() {
            return updated;
        },
        setUpdated: function(isUpdated) {
            updated = isUpdated;
        }
    };
});

webshopControllers.controller('CarouselImagesCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('http://shop.dev.ittalents.bg/carousel_images').success(function(data) {
            $scope.slides = data;
        });
    }
]);

webshopControllers.controller('ProductTopCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('http://shop.dev.ittalents.bg/top_products').success(function(data) {
            $scope.topProducts = data;
        });
    }
]);

webshopControllers.controller('ProductListCtrl', ['$scope', '$http', 'cartService',
    function ($scope, $http, cartService) {
        $http.get('http://shop.dev.ittalents.bg/products').success(function(data) {
            $scope.products = data;
        });
        $scope.orderProp = 'title';
    }
]);

webshopControllers.controller('ProductDetailCtrl', ['$scope', '$http', '$routeParams', 'cartService',
    function($scope, $http, $routeParams, cartService) {
        var imgsUrl = 'http://shop.dev.ittalents.bg/';
        $http.get('http://shop.dev.ittalents.bg/products').success(function(data) {
            $scope.productId = $routeParams.productId;
            $scope.data = data;
            for (var i=0; i < $scope.data.length; i++) {
                    if (($scope.data[i].id) == $scope.productId) {
                        $scope.product = ($scope.data[i]);
                        $scope.mainImageUrl = imgsUrl + $scope.product.images[0];
                    }
            }
        });
        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imgsUrl + imageUrl;
        };
        $scope.quantity = 1;

        $scope.addToCart = function() {
            var dataObject = {
                product_id: parseInt($routeParams.productId),
                amount : parseInt($("#quantity").val())
            };
            /*console.log(dataObject);*/

            /*Doing the post with jQuery, because of Cross-Origin Resource Sharing reasons*/
            $.post('http://shop.dev.ittalents.bg/cart/add' + cartService.getCartId(), dataObject)
                .success(function(data) {
                    /*Telling the cart that it needs to update*/
                    cartService.setUpdated(false);
                    /*Make cart button to lead to the correct cart*/
                    cartService.setCartId('/' + data.data.id);
                    $("#cartLink").attr("href", "#/cart" + cartService.getCartId());
                });
        };
    }
]);

webshopControllers.controller('CartCtrl', ['$scope', '$http', '$routeParams', 'cartService',
    function($scope, $http, $routeParams, cartService) {
        $http.get('http://shop.dev.ittalents.bg/cart/get/' + $routeParams.cartId).success(function(data) {
            if ((cartService.getProducts() === null && cartService.getItems() === null) || cartService.getUpdated() == false) {

                    cartService.setProducts(data[0].products);
                    cartService.setItems(data[0].items);
                    cartService.setUpdated(true);

                    $scope.products = cartService.getProducts();
                    $scope.items = cartService.getItems();
            } else {
                $scope.products = cartService.getProducts();
                $scope.items = cartService.getItems();
            }

            $scope.totalPrice = function() {
                var total = 0;
                for (var i = 0; i < $scope.products.length; i++) {
                    /*Get the amount of each product and calculate the total*/
                    $scope.products[i].amount = $scope.items[i].amount;
                    total += $scope.products[i].price * $scope.products[i].amount;
                }
                return total;
            };

            $scope.removeProduct = function(product) {
                var r = confirm("Are you sure you want to delete this product?");
                if (r == true) {
                    var i = $scope.products.indexOf(product);
                    $scope.products.splice(i, 1);
                    $scope.items.splice(i, 1);
                }
            };

            $scope.checkout = function() {
                /*console.log($scope.products, $scope.items);*/

                /*Post the products to the cartService*/
                cartService.setProducts($scope.products);
                cartService.setItems($scope.items);

                /*console.log(cartService.getProducts(), cartService.getItems());*/

            };
            /*$scope.created = data[0].created_at;
            $scope.updated = data[0].updated_at;*/
        });
    }
]);

webshopControllers.controller('checkoutCtrl', ['$scope', '$http', '$routeParams', 'cartService',
    function($scope, $http, $routeParams, cartService) {
        $scope.products = cartService.getProducts();
        $scope.items = cartService.getItems();

        $scope.totalPrice = function() {
            var total = 0;
            for (var i = 0; i < $scope.products.length; i++) {
                /*Get the amount of each product and calculate the total*/
                $scope.products[i].amount = $scope.items[i].amount;
                total += $scope.products[i].price * $scope.products[i].amount;
            }
            return total;
        };
    }
]);
