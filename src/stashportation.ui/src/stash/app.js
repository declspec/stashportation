import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngModalDialog from 'lib/ng-modal-dialog';
import coreUi from 'core-ui/lib';
import core from 'core/lib';

import 'styles/stash.scss';

// Config
import { RouteConfig } from './config/routes';

// Components
import { directive } from 'core-ui';
import { MarkdownFilterProvider } from './filters/markdown';
import { CodeEditorDirective } from './directives/code-editor';

// Views
import { EditView } from './views/edit';
import { ViewView } from './views/view';

// Services
import { StashService } from './services/stash';

const app = angular.module('stash.app', [ uiRouter, core, coreUi, ngModalDialog ])
    .config(RouteConfig)

    .controller('EditView', EditView)
    .controller('ViewView', ViewView)

    .filter('markdown', MarkdownFilterProvider)
    .directive('codeEditor', directive(CodeEditorDirective))

    .service('StashService', StashService);

export default app.name;
