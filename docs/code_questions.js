/* 由 python/gen_code_questions.py 自动生成，共 200 题（代码判断/Linux命令/代码分析/代码写作 各 50） */
window.CODE_QUESTIONS = [
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "uniq -c result.txt",
  "answer": "去除相邻重复行并统计出现次数（需先 sort）。",
  "explain": "uniq 只去相邻重复，通常与 sort 管道连用。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "float a=0.1, b=0.2;\nif(a+b == 0.3){ ... }",
  "answer": "浮点数二进制无法精确表示 0.1/0.2，a+b 与 0.3 不精确相等，== 比较失败。应使用误差范围比较 fabs(a+b-0.3)<1e-6。",
  "explain": "浮点数用差值比较。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=1;\nprintf(\"%d\\n\", (x++, x+10));",
  "answer": "输出 11。逗号表达式先 x++ 再返回 x+10。",
  "explain": "逗号运算符结果是最右表达式。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "struct S { char a; char b; int c; };\nprintf(\"%zu\\n\", sizeof(struct S));",
  "answer": "输出 8：a(1)+b(1)+填充2+c(4)。",
  "explain": "相邻 char 可合并填充。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = malloc(10);\np++;\nfree(p);",
  "answer": "p++ 后不再指向 malloc 返回的起始地址，free(p) 非法（释放错位）。应保存原指针：char *base=p; ... free(base)。",
  "explain": "free 必须传 malloc 返回的原始指针。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int i=0;\nwhile(i<10){ a[i]=i; }  // 忘记 i++",
  "answer": "while 循环没有更新 i，i 恒为 0，死循环。应 i++。",
  "explain": "循环变量必须向结束条件推进。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "求整数各位数字之和。",
  "code": "int digit_sum(int n);",
  "answer": "循环取余累加。",
  "explain": "循环取余累加。",
  "code_ans": "int digit_sum(int n){\n  if(n<0) n=-n;\n  int s=0;\n  while(n){ s+=n%10; n/=10; }\n  return s;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char c = 0x80;\nprintf(\"%d\\n\", c);",
  "answer": "输出 -128（若 char 有符号）。0x80 作为有符号 char 是 -128。",
  "explain": "char 是否有符号取决于平台。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "find src -name \"*.c\" -exec wc -l {} \\;",
  "answer": "在 src 下找所有 .c 文件并对每个执行 wc -l 统计行数。",
  "explain": "find -exec 对每个结果执行命令，{} 是占位符。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char dst[8];\nstrcat(dst, \"hello world\");",
  "answer": "strcat 不检查容量，dst 只有 8 字节会溢出。应改用 strncat 并保证剩余空间。",
  "explain": "strcat 同 strcpy 一样危险。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现 itoa：把整数 n 转成十进制字符串存入 buf。",
  "code": "void itoa(int n, char *buf);",
  "answer": "处理负数，先反向存数字再反转，最后补 '\\0'。",
  "explain": "处理负数，先反向存数字再反转，最后补 '\\0'。",
  "code_ans": "void itoa(int n, char *buf){\n  int i=0, neg=0;\n  if(n<0){ neg=1; n=-n; }\n  do{ buf[i++] = '0'+n%10; n/=10; }while(n);\n  if(neg) buf[i++]='-';\n  buf[i]='\\0';\n  for(int j=0;j<i/2;j++){ char t=buf[j]; buf[j]=buf[i-1-j]; buf[i-1-j]=t; }\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "enum Color{RED=1,GREEN,BLUE=5,YELLOW};\nprintf(\"%d %d\\n\", GREEN, YELLOW);",
  "answer": "输出 2 6。GREEN 在 RED=1 后为 2，YELLOW 在 BLUE=5 后为 6。",
  "explain": "枚举按上一个值 +1。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "make -j4",
  "answer": "用 4 个并行任务执行 Makefile 构建，加快编译。",
  "explain": "make clean 清理；make V=1 显示详细命令。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "printf(\"%d\\n\", 010);",
  "answer": "输出 8。0 前缀表示八进制！",
  "explain": "注意 0 开头是八进制，容易踩坑。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现选择排序。",
  "code": "void selection_sort(int a[], int n);",
  "answer": "每轮选最小放到前面。",
  "explain": "每轮选最小放到前面。",
  "code_ans": "void selection_sort(int a[], int n){\n  for(int i=0;i<n-1;i++){\n    int k=i;\n    for(int j=i+1;j<n;j++) if(a[j]<a[k]) k=j;\n    int t=a[i]; a[i]=a[k]; a[k]=t;\n  }\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int *p = malloc(100 * sizeof(int));\nfor(int i=0;i<100;i++) p[i]=i;",
  "answer": "若 malloc 失败返回 NULL 且未判空，p[i] 解引用空指针崩溃。应先 if(!p) return;。",
  "explain": "malloc 后第一件事：判空。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int x;\nprintf(\"%d\", x);",
  "answer": "x 未初始化就使用，值是未定义的（栈上残留随机值）。定义时初始化 int x=0。",
  "explain": "局部变量必须初始化再使用。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "tail -f app.log",
  "answer": "实时跟踪 app.log 末尾新增内容，常用于看日志输出。",
  "explain": "tail -f 调试利器；Ctrl+C 退出。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ifconfig eth0",
  "answer": "查看网卡 eth0 的 IP、掩码、MAC 和收发统计。",
  "explain": "新系统用 ip addr；ifconfig 属 net-tools。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "gzip -d file.gz",
  "answer": "解压 file.gz 得到 file。",
  "explain": "gzip 压缩单文件；tar 打包多个。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "size_t n = strlen(s);\nfor(int i=0; i<n; i++){ ... }",
  "answer": "若 n 很大且 i 为 int，i 累加可能溢出；且 i 与 size_t 比较时被转成无符号。更常见问题是 n 为 0 时循环正常，但类型不匹配易出错。",
  "explain": "循环下标与 size_t 比较注意类型。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int x = -1;\nunsigned int y = 1;\nif(x > y){ ... }",
  "answer": "有符号/无符号比较：x 被转换为 unsigned（巨大值），x > y 恒真，逻辑错误。应显式类型转换或都转成有符号。",
  "explain": "混合符号比较是经典陷阱。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "tar -czvf app.tar.gz app/",
  "answer": "把 app 目录打包并用 gzip 压缩成 app.tar.gz。",
  "explain": "c 创建、z gzip、v 显示、f 文件名。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "把 x 的第 n 位翻转。",
  "code": "void bit_toggle(unsigned int *x, int n);",
  "answer": "*x ^= (1u << n)。",
  "explain": "*x ^= (1u << n)。",
  "code_ans": "void bit_toggle(unsigned int *x, int n){ *x ^= (1u << n); }"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char s[10] = \"hi\";\nprintf(\"%zu %zu\\n\", sizeof(s), strlen(s));",
  "answer": "输出 10 2。sizeof 是数组容量 10，strlen 是实际长度 2。",
  "explain": "数组 sizeof 是整个数组大小。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "netstat -tlnp",
  "answer": "列出所有 TCP 监听端口（-t TCP、-l 监听、-n 数字、-p 进程）。",
  "explain": "ss -tlnp 是 netstat 的替代；排查端口占用。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char *p=\"abc\";\nprintf(\"%c\\n\", *p);",
  "answer": "输出 a。*p 取首字符。",
  "explain": "指针解引用取首元素。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ps aux",
  "answer": "列出系统所有进程及 CPU/内存占用、启动命令。",
  "explain": "ps -ef 也常用；配合 grep 过滤。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=5;\nswitch(x){\n case 1: printf(\"A\");\n case 5: printf(\"B\");\n default: printf(\"C\");\n}",
  "answer": "输出 BC。case 5 匹配后没有 break，穿透执行 default。",
  "explain": "switch 穿透：匹配后顺序执行到 break。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a[3]={1,2,3};\nprintf(\"%d\\n\", sizeof(a)/sizeof(a[0]));",
  "answer": "输出 3。数组总字节除以元素字节 = 元素个数。",
  "explain": "求数组长度的标准写法。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "printf(\"%d\\n\", 7/2);",
  "answer": "输出 3。整数除法向下取整，结果还是整数。",
  "explain": "int/int = int。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char s[]=\"abc\";\nprintf(\"%c\\n\", s[strlen(s)]);",
  "answer": "输出 '\\0'（空字符）。s[3] 是字符串结尾的 '\\0'。",
  "explain": "strlen 返回的长度处正是 '\\0'。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "返回数组第二大值。",
  "code": "int second_max(int a[], int n);",
  "answer": "维护最大值与次大值两个变量。",
  "explain": "维护最大值与次大值两个变量。",
  "code_ans": "int second_max(int a[], int n){\n  int m1=a[0]>a[1]?a[0]:a[1];\n  int m2=a[0]>a[1]?a[1]:a[0];\n  for(int i=2;i<n;i++){\n    if(a[i]>m1){ m2=m1; m1=a[i]; }\n    else if(a[i]>m2 && a[i]!=m1) m2=a[i];\n  }\n  return m2;\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = \"literal\";\nfree(p);",
  "answer": "p 指向字符串常量（静态区），不是 malloc 分配，free 会崩溃。",
  "explain": "只 free malloc 的指针。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "把数组循环左移 k 位。",
  "code": "void rotate_left(int a[], int n, int k);",
  "answer": "三步翻转法：整体翻转，前 n-k 翻转，后 k 翻转。",
  "explain": "三步翻转法：整体翻转，前 n-k 翻转，后 k 翻转。",
  "code_ans": "void rev(int a[],int l,int r){ while(l<r){ int t=a[l];a[l]=a[r];a[r]=t;l++;r--; } }\nvoid rotate_left(int a[],int n,int k){\n  k%=n; rev(a,0,n-1); rev(a,0,n-k-1); rev(a,n-k,n-1);\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = NULL;\n*p = 'a';",
  "answer": "对 NULL 指针解引用，段错误崩溃。使用前必须判空。",
  "explain": "NULL 解引用是最高频崩溃原因之一。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "cd ~ && pwd",
  "answer": "cd ~ 回到当前用户主目录，pwd 打印当前所在目录的绝对路径。",
  "explain": "~ 代表当前用户主目录；&& 表示前一条成功才执行后一条。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "struct Buf{ char *data; };\nstruct Buf x, y;\nx.data=malloc(100);\ny = x;\nfree(x.data);\nfree(y.data);",
  "answer": "结构体浅拷贝后 x.data 和 y.data 指向同一块内存，释放两次 = double free。应深拷贝或引用计数。",
  "explain": "含指针的结构体拷贝要小心。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=5;\nprintf(\"%d %d\\n\", x++, ++x);",
  "answer": "输出 5 7（依赖求值顺序，实际未定义行为；常见结果为 5 7）。",
  "explain": "同一表达式多次修改同一变量是未定义行为。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=0;\nprintf(\"%d\\n\", !x);",
  "answer": "输出 1。!0 = 1（非零即真）。",
  "explain": "逻辑非运算。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "统计字符串中单词个数（以空格分隔）。",
  "code": "int count_words(const char *s);",
  "answer": "遇到非空格且前一字符是空格/开头时计数。",
  "explain": "遇到非空格且前一字符是空格/开头时计数。",
  "code_ans": "int count_words(const char *s){\n  int n=0, in=0;\n  for(; *s; s++){\n    if(*s==' ') in=0;\n    else if(!in){ in=1; n++; }\n  }\n  return n;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a[5]={10,20,30,40,50};\nprintf(\"%d\\n\", *(a+4));",
  "answer": "输出 50。a 是首地址，a+4 指向第 5 个元素。",
  "explain": "a[i] 与 *(a+i) 等价。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "union U{ int i; char c[4]; };\nprintf(\"%zu\\n\", sizeof(union U));",
  "answer": "输出 4。union 大小取最大成员（int 4 字节）。",
  "explain": "union 成员共享内存，大小 = 最大成员。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "用循环实现 n 的阶乘（不用递归）。",
  "code": "long factorial(int n);",
  "answer": "迭代累乘，注意 n<=1 返回 1。",
  "explain": "迭代累乘，注意 n<=1 返回 1。",
  "code_ans": "long factorial(int n){\n  long r=1;\n  for(int i=2;i<=n;i++) r*=i;\n  return r;\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int *p;\n*p = 10;",
  "answer": "p 是未初始化野指针，解引用写入未知地址，段错误/未定义行为。应先 p=malloc(sizeof(int)) 并判空，或指向合法变量。",
  "explain": "未初始化指针解引用 = 未定义行为。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "在链表头部插入值为 val 的节点。",
  "code": "void list_insert_head(struct Node **head, int val);",
  "answer": "新节点指向原头，更新头指针。",
  "explain": "新节点指向原头，更新头指针。",
  "code_ans": "void list_insert_head(struct Node **head, int val){\n  struct Node *n=create_node(val);\n  if(!n) return;\n  n->next=*head; *head=n;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ip addr show",
  "answer": "显示所有网卡 IP 地址信息。",
  "explain": "ip 命令是 ifconfig 的现代替代。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int i=0;\nwhile(i<3){ printf(\"%d\", i++); }",
  "answer": "输出 012。i++ 先用后加。",
  "explain": "while 与后置自增。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现插入排序。",
  "code": "void insertion_sort(int a[], int n);",
  "answer": "把每个元素插入到已排序部分的正确位置。",
  "explain": "把每个元素插入到已排序部分的正确位置。",
  "code_ans": "void insertion_sort(int a[], int n){\n  for(int i=1;i<n;i++){\n    int key=a[i], j=i-1;\n    while(j>=0 && a[j]>key){ a[j+1]=a[j]; j--; }\n    a[j+1]=key;\n  }\n}"
 },
 {
  "category": "代码写作",
  "q": "原地反转整数数组。",
  "code": "void reverse_int_array(int a[], int n);",
  "answer": "双指针交换。",
  "explain": "双指针交换。",
  "code_ans": "void reverse_int_array(int a[], int n){\n  for(int i=0,j=n-1;i<j;i++,j--){ int t=a[i]; a[i]=a[j]; a[j]=t; }\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "for(int i=0;i<100;i++){\n  char *p = malloc(50);\n  use(p);\n}",
  "answer": "循环内每次 malloc 都不释放，泄漏 100×50 字节。应在循环内用完即 free(p)。",
  "explain": "循环内分配必须循环内释放或复用。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "安全复制字符串：保证不越界且以 '\\0' 结尾。",
  "code": "void safe_copy(char *dst, size_t dst_size, const char *src);",
  "answer": "最多复制 dst_size-1 个字符，最后补 '\\0'，入口判空。",
  "explain": "最多复制 dst_size-1 个字符，最后补 '\\0'，入口判空。",
  "code_ans": "void safe_copy(char *dst, size_t dst_size, const char *src){\n  if(!dst || dst_size==0) return;\n  size_t i=0;\n  while(src && src[i] && i<dst_size-1){ dst[i]=src[i]; i++; }\n  dst[i]='\\0';\n}"
 },
 {
  "category": "代码写作",
  "q": "返回链表节点个数。",
  "code": "int list_length(struct Node *head);",
  "answer": "遍历计数。",
  "explain": "遍历计数。",
  "code_ans": "int list_length(struct Node *head){\n  int n=0;\n  while(head){ n++; head=head->next; }\n  return n;\n}"
 },
 {
  "category": "代码写作",
  "q": "循环队列出队，空队返回 0，成功返回 1。",
  "code": "int circular_dequeue(int q[], int cap, int *head, int *tail, int *v);",
  "answer": "head==tail 即空；取出后 head 前进。",
  "explain": "head==tail 即空；取出后 head 前进。",
  "code_ans": "int circular_dequeue(int q[], int cap, int *head, int *tail, int *v){\n  if(*head==*tail) return 0;\n  *v=q[*head]; *head=(*head+1)%cap;\n  return 1;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "nm app | grep main",
  "answer": "列出 app 的符号表并过滤出 main 相关符号。",
  "explain": "nm 看符号；排查链接问题。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = malloc(10);\nif(!p) return;\n*p = 0;",
  "answer": "malloc 只分配了 10 字节，*p=0 只写 1 字节没问题，但若 p 未判空直接解引用会在内存不足时崩溃；另外更常见错误是未判空就使用。此处已判空，但需注意释放。",
  "explain": "malloc 后必判空、用后必释放。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "less main.c",
  "answer": "分页查看 main.c，支持上下翻页和搜索（/关键词）。",
  "explain": "less 比 more 更强：可向后翻、搜索。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "du -sh /var/log",
  "answer": "统计 /var/log 目录总大小（-s 汇总，-h 人类可读）。",
  "explain": "排查磁盘空间占用用 du -sh *。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "struct S { char c; int i; };\nprintf(\"%zu\\n\", sizeof(struct S));",
  "answer": "32 位默认对齐输出 8：c(1)+填充3+i(4)。",
  "explain": "结构体按最大成员对齐。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "在升序数组 a 中二分查找 key，返回下标，找不到返回 -1。",
  "code": "int binary_search(int a[], int n, int key);",
  "answer": "mid 用 lo+(hi-lo)/2 防溢出，条件 lo<=hi。",
  "explain": "mid 用 lo+(hi-lo)/2 防溢出，条件 lo<=hi。",
  "code_ans": "int binary_search(int a[], int n, int key){\n  int lo=0, hi=n-1;\n  while(lo<=hi){\n    int mid=lo+(hi-lo)/2;\n    if(a[mid]==key) return mid;\n    if(a[mid]<key) lo=mid+1; else hi=mid-1;\n  }\n  return -1;\n}"
 },
 {
  "category": "代码写作",
  "q": "去除升序数组中的重复元素，返回新长度（原地）。",
  "code": "int remove_duplicates(int a[], int n);",
  "answer": "双指针：慢指针指向不重复位置。",
  "explain": "双指针：慢指针指向不重复位置。",
  "code_ans": "int remove_duplicates(int a[], int n){\n  if(n<=1) return n;\n  int k=1;\n  for(int i=1;i<n;i++) if(a[i]!=a[k-1]) a[k++]=a[i];\n  return k;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a[5]={1,2,3,4,5};\nint *p=a;\nprintf(\"%d\\n\", *(p+3));",
  "answer": "输出 4。*(p+3) 等价 a[3] = 4。",
  "explain": "指针 + n 按元素类型偏移。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "head -n 20 log.txt",
  "answer": "只显示 log.txt 前 20 行。",
  "explain": "head -n N 看文件开头；tail 看结尾。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int flag=0;\nwhile(!flag){ } // flag 在中断里被修改",
  "answer": "flag 未用 volatile 声明，编译器可能优化掉循环中的读取，导致死循环。应 volatile int flag。",
  "explain": "中断/多线程共享变量必须 volatile。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "在数组中找到两数之和等于 target 的下标，返回 1/0。",
  "code": "int two_sum(int a[], int n, int target, int *i, int *j);",
  "answer": "暴力 O(n^2) 或排序+双指针；返回两个下标。",
  "explain": "暴力 O(n^2) 或排序+双指针；返回两个下标。",
  "code_ans": "int two_sum(int a[], int n, int target, int *i, int *j){\n  for(int x=0;x<n;x++)\n    for(int y=x+1;y<n;y++)\n      if(a[x]+a[y]==target){ *i=x; *j=y; return 1; }\n  return 0;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char s[] = \"hello\";\nprintf(\"%zu %zu\\n\", sizeof(s), strlen(s));",
  "answer": "输出 6 5。sizeof(s) 含结尾 '\\0' 是 6；strlen(s) 数到 '\\0' 前是 5。",
  "explain": "sizeof 编译期、strlen 运行时。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=2;\nswitch(x){\n case 1: printf(\"A\"); break;\n case 2: printf(\"B\"); break;\n default: printf(\"C\");\n}",
  "answer": "输出 B。case 2 匹配并 break 退出。",
  "explain": "有 break 则正确分支。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a[2][3]={{1,2,3},{4,5,6}};\nprintf(\"%d\\n\", a[1][0]);",
  "answer": "输出 4。第二行第一个元素。",
  "explain": "二维数组下标访问。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char s[]=\"abc\";\nchar *p=s;\nprintf(\"%c\\n\", *(p+2));",
  "answer": "输出 c。p+2 指向第 3 个字符。",
  "explain": "指针偏移 + 解引用。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[16];\nscanf(\"%s\", buf);",
  "answer": "scanf 的 %s 不检查目标大小，输入超长会溢出。应 scanf(\"%15s\", buf) 限制宽度，或用 fgets。",
  "explain": "%s 必须限宽，如 %15s。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "history | tail -n 20",
  "answer": "查看最近执行的 20 条命令历史。",
  "explain": "history 看历史；!N 重执行第 N 条。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[64];\nmemcpy(buf, src, sizeof(buf));  // src 内容只有 10 字节",
  "answer": "memcpy 复制 sizeof(buf)=64 字节，但 src 实际只有 10 字节，读取越界。应复制实际长度。",
  "explain": "memcpy 大小按实际数据长度。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[16];\nstrcpy(buf, \"12345678901234567890\");",
  "answer": "缓冲区溢出：buf 只有 16 字节，strcpy 不检查目标容量，会把 20 个字符越界写入相邻内存。应改用 strncpy(buf,s,sizeof(buf)-1); buf[sizeof(buf)-1]=0; 或 snprintf。",
  "explain": "strcpy/gets 是嵌入式笔试最高频 Bug：不检查容量。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "tar -xzvf app.tar.gz",
  "answer": "解压 app.tar.gz 到当前目录。",
  "explain": "x 解压、z gzip、v 显示、f 文件名。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[32];\ngets(buf);",
  "answer": "gets 不限制输入长度，读入超过 32 字节就溢出缓冲区，标准已废弃该函数。应改用 fgets(buf, sizeof(buf), stdin)。",
  "explain": "gets 因无法防溢出被 C11 移除。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "free -m",
  "answer": "以 MB 显示内存使用：total/used/free/缓存。",
  "explain": "free 看内存；嵌入式排查内存不足常用。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "union U{ int i; char c; };\nunion U u; u.i=0x41;\nprintf(\"%c\\n\", u.c);",
  "answer": "输出 A（0x41 是 'A'）。小端下低字节被 u.c 读取。",
  "explain": "union 按低地址共享，可用它判断大小端。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ls -l /home/user",
  "answer": "以长格式列出 /home/user 下的文件：显示权限、所有者、大小、修改时间。",
  "explain": "ls -l 查看详细信息；-a 显示隐藏文件；-h 人类可读大小。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char *s=\"hello\";\nprintf(\"%s %c\\n\", s, s[1]);",
  "answer": "输出 hello e。s 是字符串，s[1] 是 'e'。",
  "explain": "字符串下标访问字符。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "for(;;){ do_something(); }",
  "answer": "死循环没有退出条件/中断处理，程序卡死。应设计退出条件或看门狗。",
  "explain": "嵌入式里死循环要配看门狗。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "printf(\"%.1f\\n\", 7/2.0);",
  "answer": "输出 3.5。2.0 是浮点，整数提升为浮点除法。",
  "explain": "至少一个操作数是浮点才是浮点除法。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "enum Color{RED,GREEN,BLUE};\nprintf(\"%d\\n\", BLUE);",
  "answer": "输出 2。枚举从 0 递增：RED=0,GREEN=1,BLUE=2。",
  "explain": "枚举默认从 0 开始。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现 my_strdup：复制字符串到新分配的内存并返回。",
  "code": "char *my_strdup(const char *s);",
  "answer": "malloc 长度+1，复制内容，返回；失败返回 NULL。",
  "explain": "malloc 长度+1，复制内容，返回；失败返回 NULL。",
  "code_ans": "char *my_strdup(const char *s){\n  if(!s) return NULL;\n  size_t n = strlen(s)+1;\n  char *p = (char*)malloc(n);\n  if(p) memcpy(p, s, n);\n  return p;\n}"
 },
 {
  "category": "代码写作",
  "q": "不用临时变量交换两个整数（异或法）。",
  "code": "void swap_no_temp(int *a, int *b);",
  "answer": "*a^=*b; *b^=*a; *a^=*b; 注意 a、b 不能是同一变量。",
  "explain": "*a^=*b; *b^=*a; *a^=*b; 注意 a、b 不能是同一变量。",
  "code_ans": "void swap_no_temp(int *a, int *b){\n  if(a==b) return;\n  *a ^= *b; *b ^= *a; *a ^= *b;\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "switch(c){\n  case 'a': f1();\n  case 'b': f2();\n}",
  "answer": "case 缺 break 导致穿透（fallthrough），会顺序执行 f1 和 f2。每个 case 应加 break。",
  "explain": "switch 忘记 break 是经典 Bug。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int *foo(){ int a[5]={0}; return a; }",
  "answer": "返回局部数组名（退化为首地址指针），数组在函数返回后失效。同样应改为堆内存或调用方缓冲区。",
  "explain": "局部数组也在栈上，返回即失效。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "循环队列入队，队列满返回 0，成功返回 1。",
  "code": "int circular_enqueue(int q[], int cap, int *head, int *tail, int v);",
  "answer": "tail 指向下一个空位，(tail+1)%cap 与 head 相等即满。",
  "explain": "tail 指向下一个空位，(tail+1)%cap 与 head 相等即满。",
  "code_ans": "int circular_enqueue(int q[], int cap, int *head, int *tail, int v){\n  if((*tail+1)%cap == *head) return 0;\n  q[*tail]=v; *tail=(*tail+1)%cap;\n  return 1;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "find / -name \"*.log\" 2>/dev/null",
  "answer": "从根目录递归查找所有 .log 文件，错误信息丢弃。",
  "explain": "find -type f 按类型；-mtime 按时间；-exec 执行命令。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "去掉字符串首尾空白字符，返回处理后的字符串。",
  "code": "char *trim(char *s);",
  "answer": "头指针跳过前导空白，尾部把空白替换为 '\\0'。",
  "explain": "头指针跳过前导空白，尾部把空白替换为 '\\0'。",
  "code_ans": "char *trim(char *s){\n  while(*s==' '||*s=='\\t'||*s=='\\n') s++;\n  char *end=s+strlen(s)-1;\n  while(end>=s && (*end==' '||*end=='\\t'||*end=='\\n')) *end--='\\0';\n  return s;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int i=0;\ndo{ printf(\"%d\", i); i++; }while(i<3);",
  "answer": "输出 012。do-while 先执行一次再判断。",
  "explain": "do-while 至少执行一次。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "把 x 的第 n 位清零。",
  "code": "void bit_clr(unsigned int *x, int n);",
  "answer": "*x &= ~(1u << n)。",
  "explain": "*x &= ~(1u << n)。",
  "code_ans": "void bit_clr(unsigned int *x, int n){ *x &= ~(1u << n); }"
 },
 {
  "category": "代码写作",
  "q": "反转单链表并返回新头。",
  "code": "struct Node* list_reverse(struct Node *head);",
  "answer": "三指针迭代：prev/cur/next。",
  "explain": "三指针迭代：prev/cur/next。",
  "code_ans": "struct Node* list_reverse(struct Node *head){\n  struct Node *prev=NULL,*cur=head;\n  while(cur){ struct Node *nx=cur->next; cur->next=prev; prev=cur; cur=nx; }\n  return prev;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "#define SQ(x) x*x\nprintf(\"%d\\n\", SQ(2+3));",
  "answer": "输出 11。宏文本替换：2+3*2+3=11。",
  "explain": "宏参数不加括号的经典陷阱。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "判断字符串是否为回文（正读反读相同），返回 1/0。",
  "code": "int is_palindrome(const char *s);",
  "answer": "双指针比较两端字符。",
  "explain": "双指针比较两端字符。",
  "code_ans": "int is_palindrome(const char *s){\n  int i=0, j=strlen(s)-1;\n  while(i<j){\n    if(s[i++]!=s[j--]) return 0;\n  }\n  return 1;\n}"
 },
 {
  "category": "代码写作",
  "q": "判断单链表是否有环，返回 1/0。",
  "code": "int has_cycle(struct Node *head);",
  "answer": "快慢指针，快走 2 慢走 1，相遇即有环。",
  "explain": "快慢指针，快走 2 慢走 1，相遇即有环。",
  "code_ans": "int has_cycle(struct Node *head){\n  struct Node *s=head,*f=head;\n  while(f && f->next){ s=s->next; f=f->next->next; if(s==f) return 1; }\n  return 0;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "gcc -Wall -O2 -o app main.c",
  "answer": "编译 main.c：-Wall 全部警告、-O2 优化、-o app 输出名。",
  "explain": "嵌入式交叉编译：arm-linux-gnueabihf-gcc。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "用 C 原地反转一个 char 数组表示的字符串。",
  "code": "void reverse(char s[]);",
  "answer": "双指针从两端向中间交换。",
  "explain": "双指针从两端向中间交换。",
  "code_ans": "void reverse(char s[]){\n  if(!s) return;\n  int len = strlen(s);\n  for(int i=0,j=len-1;i<j;i++,j--){\n    char t=s[i]; s[i]=s[j]; s[j]=t;\n  }\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int x=5;\nfree(&x);",
  "answer": "free 只能释放 malloc 分配的内存，栈变量 &x 不能 free，会导致崩溃。",
  "explain": "free 必须对应 malloc。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现 strchr：在 s 中查找字符 c，返回位置指针，找不到返回 NULL。",
  "code": "char *my_strchr(const char *s, char c);",
  "answer": "遍历到 '\\0'，找到即返回。",
  "explain": "遍历到 '\\0'，找到即返回。",
  "code_ans": "char *my_strchr(const char *s, char c){\n  for(; *s; s++) if(*s==c) return (char*)s;\n  return NULL;\n}"
 },
 {
  "category": "代码写作",
  "q": "实现 my_strcmp，a<b 返回负、a==b 返回 0、a>b 返回正。",
  "code": "int my_strcmp(const char *a, const char *b);",
  "answer": "逐字符比较，遇到不同或 '\\0' 停止。",
  "explain": "逐字符比较，遇到不同或 '\\0' 停止。",
  "code_ans": "int my_strcmp(const char *a, const char *b){\n  while(*a && *a==*b){ a++; b++; }\n  return (unsigned char)*a - (unsigned char)*b;\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int *p = &arr[0];\np = p + 5;\nprintf(\"%d\", *p);  // arr 只有 4 个元素",
  "answer": "p+5 超出数组范围再解引用，越界访问。指针运算必须保证在数组范围内。",
  "explain": "指针越界与数组越界同罪。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a=5;\nprintf(\"%d\\n\", (a+=3, a*2));",
  "answer": "输出 16。逗号：先 a=8，再返回 8*2=16。",
  "explain": "逗号表达式从前往后执行。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int a[5];\na[-1] = 0;",
  "answer": "数组下标 -1 越界访问 a 之前的内存，破坏相邻数据。",
  "explain": "下标必须 0~n-1。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int f(int n){ return n<=1?1:n*f(n-1); }\nprintf(\"%d\\n\", f(5));",
  "answer": "输出 120，即 5! = 5×4×3×2×1。",
  "explain": "递归阶乘。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "touch main.c",
  "answer": "创建空文件 main.c；若文件已存在则更新其修改时间戳。",
  "explain": "touch 常用于快速建文件/更新 mtime。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "rm -rf build/",
  "answer": "递归强制删除 build 目录及其内容，不询问。慎用！",
  "explain": "rm -rf 危险命令，删除不可恢复。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a=10,b=20;\nint m = a>b ? a : b;\nprintf(\"%d\\n\", m);",
  "answer": "输出 20。三目运算符取较大者。",
  "explain": "三目 ?: 是 if-else 表达式版。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=5;\nprintf(\"%d\\n\", x << 1);",
  "answer": "输出 10。左移 1 位等价乘 2。",
  "explain": "左移乘 2、右移除 2（注意符号）。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "用循环实现斐波那契第 n 项（n>=0）。",
  "code": "int fib_iter(int n);",
  "answer": "迭代两个变量，避免递归指数爆炸。",
  "explain": "迭代两个变量，避免递归指数爆炸。",
  "code_ans": "int fib_iter(int n){\n  if(n<2) return n;\n  int a=0,b=1;\n  for(int i=2;i<=n;i++){ int t=a+b; a=b; b=t; }\n  return b;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "wc -l main.c",
  "answer": "统计 main.c 的行数。",
  "explain": "wc -w 词数；-c 字节数。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "if(x = 1){ ... }",
  "answer": "赋值 = 与比较 == 混淆：x=1 恒真且改变了 x。应写 if(x == 1)，或用 if(1 == x) 防错。",
  "explain": "== 与 = 混淆是最经典低级错误。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *get_buf(){ static char b[16]; return b; }",
  "answer": "返回 static 缓冲区虽不悬空，但多个调用方共享同一块内存，第二次调用会覆盖第一次内容；多线程下更危险。",
  "explain": "static 缓冲区要说明所有权/生命周期。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "求最小公倍数。",
  "code": "int lcm(int a, int b);",
  "answer": "a/gcd(a,b)*b 防溢出。",
  "explain": "a/gcd(a,b)*b 防溢出。",
  "code_ans": "int lcm(int a, int b){ return a / gcd(a,b) * b; }"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "echo $PATH",
  "answer": "打印环境变量 PATH 的值。",
  "explain": "echo $VAR 查看环境变量；export 设置。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int i=2;\nprintf(\"%d\\n\", i++ * 3);",
  "answer": "输出 6。i++ 先用（2）×3=6，然后 i 变为 3。",
  "explain": "后置自增在表达式求值后生效。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int *foo(){ int x=10; return &x; }",
  "answer": "返回栈上局部变量地址，函数返回后栈帧销毁，指针悬空。应返回 malloc 的内存或由调用方提供缓冲区。",
  "explain": "局部变量生命周期到函数返回结束。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "#define MAX(a,b) ((a)>(b)?(a):(b))\nint m = MAX(i++, j);",
  "answer": "宏参数有副作用：i++ 可能被求值两次，结果不确定。应改用内联函数。",
  "explain": "宏不要传带副作用的参数。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "用 C 实现 my_strlen，返回字符串长度（不调用库函数）。",
  "code": "size_t my_strlen(const char *s);",
  "answer": "指针遍历到 '\\0'，指针相减即长度；入口判空。",
  "explain": "指针遍历到 '\\0'，指针相减即长度；入口判空。",
  "code_ans": "size_t my_strlen(const char *s){\n  if(!s) return 0;\n  const char *p=s;\n  while(*p) p++;\n  return (size_t)(p-s);\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "which gcc",
  "answer": "显示 gcc 可执行文件的完整路径。",
  "explain": "which 查命令位置；type 更详细。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int counter;\nvoid inc(){ counter++; }  // 两个线程同时调用",
  "answer": "多线程共享 counter 无保护，自增非原子，出现竞态条件丢更新。应加锁或使用原子操作。",
  "explain": "共享变量要同步保护。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "返回链表中间节点（快慢指针）。",
  "code": "struct Node* list_middle(struct Node *head);",
  "answer": "快指针到末尾时慢指针在中间。",
  "explain": "快指针到末尾时慢指针在中间。",
  "code_ans": "struct Node* list_middle(struct Node *head){\n  struct Node *s=head,*f=head;\n  while(f && f->next){ s=s->next; f=f->next->next; }\n  return s;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "mv old.c new.c",
  "answer": "把 old.c 重命名为 new.c（或移动文件），同一目录内即重命名。",
  "explain": "mv 可跨目录移动；-i 覆盖前询问。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "cp -r src/ dest/",
  "answer": "递归复制 src 目录到 dest，-r 保留目录结构复制子目录。",
  "explain": "cp -i 覆盖前询问；cp -a 保留属性。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "dmesg | tail -n 50",
  "answer": "查看内核日志最后 50 行（驱动打印、启动信息）。",
  "explain": "嵌入式驱动调试必看 dmesg。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int len = strlen(s);\nfor(int i=0; i<=len; i++){ out[i] = s[i]; }",
  "answer": "当 i==len 时 s[len] 是 '\\0'（可接受），但 out 若只分配 len 字节则 out[len] 越界；且若把 '\\0' 也写入需 out 为 len+1。",
  "explain": "复制字符串要留出 '\\0' 位置。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int i=3;\nprintf(\"%d\\n\", i++ + i++);",
  "answer": "未定义行为（多次修改同一变量），不要这样写。",
  "explain": "序列点之间多次自增 = 未定义。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "man strcpy",
  "answer": "查看 strcpy 函数的手册页（用法、头文件、返回值）。",
  "explain": "man 帮助；man 3 查 C 库函数。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int a=10, b=0;\nint c = a % b;",
  "answer": "取余除零同样未定义行为。需先判 b!=0。",
  "explain": "取余运算符 % 除数也不能为 0。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int count(){ static int n=0; return ++n; }\n// 连续调用三次",
  "answer": "输出 1 2 3。static 局部变量只初始化一次，调用间保持。",
  "explain": "static 生命周期到程序结束。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "grep -v \"^#\" config.conf",
  "answer": "过滤掉以 # 开头的注释行，显示有效配置。",
  "explain": "^ 表示行首，grep -v 反向选择。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "把字符串中的小写字母转为大写。",
  "code": "void to_upper(char *s);",
  "answer": "遍历，'a'-'z' 减 32 转大写。",
  "explain": "遍历，'a'-'z' 减 32 转大写。",
  "code_ans": "void to_upper(char *s){\n  for(; *s; s++) if(*s>='a' && *s<='z') *s -= 32;\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int a[5];\nfor(int i=0; i<=5; i++){ a[i] = i; }",
  "answer": "数组越界：a 长度 5，下标 0~4，i<=5 会写 a[5] 越界，破坏相邻内存。应改为 i<5。",
  "explain": "循环边界 off-by-one，注意 <= 与 <。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "grep -rn \"TODO\" src/",
  "answer": "递归（-r）搜索 src/ 下所有文件里含 TODO 的行并显示行号（-n）。",
  "explain": "grep -i 忽略大小写；-v 反向匹配；-w 全词匹配。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "mkdir -p a/b/c",
  "answer": "递归创建多级目录 a/b/c，父目录不存在也会一并创建。",
  "explain": "mkdir -p 批量建目录；-m 指定权限。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "把 x 的第 n 位（从 0 开始）置 1。",
  "code": "void bit_set(unsigned int *x, int n);",
  "answer": "*x |= (1u << n)。",
  "explain": "*x |= (1u << n)。",
  "code_ans": "void bit_set(unsigned int *x, int n){ *x |= (1u << n); }"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int fib(int n){ return n<2?n:fib(n-1)+fib(n-2); }\nprintf(\"%d\\n\", fib(6));",
  "answer": "输出 8。斐波那契：0,1,1,2,3,5,8。",
  "explain": "递归斐波那契，注意效率问题。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int add(int a,int b){return a+b;}\nint (*fp)(int,int)=add;\nprintf(\"%d\\n\", fp(3,4));",
  "answer": "输出 7。函数指针 fp 调用 add(3,4)。",
  "explain": "函数指针用于回调。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "diff -u old.c new.c",
  "answer": "以统一格式对比两个文件差异，显示修改位置。",
  "explain": "diff -u 生成补丁；patch 应用补丁。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "char *s = \"hello\";\nprintf(\"%zu %zu\\n\", sizeof(s), strlen(s));",
  "answer": "输出 8 5（64 位系统指针 8 字节）。sizeof(s) 是指针大小，不是字符串长度；strlen 是 5。",
  "explain": "sizeof(指针) 固定为指针大小。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "创建单链表节点并返回。",
  "code": "struct Node* create_node(int val);",
  "answer": "malloc + 赋值 + next=NULL。",
  "explain": "malloc + 赋值 + next=NULL。",
  "code_ans": "struct Node { int val; struct Node *next; };\nstruct Node* create_node(int val){\n  struct Node *n=(struct Node*)malloc(sizeof(struct Node));\n  if(!n) return NULL;\n  n->val=val; n->next=NULL;\n  return n;\n}"
 },
 {
  "category": "代码写作",
  "q": "反转整数各位数字（如 123 -> 321，负数保留符号）。",
  "code": "int reverse_int(int n);",
  "answer": "逐位取余累加，注意溢出。",
  "explain": "逐位取余累加，注意溢出。",
  "code_ans": "int reverse_int(int n){\n  int neg=n<0?1:0, r=0;\n  if(neg) n=-n;\n  while(n){ r=r*10+n%10; n/=10; }\n  return neg?-r:r;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "file app",
  "answer": "显示 app 的文件类型（ELF 32位/64位、架构、动态/静态）。",
  "explain": "file 快速判断可执行文件类型，嵌入式必备。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "printf(\"%d\\n\", 0x10);",
  "answer": "输出 16。0x 前缀表示十六进制。",
  "explain": "0x10 = 16。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a[3]={1,2,3};\nint *p=a;\np++;\nprintf(\"%d %d\\n\", *p, a[1]);",
  "answer": "输出 2 2。p 指向 a[1]，*p=2，a[1]=2。",
  "explain": "p++ 使指针指向下一个元素。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "unsigned int i=5;\nwhile(i>=0){ i--; }",
  "answer": "无符号数 i>=0 恒真，i 减到 0 后再减回绕成最大值，死循环。应使用有符号类型或改条件。",
  "explain": "无符号数不会小于 0。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = malloc(10);\nfree(p);\nstrcpy(p, \"abc\");",
  "answer": "use-after-free：free 后 p 指向已释放内存（悬空指针），再写入是未定义行为。free 后应立即 p=NULL 并避免再使用。",
  "explain": "释放后再使用 = 悬空指针。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现 my_strcpy，把 src 复制到 dst（含结尾 '\\0'）。",
  "code": "void my_strcpy(char *dst, const char *src);",
  "answer": "逐个复制直到 '\\0'，把 '\\0' 也复制过去。",
  "explain": "逐个复制直到 '\\0'，把 '\\0' 也复制过去。",
  "code_ans": "void my_strcpy(char *dst, const char *src){\n  while((*dst++ = *src++) != '\\0') ;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "for(int i=0;i<3;i++){ printf(\"%d\", i); }",
  "answer": "输出 012。循环 0,1,2。",
  "explain": "for 循环基本执行。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[32];\nstrncpy(buf, src, sizeof(buf));",
  "answer": "strncpy 最多复制 n 个字符，若 src 长度 >= n 则目标不会以 '\\0' 结尾，后续 strlen/printf 越界。应复制 sizeof(buf)-1 并手动补 '\\0'。",
  "explain": "strncpy 不保证以 '\\0' 结尾，必须手动补 0。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "判断 n 是否为素数，返回 1/0。",
  "code": "int is_prime(int n);",
  "answer": "2 到 sqrt(n) 试除；注意 n<2 不是素数。",
  "explain": "2 到 sqrt(n) 试除；注意 n<2 不是素数。",
  "code_ans": "int is_prime(int n){\n  if(n<2) return 0;\n  for(int i=2;i*i<=n;i++) if(n%i==0) return 0;\n  return 1;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "readelf -h app",
  "answer": "显示 ELF 可执行文件的头部信息（架构、入口地址等）。",
  "explain": "readelf 查看 ELF；嵌入式分析交叉编译产物。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=5;\nprintf(\"%d\\n\", ++x);\nprintf(\"%d\\n\", x++);",
  "answer": "分别输出 6 和 6。++x 先加后用（6），x++ 先用后加（此时 x 还是 6）。",
  "explain": "前置/后置自增的区别。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "export CROSS=arm-linux-gnueabihf-",
  "answer": "设置环境变量 CROSS 为交叉编译工具链前缀。",
  "explain": "export 使变量对子进程可见；配置交叉编译常用。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "top",
  "answer": "动态实时显示进程 CPU/内存占用排名，按 q 退出。",
  "explain": "top 交互式；按 P 按 CPU 排序、M 按内存。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "判断 x 是否为 2 的幂。",
  "code": "int is_power_of_two(unsigned int x);",
  "answer": "x && !(x & (x-1))。",
  "explain": "x && !(x & (x-1))。",
  "code_ans": "int is_power_of_two(unsigned int x){ return x && !(x & (x-1)); }"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "df -h",
  "answer": "以人类可读格式显示各文件系统磁盘占用。",
  "explain": "df 看分区使用率；du 看目录大小。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ldd app",
  "answer": "显示 app 依赖的动态库列表。",
  "explain": "ldd 排查缺库；静态编译则无输出。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "求最大公约数（辗转相除法）。",
  "code": "int gcd(int a, int b);",
  "answer": "b==0 返回 a，否则 gcd(b, a%b)。",
  "explain": "b==0 返回 a，否则 gcd(b, a%b)。",
  "code_ans": "int gcd(int a, int b){ return b==0 ? a : gcd(b, a%b); }"
 },
 {
  "category": "代码写作",
  "q": "删除链表中第一个值为 val 的节点。",
  "code": "void list_delete(struct Node **head, int val);",
  "answer": "遍历找前驱，改指针跳过目标并释放。",
  "explain": "遍历找前驱，改指针跳过目标并释放。",
  "code_ans": "void list_delete(struct Node **head, int val){\n  struct Node *cur=*head, *prev=NULL;\n  while(cur && cur->val!=val){ prev=cur; cur=cur->next; }\n  if(!cur) return;\n  if(prev) prev->next=cur->next; else *head=cur->next;\n  free(cur);\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "kill -9 1234",
  "answer": "强制杀死 PID 为 1234 的进程（SIGKILL，不可被捕获）。",
  "explain": "kill 默认 SIGTERM 优雅退出；-9 强杀。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "chmod 755 script.sh",
  "answer": "设置权限 rwxr-xr-x：所有者可读写执行，组和其他只读执行。",
  "explain": "r=4 w=2 x=1；7=rwx、5=rx。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "统计 x 二进制中 1 的个数。",
  "code": "int count_bits(unsigned int x);",
  "answer": "逐位与 1 累加，或 n&(n-1) 技巧。",
  "explain": "逐位与 1 累加，或 n&(n-1) 技巧。",
  "code_ans": "int count_bits(unsigned int x){\n  int c=0;\n  while(x){ x &= (x-1); c++; }\n  return c;\n}"
 },
 {
  "category": "代码写作",
  "q": "把两个升序数组合并成一个升序数组 c。",
  "code": "void merge_sorted(int a[], int n, int b[], int m, int c[]);",
  "answer": "双指针比较，剩余部分接上。",
  "explain": "双指针比较，剩余部分接上。",
  "code_ans": "void merge_sorted(int a[], int n, int b[], int m, int c[]){\n  int i=0,j=0,k=0;\n  while(i<n && j<m) c[k++] = a[i]<b[j]?a[i++]:b[j++];\n  while(i<n) c[k++]=a[i++];\n  while(j<m) c[k++]=b[j++];\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a[2][3]={1,2,3,4,5,6};\nprintf(\"%d\\n\", *(*(a+1)+2));",
  "answer": "输出 6。a[1][2] = 6。",
  "explain": "二维数组指针解引用。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[64];\nsprintf(buf, \"%s-%d\", name, id);",
  "answer": "sprintf 不检查容量，name 较长时溢出 buf。应使用 snprintf(buf, sizeof(buf), \"%s-%d\", name, id)。",
  "explain": "sprintf -> snprintf 是标配修改。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=1,y=0;\nprintf(\"%d\\n\", x && y);\nprintf(\"%d\\n\", x || y);",
  "answer": "输出 0 和 1。&& 与、|| 或。",
  "explain": "逻辑与/或返回 0/1。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int m[3][4];\nfor(int i=0;i<3;i++)\n  for(int j=0;j<=4;j++) m[i][j]=0;",
  "answer": "内层循环 j<=4 越界，m[i][4] 超出每行 4 个元素（0~3）。应 j<4。",
  "explain": "二维数组越界同样危险。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现 memcpy：把 src 前 n 字节复制到 dst。",
  "code": "void *my_memcpy(void *dst, const void *src, size_t n);",
  "answer": "逐字节复制；注意源和目标不能重叠（重叠用 memmove）。",
  "explain": "逐字节复制；注意源和目标不能重叠（重叠用 memmove）。",
  "code_ans": "void *my_memcpy(void *dst, const void *src, size_t n){\n  unsigned char *d=(unsigned char*)dst;\n  const unsigned char *s=(const unsigned char*)src;\n  for(size_t i=0;i<n;i++) d[i]=s[i];\n  return dst;\n}"
 },
 {
  "category": "代码写作",
  "q": "实现 memset：把 dst 前 n 字节设为 c。",
  "code": "void *my_memset(void *dst, int c, size_t n);",
  "answer": "逐字节赋值，返回原指针。",
  "explain": "逐字节赋值，返回原指针。",
  "code_ans": "void *my_memset(void *dst, int c, size_t n){\n  unsigned char *p=(unsigned char*)dst;\n  for(size_t i=0;i<n;i++) p[i]=(unsigned char)c;\n  return dst;\n}"
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=8;\nprintf(\"%d\\n\", x >> 2);",
  "answer": "输出 2。右移 2 位等价除 4。",
  "explain": "正数右移是除以 2 的幂。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = \"hello\";\np[0] = 'H';",
  "answer": "p 指向字符串字面量（只读区），写入 p[0] 是未定义行为（段错误）。应改为 char p[]=\"hello\"。",
  "explain": "字符串字面量是只读的。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ping -c 4 192.168.1.1",
  "answer": "向目标发送 4 个 ICMP 回显请求，测试网络连通性。",
  "explain": "ping -c 限次数；-W 超时；排查网络必用。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "printf(\"%d\\n\", 7%3);",
  "answer": "输出 1。7 除以 3 余 1。",
  "explain": "% 取余。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int a=3,b=4;\nprintf(\"%d %d\\n\", a<b, a>b);",
  "answer": "输出 1 0。关系表达式结果为 1（真）或 0（假）。",
  "explain": "C 语言没有 bool，用 0/1 表示。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现 atoi：把数字字符串转成 int（可含前导空格和正负号）。",
  "code": "int my_atoi(const char *s);",
  "answer": "跳过空格，处理符号，逐位累加，防溢出。",
  "explain": "跳过空格，处理符号，逐位累加，防溢出。",
  "code_ans": "int my_atoi(const char *s){\n  int sign=1, v=0;\n  while(*s==' ') s++;\n  if(*s=='+'||*s=='-'){ if(*s=='-') sign=-1; s++; }\n  while(*s>='0' && *s<='9'){ v = v*10 + (*s-'0'); s++; }\n  return sign*v;\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char a[]=\"abc\";\nchar b[]=\"abc\";\nif(a == b){ ... }",
  "answer": "a==b 比较的是指针地址而不是内容，永远不相等。应使用 strcmp(a,b)==0。",
  "explain": "字符串比较必须用 strcmp。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int count(){ int n=0; return ++n; }\n// 连续调用三次",
  "answer": "输出 1 1 1。普通局部变量每次调用重新初始化。",
  "explain": "对比 static 与普通局部变量。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char c = 127;\nc = c + 1;",
  "answer": "char 溢出：127+1 在有符号 char 上溢出为 -128（未定义行为/实现相关）。应使用更大类型 int。",
  "explain": "整数溢出要防，嵌入式里尤其注意。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "实现冒泡排序。",
  "code": "void bubble_sort(int a[], int n);",
  "answer": "相邻两两比较，每轮把最大值冒到最后。",
  "explain": "相邻两两比较，每轮把最大值冒到最后。",
  "code_ans": "void bubble_sort(int a[], int n){\n  for(int i=0;i<n-1;i++)\n    for(int j=0;j<n-1-i;j++)\n      if(a[j]>a[j+1]){ int t=a[j]; a[j]=a[j+1]; a[j+1]=t; }\n}"
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "struct S foo(){ struct S s; return s; } // S 内含指针成员",
  "answer": "返回含指针的结构体按值拷贝，若指针指向局部数据则悬空。",
  "explain": "含指针的结构体返回值注意所有权。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "sort data.txt",
  "answer": "按字典序对 data.txt 每行排序输出。",
  "explain": "sort -n 数字排序；-r 逆序；-k 按列。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "int x=6;\nprintf(\"%d\\n\", x & 1);",
  "answer": "输出 0。6 的二进制 110，&1 得 0，判断偶数。",
  "explain": "x&1 判奇偶。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "void isr(){\n  printf(\"irq\\n\");\n  malloc(10);\n}",
  "answer": "中断服务函数里调用 printf/malloc 等不可重入/阻塞函数，会破坏系统。ISR 应只做必要操作并尽快退出。",
  "explain": "ISR 里禁止 printf/malloc/延时。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "cat /etc/passwd",
  "answer": "把 /etc/passwd 文件内容输出到终端。",
  "explain": "cat 适合小文件；大文件用 less。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "把数组中的 0 移到末尾，保持非零元素相对顺序。",
  "code": "void move_zeros(int a[], int n);",
  "answer": "快慢指针：非零前移，末尾补 0。",
  "explain": "快慢指针：非零前移，末尾补 0。",
  "code_ans": "void move_zeros(int a[], int n){\n  int k=0;\n  for(int i=0;i<n;i++) if(a[i]) a[k++]=a[i];\n  while(k<n) a[k++]=0;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "objdump -d app",
  "answer": "反汇编 app 的可执行代码段，查看汇编。",
  "explain": "objdump -d 反汇编；-h 段表；-t 符号表。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char *p = malloc(10);\nfree(p);\nfree(p);",
  "answer": "double free：同一指针释放两次是未定义行为。free 后立即 p=NULL，free(NULL) 是安全的。",
  "explain": "free 后置 NULL 防重复释放。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "#define SQ(x) x*x\nint r = SQ(2+3);",
  "answer": "宏无括号，展开为 2+3*2+3=11。应 #define SQ(x) ((x)*(x))。",
  "explain": "宏参数和整体都要加括号。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ss -tunap",
  "answer": "显示所有 TCP/UDP 连接及对应进程，排查连接问题。",
  "explain": "ss 比 netstat 更快更现代。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "在数组中线性查找 key，返回下标，找不到返回 -1。",
  "code": "int linear_search(int a[], int n, int key);",
  "answer": "顺序遍历比较。",
  "explain": "顺序遍历比较。",
  "code_ans": "int linear_search(int a[], int n, int key){\n  for(int i=0;i<n;i++) if(a[i]==key) return i;\n  return -1;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "ps aux | grep python | grep -v grep",
  "answer": "筛出 python 相关进程，并排除 grep 自身。",
  "explain": "管道把一个命令输出传给下一个命令。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char s[5];\nstrcpy(s, \"abcd\");\ns[5]='\\0';  // 越界",
  "answer": "s 长度 5，合法下标 0~4，s[5] 越界。字符串 \"abcd\" 加 '\\0' 需要 5 个字符刚好放得下，无需也不应再写 s[5]。",
  "explain": "下标 0~n-1，别写到 n。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "char buf[8];\nstrcpy(buf, \"hello world!\");",
  "answer": "buf 只有 8 字节，源字符串 12 字节，strcpy 越界写坏相邻内存（栈破坏/崩溃）。用 snprintf(buf,sizeof(buf),\"%s\",s)。",
  "explain": "越界写栈可能被攻击者利用（栈溢出攻击）。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "void foo(){\n  int *p = malloc(100);\n  // ... 忘记 free(p)\n}",
  "answer": "内存泄漏：malloc 的内存没有释放，每次调用都泄漏 100 字节，长期运行内存耗尽。函数结束前应 free(p)。",
  "explain": "malloc/free 必须配对。",
  "code_ans": ""
 },
 {
  "category": "代码分析",
  "q": "这段代码输出什么？为什么？",
  "code": "#define SQ(x) ((x)*(x))\nprintf(\"%d\\n\", SQ(2+3));",
  "answer": "输出 25。加了括号后正确展开为 (2+3)*(2+3)。",
  "explain": "正确宏写法：整体和参数都加括号。",
  "code_ans": ""
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "gcc -g -o app main.c && gdb app",
  "answer": "编译带调试信息（-g）后启动 gdb 调试器。",
  "explain": "gdb 里 break/run/next/print/bt 常用。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int r = (a, b);",
  "answer": "逗号表达式 (a,b) 结果是 b，若意图是 a 和 b 都执行则没问题，但常被误用导致只取后者。",
  "explain": "逗号表达式结果是最右操作数。",
  "code_ans": ""
 },
 {
  "category": "代码写作",
  "q": "返回数组中的最大值。",
  "code": "int array_max(int a[], int n);",
  "answer": "假设第一个最大，逐个比较。",
  "explain": "假设第一个最大，逐个比较。",
  "code_ans": "int array_max(int a[], int n){\n  int m=a[0];\n  for(int i=1;i<n;i++) if(a[i]>m) m=a[i];\n  return m;\n}"
 },
 {
  "category": "Linux 命令",
  "q": "解释这条命令的作用：",
  "code": "chown root:staff app",
  "answer": "把 app 的所有者改为 root、属组改为 staff。",
  "explain": "chown user:group 文件。",
  "code_ans": ""
 },
 {
  "category": "代码判断",
  "q": "这段代码有什么问题？请指出并说明怎么改。",
  "code": "int a=10, b=0;\nint c = a / b;",
  "answer": "整数除零是未定义行为，程序崩溃（SIGFPE）。使用前判断 if(b!=0)。",
  "explain": "除零检查是基本健壮性。",
  "code_ans": ""
 }
];
