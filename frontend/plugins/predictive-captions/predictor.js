import { units } from './prediction.js';

// Small seed corpus, then online learning from this session only. No remote completion.
const seeds = `今天的天气很好。今天我们来讨论这个问题。这个问题需要进一步研究。我们可以一起学习。谢谢大家的支持。接下来我们来看一下。你好很高兴认识你。我想去看看外面的世界。我喜欢用电脑写代码。这个项目可以在浏览器运行。我们正在测试实时字幕。语音识别需要一点时间。明天我们再见。现在开始录音。请打开你的麦克风。人工智能可以帮助我们解决问题。生活中有很多美好的事情。这个方法非常简单。我们需要更多时间。欢迎来到我的网站。\nHello how are you today. Thank you for your help. I would like to learn more about this. We are going to talk about the project. This is a local speech recognition test. The next word is a prediction. I think we can do this together. Welcome to my website. Have a nice day. Let's get started.`;
export class LocalPredictor {
  constructor(language) {
    this.language = language;
    this.table = new Map();
    this.learn(seeds);
  }
  learn(text) {
    const list = units(text, this.language).map(x => x.toLocaleLowerCase());
    for (let i = 1; i < list.length; i++) {
      for (let length = 1; length <= Math.min(i, 4); length++) {
        const key = list.slice(i - length, i).join('|');
        const counts = this.table.get(key) || new Map();
        counts.set(list[i], (counts.get(list[i]) || 0) + 1);
        this.table.set(key, counts);
      }
    }
  }
  next(text) {
    const list = units(text, this.language).map(x => x.toLocaleLowerCase());
    for (let length = Math.min(list.length, 4); length > 0; length--) {
      const counts = this.table.get(list.slice(-length).join('|'));
      if (counts) return [...counts].sort((a, b) => b[1] - a[1])[0][0];
    }
    return ''; // Unknown context: do not fabricate a prediction.
  }
}
