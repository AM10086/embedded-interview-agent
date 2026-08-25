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
  {category:'C 语言',name:'C/C++ 基础',keys:['C语言','c语言','C/C++','c/c++','C++','c++','C基础','嵌入式C','汇编']},
  {category:'C 语言',name:'指针与内存',keys:['指针','内存管理','malloc','野指针','内存池','链表']},
  {category:'驱动与外设',name:'STM32/单片机',keys:['stm32','STM32','单片机','MCU','esp32','ESP32','msp430','51单片机','51 单片机','arduino','ARM','Cortex']},
  {category:'驱动与外设',name:'外设与驱动',keys:['gpio','GPIO','i2c','I2C','spi','SPI','uart','UART','串口','can','CAN','pwm','PWM','adc','ADC','dma','DMA','定时器','中断','看门狗','寄存器','蜂鸣器','按键','电机','舵机']},
  {category:'RTOS',name:'RTOS/多任务',keys:['freertos','FreeRTOS','rtos','RTOS','uc/os','UCOS','rt-thread','RT-Thread','实时系统','多任务','嵌入式实时']},
  {category:'RTOS',name:'任务与同步',keys:['信号量','互斥量','消息队列','队列','任务调度','优先级','死锁','临界区','事件组','任务栈']},
  {category:'嵌入式 Linux',name:'Linux 基础',keys:['linux','Linux','嵌入式linux','嵌入式 Linux','ubuntu','Ubuntu','shell','Shell','vim']},
  {category:'嵌入式 Linux',name:'驱动与内核',keys:['设备树','内核','字符设备','platform','platform 总线','交叉编译','uboot','U-Boot','文件系统','mmap','内核模块','busybox']},
  {category:'网络与协议',name:'网络编程',keys:['tcp','TCP','udp','UDP','socket','Socket','网络编程','TCP/IP','tcp/ip','http','HTTP','mqtt','MQTT','lwip','LWIP','modbus','Modbus','485','rs485','RS485','CANopen']},
  {category:'数据结构与算法',name:'数据结构',keys:['链表','队列','栈','二叉树','树','排序','哈希','递归','算法','复杂度']},
  {category:'Git 与工具链',name:'Git/构建',keys:['git','Git','GitHub','github','gitee','makefile','Makefile','cmake','CMake','gcc','GCC','keil','Keil','iar','IAR','jlink','J-Link','st-link']},
  {category:'驱动与外设',name:'硬件调试',keys:['示波器','逻辑分析仪','万用表','串口调试','openmv','OpenMV']},
  {category:'C 语言',name:'嵌入式 AI',keys:['tinyml','TinyML','tensorflow','TensorFlow','神经网络','python','Python','模型量化','推理']}
];

