/* =============================================================
 * 简历驱动 AI 模拟面试 · 大厂面试官审问式（网页版）
 *  - 内置审问引擎：无需 API Key，开箱即用（层层追问 / 挑战式提问 / STAR 深挖）
 *  - 在线 AI 模式：配置 API Key 后，由大模型全真驱动
 * ============================================================= */
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};

/* ---------- 大模型服务商 ---------- */
var PROVIDERS={
  deepseek:{name:'DeepSeek（推荐，便宜）',base:'https://api.deepseek.com/v1/chat/completions',model:'deepseek-chat'},
  qwen:{name:'通义千问',base:'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',model:'qwen-plus'},
  zhipu:{name:'智谱 GLM',base:'https://open.bigmodel.cn/api/paas/v4/chat/completions',model:'glm-4-flash'},
  kimi:{name:'Kimi 月之暗面',base:'https://api.moonshot.cn/v1/chat/completions',model:'moonshot-v1-8k'},
  openai:{name:'OpenAI',base:'https://api.openai.com/v1/chat/completions',model:'gpt-4o-mini'}
};

var SYSTEM_PROMPT='你是资深大厂嵌入式软件面试官（华为/大疆/字节/小米风格），擅长"审问式"面试：1) 层层追问，抓住一个技术点不断深挖，直到确认真实水平，绝不放过模糊回答；2) 对含糊回答立刻反问"具体怎么实现的？数据是多少？为什么这么做？如果…会怎样？"；3) 用 STAR 法（情境/任务/行动/结果）追问简历项目，验证项目真实性；4) 难度递进：基础概念→深入原理→综合场景→压力题；5) 判断标准：能讲清原理、能量化数据、能说出取舍（trade-off）才算过关。说话简洁、直接、有压迫感但不失礼貌；一次只问一个问题。';

/* ---------- 简历技能识别表 ---------- */
var SKILL_DEFS=[
  {cat:'C 语言',name:'C/C++ 基础',keys:['C语言','c语言','C/C++','c/c++','C++','c++','C基础','嵌入式C','汇编']},
  {cat:'C 语言',name:'指针与内存',keys:['指针','内存管理','malloc','野指针','内存池','链表']},
  {cat:'驱动与外设',name:'STM32/单片机',keys:['stm32','STM32','单片机','MCU','esp32','ESP32','msp430','51单片机','51 单片机','arduino','ARM','Cortex']},
  {cat:'驱动与外设',name:'外设与驱动',keys:['gpio','GPIO','i2c','I2C','spi','SPI','uart','UART','串口','can','CAN','pwm','PWM','adc','ADC','dma','DMA','定时器','中断','看门狗','寄存器','蜂鸣器','按键','电机','舵机']},
  {cat:'RTOS',name:'RTOS/多任务',keys:['freertos','FreeRTOS','rtos','RTOS','uc/os','UCOS','rt-thread','RT-Thread','实时系统','多任务','嵌入式实时']},
  {cat:'RTOS',name:'任务与同步',keys:['信号量','互斥量','消息队列','队列','任务调度','优先级','死锁','临界区','事件组','任务栈']},
  {cat:'嵌入式 Linux',name:'Linux 基础',keys:['linux','Linux','嵌入式linux','嵌入式 Linux','ubuntu','Ubuntu','shell','Shell','vim']},
  {cat:'嵌入式 Linux',name:'驱动与内核',keys:['设备树','内核','字符设备','platform','platform 总线','交叉编译','uboot','U-Boot','文件系统','mmap','内核模块','busybox']},
  {cat:'网络与协议',name:'网络编程',keys:['tcp','TCP','udp','UDP','socket','Socket','网络编程','TCP/IP','tcp/ip','http','HTTP','mqtt','MQTT','lwip','LWIP','modbus','Modbus','485','rs485','RS485','CANopen']},
  {cat:'数据结构与算法',name:'数据结构',keys:['链表','队列','栈','二叉树','树','排序','哈希','递归','算法','复杂度']},
  {cat:'Git 与工具链',name:'Git/构建',keys:['git','Git','GitHub','github','gitee','makefile','Makefile','cmake','CMake','gcc','GCC','keil','Keil','iar','IAR','jlink','J-Link','st-link']},
  {cat:'驱动与外设',name:'硬件调试',keys:['示波器','逻辑分析仪','万用表','串口调试','openmv','OpenMV']},
  {cat:'C 语言',name:'嵌入式 AI',keys:['tinyml','TinyML','tensorflow','TensorFlow','神经网络','python','Python','模型量化','推理']}
];

/* ---------- 各分类核心概念词（用于离线评分） ---------- */
var CONCEPTS={
  'C 语言':['指针','内存','static','volatile','const','宏','链表','栈','堆','位操作','回调','函数指针','结构体','union','联合体','大小端','野指针','malloc','free','编译','链接','数组','字符串','递归'],
  '驱动与外设':['GPIO','中断','DMA','定时器','PWM','ADC','串口','UART','SPI','I2C','CAN','寄存器','时钟','外设','轮询','看门狗','按键','回调','上拉','下拉','滤波','波特率','时钟树'],
  'RTOS':['任务','信号量','互斥量','队列','中断','优先级','死锁','调度','Tick','临界区','栈','时间片','消息','事件','看门狗','空闲任务','上下文切换'],
  '嵌入式 Linux':['进程','线程','内存','设备树','驱动','内核','交叉编译','文件系统','mmap','模块','中断','DMA','同步','锁','字符设备','platform','shell','调试'],
  '网络与协议':['TCP','UDP','三次握手','四次挥手','粘包','阻塞','非阻塞','select','epoll','IP','端口','重传','超时','滑动窗口','socket','校验'],
  '数据结构与算法':['链表','栈','队列','树','排序','复杂度','递归','哈希','查找','二叉树','快排','冒泡'],
  'Git 与工具链':['git','提交','分支','合并','冲突','回滚','Makefile','CMake','编译','静态库','动态库','gdb','调试']
};

