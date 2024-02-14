import type { App } from 'vue';
import debounce from './modules/debounce';
// import permission from './modules/permission';

const directiveList: any = {
  debounce,
  // permission
};

const directives = {
  // 註冊自定義的 directives
  install: function (app: App<Element>) {
    Object.keys(directiveList).forEach(key => {
      app.directive(key, directiveList[key]);
    });
  }
};

export default directives;
