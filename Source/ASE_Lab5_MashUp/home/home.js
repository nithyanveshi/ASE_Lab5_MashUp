/**
 * Created by rapar on 2/25/2016.
 */
angular.module( 'sample.home', [
        'auth0'
    ])
    .controller( 'HomeCtrl', function HomeController( $scope, auth, $http, $location, store ) {

        $scope.auth = auth;
        $scope.logout = function() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $location.path('/login');
        }

    });
