import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  url,
  applyTemplates,
  renameTemplateFiles,
  move,
  MergeStrategy,
  schematic,
  externalSchematic,
  noop,
} from '@angular-devkit/schematics';
import { normalize } from 'path';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { addModuleDependencies, setupOptions } from '../helpers/workspace';
import { NodeDependency, NodeDependencyType } from 'schematics-utilities';
import { addPackageJsonDependencies } from '../helpers/package-dependencies';


function generateRepo(options: any): Rule {
  const { name } = options;
  return options && options.isNewProject ?
    externalSchematic('@schematics/angular', 'ng-new', {
      name,
      version: '9.0.0',
      directory: name,
      routing: false,
      style: 'scss',
      inlineStyle: false,
      inlineTemplate: false
    }) : noop();
}


function addLoggingDependency(): Rule {
  const dependencies: NodeDependency[] = [];
  dependencies.push({ type: NodeDependencyType.Dev, version: '~4.1.9', name: 'ngx-logger' });
  return addPackageJsonDependencies(dependencies);
}


export default function (options: any): Rule {
  return chain([
    generateRepo(options),
    addLoggingDependency(),
    schematic('npx-idp-schematic', { ...options }),
    schematic('npx-global-handler', { ...options }),
    schematic('npx-add-analytics', { ...options }),    
    (_tree: Tree, context: SchematicContext) => {
      setupOptions(_tree, options);
      const movePath = normalize(options.path + '/app');
      const { serverLoggingUrl } = options;
      const templateSource = apply(url('./templates'), [
        applyTemplates({
          classify,
          dasherize,
          serverLoggingUrl,
          ...options
        }),
        renameTemplateFiles(),
        move(movePath)
      ]);

      const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
      
      addModuleDependencies(_tree, options);
      return rule(_tree, context);
    },
     externalSchematic('@oktadev/schematics', 'add-auth', options) 
  ]);
}
