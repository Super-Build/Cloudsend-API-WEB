import { defineStore, acceptHMRUpdate } from 'pinia'
import logo from '@/assets/logo.png'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ko from 'element-plus/es/locale/lang/ko'
import ru from 'element-plus/es/locale/lang/ru'
import fr from 'element-plus/es/locale/lang/fr'
import es from 'element-plus/es/locale/lang/es'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import { app, server } from '@/api/config'

const langs = {
  'zh-CN': { name: 'Chinese (Simplified)', value: zhCn, sideBarWidth: '218px' },
  en: { name: 'English', value: en, sideBarWidth: '232px' },
  fr: { name: 'French', value: fr, sideBarWidth: '240px' },
  ko: { name: 'Korean', value: ko, sideBarWidth: '228px' },
  ru: { name: 'Russian', value: ru, sideBarWidth: '238px' },
  es: { name: 'Spanish', value: es, sideBarWidth: '240px' },
  'zh-TW': { name: 'Chinese (Traditional)', value: zhTw, sideBarWidth: '218px' },
}
const defaultLang = 'zh-CN'

export const useAppStore = defineStore({
  id: 'App',
  state: () => ({
    setting: {
      title: '大仙会议后端API',
      logo,
      langs,
      lang: defaultLang,
      locale: langs[defaultLang] ? langs[defaultLang] : langs.en,
      appConfig: {
        web_client: 1,
      },
      rustdeskConfig: {
        id_server: '',
        key: '',
        relay_server: '',
        api_server: '',
      },
    },
  }),

  actions: {
    setLang (lang) {
      this.setting.lang = lang
      this.setting.locale = langs[lang]
      localStorage.setItem('lang', lang)
    },
    changeLang (v) {
      this.setLang(v)
    },
    loadConfig () {
      this.getAppConfig()
      this.loadRustdeskConfig()
    },
    getAppConfig () {
      return app().then(res => {
        this.setting.appConfig = res.data
      })
    },
    async loadRustdeskConfig () {
      const res = await server().catch(_ => false)
      if (res) {
        this.setting.rustdeskConfig = res.data
        const prefix = 'wc-'
        localStorage.setItem(`${prefix}custom-rendezvous-server`, res.data.id_server)
        localStorage.setItem(`${prefix}key`, res.data.key)
        localStorage.setItem(`${prefix}api-server`, res.data.api_server)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
