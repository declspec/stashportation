import angular from 'angular';

import { CutFilter } from './filters/cut';

const lib = angular.module('core-ui.lib', [])
    .filter('cut', () => CutFilter)
    .filter('raw', [ '$sce', (sce) => sce.trustAsHtml ])
    .filter('urlsafe', () => encodeURIComponent);

export default lib.name;