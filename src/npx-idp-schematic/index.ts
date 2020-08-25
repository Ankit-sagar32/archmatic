import {
  Rule,
  SchematicContext,
  Tree, chain,
  // externalSchematic,
  noop,
} from '@angular-devkit/schematics';

// import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPackageJsonDependency, NodeDependency, NodeDependencyType } from 'schematics-utilities';


function addPackageJsonDependencies(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {

    const dependencies: NodeDependency[] = [];

    options.authType == 'OKTA' ?
      dependencies.push({ type: NodeDependencyType.Dev, version: '~2.2.0', name: '@oktadev/schematics' }) : null;
    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

export function idpSchematic(options: any): Rule {

  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(options),
    (tree: Tree, context: SchematicContext) => {
      // Not required : Since okta external schematic already installs package
      // context.addTask(new NodePackageInstallTask());
      context.logger.info('Installing');
      return tree;
    }
  ]);
}
