import { createApp } from "vue";
import App from "./views/App.vue";
import VueFeather from "vue-feather";
import PostForm from "./components/PostForm.vue";
import PostItem from "./components/PostItem.vue";
import PostList from "./components/PostList.vue";
import PostUndo from "./components/Icons/PostUndo.vue";
import axios from "./plugins/axios"
import mitt from 'mitt';
import appMixin from './mixins/app.js'

const app = createApp(App);

app.mixin(appMixin)

const emitter = mitt();

[
  {name: "VueFeather", value: VueFeather},
  {name: "PostForm", value: PostForm},
  {name: "PostItem", value: PostItem},
  {name: "PostList", value: PostList},
  {name: "PostUndo", value: PostUndo},
].forEach((componentItem) => app.component(componentItem.name, componentItem.value))

app.config.globalProperties.$axios = { ...axios }
app.config.globalProperties.$bus = emitter;

app.mount("#app");
