import {
  SchematicContext,
  Tree,
  chain,
  applyTemplates,
  renameTemplateFiles,
  move,
  apply,
  url,
  mergeWith,
  MergeStrategy,
} from '@angular-devkit/schematics';
import { setupOptions } from '../helpers/workspace';
import { normalize } from 'path';


export default function (options: any) {
  return chain([
    (tree: Tree, context: SchematicContext) => {
      setupOptions(tree, options);
      console.log('Inside Templates');
      const movePath = normalize(options.path + '/app');
      const templateSource = apply(url('./templates'), [
        applyTemplates({
          ...options
        }),
        renameTemplateFiles(),
        move(movePath)
      ]);

      const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
      return rule(tree, context);
    }
  ]);
}

