import router from '@/router'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type { LoginRep } from '@/models/api/login';
import { apiRefreshToken } from '@/apis/login';

interface Auth {
  isLogin: boolean,
  toRoute: string,
  account: string | null,
  permissions: permission[]
}

type permission = {
  label: string,
  name?: string,
  children: permission[];
}

export const appAuthStore = defineStore('auth',{
  //定義狀態初始值
  state: ():Auth => ({ 
    isLogin: false,
    toRoute: '',
    account: null,
    permissions: []
  }),
  //對狀態加工的 getters，如同 computed
  getters: {
    getUserAccount(): string {
      return this.account || localStorage.getItem('account') || '';
    },
  },
  //定義使用到的函式，可以為同步和非同步，如同 method
  actions: {
    SET_TO_ROUTE(name: string) {
      this.toRoute = name
    },
    REMOVE_LOCAL_DATA() {
      localStorage.removeItem('token');
      localStorage.removeItem('timestamp');
      localStorage.removeItem('account');
    },
    LOGIN(rep :LoginRep){
      // this.permissions = [
      //   {label: '導航A', name: 'board', children: []},
      //   {label: '導航B', children: []}
      // ]
      this.isLogin = true;
      this.SET_TO_ROUTE('/dashboard/index'); // 保留 websocket 連接完成後要跳轉的頁面
      this.SAVE_TOKEN(rep.access_token); // 儲存 Token
      // dispatch('webSocket/INIT_WEBSOCKET', null, { root: true }); // 初始化 websocket
    },
    LOGOUT() {
      this.REMOVE_LOCAL_DATA();
      this.isLogin = false;
      router.push({ name: 'login' });
    },
    SAVE_TOKEN(token: string){
      localStorage.setItem('token', token);
      localStorage.setItem('timestamp', String(dayjs().valueOf()));
    },
    REFRESH_TOKEN() {
      return new Promise(resolve => {
        apiRefreshToken().then(res => {
          if (res.status === 1) {
            this.SAVE_TOKEN(res.result.access_token);
            resolve(true);
          } else {
            console.log('Logout!!!! REFRESH_TOKEN Error');
            this.LOGOUT();
            resolve(false);
          }
        });
      });
    },
    async CHECK_TOKEN() {
      if (localStorage.getItem('token') && localStorage.getItem('timestamp')) {
        const idleTime = dayjs().diff(Number(localStorage.getItem('timestamp')), 'minutes');
        // console.log(`距離上次token刷新時間: ${idleTime} 分鐘`);
  
        // 距離上次token刷新時間大於或等於30分鐘
        if (idleTime >= 30) {
          // @ts-ignore
          // showNotification(i18n.global.t('Notice'), i18n.global.t('Idle_Error'), 'warning');
          console.log('Logout!!!! token刷新時間大於或等於30分鐘');
          this.LOGOUT();
        }
  
        // 距離上次token刷新時間超過或等於25分鐘小於30分鐘
        // if (idleTime < 30 && idleTime >= 25) {
        //   const refreshOK = await this.REFRESH_TOKEN();
        //   if (!this.isLogin && refreshOK) {
        //   }
        // }
  
        // 距離上次token刷新時間小於25分鐘
        // if (idleTime < 25) {
        //   if (!this.isLogin) {
        //     const refreshOK = await this.REFRESH_TOKEN();
        //     if (refreshOK) {
        //       dispatch('webSocket/INIT_WEBSOCKET', null, { root: true });
        //     }
        //   }
        // }
      }
    }
  }
})