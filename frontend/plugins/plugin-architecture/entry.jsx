import { useId, useState } from 'react';
import './style.css';

const layers = [
  { id:'host', label:'宿主', title:'固定页面与共享运行时', text:'首页、博客和插件目录由主站提供。插件目录读取已发布插件，宿主提供导航、主题变量和共享 React 运行时。' },
  { id:'plugin', label:'插件', title:'插件文件与加载方式', text:'每个插件包含清单、入口和样式，使用独立的 id 和版本，通过 /p/<id> 访问。module 插件共享宿主 React 运行时；iframe 插件使用沙箱加载。' },
  { id:'publish', label:'发布', title:'上传、发布与版本管理', text:'管理员在管理端上传 ZIP 后保存为草稿，再选择版本发布。插件目录按后台保存的顺序展示当前发布版本。宿主升级不会替换已安装插件。' },
];
export default function PluginArchitecture() {
  const [selected, setSelected] = useState('host');
  const detailId = useId();
  const current = layers.find(layer => layer.id === selected);
  return <section className="par-page" aria-label="快闪插件架构">
    <h1>快闪插件<br /><span>架构说明</span></h1>
    <div className="par-map" role="group" aria-label="选择架构层查看说明">
      {layers.map(layer => <button className={`par-node par-node--${layer.id}`} key={layer.id} type="button" aria-pressed={selected === layer.id} aria-controls={detailId} onClick={() => setSelected(layer.id)}>
        <strong>{layer.label}</strong>
        <span>{layer.id === 'host' ? '首页 / 博客 / 插件目录' : layer.id === 'plugin' ? '清单 / 入口 / 样式' : 'ZIP → 草稿 → 发布'}</span>
        <b aria-hidden="true">{layer.id === 'host' ? '↗' : layer.id === 'plugin' ? '+' : '↑'}</b>
      </button>)}
    </div>
    <div className="par-detail" id={detailId} aria-live="polite" aria-atomic="true"><h2>{current.title}</h2><p>{current.text}</p></div>
  </section>;
}
