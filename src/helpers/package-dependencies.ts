import { NodeDependency, addPackageJsonDependency } from "schematics-utilities";
import { Rule, Tree, SchematicContext } from "@angular-devkit/schematics";

export function addPackageJsonDependencies(dependencies: NodeDependency[]): Rule {
    return (host: Tree, context: SchematicContext) => {
        dependencies.forEach(dependency => {
            addPackageJsonDependency(host, dependency);
            // @ts-ignore
            context.logger.log('info', `✅️ Added '${dependency.name}' into ${dependency.type}`);
        });
        return host;
    }
}