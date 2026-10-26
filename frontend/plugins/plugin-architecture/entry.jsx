import { useId, useState } from 'react';
import './style.css';

const layers = [
  { id:'host', label:'宿主', title:'一个外壳，保持一致。', text:'首页和博客固定在宿主中。快闪页读取已发布的插件，提供统一导航、主题和共享 React 运行时。' },
  { id:'plugin', label:'插件', title:'每个实验，独立生长。', text:'一个 ZIP 包含清单、入口和样式。可信模块共享宿主运行时；外部页面使用沙箱 iframe。插件有自己的版本和 /p/ 页面。' },
  { id:'publish', label:'发布', title:'上传只是草稿。', text:'在独立管理端上传 ZIP，确认后发布。后台保存版本和顺序，快闪页展示当前发布版本。宿主升级不会替换已安装插件。' },
];
export default function PluginArchitecture() {
  const [selected, setSelected] = useState('host');
  const detailId = useId();
  const current = layers.find(layer => layer.id === selected);
  return <section className="par-page" aria-label="快闪插件架构">
    <h1>页面，<br /><span>自由组装。</span></h1>
    <div className="par-map" role="group" aria-label="选择架构层查看说明">
      {layers.map(layer => <button className={`par-node par-node--${layer.id}`} key={layer.id} type="button" aria-pressed={selected === layer.id} aria-controls={detailId} onClick={() => setSelected(layer.id)}>
        <strong>{layer.label}</strong>
        <span>{layer.id === 'host' ? 'HOME / JOURNAL / PLAYGROUND' : layer.id === 'plugin' ? 'manifest.json + entry + styles' : 'ZIP → 草稿 → 发布'}</span>
        <b aria-hidden="true">{layer.id === 'host' ? '↗' : layer.id === 'plugin' ? '+' : '↑'}</b>
      </button>)}
    </div>
    <div className="par-detail" id={detailId} aria-live="polite" aria-atomic="true"><h2>{current.title}</h2><p>{current.text}</p></div>
  </section>;
}
