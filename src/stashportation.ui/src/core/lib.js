import { WebApiService } from './web-api';

const lib = angular.module('core.lib', [])
    .service('WebApiService', WebApiService);

export default lib.name;