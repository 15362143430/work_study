<div data-v-f936ee78="" data-id="5e81d02351882573c2190ad6" itemprop="articleBody" class="article-content"><p>防抖和节流都是对多次频繁触发的处理，但是二者又有很大不同。</p><p>防抖是将多次触发情况变为一次触发，如下图蓝色的圆，准备从左边走到右边，而每次点击按钮都会让其重新回到左边。我们把左到右这段距离比作防抖限制的时间wait，那么每次触发，只要wait时间没有走完，则wait会重新开始计时。</p><p><br></p><p><img title="debounce-ball.gif" alt="debounce-ball.gif" class="lazyload inited loaded" data-src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef357e4d0?imageslim" data-width="587" data-height="70" src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef357e4d0?imageslim"><br></p><p><br></p><p>节流则是将多次触发变为每隔一段时间触发一次。如下图红色的球，每次触发，只要还没走完wait时间，就不会从头开始走。</p><p><br></p><p><img title="throttle-ball.gif" alt="throttle-ball.gif" class="lazyload inited loaded" data-src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef4799e1b?imageslim" data-width="571" data-height="61" src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef4799e1b?imageslim"></p><p><br></p><p>对于防抖函数而言，我们要设置一个timer，作为每次触发时的标杆。</p><p>如下面的流程图所示，当timer存在，说明上一次的wait时间没有走完，需要将timer清空，重新计时。如果timer不存在，就赋值一个timer开始计时，再判断函数是否要立即执行，是的话则执行代码，清空timer，不是的话即开始等待wait时间的结束。如果wait时间还未结束，函数又被触发了，则回到顶部的函数调用，再进行一轮判断。</p><p><img title="防抖函数流程图.jpg" alt="防抖函数流程图.jpg" class="lazyload inited loaded" data-src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef48b8c03?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="692" data-height="900" src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef48b8c03?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"></p><p>节流函数则在函数调用时判断是否走完了wait，是则执行，不是则继续等待。</p><p><img title="节流函数流程图.jpg" alt="节流函数流程图.jpg" class="lazyload inited loaded" data-src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef5a8255d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="610" data-height="471" src="https://user-gold-cdn.xitu.io/2020/3/30/1712b12ef5a8255d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1"></p><p>本篇小文主要是帮自己梳理防抖和节流的不同，以及其中的实现思路。学习过程里一直参看 <a href="https://yuchengkai.cn/docs/frontend/#%E9%98%B2%E6%8A%96" target="_blank" rel="nofollow noopener noreferrer">JS | 前端进阶之道</a> 。为了方便查阅，特将其中的防抖函数实现代码贴在下方。</p><div><div><div><pre code-lang="javascript" class="hljs javascript"><code class="hljs javascript copyable" lang="javascript"><span class="hljs-comment">// 这个是用来获取当前时间戳的</span>
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">now</span>(<span class="hljs-params"></span>) </span>{
  <span class="hljs-keyword">return</span> +<span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>()
}
<span class="hljs-comment">/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */</span>
<span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">debounce</span> (<span class="hljs-params">func, wait = <span class="hljs-number">50</span>, immediate = true</span>) </span>{
  <span class="hljs-keyword">let</span> timer, context, args

  <span class="hljs-comment">// 延迟执行函数</span>
  <span class="hljs-keyword">const</span> later = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> setTimeout(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> {
    <span class="hljs-comment">// 延迟函数执行完毕，清空缓存的定时器序号</span>
    timer = <span class="hljs-literal">null</span>
    <span class="hljs-comment">// 延迟执行的情况下，函数会在延迟函数中执行</span>
    <span class="hljs-comment">// 使用到之前缓存的参数和上下文</span>
    <span class="hljs-keyword">if</span> (!immediate) {
      func.apply(context, args)
      context = args = <span class="hljs-literal">null</span>
    }
  }, wait)

  <span class="hljs-comment">// 这里返回的函数是每次实际调用的函数</span>
  <span class="hljs-keyword">return</span> <span class="hljs-function"><span class="hljs-keyword">function</span>(<span class="hljs-params">...params</span>) </span>{
    <span class="hljs-comment">// 如果没有创建延迟执行函数（later），就创建一个</span>
    <span class="hljs-keyword">if</span> (!timer) {
      timer = later()
      <span class="hljs-comment">// 如果是立即执行，调用函数</span>
      <span class="hljs-comment">// 否则缓存参数和调用上下文</span>
      <span class="hljs-keyword">if</span> (immediate) {
        func.apply(<span class="hljs-keyword">this</span>, params)
      } <span class="hljs-keyword">else</span> {
        context = <span class="hljs-keyword">this</span>
        args = params
      }
    <span class="hljs-comment">// 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个</span>
    <span class="hljs-comment">// 这样做延迟函数会重新计时</span>
    } <span class="hljs-keyword">else</span> {
      clearTimeout(timer)
      timer = later()
    }
  }
}<span class="copy-code-btn">复制代码</span></code></pre></div></div></div><p>节流函数代码也是借鉴 <a href="https://yuchengkai.cn/docs/frontend/#%E8%8A%82%E6%B5%81" target="_blank" rel="nofollow noopener noreferrer">JS | 前端进阶之道</a>，不过只取了部分以实现功能。这里对wait是否走完的判断依据为当前时间和上一次调用时间的差值：</p><div><div><div><pre code-lang="javascript" class="hljs javascript"><code class="hljs javascript copyable" lang="javascript"><span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">throttle</span> (<span class="hljs-params">func, wait</span>) </span>{
  <span class="hljs-keyword">var</span> context, args
  <span class="hljs-comment">// 设置前一个函数被触发的时间戳</span>
  <span class="hljs-keyword">var</span> previous = <span class="hljs-number">0</span>
  <span class="hljs-comment">// 返回给用户调用的回调</span>
  <span class="hljs-keyword">return</span> <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{
    <span class="hljs-keyword">var</span> now = <span class="hljs-keyword">new</span> <span class="hljs-built_in">Date</span>().getTime()
    <span class="hljs-comment">// 首次进入</span>
    <span class="hljs-keyword">if</span> (!previous) previous = now
    <span class="hljs-comment">// 准备context和args</span>
    context = <span class="hljs-keyword">this</span>
    args = <span class="hljs-built_in">arguments</span>
    <span class="hljs-comment">// 计算剩余的时间时长</span>
    <span class="hljs-keyword">var</span> remaining = wait - (now - previous)
    <span class="hljs-comment">// 如果 now 超过了previous + wait，可以执行函数</span>
    <span class="hljs-keyword">if</span> (remaining &lt;= <span class="hljs-number">0</span>) {
      previous = now
      timeout = <span class="hljs-literal">null</span>
      result = func.apply(context, args)
      context = args = <span class="hljs-literal">null</span>}
  }
}<span class="copy-code-btn">复制代码</span></code></pre></div></div></div><p>之前学习节流时，做过一个小练习，也贴<a href="https://codepen.io/emmayxy/full/yLNRMRp" target="_blank" rel="nofollow noopener noreferrer">在此</a>，若有兴趣，可以看看效果，持续点击+按钮即可。</p><p><br></p></div>