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
import { TagEditorDirective } from './directives/tag-editor';

// Views
import { EditView } from './views/edit';
import { ViewView } from './views/view';
import { SearchQueryView } from './views/search/query';
import { SearchTagView } from './views/search/tag';

// Services
import { StashService } from './services/stash';

const app = angular.module('stash.app', [ uiRouter, core, coreUi, ngModalDialog ])
    .config(RouteConfig)

    .controller('EditView', EditView)
    .controller('ViewView', ViewView)
    .controller('SearchQueryView', SearchQueryView)
    .controller('SearchTagView', SearchTagView)

    .filter('markdown', MarkdownFilterProvider)
    .directive('codeEditor', directive(CodeEditorDirective))
    .directive('tagEditor', directive(TagEditorDirective))

    .service('StashService', StashService);

export default app.name;
