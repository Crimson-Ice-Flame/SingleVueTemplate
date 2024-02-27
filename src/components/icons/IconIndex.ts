// import DocumentationIcon from './IconDocumentation.vue'
// import ToolingIcon from './IconTooling.vue'
import EcosystemIcon from './IconEcosystem.vue'
// import CommunityIcon from './IconCommunity.vue'
// import SupportIcon from './IconSupport.vue'
import ReportIcon from './IconReport.vue'
import HomeIcon from './IconHome.vue'
import { NIcon } from 'naive-ui'

export const PageIconMap = new Map<string, any>([
    ['Page_Home', HomeIcon],
    ['Page_Permission_Management', EcosystemIcon],
    ['Page_Navigate_Web_Management', ReportIcon],
]);

export function renderIcon(target: string) {
  const icon = PageIconMap.get(target);
  return icon ? () => h(NIcon, null, { default: () => h(icon) }) : undefined;
}
