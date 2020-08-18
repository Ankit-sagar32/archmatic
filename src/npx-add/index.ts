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

export default function (options: any): Rule {
  return chain([
    generateRepo(options),
    schematic('npx-idp-schematic', { ...options }),
    schematic('npx-global-handler', { ...options }),
    schematic('npx-add-analytics', { ...options }),
    (_tree: Tree, context: SchematicContext) => {
      setupOptions(_tree, options);
      console.log('Inside Templates');
      const movePath = normalize(options.path + '/app');
      const templateSource = apply(url('./templates'), [
        applyTemplates({
          classify,
          dasherize,
          ...options
        }),
        renameTemplateFiles(),
        move(movePath)
      ]);

      const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
      addModuleDependencies(_tree, options);
      return rule(_tree, context);
    }
  ]);
}
