import { Tree, SchematicsException } from "@angular-devkit/schematics";
import { experimental, parseJson, JsonParseMode } from "@angular-devkit/core";
import { addModuleImportToModule } from 'schematics-utilities/dist/cdk';
import { join, normalize } from "path";
/* TODO: Dependency_On : ''
Message:  Workspace is Angular Json file as object  
*/
export function getWorkspace(
  host: Tree,
): { path: string, workspace: experimental.workspace.WorkspaceSchema } {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return {
    path,
    workspace: parseJson(
      content,
      JsonParseMode.Loose,
    ) as {} as experimental.workspace.WorkspaceSchema,
  };
}

export function getProjectPath(tree: Tree, options: any) {
  const { workspace } = getWorkspace(tree);
  let projectPath = './';

  const project = workspace.projects[Object.keys(workspace.projects)[0]];
  projectPath = project.root;

  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  return projectPath;
}

export function setupOptions(host: Tree, options: any): Tree {
  const projectPath = getProjectPath(host, options);
  console.log("Project Path: " + projectPath);
  options.path = join(normalize(projectPath), 'src');
  return host;
}


export function addModuleDependencies(tree: Tree, options: any) {
  const projectPath = getProjectPath(tree, options);
  // add imports to app.module.ts
  console.log('Added Archmatic Module');
  addModuleImportToModule(tree, projectPath + '/src/app/app.module.ts',
    'ArchmaticModule', './plugins/archmatic/archmatic.module');
}

