/**
 * v-debounce
 * 按鈕防抖指令
 * 接收參數: function 類型
 */
import { useInfoStore } from '@/stores/app';

import type { Directive, DirectiveBinding } from 'vue';
interface ElType extends HTMLElement {
  __handleClick__: () => void;
}

const app = useInfoStore();

const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding<{ callback: () => void; isRecordAPI?: boolean }>) {
    const { callback, isRecordAPI = true } = binding.value;
    const delay = binding.arg ? parseInt(binding.arg) || 30000 : 30000;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (typeof callback !== 'function') {
      throw 'callback must be function';
    }

    el.__handleClick__ = () => {
      el.setAttribute('disabled', '');
      el.classList.add('is-disabled');

      if (timer) {
        clearInterval(timer);
      }
      timer = setTimeout(() => {
        el.removeAttribute('disabled');
        el.classList.remove('is-disabled');
      }, 300);

      app.CHANGE_LOADING(true, delay, isRecordAPI);
      callback();
    };

    el.addEventListener('click', el.__handleClick__);
  },

  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__);
  }
};

export default debounce;
