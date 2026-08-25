/* =============================================================
 * 用户登录 + 数据隔离（本地账号体系）
 *  - 账号注册/登录/游客模式
 *  - 每个账号的数据存到独立命名空间（localStorage 前缀），互不干扰
 *  - 说明：纯前端本地账号，仅用于个人设备上区分用户，非云端安全认证
 * ============================================================= */
(function(){
'use strict';
var USER_KEY='agent_users_v1';
var SESSION_KEY='agent_session_v1';
var RAW={agent_users_v1:1, agent_session_v1:1};

var currentUser=null;
try{
  var _s=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
  if(_s && _s.u && typeof _s.u==='string') currentUser=_s.u;
}catch(e){}

function prefixKey(k){ if(RAW[k]) return k; if(!currentUser) return k; return k+'_'+currentUser; }

/* ---- localStorage 命名空间垫片：所有现有代码自动按账号隔离 ---- */
var _g=localStorage.getItem.bind(localStorage);
var _s2=localStorage.setItem.bind(localStorage);
var _r=localStorage.removeItem.bind(localStorage);
var _c=localStorage.clear.bind(localStorage);
localStorage.getItem=function(k){ return _g(prefixKey(k)); };
localStorage.setItem=function(k,v){ return _s2(prefixKey(k),v); };
localStorage.removeItem=function(k){ return _r(prefixKey(k)); };
localStorage.clear=function(){ _c(); };

function getUsers(){ try{ return JSON.parse(_g(USER_KEY)||'{}'); }catch(e){ return {}; } }
function saveUsers(u){ _s2(USER_KEY, JSON.stringify(u)); }

function sha256hex(str){
  try{
    if(window.crypto && crypto.subtle && crypto.subtle.digest){
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function(buf){
        return Array.prototype.map.call(new Uint8Array(buf), function(b){ return ('0'+b.toString(16)).slice(-2); }).join('');
      });
    }
  }catch(e){}
  return Promise.resolve(simpleHash(str));
}
function simpleHash(str){ var h=5381; for(var i=0;i<str.length;i++){ h=((h<<5)+h+str.charCodeAt(i))>>>0; } return 'h'+h.toString(16); }
function randSalt(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }

function doLogin(u){
  currentUser=u;
  _s2(SESSION_KEY, JSON.stringify({u:u}));
  location.reload();
}
function doLogout(){
  currentUser=null;
  _r(SESSION_KEY);
  location.reload();
}

/* ---- 登录弹窗样式 ---- */
var css=
'.auth-wrap{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(5,8,16,.85);backdrop-filter:blur(10px)}'+
'.auth-card{width:370px;max-width:92vw;background:linear-gradient(180deg,rgba(17,25,40,.97),rgba(10,16,28,.99));border:1px solid rgba(148,163,184,.2);border-radius:20px;padding:34px 30px 24px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.55);animation:fadeUp .4s ease}'+
'.auth-logo{width:56px;height:56px;margin:0 auto 12px;border-radius:16px;display:grid;place-items:center;font-size:26px;background:linear-gradient(135deg,#38bdf8,#6366f1);box-shadow:0 8px 24px rgba(56,189,248,.35)}'+
'.auth-card h2{font-size:19px;color:#fff;margin-bottom:4px}'+
'.auth-sub{font-size:12px;color:#8ea0b8;margin-bottom:18px;line-height:1.7}'+
'.auth-tabs{display:flex;gap:8px;background:rgba(148,163,184,.1);border-radius:12px;padding:4px;margin-bottom:14px}'+
'.auth-tabs button{flex:1;padding:9px;border:none;border-radius:9px;background:transparent;color:#8ea0b8;font-size:14px;cursor:pointer;transition:.2s;font-family:inherit}'+
'.auth-tabs button.on{background:linear-gradient(135deg,#38bdf8,#6366f1);color:#fff}'+
'#authForm input{width:100%;box-sizing:border-box;background:rgba(13,20,35,.9);border:1px solid rgba(148,163,184,.2);border-radius:11px;color:#e6edf7;padding:12px 14px;font-size:14px;margin-bottom:10px;outline:none;font-family:inherit}'+
'#authForm input:focus{border-color:#38bdf8}'+
'.auth-msg{min-height:20px;font-size:12.5px;color:#f87171;margin-bottom:6px}'+
'.auth-btn{width:100%;padding:13px;border:none;border-radius:11px;font-size:15px;font-weight:700;color:#fff;background:linear-gradient(135deg,#38bdf8,#6366f1);cursor:pointer;box-shadow:0 6px 20px rgba(56,189,248,.3);transition:.2s;font-family:inherit}'+
'.auth-btn:hover{filter:brightness(1.12)}'+
'.auth-foot{margin-top:16px;font-size:12.5px}'+
'.auth-foot a{color:#8ea0b8;text-decoration:none}'+
'.auth-foot a:hover{color:#38bdf8}'+
'#userBox{margin-top:10px;padding-top:10px;border-top:1px solid rgba(148,163,184,.12)}'+
'#userBox .mini{display:flex;justify-content:space-between;font-size:11.5px;color:#8ea0b8;margin-bottom:8px}'+
'#userBox .mini b{color:#38bdf8;font-weight:700}'+
'#userBox .gh{display:block;text-align:center;font-size:12px;color:#e6edf7;text-decoration:none;padding:8px;border-radius:10px;border:1px solid rgba(148,163,184,.2);transition:.2s;background:rgba(148,163,184,.06)}'+
'#userBox .gh:hover{border-color:#38bdf8}';
var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

/* ---- 登录弹窗 ---- */
function buildOverlay(){
  var d=document.createElement('div');
  d.id='authOverlay';
  d.className='auth-wrap';
  d.innerHTML='<div class="auth-card">'+
    '<div class="auth-logo">🔐</div>'+
    '<h2>嵌入式面试 AI Agent</h2>'+
    '<p class="auth-sub">登录后各账号练习记录、薄弱点、AI 配置<b style="color:#38bdf8">互不干扰</b><br>纯本地账号 · 数据保存在当前浏览器</p>'+
    '<div class="auth-tabs"><button id="authTabLogin" class="on" onclick="AUTH.tab(\'login\')">登 录</button><button id="authTabReg" onclick="AUTH.tab(\'reg\')">注 册</button></div>'+
    '<div id="authForm">'+
      '<input id="authUser" placeholder="用户名（2-20 位，字母/数字/下划线/中文）" maxlength="20" autocomplete="username">'+
      '<input id="authPass" type="password" placeholder="密码（至少 4 位）" maxlength="64" autocomplete="current-password">'+
      '<div id="authRegExtra" class="hidden"><input id="authPass2" type="password" placeholder="再次输入密码" autocomplete="new-password"></div>'+
      '<div id="authMsg" class="auth-msg"></div>'+
      '<button class="auth-btn" id="authGo" onclick="AUTH.submit()">登 录</button>'+
    '</div>'+
    '<div class="auth-foot"><a href="javascript:void(0)" onclick="AUTH.guest()">暂不登录，游客模式 →</a></div>'+
  '</div>';
  document.body.appendChild(d);
  var u=document.getElementById('authUser');
  if(u) u.focus();
}

window.AUTH={
  tab:function(mode){
    var isLogin=(mode==='login');
    var tl=document.getElementById('authTabLogin');
    var tr=document.getElementById('authTabReg');
    if(!tl) return;
    tl.className=isLogin?'on':'';
    tr.className=isLogin?'':'on';
    document.getElementById('authRegExtra').classList.toggle('hidden',isLogin);
    document.getElementById('authGo').textContent=isLogin?'登 录':'注 册';
    document.getElementById('authMsg').textContent='';
  },
  guest:function(){
    var o=document.getElementById('authOverlay');
    if(o) o.remove();
  },
  show:function(){ buildOverlay(); },
  submit:function(){
    var u=(document.getElementById('authUser').value||'').trim();
    var p=document.getElementById('authPass').value||'';
    var isLogin=document.getElementById('authTabLogin').className==='on';
    var msg=document.getElementById('authMsg');
    if(!/^[\w\u4e00-\u9fa5]{2,20}$/.test(u)){ msg.textContent='用户名需 2-20 位（字母/数字/下划线/中文）'; return; }
    if(p.length<4){ msg.textContent='密码至少 4 位'; return; }
    var users=getUsers();
    if(isLogin){
      var rec=users[u];
      if(!rec){ msg.textContent='该用户不存在，请先注册'; return; }
      sha256hex(p+':'+rec.salt).then(function(h){
        if(h===rec.hash){ doLogin(u); } else { msg.textContent='密码错误'; }
      });
    } else {
      if(users[u]){ msg.textContent='该用户名已被注册'; return; }
      var p2=document.getElementById('authPass2').value||'';
      if(p!==p2){ msg.textContent='两次密码不一致'; return; }
      var salt=randSalt();
      sha256hex(p+':'+salt).then(function(h){
        users[u]={salt:salt, hash:h, created:Date.now()};
        saveUsers(users);
        doLogin(u);
      });
    }
  },
  logout:doLogout,
  user:function(){ return currentUser; },
  /* 调试/工具：直接读写原始（未加账号前缀）的数据 */
  rawGet:function(k){ return _g(k); },
  rawSet:function(k,v){ return _s2(k,v); },
  rawRemove:function(k){ return _r(k); }
};

/* ---- 页面加载后：无会话则弹登录框；侧边栏显示用户信息 ---- */
document.addEventListener('DOMContentLoaded', function(){
  if(!currentUser) buildOverlay();
  var box=document.getElementById('userBox');
  if(box){
    if(currentUser){
      box.innerHTML='<div class="mini"><span>👤 当前用户</span><b>'+currentUser+'</b></div>'+
        '<a href="javascript:void(0)" class="gh" onclick="AUTH.logout()">🚪 退出登录</a>';
    } else {
      box.innerHTML='<a href="javascript:void(0)" class="gh" onclick="AUTH.show()">🔐 登录 / 注册</a>';
    }
  }
});
})();