/* ---------- 面试官追问模板（回答命中关键词即深挖） ---------- */
var FOLLOWUPS=[
  {kw:'中断',q:'在中断服务函数（ISR）里有哪些绝对不能做的事？为什么？'},
  {kw:'DMA',q:'DMA 和中断、轮询怎么选？DMA 传输完成如何通知 CPU？'},
  {kw:'信号量',q:'信号量和互斥量有什么区别？哪些场景必须用互斥量？'},
  {kw:'互斥量',q:'互斥量和二值信号量的区别？优先级继承（Priority Inheritance）是干什么的？'},
  {kw:'队列',q:'消息队列的深度怎么确定？队列满/空时你一般怎么处理？'},
  {kw:'优先级',q:'优先级反转是怎么发生的？有哪些解决方案？'},
  {kw:'死锁',q:'死锁的四个必要条件是什么？你如何避免死锁？'},
  {kw:'链表',q:'如何判断一个链表是否有环？时间复杂度是多少？'},
  {kw:'排序',q:'快排和归并排序的时间/空间复杂度？什么场景下你会选哪个？'},
  {kw:'malloc',q:'嵌入式开发里为什么尽量少用 malloc？内存碎片如何解决？'},
  {kw:'野指针',q:'野指针和悬空指针有什么区别？分别怎么避免？'},
  {kw:'指针',q:'函数指针怎么用？回调机制相比轮询有什么优势？'},
  {kw:'static',q:'static 修饰局部变量、全局变量、函数分别是什么作用？'},
  {kw:'volatile',q:'volatile 能保证原子性吗？哪些场景必须用 volatile？'},
  {kw:'大小端',q:'如何判断系统是大端还是小端？跨平台通信时字节序怎么处理？'},
  {kw:'栈',q:'任务栈大小怎么确定？栈溢出会有什么后果？如何检测？'},
  {kw:'线程',q:'线程同步有哪些方式？它们分别适合什么场景？'},
  {kw:'进程',q:'进程间通信（IPC）有哪些方式？各有什么优缺点？'},
  {kw:'设备树',q:'设备树的作用是什么？驱动如何从设备树中获取资源？'},
  {kw:'驱动',q:'字符设备驱动的基本框架？file_operations 里的 open/read/write 怎么实现？'},
  {kw:'GPIO',q:'GPIO 配置为输入时要注意什么？上拉/下拉怎么选？按键防抖怎么做？'},
  {kw:'串口',q:'串口波特率误差怎么计算？一帧数据的格式是什么？'},
  {kw:'SPI',q:'SPI 有哪四种模式？怎么区分？和 I2C 相比优缺点是什么？'},
  {kw:'I2C',q:'I2C 的起始/停止/应答时序是怎样的？多主机冲突怎么解决？'},
  {kw:'TCP',q:'三次握手和四次挥手分别解决什么问题？为什么需要三次？'},
  {kw:'UDP',q:'TCP 和 UDP 的区别？如果要实现可靠 UDP，你会怎么设计？'},
  {kw:'socket',q:'阻塞/非阻塞 socket 的区别？select 和 epoll 的区别？'},
  {kw:'任务',q:'FreeRTOS 任务有哪几种状态？任务切换的流程是怎样的？'},
  {kw:'看门狗',q:'看门狗的作用？喂狗代码放在哪里最合适？'},
  {kw:'定时器',q:'定时器溢出中断的重载值怎么计算？'},
  {kw:'PWM',q:'PWM 的频率和占空比怎么计算？'},
  {kw:'ADC',q:'ADC 的分辨率和采样率怎么选？采样数据需要滤波吗？'},
  {kw:'寄存器',q:'操作寄存器一般用哪些位操作技巧？读-改-写要注意什么？'}
];

/* ---------- 综合压力题（第 20 题） ---------- */
var DESIGN_QUESTIONS=[
  {category:'综合',question:'如果给你一块全新的 MCU（比如 STM32F407），从拿到开发板到点亮一个 LED 并跑通串口打印，你会按什么步骤上手？请说出完整思路。',answer:'查数据手册/原理图→搭最小系统→配时钟→配 GPIO→串口调试',explanation:'考察工程方法：先最小系统验证，再逐模块外设，配合调试工具'},
  {category:'综合',question:'让你设计一个可靠的串口通信协议（含帧头、长度、校验、超时重传），你会怎么设计？为什么？',answer:'帧头+长度+CRC+应答+超时重传+粘包/断包处理',explanation:'考察协议设计：帧同步、校验、容错'},
  {category:'综合',question:'你的产品在现场偶发死机/复位，请说出你完整的排查思路。',answer:'复现→查日志/看门狗复位标志→排查电源/内存/栈/干扰→定位代码',explanation:'考察故障定位方法论'},
  {category:'综合',question:'系统运行一段时间后越来越卡，可能是什么原因？怎么定位？',answer:'内存泄漏/句柄泄漏/任务堆积/缓存未释放；用工具监控内存、CPU 占用',explanation:'考察资源管理与排查能力'},
  {category:'综合',question:'一个中断里需要处理大量数据，你会用中断+DMA+队列怎么设计整个数据链路？',answer:'DMA 搬运→中断通知→队列缓冲→任务处理，避免在 ISR 里做重活',explanation:'考察中断/DMA/RTOS 综合设计能力'},
  {category:'综合',question:'如果面试通过，入职后前三个月你会怎么规划自己的学习和产出？',answer:'熟悉代码库/工具链→从简单 bug 入手→独立负责模块→输出文档',explanation:'考察学习能力和稳定性'}
];

/* ---------- 基础工具 ---------- */
function shuffle(a){ for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;} return a; }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function openEnded(q){
  var t=q.question;
  if(q.type==='single'){
    if(/下列|以下|哪个|哪种|选择/.test(t)) return '请直接作答并说明理由：'+t;
    return t;
  }
  if(q.type==='judge') return '请判断对错并说明理由：'+t;
  return t;
}

