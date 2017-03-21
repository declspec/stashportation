import angular from 'angular';

import { CutFilter } from './filters/cut';
import { PluralizeFilter } from './filters/pluralize'

const lib = angular.module('core-ui.lib', [])
    .filter('cut', () => CutFilter)
    .filter('pluralize', () => PluralizeFilter)
    .filter('raw', [ '$sce', (sce) => sce.trustAsHtml ])
    .filter('urlsafe', () => encodeURIComponent);

export default lib.name;