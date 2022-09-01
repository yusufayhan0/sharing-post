import { createApp } from "vue";
import App from "./views/App.vue";
import VueFeather from "vue-feather";
import PostForm from "./components/PostForm.vue";
import PostItem from "./components/PostItem.vue";
import PostList from "./components/PostList.vue";
import PostUndo from "./components/Icons/PostUndo.vue";
import Attach from "./components/Icons/Attach.vue";
import axios from "./plugins/axios"
import mitt from 'mitt';
import appMixin from './mixins/app.js'

const app = createApp(App);

// Mixins
[
  appMixin
].forEach((mixin) => {
  app.mixin(mixin)
});

//Components
[
  {name: "VueFeather", value: VueFeather},
  {name: "PostForm", value: PostForm},
  {name: "PostItem", value: PostItem},
  {name: "PostList", value: PostList},
  {name: "PostUndo", value: PostUndo},
  {name: "Attach", value: Attach},
].forEach((componentItem) => app.component(componentItem.name, componentItem.value));

// Propertieses
[
  {key: '$axios', value: axios},
  {key: '$bus', value: mitt()},
].forEach(({key, value}) => {
  app.config.globalProperties[key] = value
})

app.mount("#app");