/* ---------- 简历分析（离线） ---------- */
function extractSkills(text){
  var found=[], seen={};
  SKILL_DEFS.forEach(function(sd){
    for(var i=0;i<sd.keys.length;i++){
      if(text.indexOf(sd.keys[i])>=0 && !seen[sd.name]){ seen[sd.name]=1; found.push({cat:sd.cat,name:sd.name}); break; }
    }
  });
  return found;
}
function analyzeResume(text){
  var skills=extractSkills(text);
  var risks=[];
  var clean=text.replace(/\s+/g,'');
  if(clean.length<200) risks.push('简历内容过于简短，面试官会怀疑项目真实性');
  if(!/\d/.test(text)) risks.push('缺少量化数据（性能/时间/规模/优化比例），说服力不足');
  if(!/(项目|实习|毕设|大赛|竞赛|课程设计)/.test(text)) risks.push('缺少项目/实习经历，无法用 STAR 深挖');
  if(!/(学校|大学|学院|本科|硕士|学历|专业)/.test(text)) risks.push('缺少教育背景信息');
  if(skills.length===0) risks.push('技术关键词过少，无法定位技能栈');
  if(!/(嵌入式|单片机|MCU|C语言|Linux|驱动|RTOS|C\+\+)/.test(text)) risks.push('与目标岗位（嵌入式软件）匹配度低，建议突出相关技能');
  return {skills:skills, risks:risks.map(function(r){return {text:r};})};
}

/* ---------- 题库抽取（Q2-Q19 共 18 道 + Q20 综合题） ---------- */
function buildPool(skills){
  var boost={};
  skills.forEach(function(s){ boost[s.cat]=(boost[s.cat]||0)+1; });
  var plan=[['C 语言',5],['驱动与外设',4],['RTOS',4],['嵌入式 Linux',3],['网络与协议',2],['数据结构与算法',1],['Git 与工具链',1]];
  var pool=[];
  plan.forEach(function(p){
    var cat=p[0], n=p[1]+Math.min(2,boost[cat]||0);
    var arr=QS.filter(function(q){return q.category===cat;});
    shuffle(arr);
    pool=pool.concat(arr.slice(0,Math.min(n,arr.length)));
  });
  shuffle(pool);
  pool=pool.slice(0,18);
  var design=DESIGN_QUESTIONS[Math.floor(Math.random()*DESIGN_QUESTIONS.length)];
  pool.push(design);
  return pool;
}

