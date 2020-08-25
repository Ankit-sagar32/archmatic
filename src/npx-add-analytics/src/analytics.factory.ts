import { AnalyticsEnum } from "./analytics.enum";
import { Tree } from "@angular-devkit/schematics";

export function analyticsFactory(analytics: any, tree: Tree, options: any): Tree | void {

    switch (analytics) {
        case AnalyticsEnum.GoogleAnalytics:
            const { trackingId } = options;
            const content: Buffer | null = tree.read("src/index.html");
            let strContent: string = '';
            if (content) strContent = content.toString();
            const appendIndex = strContent.indexOf('</body>');
            const content2Append = `
    <!--************ Google Analytics Starts **************-->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-175460377-2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());          
        gtag('config', 'UA-${trackingId}'); 
    </script>
    <!--************ Google Analytics Ends ****************-->
            ` ;
            const updatedContent = strContent.slice(0, appendIndex) + content2Append + "\n" + strContent.slice(appendIndex);

            tree.overwrite("src/index.html", updatedContent);
            return tree;
    }
}