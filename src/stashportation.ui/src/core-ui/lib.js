import angular from 'angular';

import { directive } from './directive';

import { CutFilter } from './filters/cut';
import { PluralizeFilter } from './filters/pluralize';
import { ViewLoaderService, ViewLoaderDirective } from './view-loader';

import { DefaultDialog } from './dialogs/default';

const lib = angular.module('core-ui.lib', [])
    .service('ViewLoaderService', ViewLoaderService)

    .filter('cut', () => CutFilter)
    .filter('pluralize', () => PluralizeFilter)
    .filter('raw', [ '$sce', (sce) => sce.trustAsHtml ])
    .filter('urlsafe', () => encodeURIComponent)
    .filter('negate', () => ((o) => typeof(o) === 'undefined' ? undefined : !o))

    .controller('DefaultDialog', DefaultDialog)

    .directive('uiView', directive(ViewLoaderDirective));

export default lib.name;