/* ---------- 离线审问式评分与点评 ---------- */
var VAGUE=/大概|可能|差不多|应该|忘了|不记得|不清楚|不太|了解一点|用过一下|没做过|不会|不确定|也许|记不清|好像|吧/;
function parseJudge(ans){
  var a=(ans||'').trim();
  if(!a) return null;
  var t=a.replace(/\s+/g,'');
  // 0) 含糊表态 / 含“对错”一词：不判定（避免误报“判断正确/错误”）
  if(/不完全正确|不完全对|基本正确|基本对|部分正确|不一定|不好说|分情况|看情况|视情况|各有|对错/.test(t)) return null;
  // 1) 纠正式开头：“正确的是X/正确的说法是X/错误在于X/错在X” → 用户在纠正原句 → 判“错”
  if(/^正确的?(说法|答案|理解|解释|表述|定义|做法|描述|观点)?是/.test(t)) return '错';
  if(/^错误的?(说法|答案|理解|解释|表述|定义|做法|描述|观点)?是|^错误在于|^错在|^错就错在/.test(t)) return '错';
  // 2) 开头明确表态（对/错须后接标点或结尾，避免“对比/错误”误伤）
  if(/^(没错[，。,.！!？?]|没错$|对[，。,.！!？?]|对$|对的|正确[，。,.！!？?]|正确$|完全正确[，。,.！!？?]|完全正确$|是的|是[，。,.！!？?]|√|✓|T[，。,.！!？?]|T$)/.test(t)) return '对';
  if(/^(错[，。,.！!？?]|错$|错的|错误[，。,.！!？?]|错误$|完全错误[，。,.！!？?]|完全错误$|不对|不正确|不是的|不是[，。,.！!？?]|×|✗|F[，。,.！!？?]|F$|非[，。,.！!？?])/.test(t)) return '错';
  // 3) 全文否定/肯定短语（否定优先）
  var cuo2=/不正确|不对|不是的|错误的|说法错误|表述错误|是错的|为错|×|✗/.test(t);
  var dui2=(/正确的|对的|是的|是对的|为对|√|✓/.test(t)) && !cuo2;
  // 4) 独立对/错（跟在判断性动词/名词后、原句/这句话、没错/说错 等）
  var cuo3=/(认为|觉得|判断|感觉|应该|肯定|明显|确实|所以|说法|观点|描述|结论|这个|这|原句|这句话|就是|就|是)(为|得)?错(误|的)?$|(说错|讲错|判断错|认为错误|觉得错误)$/.test(t);
  var dui3=/(认为|觉得|判断|感觉|应该|肯定|明显|确实|所以|说法|观点|描述|结论|这个|这|原句|这句话|就是|就|是)(为)?对(的)?$|(没错|说对|讲对|判断对|认为正确|觉得正确)$/.test(t);
  if(cuo2 || cuo3) return '错';
  if(dui2 || dui3) return '对';
  return null;
}
function scoreAnswer(ans, q){
  if(!ans) return 0;
  var a=ans;
  var score=0;
  var cat=q?q.category:'通用';
  // 1) 核心概念覆盖（正确使用术语才给分）
  var concepts=CONCEPTS[cat]||[];
  var hits=0;
  concepts.forEach(function(c){ if(a.indexOf(c)>=0) hits++; });
  score+=Math.min(5, hits);
  // 2) 判断/选择类题目：真正判断对错
  if(q && q.type==='judge'){
    var j=parseJudge(a);
    if(j===q.answer) score+=3; else if(j) score-=3;
  } else if(q && q.type==='single' && q.options){
    var ci=('ABCD').indexOf(q.answer||'');
    if(ci>=0){
      var opt=String(q.options[ci]||'').replace(/^[A-D][.、]\s*/,'');
      if(opt && (a.indexOf(opt)>=0 || a.indexOf(q.answer)>=0)) score+=3;
    }
  }
  // 3) 表达质量：长度 + 结论先行 + 讲取舍/数据
  score+=Math.min(2, a.length/60);
  if(/^(首先|核心|本质|因为|所以|答|我认为|关键|是的|不是|对|错)/.test(a.trim())) score+=1;
  if(/取舍|权衡|为什么|原因|代价|性能|延迟|内存|复杂度|数据|比如|例如|测试/.test(a)) score+=1;
  if(VAGUE.test(a)) score-=2;
  return Math.max(0, Math.min(10, Math.round(score)));
}
function scoreIntro(ans){
  var a=ans||'';
  var s=Math.min(6, a.length/25);
  var kws=['项目','实习','技术','C','STM32','FreeRTOS','Linux','驱动','岗位','成绩','竞赛','嵌入式','C++'];
  kws.forEach(function(k){ if(a.indexOf(k)>=0) s+=0.5; });
  if(VAGUE.test(a)) s-=1.5;
  return Math.max(0, Math.min(10, Math.round(s)));
}
function pickFollowUp(ans){
  for(var i=0;i<FOLLOWUPS.length;i++){ if(ans.indexOf(FOLLOWUPS[i].kw)>=0) return FOLLOWUPS[i].q; }
  return null;
}
function extractZhuiWen(q){
  if(!q||!q.explanation) return null;
  var m=q.explanation.match(/【面试追问】([^【]*)/);
  return m?m[1].replace(/\s+/g,' ').trim():null;
}
function interviewerNote(q, ans, sc){
  var fw=pickFollowUp(ans)||extractZhuiWen(q);
  var jn='', jcorrect=false;
  if(q && q.type==='judge'){
    var j=parseJudge(ans);
    if(j && j!==q.answer) jn='<br>❌ <b>你的判断错了</b>，正确答案是「'+q.answer+'」。判断类题目要先给结论（对/错），再用原理支撑。';
    else if(j){ jn='<br>✅ 判断正确。'; jcorrect=true; }
    else jn='<br>⚠️ 你没有明确给出判断（对/错）。真实面试官会追问："到底是对还是错？先说结论，再讲原理。"';
  }
  var scTxt='本题得分 <b>'+sc+'/10</b>，';
  if(sc>=8) return {t:'ok', text:scTxt+'回答要点清晰'+(/\d/.test(ans)?'、有数据支撑':'')+'，过关。'+jn, fw:fw?('追问：'+fw):''};
  if(sc>=5) return {t:'mid', text:scTxt+'答到了一些要点，但不够深入、缺少细节。'+jn, fw:fw?('追问：'+fw):'追问：能结合具体实现和数据再讲一遍吗？'};
  if(jcorrect) return {t:'ok', text:scTxt+'判断正确，但理由不够充分，需要补强原理与细节。'+jn, fw:fw?('追问：'+fw):''};
  if(VAGUE.test(ans)) return {t:'no', text:scTxt+'回答太模糊了。真实面试官会立刻挑战你："别用「大概/可能」，说清楚具体怎么实现的、数据是多少。"'+jn, fw:fw?('追问：'+fw):'追问：请重新组织语言，讲清原理与数据。'};
  return {t:'no', text:scTxt+'没有抓住核心考点，需要补强。'+jn, fw:fw?('追问：'+fw):'追问：核心要点是什么？请补充。'};
}
function refAnswer(q){
  if(!q) return '';
  var s='';
  if(q.type==='single' && q.options){
    var ci=('ABCD').indexOf(q.answer||'');
    var opt=ci>=0?String(q.options[ci]||'').replace(/^[A-D][.、]\s*/,''):'';
    s+='正确选项：'+q.answer+' '+(opt||'')+'\n';
  } else if(q.type==='judge'){
    s+='正确答案：'+q.answer+'\n';
  } else {
    s+='参考答案要点：'+String(q.answer||'')+'\n';
  }
  var e=String(q.explanation||'').split('【易错点】')[0].replace('【解析】','').trim();
  if(e) s+=e;
  return s;
}

/* ---------- 在线 AI 客户端（OpenAI 兼容协议） ---------- */
function aiCall(messages){
  var p=PROVIDERS[S.provider];
  return fetch(p.base,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+S.key},body:JSON.stringify({model:p.model,messages:messages,temperature:0.7,max_tokens:1500})})
  .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
  .then(function(d){ var c=d.choices&&d.choices[0]&&d.choices[0].message; if(!c||!c.content) throw new Error('no content'); return c.content; });
}

/* ---------- 状态与渲染 ---------- */
var S={phase:'setup',mode:'offline',pos:'',provider:'deepseek',key:'',step:0,pool:[],answers:[],skills:[],risks:[],text:'',ai:null,pendingQ:''};
var busy=false;

function setPhase(p){
  $('ivSetup').classList.toggle('hidden', p!=='setup');
  $('ivSession').classList.toggle('hidden', p!=='session');
  $('ivReport').classList.toggle('hidden', p!=='report');
}
function addBubble(kind, html){
  var box=$('ivChat');
  var d=document.createElement('div');
  d.className='iv-b '+kind;
  d.innerHTML=html;
  box.appendChild(d);
  box.scrollTop=box.scrollHeight;
}
function showLoading(msg){
  var box=$('ivChat');
  var d=document.createElement('div');
  d.className='iv-loading';
  d.innerHTML='<span class="spinner"></span><span>'+esc(msg)+'</span>';
  box.appendChild(d);
  box.scrollTop=box.scrollHeight;
  return d;
}
function setBusy(b){ busy=b; $('ivSendBtn').disabled=b; }
function showAnswerBox(){
  var n=S.step+1;
  $('ivMeta').textContent='第 '+n+' / 20 题';
  $('ivPbar').style.width=((n-1)/20*100)+'%';
  $('ivSendBtn').disabled=false;
  $('ivAnswer').focus();
}

