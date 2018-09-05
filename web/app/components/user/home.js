var origin = document.location.origin,
	partial_path =  origin + '/partials/opuser/',

	profile = angular.module('profile', ['ui.router']);
var photosTemplateUrl = Routing.generate('get_user_static_template', {'templateName': 'images-gallery', '_format':'html'}),
	InfosTemplateUrl	= Routing.generate('get_user_static_template', {'templateName': 'user-infos', '_format':'html'}),
	followersTemplateUrl = Routing.generate('get_user_static_template', {'templateName': 'list-followeds', '_format':'html'});

console.log(photosTemplateUrl);
profile.config(function($stateProvider, $urlRouterProvider, $httpProvider, $interpolateProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
    $urlRouterProvider.otherwise('');

    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XmlHttpRequest'; //make XmlHttpRequest identifiable in symfony
    
    $stateProvider        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('starter', {
            url: '',
             views: {
                '': { templateUrl: partial_path + 'starter.html' },
                'profileInfo@starter'	: { template: $('.profile_3').html() },
                'activity@starter'		: { template: $('.activity_4').html() },
                'form@starter' 			: { template: $('.form_1').html() },
                'news@starter'			: { template: $('.news_5').html() }
            }
        })
        
        // nested list with custom controller
        .state('infos', {
            url: '/infos',
            templateUrl: InfosTemplateUrl,
            controller: 'infosCtrl'
            // resolve : Resolver

        })

        // nested list with custom controller
        .state('photos', {
            url: '/photos',
            templateUrl: photosTemplateUrl
        })
        
        // nested list with just some random string data
        .state('followers', {
            url: '/followers',
            templateUrl: followersTemplateUrl
        })

        // nested list with custom controller
        .state('opinions', {
            url: '/opinions',
            templateUrl: partial_path + 'about.html'
        })

        // nested list with just some random string data
        .state('followers.friends', {
            url: '/followers/friends',
            template: 'I could sure use a drink right now.'
        })

        // nested list with just some random string data
        .state('followers.followeds', {
            url: '/followers/followeds',
            template: 'I could sure use a drink right now.'
        })
});
profile.run(function($rootScope, $state) {
    // $rootScope.$on('', function() {
    //     $state.transitionTo('demologin');
    // });
});
profile.controller('infosCtrl', ['$rootScope', '$scope', '$http', '$q', '$timeout', infosCtrl]);

function infosCtrl($rootScope, $scope, $http, $q, $timeout) {

	var url = 'http://opinion.comapp_dev.php/derlish@yahoo.fr/about';
	$http.get(url).success(function(data){
		$scope.infos = data.infos;
		console.log($scope.infos);
    	// $scope.others = data.others;
	});    
}

var Resolver = {
    datasets: function($q, $http, $stateParams) {
        var deferred = $q.defer();
        $http.get(this.templateUrl($stateParams)).success(function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }
}