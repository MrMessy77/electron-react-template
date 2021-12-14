import dva from 'dva';
import { createHashHistory } from 'history';
import routerConfig from "./router";
import models from "./models";
// 引用iconfont
import 'animate.css';

const app = dva();
if (!window.__static) {
  window.__static = __static;
  window.__locale = "static";
} else {
  window.__locale = __static;
}

models.map(m => {
  app.model(m);
})

app.router(routerConfig);
app.start('#app', {
  history: createHashHistory(),
});