/* ---------- 提问流程 ---------- */
function nextQuestion(){
  var n=S.step+1;
  if(n===1){
    if(S.mode==='ai' && !S.pendingQ){
      var ld=showLoading('AI 正在提问...');
      aiCall(S.ai.concat([{role:'user',content:'请以面试官身份提出第1个问题：先让应聘者做30秒自我介绍（要求突出技术亮点）。只问这一个问题，不要展开。'}]))
      .then(function(r){ ld.remove(); S.pendingQ=r.trim(); showQ1(); })
      .catch(function(){ ld.remove(); S.mode='offline'; showQ1(); });
    } else showQ1();
  } else {
    var q=S.pool[n-2];
    if(S.mode==='ai' && !S.pendingQ){
      var ld=showLoading('AI 正在提问...');
      aiCall(S.ai.concat([{role:'user',content:'请以面试官身份提出第'+n+'题（方向：'+q.category+'，难度比上一题稍高；若上一题回答有漏洞可优先深挖）。只输出这一道题。'}]))
      .then(function(r){ ld.remove(); S.pendingQ=r.trim(); showQ(q); })
      .catch(function(){ ld.remove(); S.mode='offline'; showQ(q); });
    } else showQ(q);
  }
}
function showQ1(){
  var text=S.pendingQ || '请用 30 秒做自我介绍，重点突出：技术栈、项目亮点、为什么适合这个岗位。';
  S.pendingQ='';
  addBubble('iv','<span class="iv-who">🎤 面试官 Q1</span>'+esc(text).replace(/\n/g,'<br>'));
  showAnswerBox();
}
function showQ(q){
  var n=S.step+1;
  var text=S.pendingQ || openEnded(q);
  S.pendingQ='';
  addBubble('iv','<span class="iv-who">🎤 面试官 Q'+n+' · '+esc(q.category)+'</span>'+esc(text).replace(/\n/g,'<br>'));
  showAnswerBox();
}

/* ---------- 开始 ---------- */
function start(){
  var text=($('ivResume').value||'').trim();
  if(!text){ alert('请先粘贴简历内容，或点击「上传简历文件」'); return; }
  if(text.length<30){ alert('简历内容太短，请粘贴完整简历'); return; }
  var pos=($('ivPos').value||'').trim()||'嵌入式软件工程师';
  var prov=$('ivProvider').value, key=$('ivKey').value.trim();
  S={phase:'setup',mode:key?'ai':'offline',pos:pos,provider:prov,key:key,step:0,pool:[],answers:[],skills:[],risks:[],text:text,ai:null,pendingQ:''};
  try{ localStorage.setItem('iv_provider',prov); if(key) localStorage.setItem('iv_key',key); else localStorage.removeItem('iv_key'); }catch(e){}
  var an=analyzeResume(text);
  S.skills=an.skills; S.risks=an.risks;
  S.pool=buildPool(an.skills);
  setPhase('session');
  $('ivChat').innerHTML='';
  $('ivAnswer').value='';
  $('ivModeTag').textContent=S.mode==='ai'?('🤖 '+PROVIDERS[prov].name):'⚙️ 内置审问引擎';
  addBubble('iv','<span class="iv-who">🤖 面试官</span>你好，我是今天的面试官。已收到你的简历，目标岗位：<b>'+esc(pos)+'</b>。本次面试共 <b>20 题</b>：自我介绍 → 基础到进阶 → 结合简历项目深挖（STAR）→ 综合压力题。<br>'+ (S.mode==='ai'?'本场由 <b>'+PROVIDERS[prov].name+'</b> 大模型全真驱动。':'本场由 <b>内置审问引擎</b> 驱动（配置 API Key 可升级为大模型真面试）。'));
  var sk=an.skills.map(function(s){return s.name;});
  var risk=an.risks.map(function(r){return r.text;});
  addBubble('iv','<span class="iv-who">📋 简历速览</span>检测到技能：<b>'+(sk.length?esc(sk.join('、')):'未识别到明显技术关键词')+'</b><br>⚠️ 面试官重点考察：'+esc(risk.length?risk.join('；'):'围绕你简历里的项目和技能展开深挖'));
  if(S.mode==='ai'){
    S.ai=[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:'应聘者简历：\n'+text.slice(0,3000)+'\n目标岗位：'+pos}];
    var ld=showLoading('AI 正在分析简历...');
    aiCall(S.ai.concat([{role:'user',content:'请先对这份简历做专业分析（目标岗位：'+pos+'），输出：一、整体评价（强项3条+弱项3条）；二、面试官一定会深挖的风险点3-5条；三、简历表达优化建议。控制在400字内。'}]))
    .then(function(r){ ld.remove(); addBubble('iv','<span class="iv-who">🤖 AI 简历分析</span>'+esc(r).replace(/\n/g,'<br>')); S.ai.push({role:'assistant',content:r}); nextQuestion(); })
    .catch(function(){ ld.remove(); addBubble('iv','<span class="iv-who">⚠️</span>AI 连接失败（Key 无效 / 网络受限 / 浏览器跨域限制），已自动切换为内置审问引擎继续。'); S.mode='offline'; nextQuestion(); });
  } else {
    nextQuestion();
  }
}

/* 评分气泡样式：判断题按对错给色，其他按得分 */
function noteClass(note, q, ans){
  if(q && q.type==='judge'){
    var j=parseJudge(ans);
    if(j && j===q.answer) return 'iv-ok';
    if(j) return 'iv-no';
    return 'iv-warn';
  }
  if(note.t==='ok') return 'iv-ok';
  if(note.t==='mid') return 'iv-mid';
  return 'iv-no';
}

