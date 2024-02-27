/**
 * v-permission
 * 權限指令
 * 接收參數: string、boolean 類型
 */

import { getPermissionID } from '@/utils/permission';

import type { Directive, DirectiveBinding } from 'vue';

interface ElType extends HTMLElement {
  __handleClick__: (e: any) => void;
}

const create = (el: ElType, binding: DirectiveBinding) => {
  el.__handleClick__ = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const noPermission = () => {
    // @ts-ignore
    el.setAttribute('title', '沒有權限請聯絡管理員');
    el.setAttribute('limit', '');
    el.classList.add('limit');
    el.addEventListener('click', el.__handleClick__, { capture: true });
  };

  if (typeof binding.value == 'string') {
    const key = binding.value.split(':')[0];
    const fn = binding.value.split(':')[1];

    if (key && fn) {
      const permissionID = getPermissionID(key, fn);
      if (permissionID === undefined) {
        noPermission();
      }
    } else {
      throw new Error('value格式錯誤,格式為"Target:FUNCTION"');
    }
  } else if (typeof binding.value == 'boolean') {
    if (binding.value === false) {
      noPermission();
    }
  } else {
    throw new Error('value類型錯誤,應給予string類型,格式為"Target:FUNCTION"');
  }
};

const restore = (el: ElType, binding: DirectiveBinding) => {
  el.removeAttribute('title');
  el.removeAttribute('limit');
  el.classList.remove('limit');
  el.removeEventListener('click', el.__handleClick__, { capture: true });
};

const permission: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    create(el, binding);
  },

  updated(el: ElType, binding: DirectiveBinding) {
    create(el, binding);
  },

  beforeUpdate(el: ElType, binding: DirectiveBinding) {
    restore(el, binding);
  },

  beforeUnmount(el: ElType, binding: DirectiveBinding) {
    restore(el, binding);
  }
};

export default permission;