/* ---------- 各分类核心概念词（用于离线评分） ---------- */
var CONCEPTS={
  'C 语言':['指针','内存','static','volatile','const','宏','链表','栈','堆','位操作','回调','函数指针','结构体','union','联合体','大小端','野指针','malloc','free','编译','链接','数组','字符串','递归'],
  '驱动与外设':['GPIO','中断','DMA','定时器','PWM','ADC','串口','UART','SPI','I2C','CAN','寄存器','时钟','外设','轮询','看门狗','按键','回调','上拉','下拉','滤波','波特率','时钟树'],
  'RTOS':['任务','信号量','互斥量','队列','中断','优先级','死锁','调度','Tick','临界区','栈','时间片','消息','事件','看门狗','空闲任务','上下文切换'],
  '嵌入式 Linux':['进程','线程','内存','设备树','驱动','内核','交叉编译','文件系统','mmap','模块','中断','DMA','同步','锁','字符设备','platform','shell','调试'],
  '网络与协议':['TCP','UDP','三次握手','四次挥手','粘包','阻塞','非阻塞','select','epoll','IP','端口','重传','超时','滑动窗口','socket','校验'],
  '数据结构与算法':['链表','栈','队列','树','排序','复杂度','递归','哈希','查找','二叉树','快排','冒泡'],
  'Git 与工具链':['git','提交','分支','合并','冲突','回滚','Makefile','CMake','编译','静态库','动态库','gdb','调试'],
  '代码判断':['越界','溢出','野指针','未初始化','malloc','free','NULL','悬空','strcpy','缓冲区','除零','释放','栈','数组','越界'],
  'Linux 命令':['chmod','find','grep','ps','gcc','dmesg','ifconfig','tar','管道','权限','进程','编译','日志','网络','命令'],
  '代码分析':['指针','sizeof','strlen','对齐','递归','宏','static','输出','地址','结构体','数组','填充','\0'],
  '代码写作':['指针','malloc','free','NULL','循环','while','return','strlen','链表','位操作','二分','交换','边界','实现'],
  '项目深挖':['STAR','项目','调试','问题','解决','优化','测试','架构','选型','数据','方案','负责','根因','验证'],
  '通信协议对比':['SPI','I2C','UART','CAN','USB','串口','速率','引脚','主从','多机','仲裁','全双工','校验','波特率','时序'],
  '项目排障':['排查','日志','复位','看门狗','内存','栈','溢出','丢包','调试','定位','现象','根因','验证','滤波','崩溃']
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

﻿/* 代码类面试题（代码判断 / Linux 命令 / 代码分析 / 代码写作）来自 code_questions.js（200 题） */
var CODE_QUESTIONS = window.CODE_QUESTIONS || [];

/* ---------- 通信协议对比（面试高频） ---------- */
var PROTOCOL_QUESTIONS=[
{category:'通信协议对比',q:'SPI 和 I2C 的主要区别？各自适合什么场景？',answer:'SPI：4 线（SCLK/MOSI/MISO/CS）、全双工、速度快（几十 MHz）、一主多从靠片选；I2C：2 线（SCL/SDA）、半双工、带地址、可挂多从机、速度慢（100k/400k/1M）。高速大数据选 SPI，多从机省引脚选 I2C。',explain:'协议对比必考题，先列维度再结论。',code_ans:''},
{category:'通信协议对比',q:'UART 和 SPI 的区别？',answer:'UART：2 线（TX/RX）、异步（靠波特率对齐）、点对点、全双工、速率一般 <几 Mbps；SPI：同步（有时钟线）、可多从机、全双工、速率高。UART 简单省线用于调试/短距点对点，SPI 用于高速外设（Flash/屏/传感器）。',explain:'异步 vs 同步是核心。',code_ans:''},
{category:'通信协议对比',q:'UART 和 I2C 的区别？',answer:'UART 异步点对点 2 线；I2C 同步 2 线带地址总线式，可挂多从机。I2C 需正确时序（起始/停止/应答），UART 只需波特率一致。',explain:'总线式 vs 点对点。',code_ans:''},
{category:'通信协议对比',q:'CAN 和 RS485 的区别？各用在什么场景？',answer:'CAN：差分 2 线、多主、带仲裁与错误检测、速度最高 1Mbps（经典）/更高（CAN FD）、抗干扰强，用于汽车/工业；RS485：差分半双工、主从轮询、无仲裁，速度可达 10Mbps+，成本低用于工业总线/Modbus。',explain:'CAN 有协议栈，RS485 只是物理层。',code_ans:''},
{category:'通信协议对比',q:'I2C 为什么适合挂多个从设备？地址怎么处理？',answer:'I2C 是总线式，每个从机有唯一 7 位（或 10 位）地址，主机通过地址寻址，所有从机并联在 SCL/SDA 上即可，省引脚。需处理地址冲突、上拉电阻。',explain:'地址寻址是 I2C 多从机关键。',code_ans:''},
{category:'通信协议对比',q:'SPI 是全双工吗？I2C、UART 呢？',answer:'SPI 和 UART 都是全双工（可同时收发）；I2C 是半双工（同一根数据线分时收发）。',explain:'全/半双工区分。',code_ans:''},
{category:'通信协议对比',q:'SPI 有哪四种模式？CPOL/CPHA 怎么区分？',answer:'CPOL 决定时钟空闲电平（0/1），CPHA 决定数据在时钟上升沿还是下降沿采样。4 种组合：模式0（CPOL0 CPHA0）最常用。主从必须配置一致。',explain:'SPI 模式 0-3，模式 0 最常用。',code_ans:''},
{category:'通信协议对比',q:'I2C 的起始、停止、应答时序是怎样的？',answer:'起始：SCL 高电平时 SDA 由高变低；停止：SCL 高电平时 SDA 由低变高；应答：接收方在第 9 个时钟拉低 SDA（ACK），不拉低为 NACK。',explain:'时序是 I2C 手写驱动必考。',code_ans:''},
{category:'通信协议对比',q:'I2C 多主机冲突怎么解决？',answer:'I2C 有仲裁机制：多个主机同时发数据时，检测 SDA 与自己发送不一致即让出总线；加上时钟同步（低电平保持）。通常用主从模式避免冲突。',explain:'仲裁 = 发送时检测冲突。',code_ans:''},
{category:'通信协议对比',q:'串口波特率误差怎么算？误差太大会怎样？',answer:'误差 = |实际波特率-目标|/目标。一般 <2% 可用，误差太大会采样错位导致乱码。STM32 用 BRR 分频，选时钟使误差尽量小。',explain:'波特率误差导致乱码。',code_ans:''},
{category:'通信协议对比',q:'实际项目中怎么选 UART/SPI/I2C？举例说明。',answer:'按需求：调试日志/点对点低速→UART；接 Flash/屏/高速传感器→SPI；挂多个 I2C 传感器/EEPROM→I2C；汽车/长距离抗干扰→CAN。讲清速率、引脚、多机、距离、成本。',explain:'选型题：先给维度再下结论。',code_ans:''},
{category:'通信协议对比',q:'CAN 报文的仲裁机制？',answer:'CAN 是多主总线，节点同时发送时按标识符逐位仲裁：显性位（0）优先，ID 小的先发送；仲裁失败自动转接收，不破坏数据。',explain:'CAN 优先级由 ID 决定。',code_ans:''},
{category:'通信协议对比',q:'CAN 和以太网的区别？',answer:'CAN：短帧（8 字节数据）、多主、确定性仲裁、抗干扰、速率低（最高几 Mbps），适合实时控制；以太网：帧大、速率高（100M/1G）、需交换/协议栈（TCP/IP），适合大数据传输。',explain:'实时性 vs 吞吐量。',code_ans:''},
{category:'通信协议对比',q:'USB 和 UART 的区别？USB 枚举是什么？',answer:'USB：主从（Host/Device）、差分、速率高（12M~20G）、需枚举（设备接入后主机发配置请求、分配地址、加载驱动）；UART：简单点对点、无枚举。USB 用于大容量/高速外设，UART 用于简单调试。',explain:'枚举 = USB 设备初始化的握手过程。',code_ans:''},
{category:'通信协议对比',q:'Modbus RTU 帧格式？和 Modbus TCP 的区别？',answer:'RTU：地址(1)+功能码(1)+数据(N)+CRC16(2)，基于串口 RS485，二进制紧凑；Modbus TCP 基于以太网，去掉 CRC 换成 MBAP 头。',explain:'工业通信常考。',code_ans:''},
{category:'通信协议对比',q:'RS485 和 RS232 的区别？',answer:'RS232：单端、±12V 电平、点对点、距离短（~15m）；RS485：差分、半双工/全双工、可多机（128 节点）、距离长（1200m）、抗干扰强。工业现场用 RS485。',explain:'差分 vs 单端。',code_ans:''},
{category:'通信协议对比',q:'蓝牙和 WiFi 的区别？各适合什么场景？',answer:'蓝牙：短距（~10m）、低功耗、速率低（经典 2Mbps，BLE 更低）、组网简单（一对多广播/连接）；WiFi：速率高（百 Mbps）、距离远、功耗大、需接入点。传感器穿戴用 BLE，数据传输用 WiFi。',explain:'功耗/速率/距离权衡。',code_ans:''},
{category:'通信协议对比',q:'常用嵌入式总线的速度大致是多少？',answer:'UART 几 Mbps 以内；I2C 标准 100k/400k/1M（FM+）；SPI 可达几十 MHz（按分频）；CAN 最高 1Mbps（FD 更高）；USB2.0 480Mbps；以太网 10/100/1000M。',explain:'数量级记住即可。',code_ans:''},
{category:'通信协议对比',q:'串口通信粘包/半包怎么解决？',answer:'定长帧、或帧头+长度+校验+超时判帧；接收用环形缓冲+状态机解析，按帧处理，超时判断半包。',explain:'拆包是嵌入式网络/串口高频题。',code_ans:''},
{category:'通信协议对比',q:'怎么保证通信可靠性？',answer:'物理层校验（CRC/校验和）、应答（ACK/NACK）、超时重传、帧序号去重、心跳保活、看门狗兜底。',explain:'可靠通信四要素。',code_ans:''}
];

/* ---------- 项目排障（遇到问题怎么解决） ---------- */
var PROBLEM_QUESTIONS=[
{category:'项目排障',q:'你项目里遇到最难解决的 bug 是什么？怎么定位和解决的？',answer:'用「现象→排查→根因→解决→验证」讲一个真实故事，最好带数据（如"排查了 3 天，最后定位到 DMA 未等待传输完成"）。',explain:'问题解决能力是面试重点。',code_ans:''},
{category:'项目排障',q:'系统在现场偶发死机/复位，你怎么排查？',answer:'复现→查看门狗复位标志/内核日志→排查电源纹波、内存越界、栈溢出、干扰、任务卡死→用示波器/逻辑分析仪抓现场→逐步隔离。',explain:'偶发问题定位方法论。',code_ans:''},
{category:'项目排障',q:'程序卡死（任务不运行）怎么定位？',answer:'看所有任务状态（是否阻塞等锁）、是否死锁/优先级反转、中断是否死循环、栈是否溢出；用调试器挂起看当前执行点。',explain:'卡死 = 调度/锁/中断/栈问题。',code_ans:''},
{category:'项目排障',q:'通信丢包/数据错乱怎么解决？',answer:'先确认物理层（波形/电平/干扰），再查波特率/时序/校验；加 CRC、应答重传、帧同步；用逻辑分析仪抓波形对比。',explain:'丢包分层排查。',code_ans:''},
{category:'项目排障',q:'内存泄漏怎么发现和定位？',answer:'监控内存占用曲线持续增长→检查 malloc/free 是否配对、错误路径是否释放→用工具（如统计分配）定位泄漏点。',explain:'泄漏 = 只分配不释放。',code_ans:''},
{category:'项目排障',q:'栈溢出有什么征兆？怎么检测？',answer:'征兆：莫名崩溃、变量被改、函数返回异常；检测：用栈高水位（如 FreeRTOS uxTaskGetStackHighWaterMark）、栈填充标记、MPU 栈保护。',explain:'栈溢出检测手段。',code_ans:''},
{category:'项目排障',q:'传感器数据跳动/不稳定怎么处理？',answer:'先查硬件（供电/干扰/接线），再软件滤波：多次采样取平均/中值、滑动滤波、限幅滤波；确认采样时序与数据手册一致。',explain:'滤波是嵌入式基本功。',code_ans:''},
{category:'项目排障',q:'电机/PWM 出现抖动震荡怎么调？',answer:'检查 PWM 频率是否在可听/合适范围、死区设置、PID 参数是否过大（比例过大震荡）、编码器反馈是否稳定、机械间隙。',explain:'控制环调参思路。',code_ans:''},
{category:'项目排障',q:'出现优先级反转导致的异常，怎么处理？',answer:'识别：高优先级任务被中优先级任务间接阻塞。解决：优先级继承、优先级天花板、或避免共享资源长时间占用。',explain:'RTOS 经典问题。',code_ans:''},
{category:'项目排障',q:'你常用的调试手段有哪些？',answer:'串口日志（分级打印）、调试器断点/单步/看变量、示波器/逻辑分析仪看波形时序、状态机打印、看门狗+复位标志。',explain:'调试工具链越全越好。',code_ans:''},
{category:'项目排障',q:'系统长时间运行后越来越慢/卡顿，怎么排查？',answer:'查内存泄漏（可用内存持续下降）、句柄/任务堆积、队列积压、缓存未释放、碎片化；用工具监控 CPU 占用和内存曲线。',explain:'资源泄漏导致变慢。',code_ans:''},
{category:'项目排障',q:'中断里出现的问题怎么排查？',answer:'确认 ISR 是否过长/调用不可重入函数；用示波器看中断响应是否及时；检查中断优先级与共享变量；加调试计数。',explain:'ISR 常见坑。',code_ans:''},
{category:'项目排障',q:'怎么保证代码健壮性（异常输入/极端情况）？',answer:'入口参数校验、指针判空、数组边界检查、看门狗、异常捕获、压力/边界测试、防御式编程。',explain:'健壮性意识。',code_ans:''},
{category:'项目排障',q:'遇到没见过的技术问题，你的处理思路？',answer:'先查资料（手册/文档/社区）→搭最小复现环境→分而治之排除变量→动手验证假设→记录总结。',explain:'学习与排障方法论。',code_ans:''},
{category:'项目排障',q:'项目进度紧张/需求变化时你怎么处理？',answer:'先和负责人对齐优先级，砍掉非核心功能保主线；关键路径先做最小可用版本再迭代；及时同步风险。',explain:'软技能也重要。',code_ans:''}
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
function detectProjects(text){
  var hasProject=/项目|实习|毕设|课程设计|大赛|竞赛|作品|开发了|实现了|设计了|负责/.test(text);
  var protocols=[];
  ['串口','UART','SPI','I2C','CAN','USB','RS485','Modbus','蓝牙','WiFi','以太网','TCP','UDP','MQTT','LORA','LoRa'].forEach(function(p){
    if(text.indexOf(p)>=0) protocols.push(p);
  });
  var techs=[];
  ['STM32','单片机','MCU','FreeRTOS','RTOS','Linux','驱动','PID','PWM','编码器','DMA','中断','传感器','OLED','电机','TinyML','OpenMV','摄像头','循迹','温湿度'].forEach(function(t){
    if(text.indexOf(t)>=0) techs.push(t);
  });
  return {hasProject:hasProject, protocols:protocols, techs:techs};
}
function buildProjectQuestions(ri){
  var qs=[];
  if(!ri || !ri.hasProject) return qs;
  var tech=(ri.techs.length?('（如 '+ri.techs.slice(0,5).join('/')+'）'):'');
  qs.push({category:'项目深挖',q:'请用 STAR（情境→任务→行动→结果）介绍你简历里的一个项目：你负责什么、用了哪些技术、最终量化成果是什么？',answer:'用 STAR 结构讲：背景→你的任务→技术方案与行动→量化结果（性能/时间/精度）。',explain:'先验证项目真实性和表达能力。',code_ans:''});
  qs.push({category:'项目深挖',q:'这个项目里你遇到的最大技术难点是什么？你是怎么一步步解决的？'+tech,answer:'讲一个具体问题：现象→排查步骤→根因→解决方案→验证数据。',explain:'问题解决能力是面试核心。',code_ans:''});
  qs.push({category:'项目深挖',q:'项目里用到的关键技术'+tech+'，你具体怎么实现的？数据/参数是多少？',answer:'讲清原理+实现细节+关键数据（如 PID 周期、PWM 频率、通信波特率）。',explain:'深挖技术真实性，含糊会被挑战。',code_ans:''});
  qs.push({category:'项目深挖',q:'如果让你重新做这个项目，你会怎么改进架构、选型或流程？为什么？',answer:'指出可改进点（模块化/选型/测试/性能），给出取舍理由。',explain:'考察反思与工程思维。',code_ans:''});
  qs.push({category:'项目深挖',q:'你怎么验证项目功能正常？有没有做可靠性测试（长时间运行/异常输入/边界）？',answer:'说明测试方法：功能用例、边界测试、长时间跑机、异常注入。',explain:'考察测试与质量意识。',code_ans:''});
  if(ri.protocols.length){
    qs.push({category:'通信协议对比',q:'你项目里用了 '+ri.protocols.join('/')+'，为什么选它？和替代方案相比有什么取舍？',answer:'结合场景说明选型理由：速率、距离、引脚、多机、可靠性、成本。',explain:'协议选型是加分项。',code_ans:''});
  }
  return qs;
}
function buildPool(skills, resumeInfo){
  var boost={};
  skills.forEach(function(s){ boost[s.cat]=(boost[s.cat]||0)+1; });
  var plan=[['C 语言',4],['驱动与外设',3],['RTOS',3],['嵌入式 Linux',2],['网络与协议',2],['数据结构与算法',1],['Git 与工具链',1]];
  var bank=[];
  plan.forEach(function(p){
    var cat=p[0], n=p[1]+Math.min(2,boost[cat]||0);
    var arr=QS.filter(function(q){return q.category===cat;});
    shuffle(arr);
    bank=bank.concat(arr.slice(0,Math.min(n,arr.length)));
  });
  // 面试重点：简历项目 STAR 深挖 + 问题排障 + 协议对比 + 少量代码/基础题
  var extras=[];
  if(resumeInfo && resumeInfo.hasProject) extras=extras.concat(buildProjectQuestions(resumeInfo)); // 项目深挖 5-6 题
  var pa=shuffle(PROTOCOL_QUESTIONS.slice()).slice(0,3);  extras=extras.concat(pa);   // 协议对比 3 题
  var pb=shuffle(PROBLEM_QUESTIONS.slice()).slice(0,2);   extras=extras.concat(pb);   // 项目排障 2 题
  ['代码判断','Linux 命令','代码分析','代码写作'].forEach(function(ct){              // 代码题 4 题
    var arr=CODE_QUESTIONS.filter(function(cq){return cq.category===ct;});
    shuffle(arr);
    extras=extras.concat(arr.slice(0,1));
  });
  shuffle(extras);
  shuffle(bank);
  var need=18-extras.length; if(need<0) need=0;
  var pool=bank.slice(0,need).concat(extras);
  shuffle(pool);
  var design=DESIGN_QUESTIONS[Math.floor(Math.random()*DESIGN_QUESTIONS.length)];
  pool.push(design);   // 1 道综合压力题（共 19 题，Q2~Q20）
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
  var isAIq=!!S.pendingQ;
  var text=S.pendingQ || openEnded(q);
  S.pendingQ='';
  var codeHtml=(!isAIq && q.code)?'<pre class="iv-code">'+esc(q.code)+'</pre>':'';
  addBubble('iv','<span class="iv-who">🎤 面试官 Q'+n+' · '+esc(q.category)+'</span>'+esc(text).replace(/\n/g,'<br>')+codeHtml);
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
  var ri=detectProjects(text);
  S.resumeInfo=ri;
  S.pool=buildPool(an.skills, ri);
  setPhase('session');
  $('ivChat').innerHTML='';
  $('ivAnswer').value='';
  $('ivModeTag').textContent=S.mode==='ai'?('🤖 '+PROVIDERS[prov].name):'⚙️ 内置审问引擎';
  addBubble('iv','<span class="iv-who">🤖 面试官</span>你好，我是今天的面试官。已收到你的简历，目标岗位：<b>'+esc(pos)+'</b>。本次面试共 <b>20 题</b>：自我介绍 → <b>简历项目深挖（STAR）</b> → 遇到的问题怎么解决 → 通信协议对比 → 基础与代码题 → 综合压力题。<br>'+ (S.mode==='ai'?'本场由 <b>'+PROVIDERS[prov].name+'</b> 大模型全真驱动。':'本场由 <b>内置审问引擎</b> 驱动（配置 API Key 可升级为大模型真面试）。'));
  var sk=an.skills.map(function(s){return s.name;});
  var risk=an.risks.map(function(r){return r.text;});
  var ri=detectProjects(text);
  var projHtml = ri.hasProject
    ? '✅ <b>项目经历</b>：已检测到，将重点 STAR 深挖'+(ri.techs.length?'（'+esc(ri.techs.slice(0,5).join('/'))+'）':'')
    : '⚠️ <b>项目经历</b>：未检测到项目/实习关键词，建议尽快补充';
  var protHtml = ri.protocols.length ? '✅ <b>通信协议</b>：'+esc(ri.protocols.slice(0,6).join('/'))+'（将重点考察协议区别与选型）' : '⚠️ <b>通信协议</b>：简历未提及，建议补充（SPI/I2C/UART/CAN 等）';
  addBubble('iv','<span class="iv-who">📋 简历速览</span>检测到技能：<b>'+(sk.length?esc(sk.join('、')):'未识别到明显技术关键词')+'</b><br>'+projHtml+'<br>'+protHtml);
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
      addBubble('iv-ref','<span class="iv-who">📖 参考答案要点</span>'+esc(refAnswer(q)).replace(/\n/g,'<br>'));
      if(q.code_ans) addBubble('iv-ref','<span class="iv-who">💻 参考代码</span><pre class="iv-code">'+esc(q.code_ans)+'</pre>');
      if(note.fw) addBubble('iv','<span class="iv-who">🔍 面试官追问</span>'+esc(note.fw));
      advance();
    });
  } else {
    var note=interviewerNote(q,ans,sc);
    addBubble(noteClass(note,q,ans),'<span class="iv-who">📝 面试官点评</span>'+esc(note.text));
    addBubble('iv-ref','<span class="iv-who">📖 参考答案要点</span>'+esc(refAnswer(q)).replace(/\n/g,'<br>'));
    if(q.code_ans) addBubble('iv-ref','<span class="iv-who">💻 参考代码</span><pre class="iv-code">'+esc(q.code_ans)+'</pre>');
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
  'Git 与工具链':['Git 常用命令与分支管理','Makefile / CMake 构建','gdb 调试'],
  '代码判断':['数组越界与缓冲区溢出（strcpy/strncpy/snprintf）','指针与内存（野指针/悬空指针/重复 free）','未初始化/返回局部地址/除零等 C 陷阱'],
  'Linux 命令':['文件与权限（chmod/chown/ls -l）','查找与过滤（find/grep/管道）','进程与调试（ps/top/kill/gdb/dmesg）','编译构建（gcc -Wall/-O2、Makefile、交叉编译）'],
  '代码分析':['sizeof/strlen 与指针运算','结构体对齐与内存布局','宏与预处理陷阱','递归/循环/static 作用域'],
  '代码写作':['字符串与内存操作（strlen/strcpy/反转/安全复制）','链表与指针操作','位操作与寄存器','二分查找/排序实现'],
  '项目深挖':['用 STAR 结构准备 5 个完整项目故事（情境/任务/行动/结果+数据）','每个项目技术点逐条深挖（原理+选型+数据）','提前预演面试官追问（为什么/怎么实现/如果…会怎样）'],
  '通信协议对比':['SPI/I2C/UART/CAN/USB 对比表（速度/引脚/主从/多机/距离）','各协议时序、帧格式与校验方式','根据场景讲选型思路（速率/距离/可靠性/成本）'],
  '项目排障':['常见问题定位方法论（死机/卡死/丢包/内存泄漏/栈溢出）','调试工具链（日志/调试器/示波器/逻辑分析仪）','可靠性设计（看门狗/异常处理/边界测试）']
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
  (rep.weak.length?rep.weak:[{category:'C 语言'}]).forEach(function(w,i){
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