/* ---------- 提交回答 ---------- */
function submit(){
  if(busy) return;
  var ans=($('ivAnswer').value||'').trim();
  if(!ans){ alert('请先输入你的回答'); return; }
  $('ivAnswer').value='';
  var n=S.step+1;
  addBubble('me','<span class="iv-who">🙋 你的回答</span>'+esc(ans).replace(/\n/g,'<br>'));
  if(n===1){
    S.answers.push({no:1,q:'自我介绍',cat:'通用',ans:ans,score:scoreIntro(ans)});
    if(S.mode==='ai') S.ai.push({role:'user',content:'Q1 自我介绍，应聘者回答：'+ans});
    S.step=1;
    nextQuestion();
    return;
  }
  var q=S.pool[n-2];
  var sc=scoreAnswer(ans,q);
  S.answers.push({no:n,q:q.question,cat:q.category,ans:ans,score:sc});
  if(S.mode==='ai'){
    setBusy(true);
    S.ai.push({role:'user',content:'Q'+n+'（'+q.category+'）：'+openEnded(q)+'\n应聘者回答：'+ans});
    var ld=showLoading('AI 正在点评并准备下一题...');
    aiCall(S.ai.concat([{role:'user',content:'请先用2-3句点评应聘者刚才的回答（指出优点/不足；若回答模糊或没答到点，就像真实面试官一样严厉指出并追问），再以面试官身份提出下一题（第'+(n+1)+'题）。严格按以下格式输出两行：\n【点评】...\n【提问】...'}]))
    .then(function(r){
      ld.remove(); setBusy(false);
      S.ai.push({role:'assistant',content:r});
      var note=interviewerNote(q,ans,sc);
      var g=parseAQ(r);
      if(g.q){ S.pendingQ=g.q; addBubble(noteClass(note,q,ans),'<span class="iv-who">📝 面试官点评</span>'+esc(g.a||'继续。')); }
      else { addBubble(noteClass(note,q,ans),'<span class="iv-who">📝 面试官点评</span>'+esc(r)); }
      advance();
    })
    .catch(function(){
      ld.remove(); setBusy(false); S.mode='offline';
      var note=interviewerNote(q,ans,sc);
      addBubble(noteClass(note,q,ans),'<span class="iv-who">📝 面试官点评</span>'+esc(note.text));
      if(note.fw) addBubble('iv','<span class="iv-who">🔍 面试官追问</span>'+esc(note.fw));
      advance();
    });
  } else {
    var note=interviewerNote(q,ans,sc);
    addBubble(noteClass(note,q,ans),'<span class="iv-who">📝 面试官点评</span>'+esc(note.text));
    addBubble('iv-ref','<span class="iv-who">📖 参考答案要点</span>'+esc(refAnswer(q)).replace(/\n/g,'<br>'));
    if(note.fw) addBubble('iv','<span class="iv-who">🔍 面试官追问</span>'+esc(note.fw));
    advance();
  }
}
function parseAQ(r){
  var a=(r.match(/【点评】([\s\S]*?)(?=【提问】|$)/)||[])[1];
  var q=(r.match(/【提问】([\s\S]*)/)||[])[1];
  return {a:a?a.trim():'',q:q?q.trim():''};
}
function advance(){
  S.step++;
  if(S.step>=20) finish(); else nextQuestion();
}

/* ---------- 结束与报告 ---------- */
function finish(){
  $('ivAnswer').value='';
  setBusy(false);
  var ld=showLoading('面试结束，正在生成报告...');
  function offline(){ ld.remove(); renderReport(buildReport()); }
  if(S.mode==='ai'){
    S.ai.push({role:'user',content:'20 题面试已全部结束，请输出一份完整报告，目标岗位：'+S.pos+'。要求：一、面试分析（整体表现评分/分题型表现/暴露的知识短板/表达与逻辑问题/面试官角度的录用判断）；二、修正计划（针对暴露的问题按优先级列出可执行改进步骤，每条给具体做法和周期）；三、简历优化方案（结合面试暴露的问题给简历具体修改建议，如何量化成果、突出哪些经历）；四、学习计划（按周拆分：第1周/第2周/第3-4周，具体到知识点、推荐资源和练习方法）。'});
    aiCall(S.ai).then(function(r){ ld.remove(); renderReportText(r); })
    .catch(function(){ offline(); });
  } else offline();
}

function buildReport(){
  var ans=S.answers;
  var total=0, vagueN=0, shortN=0;
  ans.forEach(function(a){ total+=a.score; if(VAGUE.test(a.ans)) vagueN++; if(a.ans.length<15) shortN++; });
  var pct=Math.round(total/(ans.length*10)*100);
  var catAgg={}, catN={};
  ans.forEach(function(a){ if(a.cat==='通用') return; catAgg[a.cat]=(catAgg[a.cat]||0)+a.score; catN[a.cat]=(catN[a.cat]||0)+1; });
  var catRows=Object.keys(catAgg).map(function(c){return {cat:c,avg:catAgg[c]/catN[c],n:catN[c]};}).sort(function(a,b){return a.avg-b.avg;});
  var weak=catRows.slice(0,Math.min(3,catRows.length));
  var verdict='';
  if(pct>=85) verdict='🔴 强烈推荐：基础扎实、有工程思维，可对标大厂校招一面水平，继续保持并打磨细节';
  else if(pct>=70) verdict='🟢 有潜力：核心掌握较好，补强薄弱点后竞争力很强';
  else if(pct>=55) verdict='🟡 基础一般：需要系统补强，重点攻克低分知识点';
  else verdict='⚪ 差距较大：建议按学习计划扎实补基础，先刷题再面试';
  return {total:total,pct:pct,vagueN:vagueN,shortN:shortN,catRows:catRows,weak:weak,verdict:verdict};
}

