import { chain, Tree, SchematicContext } from "@angular-devkit/schematics";
import { analyticsFactory } from "./src/analytics.factory";
import { AnalyticsEnum } from "./src/analytics.enum";

export function addAnalytics(options: any) {

  return chain([
    (tree: Tree, context: SchematicContext) => {
      context.logger.info('TrackingId: UA-' + options.trackingId);
      const analytics: string = options.analytics;
      analyticsFactory(AnalyticsEnum[analytics as keyof typeof AnalyticsEnum], tree, options);
      return tree;
    }
  ]);
}