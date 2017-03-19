
// Can't @inject functions
RouteConfig.$inject = [ '$stateProvider','$urlRouterProvider','$locationProvider','$urlMatcherFactoryProvider' ];

export function RouteConfig(stateProvider, urlRouterProvider, locationProvider, urlMatcherFactoryProvider) {
    locationProvider.html5Mode(true);
    urlMatcherFactoryProvider.caseInsensitive(true);

    stateProvider
        .state('new', {
            url: '/new',
            controller: 'EditView',
            controllerAs: 'vm',
            templateUrl: require('../views/edit.html')
        })
        .state('edit', {
            url: '/edit/:id',
            params: { id: { value: null, type: 'int' }, stash: null },
            controller: 'EditView',
            controllerAs: 'vm',
            templateUrl: require('../views/edit.html')
        });
        

    urlRouterProvider.otherwise('/new');
}