var FIX_PLAN={
  'C 语言':['指针与内存（野指针/悬空指针/malloc/内存布局）','static / const / volatile 关键字','位操作与寄存器操作','链表与常见算法题'],
  '驱动与外设':['GPIO / 中断 / DMA 的使用与选择','串口 / SPI / I2C 时序与驱动编写','定时器 / PWM / ADC 应用','寄存器配置与读-改-写'],
  'RTOS':['任务状态与调度','信号量 / 互斥量 / 队列使用与选型','优先级反转与死锁','任务栈与内存管理'],
  '嵌入式 Linux':['进程 / 线程与同步','字符设备驱动框架','设备树与平台驱动','交叉编译与调试'],
  '网络与协议':['TCP / UDP 与 socket 编程','三次握手 / 四次挥手','select / epoll 模型','粘包 / 拆包处理'],
  '数据结构与算法':['链表 / 栈 / 队列','排序与复杂度分析','递归与回溯','哈希与查找'],
  'Git 与工具链':['Git 常用命令与分支管理','Makefile / CMake 构建','gdb 调试']
};

function renderReport(rep){
  setPhase('report');
  var catRowsHtml='';
  rep.catRows.forEach(function(r){
    var grade=r.avg>=7?'✅ 扎实':(r.avg>=5?'🟡 一般':'🔴 薄弱');
    catRowsHtml+='<tr><td>'+r.cat+'</td><td>'+r.avg.toFixed(1)+' / 10</td><td>'+r.n+' 题</td><td>'+grade+'</td></tr>';
  });
  var fixHtml='', used={};
  rep.weak.forEach(function(w){
    if(used[w.cat]) return; used[w.cat]=1;
    var topics=FIX_PLAN[w.cat]||[];
    fixHtml+='<p><b>🎯 '+w.cat+'</b>（平均 '+w.avg.toFixed(1)+' 分）</p><ul>';
    topics.forEach(function(t){ fixHtml+='<li>'+t+'</li>'; });
    fixHtml+='</ul>';
  });
  if(rep.weak.length===0) fixHtml='<p>各分类表现均衡，继续保持并深入项目细节。</p>';
  fixHtml+='<p><b>🗣 表达与逻辑</b></p><ul>'+
    (rep.vagueN>0?'<li>本次有 <b>'+rep.vagueN+'</b> 次模糊回答（用了"大概/可能/应该"等词）。练习时强制自己给具体数据、具体实现，拒绝模糊词。</li>':'<li>表达较清晰，能给出具体细节，继续保持。</li>')+
    (rep.shortN>0?'<li>有 <b>'+rep.shortN+'</b> 次回答过短（少于 15 字），面试官会认为思考不深入。用 STAR 结构扩充：情境→任务→行动→结果。</li>':'<li>回答长度合适，注意结论先行。</li>')+'</ul>';
  var resumeHtml='<ul>';
  S.risks.forEach(function(r){ resumeHtml+='<li>'+esc(r.text)+'</li>'; });
  if(S.risks.length===0) resumeHtml+='<li>简历结构完整。下一步：把每个项目都加上"用了什么技术 + 解决了什么问题 + 量化结果"。</li>';
  resumeHtml+='<li>项目描述模板：<b>「使用 X 技术，解决了 Y 问题，使 Z 指标提升 N%」</b>，一段话不超过 3 行。</li>';
  resumeHtml+='<li>把开源项目「嵌入式面试 AI Agent」写进项目经历，作为工具 / 效率 / 学习能力的证明（附 GitHub 链接）。</li></ul>';
  var wk1='<ul>', wk2='<ul>', wk3='<ul>';
  (rep.weak.length?rep.weak:[{cat:'C 语言'}]).forEach(function(w,i){
    var t=(FIX_PLAN[w.cat]||[]).slice(0,2).join('、');
    if(i===0){ wk1+='<li>补强 <b>'+w.cat+'</b>：'+t+'</li>'; wk2+='<li>每天 20 题专项练习（'+w.cat+' 分类），正确率 80% 以上</li>'; wk3+='<li>把 '+w.cat+' 相关考点整理成自己的「面试笔记」（原理 + 代码 + 数据）</li>'; }
    else if(i===1){ wk1+='<li>补强 <b>'+w.cat+'</b>：'+t+'</li>'; wk2+='<li>针对 '+w.cat+' 写 3 个小工程验证理解</li>'; wk3+='<li>模拟面试复测，确保 '+w.cat+' 不再丢分</li>'; }
    else { wk2+='<li>补强 <b>'+w.cat+'</b>：'+t+'</li>'; }
  });
  wk1+='<li>每天固定：20 道选择题 + 5 道简答题默写</li></ul>';
  wk2+='<li>每周 2 次「20 题模拟面试」，记录分数曲线</li></ul>';
  wk3+='<li>用本工具「简历 AI 模拟面试」复测，直到 20 题总分 ≥ 170 / 200</li><li>准备 5 个 STAR 项目故事，讲熟讲透</li></ul>';

  var html='';
  html+='<div class="rep-actions" style="margin-bottom:14px"><button class="btn btn-p" onclick="IV.restart()">↺ 再来一次面试</button><button class="btn btn-g" onclick="IV.copyReport()">📋 复制报告</button><button class="btn btn-g" onclick="backHome()">🏠 返回首页</button></div>';
  html+='<div class="rep-sec"><h3><span class="dot"></span>一、面试分析</h3><div style="display:flex;align-items:center;gap:26px;flex-wrap:wrap"><div style="text-align:center"><div class="score-big">'+rep.pct+'</div><div style="color:var(--sub);font-size:12px">总分 '+rep.total+' / 200</div></div><div style="flex:1;min-width:220px"><p>'+rep.verdict+'</p><p style="color:var(--sub)">模糊回答 '+(rep.vagueN>0?'<b style="color:var(--err)">'+rep.vagueN+'</b>':'0')+' 次 · 过短回答 '+(rep.shortN>0?'<b style="color:var(--err)">'+rep.shortN+'</b>':'0')+' 次</p></div></div><table class="rep-tbl"><tr><th>知识点</th><th>平均分</th><th>题数</th><th>评级</th></tr>'+catRowsHtml+'</table></div>';
  html+='<div class="rep-sec"><h3><span class="dot"></span>二、修正计划</h3>'+fixHtml+'</div>';
  html+='<div class="rep-sec"><h3><span class="dot"></span>三、简历优化方案</h3>'+resumeHtml+'</div>';
  html+='<div class="rep-sec"><h3><span class="dot"></span>四、学习计划</h3><p><b>第 1 周：补短板</b></p>'+wk1+'<p><b>第 2 周：专项突破</b></p>'+wk2+'<p><b>第 3-4 周：模拟与复盘</b></p>'+wk3+'</div>';
  html+='<div class="rep-actions"><button class="btn btn-p" onclick="IV.restart()">↺ 再来一次面试</button><button class="btn btn-g" onclick="IV.copyReport()">📋 复制报告</button></div>';
  $('ivReport').innerHTML=html;
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderReportText(r){
  setPhase('report');
  var html='<div class="rep-actions" style="margin-bottom:14px"><button class="btn btn-p" onclick="IV.restart()">↺ 再来一次面试</button><button class="btn btn-g" onclick="IV.copyReport()">📋 复制报告</button><button class="btn btn-g" onclick="backHome()">🏠 返回首页</button></div>';
  var lines=String(r||'').split('\n'), inList=false;
  lines.forEach(function(line){
    line=line.trim();
    if(!line){ if(inList){html+='</ul>';inList=false;} return; }
    var h=line.match(/^#{1,3}\s*(.*)/);
    if(h){ if(inList){html+='</ul>';inList=false;} html+='<div class="rep-sec"><h3>'+esc(h[1])+'</h3>'; return; }
    if(/^[-*•]\s+/.test(line)){ if(!inList){html+='<ul>';inList=true;} html+='<li>'+esc(line.replace(/^[-*•]\s+/,''))+'</li>'; return; }
    if(/^\d+[.、]\s*/.test(line)){ if(!inList){html+='<ul>';inList=true;} html+='<li>'+esc(line.replace(/^\d+[.、]\s*/,''))+'</li>'; return; }
    if(inList){html+='</ul>';inList=false;}
    html+='<p>'+esc(line).replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')+'</p>';
  });
  if(inList) html+='</ul>';
  html+='<div class="rep-actions"><button class="btn btn-p" onclick="IV.restart()">↺ 再来一次面试</button><button class="btn btn-g" onclick="IV.copyReport()">📋 复制报告</button></div>';
  $('ivReport').innerHTML=html;
  window.scrollTo({top:0,behavior:'smooth'});
}

function copyReport(){
  var el=$('ivReport');
  var t=el.innerText||el.textContent||'';
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(function(){ alert('报告已复制到剪贴板'); }); }
  else { alert('复制失败，请手动选择文本复制'); }
}

/* ---------- 初始化 ---------- */
function init(){
  var sel=$('ivProvider');
  Object.keys(PROVIDERS).forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=PROVIDERS[k].name; sel.appendChild(o); });
  try{
    var p=localStorage.getItem('iv_provider'); if(p&&PROVIDERS[p]) sel.value=p;
    var k=localStorage.getItem('iv_key'); if(k) $('ivKey').value=k;
  }catch(e){}
  function parsePdf(file){
    return new Promise(function(resolve, reject){
      if(!window.pdfjsLib){ reject(new Error('PDF 解析库未加载')); return; }
      try{ window.pdfjsLib.GlobalWorkerOptions.workerSrc='vendor/pdf.worker.min.js'; }catch(e){}
      var rd=new FileReader();
      rd.onload=function(){
        window.pdfjsLib.getDocument({data: rd.result}).promise.then(function(pdf){
          var tasks=[];
          for(var i=1;i<=pdf.numPages;i++){
            (function(pageNum){
              tasks.push(pdf.getPage(pageNum).then(function(page){
                return page.getTextContent().then(function(tc){
                  return tc.items.map(function(it){ return it.str; }).join(' ');
                });
              }));
            })(i);
          }
          Promise.all(tasks).then(function(parts){ resolve(parts.join('\n')); }, reject);
        }, reject);
      };
      rd.onerror=reject;
      rd.readAsArrayBuffer(file);
    });
  }
  function loadResumeFile(file){
    var name=(file.name||'').toLowerCase();
    if(name.slice(-4)==='.pdf'){
      $('ivResume').value='（正在解析 PDF，请稍候...）';
      parsePdf(file).then(function(text){
        if(!text || !text.trim()){ $('ivResume').value=''; alert('未能从该 PDF 提取到文字（可能是扫描件/图片型 PDF），请手动复制粘贴简历内容。'); }
        else $('ivResume').value=text.trim();
      }).catch(function(){ $('ivResume').value=''; alert('PDF 解析失败（可能是扫描件或加密文件），请手动复制粘贴简历文字。'); });
    } else {
      var rd=new FileReader();
      rd.onload=function(){ $('ivResume').value=rd.result; };
      rd.readAsText(file,'utf-8');
    }
  }
  $('ivFile').addEventListener('change', function(){
    var f=this.files&&this.files[0]; if(!f) return;
    loadResumeFile(f);
    this.value='';
  });
  document.addEventListener('keydown', function(e){
    if(!$('ivSession').classList.contains('show')) return;
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)&&document.activeElement===$('ivAnswer')){ e.preventDefault(); submit(); }
  });
}

/* ---------- 公开 API ---------- */
window.IV={
  start:start,
  submit:submit,
  restart:function(){ setPhase('setup'); },
  reset:function(){ setPhase('setup'); },
  copyReport:copyReport
};

document.addEventListener('DOMContentLoaded', init);
})();
