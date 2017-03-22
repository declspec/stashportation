import angular from 'angular';

import { directive } from './directive';

import { CutFilter } from './filters/cut';
import { PluralizeFilter } from './filters/pluralize';
import { ViewLoaderService, ViewLoaderDirective } from './view-loader';

const lib = angular.module('core-ui.lib', [])
    .service('ViewLoaderService', ViewLoaderService)

    .filter('cut', () => CutFilter)
    .filter('pluralize', () => PluralizeFilter)
    .filter('raw', [ '$sce', (sce) => sce.trustAsHtml ])
    .filter('urlsafe', () => encodeURIComponent)

    .directive('uiView', directive(ViewLoaderDirective));

export default lib.name;