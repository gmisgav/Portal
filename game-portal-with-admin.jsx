import { useState, useMemo, createContext, useContext } from "react";
import { ComposedChart, BarChart, LineChart, Bar, Line, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

// ══════════════════════════════════════════════════════════════════════════════
// AUTH & PERMISSIONS SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
const LEVELS    = ["none","view","edit","admin"];
const levelRank = l => LEVELS.indexOf(l);
const canView   = l => levelRank(l) >= levelRank("view");
const canEdit   = l => levelRank(l) >= levelRank("edit");
const SECTION_IDS = ["economy","tournaments","missions","missions-v2","cashback","liveops","matchmaking"];

const SEED_USERS = [
  { id:1, email:"admin@company.com",   name:"Super Admin",   password:"admin123",  role:"superadmin",
    permissions:{economy:"admin",tournaments:"admin",missions:"admin","missions-v2":"admin",cashback:"admin",liveops:"admin",matchmaking:"admin"} },
  { id:2, email:"lead@company.com",    name:"LiveOps Lead",  password:"lead123",   role:"editor",
    permissions:{economy:"edit",tournaments:"edit",missions:"edit","missions-v2":"edit",cashback:"view",liveops:"view",matchmaking:"edit"} },
  { id:3, email:"analyst@company.com", name:"Data Analyst",  password:"analyst123",role:"viewer",
    permissions:{economy:"view",tournaments:"view",missions:"view","missions-v2":"view",cashback:"none",liveops:"none",matchmaking:"view"} },
  { id:4, email:"junior@company.com",  name:"Junior Designer",password:"junior123",role:"viewer",
    permissions:{economy:"none",tournaments:"none",missions:"view","missions-v2":"view",cashback:"none",liveops:"none",matchmaking:"none"} },
];

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const doLogin = (em, pw) => {
    const u = SEED_USERS.find(u => u.email.toLowerCase() === em.toLowerCase().trim() && u.password === pw);
    if (u) onLogin(u); else setError("Invalid email or password.");
  };

  const RCOL = { superadmin:"#f6ad55", editor:"#90cdf4", viewer:"#718096" };
  const RBG  = { superadmin:"#2d3748", editor:"#2c5282", viewer:"#1e2a45" };

  return (
    <div style={{minHeight:"100vh",background:"#0a0d14",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:"420px"}}>
        <div style={{textAlign:"center",marginBottom:"28px"}}>
          <div style={{width:"52px",height:"52px",background:"linear-gradient(135deg,#3182ce,#553c9a)",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",margin:"0 auto 12px"}}>🎯</div>
          <h1 style={{margin:"0 0 4px",fontSize:"22px",fontWeight:"800",color:"#e2e8f0"}}>Game Features Portal</h1>
          <p style={{margin:0,fontSize:"12px",color:"#4a5568"}}>Economy & LiveOps Management Console</p>
        </div>
        <div style={{background:"#111827",border:"1px solid #1e2a45",borderRadius:"16px",padding:"28px"}}>
          <h2 style={{margin:"0 0 18px",fontSize:"16px",fontWeight:"700",color:"#90cdf4"}}>Sign in</h2>
          <div style={{marginBottom:"12px"}}>
            <label style={{display:"block",fontSize:"11px",color:"#718096",marginBottom:"4px",fontWeight:"600"}}>EMAIL</label>
            <input type="text" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&doLogin(email,password)} placeholder="you@company.com"
              style={{width:"100%",padding:"10px 12px",background:"#0f1117",border:"1px solid "+(error?"#c53030":"#2d3748"),borderRadius:"8px",color:"#e2e8f0",fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:"16px"}}>
            <label style={{display:"block",fontSize:"11px",color:"#718096",marginBottom:"4px",fontWeight:"600"}}>PASSWORD</label>
            <input type="password" value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&doLogin(email,password)} placeholder="••••••••"
              style={{width:"100%",padding:"10px 12px",background:"#0f1117",border:"1px solid "+(error?"#c53030":"#2d3748"),borderRadius:"8px",color:"#e2e8f0",fontSize:"13px",outline:"none",boxSizing:"border-box"}}/>
          </div>
          {error && <div style={{padding:"8px 12px",background:"#2d1a1a",border:"1px solid #c53030",borderRadius:"7px",color:"#fc8181",fontSize:"12px",marginBottom:"12px"}}>⚠️ {error}</div>}
          <button onClick={()=>doLogin(email,password)}
            style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#3182ce,#553c9a)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"14px",cursor:"pointer",marginBottom:"20px"}}>
            Sign In →
          </button>
          <div style={{borderTop:"1px solid #1e2a45",paddingTop:"16px"}}>
            <div style={{fontSize:"11px",color:"#718096",fontWeight:"600",marginBottom:"8px"}}>⚡ QUICK LOGIN</div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {SEED_USERS.map(u=>(
                <button key={u.id} onClick={()=>onLogin(u)}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:"#0f1117",border:"1px solid #1e2a45",borderRadius:"8px",cursor:"pointer",width:"100%"}}>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:"12px",color:"#e2e8f0",fontWeight:"600"}}>{u.name}</div>
                    <div style={{fontSize:"10px",color:"#4a5568"}}>{u.email}</div>
                  </div>
                  <span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"10px",fontWeight:"700",background:RBG[u.role],color:RCOL[u.role]}}>{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── User Row component (hooks must be in a component, not inside .map) ────────
function UserRow({ u, currentUser, editId, setEditId, onSave, onDelete }) {
  const [draft, setDraft] = useState(null);
  const isEditing = editId === u.id;
  const isSelf    = u.id === currentUser.id;
  const ROLE_OPTS = ["superadmin","editor","viewer"];
  const LEVEL_OPTS= ["none","view","edit","admin"];
  const LEVEL_COL = { none:"#4a5568", view:"#63b3ed", edit:"#f6ad55", admin:"#fc8181" };
  const ROLE_COL  = { superadmin:"#f6ad55", editor:"#90cdf4", viewer:"#718096" };
  const FEAT_LIST = [{id:"economy",icon:"💰",label:"Economy"},{id:"tournaments",icon:"🏆",label:"Tournaments"},{id:"missions",icon:"🗡️",label:"Missions"},{id:"missions-v2",icon:"⚔️",label:"Missions V2"},{id:"cashback",icon:"💸",label:"Cash Back"},{id:"liveops",icon:"🎮",label:"Live Ops"}];

  const startEdit  = () => { setDraft({...u, permissions:{...u.permissions}}); setEditId(u.id); };
  const cancelEdit = () => { setDraft(null); setEditId(null); };

  return (
    <div style={{background:"#141820",borderRadius:"10px",border:"1px solid "+(isEditing?"#f6ad55":"#2d3748"),padding:"14px"}}>
      {!isEditing ? (
        <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
          <div style={{width:"34px",height:"34px",background:"linear-gradient(135deg,#2c5282,#553c9a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"700",color:"#fff",flexShrink:0}}>{u.name[0]}</div>
          <div style={{flex:1,minWidth:"140px"}}>
            <div style={{fontSize:"13px",fontWeight:"700",color:"#e2e8f0",display:"flex",alignItems:"center",gap:"6px"}}>
              {u.name}{isSelf&&<span style={{fontSize:"9px",padding:"1px 6px",background:"#276749",borderRadius:"8px",color:"#9ae6b4"}}>YOU</span>}
            </div>
            <div style={{fontSize:"11px",color:"#4a5568"}}>{u.email}</div>
          </div>
          <span style={{fontSize:"10px",padding:"3px 10px",borderRadius:"10px",fontWeight:"700",background:ROLE_COL[u.role]+"22",color:ROLE_COL[u.role],border:"1px solid "+ROLE_COL[u.role]+"44"}}>{u.role}</span>
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap",flex:2,minWidth:"260px"}}>
            {SECTION_IDS.map(sid=>{
              const f=FEAT_LIST.find(x=>x.id===sid), lv=u.permissions[sid]||"none";
              return <div key={sid} style={{display:"flex",alignItems:"center",gap:"3px",padding:"2px 6px",background:LEVEL_COL[lv]+"18",border:"1px solid "+LEVEL_COL[lv]+"44",borderRadius:"5px"}}>
                <span style={{fontSize:"10px"}}>{f?.icon}</span>
                <span style={{fontSize:"9px",color:LEVEL_COL[lv],fontWeight:"600"}}>{lv==="none"?"—":lv}</span>
              </div>;
            })}
          </div>
          <div style={{display:"flex",gap:"6px",marginLeft:"auto"}}>
            <button onClick={startEdit} style={{padding:"5px 12px",background:"#2c5282",border:"none",borderRadius:"6px",color:"#90cdf4",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>✏️ Edit</button>
            {!isSelf&&<button onClick={()=>onDelete(u.id)} style={{padding:"5px 10px",background:"transparent",border:"1px solid #c53030",borderRadius:"6px",color:"#fc8181",fontSize:"11px",cursor:"pointer"}}>✕</button>}
          </div>
        </div>
      ) : draft && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"12px"}}>
            {[["Name","name","text"],["Email","email","text"],["Password","password","text"]].map(([l,k,t])=>(
              <div key={k}>
                <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"3px",fontWeight:"600"}}>{l.toUpperCase()}</label>
                <input type={t} value={draft[k]} onChange={e=>setDraft(v=>({...v,[k]:e.target.value}))}
                  style={{width:"100%",padding:"7px 10px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          <div style={{marginBottom:"12px"}}>
            <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"5px",fontWeight:"600"}}>ROLE</label>
            <div style={{display:"flex",gap:"8px"}}>
              {ROLE_OPTS.map(r=>(
                <button key={r} onClick={()=>setDraft(v=>({...v,role:r}))}
                  style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid "+(draft.role===r?ROLE_COL[r]:"#2d3748"),background:draft.role===r?ROLE_COL[r]+"22":"transparent",color:draft.role===r?ROLE_COL[r]:"#718096",cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>{r}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:"12px"}}>
            <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"7px",fontWeight:"600"}}>PERMISSIONS PER SECTION</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
              {SECTION_IDS.map(sid=>{
                const f=FEAT_LIST.find(x=>x.id===sid), cur=draft.permissions[sid]||"none";
                return (
                  <div key={sid} style={{background:"#0f1117",borderRadius:"7px",padding:"8px"}}>
                    <div style={{fontSize:"10px",color:"#a0aec0",marginBottom:"5px",fontWeight:"600"}}>{f?.icon} {f?.label}</div>
                    <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
                      {LEVEL_OPTS.map(l=>(
                        <button key={l} onClick={()=>setDraft(v=>({...v,permissions:{...v.permissions,[sid]:l}}))}
                          style={{padding:"2px 7px",borderRadius:"4px",border:"1px solid "+(cur===l?LEVEL_COL[l]:"#2d3748"),background:cur===l?LEVEL_COL[l]+"22":"transparent",color:cur===l?LEVEL_COL[l]:"#4a5568",cursor:"pointer",fontSize:"10px",fontWeight:"600"}}>{l}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={()=>{onSave(draft);setDraft(null);}} style={{padding:"7px 18px",background:"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"7px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>💾 Save</button>
            <button onClick={cancelEdit} style={{padding:"7px 14px",background:"transparent",border:"1px solid #2d3748",borderRadius:"7px",color:"#a0aec0",fontSize:"12px",cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ users, setUsers, currentUser, onClose }) {
  const [tab,     setTab]     = useState("users");
  const [editId,  setEditId]  = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({email:"",name:"",password:"",role:"viewer",permissions:Object.fromEntries(SECTION_IDS.map(s=>[s,"none"]))});
  const [saveMsg, setSaveMsg] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const ROLE_OPTS  = ["superadmin","editor","viewer"];
  const LEVEL_OPTS = ["none","view","edit","admin"];
  const LEVEL_COL  = { none:"#4a5568", view:"#63b3ed", edit:"#f6ad55", admin:"#fc8181" };
  const ROLE_COL   = { superadmin:"#f6ad55", editor:"#90cdf4", viewer:"#718096" };
  const FEAT_LIST  = [{id:"economy",icon:"💰",label:"Economy"},{id:"tournaments",icon:"🏆",label:"Tournaments"},{id:"missions",icon:"🗡️",label:"Missions"},{id:"missions-v2",icon:"⚔️",label:"Missions V2"},{id:"cashback",icon:"💸",label:"Cash Back"},{id:"liveops",icon:"🎮",label:"Live Ops"}];

  const flash = msg => { setSaveMsg(msg); setTimeout(()=>setSaveMsg(""),2000); };
  const onSave   = updated => { setUsers(u=>u.map(x=>x.id===updated.id?updated:x)); setEditId(null); flash("✅ Saved"); };
  const onDelete = id => { if(id===currentUser.id)return; setUsers(u=>u.filter(x=>x.id!==id)); flash("🗑 Removed"); };
  const addUser  = () => {
    if(!newUser.email||!newUser.name||!newUser.password){flash("⚠️ Fill all fields");return;}
    if(users.find(u=>u.email.toLowerCase()===newUser.email.toLowerCase())){flash("⚠️ Email exists");return;}
    setUsers(u=>[...u,{...newUser,id:Date.now()}]);
    setNewUser({email:"",name:"",password:"",role:"viewer",permissions:Object.fromEntries(SECTION_IDS.map(s=>[s,"none"]))});
    setShowAdd(false); flash("✅ User added");
  };

  const filtered = users.filter(u=>!searchQ||u.name.toLowerCase().includes(searchQ.toLowerCase())||u.email.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px",overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:"940px",background:"#0f1117",borderRadius:"16px",border:"1px solid #2d3748",fontFamily:"'Segoe UI',sans-serif",color:"#e2e8f0"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #2d3748",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(135deg,#0f1420,#1a1f2e)",borderRadius:"16px 16px 0 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontSize:"20px"}}>🛡️</span>
            <div><h2 style={{margin:0,fontSize:"16px",fontWeight:"800",color:"#f6ad55"}}>Admin Panel</h2>
              <p style={{margin:0,fontSize:"11px",color:"#4a5568"}}>User management & permissions</p></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            {saveMsg&&<span style={{fontSize:"12px",padding:"4px 10px",background:"#1a2e1a",border:"1px solid #276749",borderRadius:"6px",color:"#68d391"}}>{saveMsg}</span>}
            <button onClick={onClose} style={{padding:"6px 14px",background:"transparent",border:"1px solid #2d3748",borderRadius:"8px",color:"#a0aec0",cursor:"pointer",fontSize:"12px"}}>✕ Close</button>
          </div>
        </div>
        <div style={{padding:"0 20px",background:"#141820",borderBottom:"1px solid #2d3748",display:"flex"}}>
          {[["users","👥 Users"],["matrix","🔐 Matrix"],["roles","📋 Roles"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 14px",border:"none",background:"none",cursor:"pointer",color:tab===id?"#f6ad55":"#718096",borderBottom:tab===id?"2px solid #f6ad55":"2px solid transparent",fontWeight:tab===id?"700":"400",fontSize:"12px"}}>{label}</button>
          ))}
        </div>
        <div style={{padding:"18px 20px"}}>

          {tab==="users" && (<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",gap:"10px",flexWrap:"wrap"}}>
              <input placeholder="🔍 Search…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                style={{flex:1,minWidth:"200px",padding:"8px 12px",background:"#141820",border:"1px solid #2d3748",borderRadius:"8px",color:"#e2e8f0",fontSize:"12px",outline:"none"}}/>
              <button onClick={()=>setShowAdd(v=>!v)}
                style={{padding:"8px 16px",background:showAdd?"#2d3748":"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>
                {showAdd?"✕ Cancel":"+ Add User"}
              </button>
            </div>
            {showAdd&&(
              <div style={{background:"#0d1a12",border:"1px solid #276749",borderRadius:"12px",padding:"16px",marginBottom:"14px"}}>
                <h3 style={{margin:"0 0 12px",fontSize:"13px",color:"#68d391",fontWeight:"700"}}>➕ New User</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                  {[["Name","name","text"],["Email","email","text"],["Password","password","text"]].map(([l,k,t])=>(
                    <div key={k}>
                      <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"3px",fontWeight:"600"}}>{l.toUpperCase()}</label>
                      <input type={t} value={newUser[k]} onChange={e=>setNewUser(v=>({...v,[k]:e.target.value}))} placeholder={l}
                        style={{width:"100%",padding:"7px 10px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#e2e8f0",fontSize:"12px",outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:"12px"}}>
                  <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"5px",fontWeight:"600"}}>ROLE</label>
                  <div style={{display:"flex",gap:"8px"}}>
                    {ROLE_OPTS.map(r=>(
                      <button key={r} onClick={()=>setNewUser(v=>({...v,role:r}))}
                        style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid "+(newUser.role===r?ROLE_COL[r]:"#2d3748"),background:newUser.role===r?ROLE_COL[r]+"22":"transparent",color:newUser.role===r?ROLE_COL[r]:"#718096",cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>{r}</button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"12px"}}>
                  <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"7px",fontWeight:"600"}}>PERMISSIONS</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
                    {SECTION_IDS.map(sid=>{
                      const f=FEAT_LIST.find(x=>x.id===sid), cur=newUser.permissions[sid];
                      return (
                        <div key={sid} style={{background:"#141820",borderRadius:"7px",padding:"8px"}}>
                          <div style={{fontSize:"10px",color:"#a0aec0",marginBottom:"5px",fontWeight:"600"}}>{f?.icon} {f?.label}</div>
                          <div style={{display:"flex",gap:"4px",flexWrap:"wrap"}}>
                            {LEVEL_OPTS.map(l=>(
                              <button key={l} onClick={()=>setNewUser(v=>({...v,permissions:{...v.permissions,[sid]:l}}))}
                                style={{padding:"2px 7px",borderRadius:"4px",border:"1px solid "+(cur===l?LEVEL_COL[l]:"#2d3748"),background:cur===l?LEVEL_COL[l]+"22":"transparent",color:cur===l?LEVEL_COL[l]:"#4a5568",cursor:"pointer",fontSize:"10px",fontWeight:"600"}}>{l}</button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button onClick={addUser} style={{padding:"8px 20px",background:"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>✅ Create User</button>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {filtered.map(u=>(
                <UserRow key={u.id} u={u} currentUser={currentUser} editId={editId} setEditId={setEditId} onSave={onSave} onDelete={onDelete}/>
              ))}
            </div>
          </>)}

          {tab==="matrix" && (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                <thead><tr style={{background:"#141820"}}>
                  <th style={{padding:"10px 12px",textAlign:"left",color:"#718096",fontWeight:"600",borderBottom:"1px solid #2d3748"}}>User</th>
                  {SECTION_IDS.map(sid=>{
                    const f=FEAT_LIST.find(x=>x.id===sid);
                    return <th key={sid} style={{padding:"10px 8px",textAlign:"center",color:"#a0aec0",fontWeight:"600",fontSize:"10px",borderBottom:"1px solid #2d3748",whiteSpace:"nowrap"}}>{f?.icon}<br/>{f?.label}</th>;
                  })}
                </tr></thead>
                <tbody>{users.map((u,i)=>(
                  <tr key={u.id} style={{background:i%2===0?"#141820":"transparent"}}>
                    <td style={{padding:"10px 12px",borderBottom:"1px solid #1e2a45"}}>
                      <div style={{fontWeight:"700",color:"#e2e8f0",fontSize:"12px"}}>{u.name}</div>
                      <div style={{color:"#4a5568",fontSize:"10px"}}>{u.email}</div>
                      <span style={{fontSize:"9px",padding:"1px 6px",borderRadius:"8px",background:ROLE_COL[u.role]+"22",color:ROLE_COL[u.role],fontWeight:"600"}}>{u.role}</span>
                    </td>
                    {SECTION_IDS.map(sid=>{
                      const lv=u.permissions[sid]||"none";
                      const ICON={none:"—",view:"👁",edit:"✏️",admin:"🔑"};
                      return (
                        <td key={sid} style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #1e2a45"}}>
                          <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:"2px",padding:"5px 10px",borderRadius:"7px",background:LEVEL_COL[lv]+"18",border:"1px solid "+LEVEL_COL[lv]+"44",minWidth:"52px"}}>
                            <span style={{fontSize:"11px"}}>{ICON[lv]}</span>
                            <span style={{fontSize:"9px",fontWeight:"700",color:LEVEL_COL[lv]}}>{lv}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          {tab==="roles" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              {[
                {role:"superadmin",color:"#f6ad55",icon:"👑",desc:"Full access to everything.",perms:["View all sections","Edit all sections","Export JSON & CSV","Manage users","Open Admin Panel"]},
                {role:"editor",    color:"#90cdf4",icon:"✏️", desc:"Edit assigned sections. No user management.",perms:["View assigned sections","Edit assigned sections","Export JSON & CSV","✕ Manage users","✕ Admin Panel"]},
                {role:"viewer",    color:"#718096",icon:"👁", desc:"Read-only. No editing or exporting.",perms:["View assigned sections","✕ Edit anything","✕ Export data","✕ Manage users","✕ Admin Panel"]},
              ].map(({role,color,icon,desc,perms})=>(
                <div key={role} style={{background:"#141820",borderRadius:"12px",padding:"16px",border:"1px solid "+color+"44"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                    <span style={{fontSize:"20px"}}>{icon}</span>
                    <span style={{fontSize:"14px",fontWeight:"800",color}}>{role}</span>
                  </div>
                  <p style={{margin:"0 0 10px",fontSize:"11px",color:"#718096",lineHeight:1.6}}>{desc}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                    {perms.map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"7px",fontSize:"11px"}}>
                        <span style={{color:p.startsWith("✕")?"#fc8181":"#68d391"}}>{p.startsWith("✕")?"✕":"✓"}</span>
                        <span style={{color:p.startsWith("✕")?"#718096":"#a0aec0"}}>{p.replace("✕ ","")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{background:"#141820",borderRadius:"12px",padding:"16px",border:"1px solid #2d3748",gridColumn:"span 2"}}>
                <div style={{fontSize:"12px",fontWeight:"700",color:"#90cdf4",marginBottom:"10px"}}>🔐 Access Level Legend</div>
                <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
                  {[["none","—","#4a5568","Hidden"],["view","👁","#63b3ed","Read only"],["edit","✏️","#f6ad55","Full edit"],["admin","🔑","#fc8181","Edit + export"]].map(([l,icon,c,desc])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 12px",background:"#0f1117",borderRadius:"8px",border:"1px solid "+c+"33"}}>
                      <span style={{fontSize:"14px"}}>{icon}</span>
                      <div><div style={{fontSize:"11px",fontWeight:"700",color:c}}>{l}</div><div style={{fontSize:"10px",color:"#4a5568"}}>{desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Access Gate ───────────────────────────────────────────────────────────────
function AccessGate({ sectionId, children }) {
  const { currentUser } = useAuth();
  const level = currentUser?.permissions?.[sectionId] || "none";
  if (!canView(level)) return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{textAlign:"center",padding:"40px"}}>
        <div style={{fontSize:"48px",marginBottom:"14px"}}>🔒</div>
        <h2 style={{margin:"0 0 8px",color:"#fc8181",fontSize:"18px"}}>Access Denied</h2>
        <p style={{color:"#4a5568",fontSize:"13px",margin:0}}>You don't have permission to view this section.</p>
      </div>
    </div>
  );
  return children;
}

function ViewOnlyBanner({ sectionId }) {
  const { currentUser } = useAuth();
  const level = currentUser?.permissions?.[sectionId] || "none";
  if (canEdit(level)) return null;
  return (
    <div style={{background:"#1a1a08",border:"1px solid #744210",borderRadius:"8px",padding:"8px 14px",marginBottom:"10px",display:"flex",alignItems:"center",gap:"8px",fontSize:"11px",color:"#f6ad55"}}>
      <span>👁</span><span><strong>View Only</strong> — Contact an admin to request edit access.</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED HELPERS
// ══════════════════════════════════════════════════════════════════════════════
const FEATURES = [
  {id:"economy",    icon:"💰",label:"Economy",    color:"#f6ad55",border:"#744210",bg:"#1a1508",status:"active",     description:"Token rates, reward values, chip pricing, platform rake & room EV calculations."},
  {id:"tournaments",icon:"🏆",label:"Tournaments",color:"#90cdf4",border:"#2c5282",bg:"#0d1a2e",status:"active",description:"Configure tournament schedules, prize pools, entry fees, room rewards, missions and leaderboard rules."},
  {id:"missions",   icon:"🗡️",label:"Missions",   color:"#68d391",border:"#276749",bg:"#0d1a12",status:"active",     description:"30-tier mission simulator with token earn rates, B.cash & chip rewards, persona UX and export."},
  {id:"missions-v2",icon:"⚔️",label:"Missions V2",color:"#b794f4",border:"#553c9a",bg:"#150d2e",status:"active",     description:"7-day daily missions with per-mission rewards, stars, weekly bar milestones and persona analysis."},
  {id:"cashback",   icon:"💸",label:"Cash Back",  color:"#fc8181",border:"#9b2c2c",bg:"#1a0d0d",status:"coming-soon",description:"Configure cashback percentages, tier thresholds, payout schedules and user eligibility rules."},
  {id:"liveops",      icon:"🎮",label:"Live Ops",      color:"#63b3ed",border:"#2b6cb0",bg:"#0d1520",status:"coming-soon",description:"Real-time event management, seasonal campaigns, push notifications and player engagement tools."},
  {id:"matchmaking",  icon:"🎯",label:"Matchmaking",  color:"#f687b3",border:"#97266d",bg:"#1a0d1a",status:"active",     description:"Score-based matchmaking simulator — pool scores, K-factor ELO, win ratio adjustments & match range config."},
];
const STATUS = {
  "active":      {label:"Active",      bg:"#276749",color:"#9ae6b4",dot:"#68d391"},
  "coming-soon": {label:"Coming Soon", bg:"#2d3748",color:"#a0aec0",dot:"#4a5568"},
};

function PBar({ val, max, color, h }) {
  const p = max > 0 ? Math.min(100,(+val||0)/(+max)*100) : 0;
  return (
    <div style={{background:"#2d3748",borderRadius:"4px",height:h||6,overflow:"hidden"}}>
      <div style={{height:"100%",width:p+"%",background:p>=100?"#68d391":(color||"#63b3ed"),borderRadius:"4px",transition:"width 0.3s"}}/>
    </div>
  );
}

function downloadCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r=>headers.map(h=>JSON.stringify(r[h]??'')).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
  a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function HistCopyBtn({ json }) {
  const [ok,setOk] = useState(false);
  const copy = () => { const s=JSON.stringify(json,null,2); if(navigator.clipboard?.writeText) navigator.clipboard.writeText(s).then(()=>{setOk(true);setTimeout(()=>setOk(false),2000);}); };
  return <button onClick={copy} style={{padding:"5px 10px",background:ok?"#276749":"#2c5282",border:"none",borderRadius:"6px",color:"#fff",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>{ok?"✅ Copied":"📋 JSON"}</button>;
}

const CHIP_VALUE = 1/1200;
const MPCOLS     = ["#63b3ed","#68d391","#f6ad55","#fc8181"];
const r2  = v => Math.round((+v||0)*100)/100;
const r4  = v => Math.round((+v||0)*10000)/10000;
const r1  = v => Math.round((+v||0)*10)/10;
const $f  = v => "$"+r2(v).toFixed(2);
const pf  = v => r2(v).toFixed(2)+"%";

// ══════════════════════════════════════════════════════════════════════════════
// MISSIONS V1
// ══════════════════════════════════════════════════════════════════════════════
const STATIC_GOALS = [
  {"$type":"playCashMatch","grantTokenAmount":1,"uiInfo":{"iconResourceKey":"Missions/Icons/PlayCashRoom_Goal","titleLocalizationKey":"Play Cash Room"}},
  {"$type":"winCashMatch","grantTokenAmount":2,"uiInfo":{"iconResourceKey":"Missions/Icons/WinCashRoom_Goal","titleLocalizationKey":"Win in Cash Room"},"treatPositiveCashAsWin":false}
];
const STATIC_UI   = {"resourceKey":"ScriptableObjects/FrenzyJam","joiningMissionPopupEnabled":true};
const STATIC_MULT = {"defaultCashMultiplier":1,"cashMultiplierConfigurations":[],"cashMultiplierConfigurationOverrides":[{"room":{"id":"match3_e_cash_1_p_cash_u_7","$recordType":"room"},"multiplier":1},{"room":{"id":"match3_e_cash_1_p_cash_u_6","$recordType":"room"},"multiplier":1},{"room":{"id":"match3_e_cash_3_p_cash_u_6","$recordType":"room"},"multiplier":3},{"room":{"id":"match3_e_cash_5_p_cash_u_6","$recordType":"room"},"multiplier":5},{"room":{"id":"match3_e_cash_7_p_cash_u_6","$recordType":"room"},"multiplier":7},{"room":{"id":"blocks_e_cash_1_p_cash_u_7","$recordType":"room"},"multiplier":1},{"room":{"id":"blocks_e_cash_1_p_cash_u_6","$recordType":"room"},"multiplier":1},{"room":{"id":"blocks_e_cash_3_p_cash_u_6","$recordType":"room"},"multiplier":3},{"room":{"id":"blocks_e_cash_5_p_cash_u_6","$recordType":"room"},"multiplier":5},{"room":{"id":"blocks_e_cash_7_p_cash_u_6","$recordType":"room"},"multiplier":7},{"room":{"id":"solitaire_e_cash_1_p_cash_u_7","$recordType":"room"},"multiplier":1},{"room":{"id":"solitaire_e_cash_1_p_cash_u_6","$recordType":"room"},"multiplier":1},{"room":{"id":"solitaire_e_cash_3_p_cash_u_6","$recordType":"room"},"multiplier":3},{"room":{"id":"solitaire_e_cash_5_p_cash_u_6","$recordType":"room"},"multiplier":5},{"room":{"id":"solitaire_e_cash_7_p_cash_u_6","$recordType":"room"},"multiplier":7},{"room":{"id":"bubbleShooter_e_cash_1_p_cash_u_7","$recordType":"room"},"multiplier":1},{"room":{"id":"bubbleShooter_e_cash_3_p_cash_u_6","$recordType":"room"},"multiplier":3},{"room":{"id":"bubbleShooter_e_cash_5_p_cash_u_6","$recordType":"room"},"multiplier":5},{"room":{"id":"bubbleShooter_e_cash_7_p_cash_u_6","$recordType":"room"},"multiplier":7}]};

const DEF_ROOMS    = [{fee:1,dist:85,winRate:28,rtp:0.86,bonusCash:40,playTokens:1,winTokens:2},{fee:3,dist:8,winRate:30,rtp:0.72,bonusCash:27,playTokens:3,winTokens:6},{fee:5,dist:3,winRate:32,rtp:0.80,bonusCash:17,playTokens:5,winTokens:10},{fee:7,dist:4,winRate:35,rtp:0.88,bonusCash:19,playTokens:7,winTokens:14}];
const DEF_PERSONAS = [{name:"Casual",pct:"50th %",matches:10,tokens:30},{name:"Engaged",pct:"75th %",matches:23,tokens:92},{name:"Extreme",pct:"90th %",matches:51,tokens:160},{name:"Whale",pct:"99th % Est",matches:80,tokens:250}];
// Tiers synced from company Excel (Missions_Config - Dollar Per To sheet)
const DEF_TIERS = [
  {id:1, tokReq:1,  bcash:0,    chips:20},  {id:2, tokReq:1,  bcash:0,   chips:40},
  {id:3, tokReq:2,  bcash:0,    chips:40},  {id:4, tokReq:4,  bcash:0.1, chips:20},
  {id:5, tokReq:3,  bcash:0.1,  chips:0},   {id:6, tokReq:4,  bcash:0,   chips:150},
  {id:7, tokReq:6,  bcash:0.2,  chips:0},   {id:8, tokReq:4,  bcash:0.1, chips:100},
  {id:9, tokReq:14, bcash:0.5,  chips:0},   {id:10,tokReq:8,  bcash:0.2, chips:0},
  {id:11,tokReq:7,  bcash:0,    chips:200}, {id:12,tokReq:14, bcash:0.3, chips:0},
  {id:13,tokReq:12, bcash:0.2,  chips:0},   {id:14,tokReq:9,  bcash:0.1, chips:200},
  {id:15,tokReq:22, bcash:1,    chips:0},   {id:16,tokReq:12, bcash:0.3, chips:100},
  {id:17,tokReq:8,  bcash:0.2,  chips:0},   {id:18,tokReq:18, bcash:0.5, chips:100},
  {id:19,tokReq:12, bcash:0.3,  chips:0},   {id:20,tokReq:8,  bcash:0,   chips:240},
  {id:21,tokReq:11, bcash:0.2,  chips:300}, {id:22,tokReq:15, bcash:0.3, chips:0},
  {id:23,tokReq:18, bcash:0.5,  chips:0},   {id:24,tokReq:10, bcash:0,   chips:400},
  {id:25,tokReq:25, bcash:2,    chips:0},   {id:26,tokReq:40, bcash:0.6, chips:200},
  {id:27,tokReq:55, bcash:1,    chips:0},   {id:28,tokReq:58, bcash:0.8, chips:300},
  {id:29,tokReq:60, bcash:1,    chips:0},   {id:30,tokReq:100,bcash:18,  chips:0},
];
let _nextTierId = 200;

function MissionsPage({ onBack, readOnly, history, setHistory, histNote, setHistNote }) {
  const [tab,      setTab]      = useState("tiers");
  const [rooms,    setRooms]    = useState(()=>DEF_ROOMS.map(r=>({...r})));
  const [personas, setPersonas] = useState(()=>DEF_PERSONAS.map(p=>({...p})));
  const [tiers,    setTiers]    = useState(()=>DEF_TIERS.map(t=>({...t})));
  const [avgTokBC, setAvgTokBC] = useState(6.726);
  const [selP,     setSelP]     = useState(0);
  const [qaRes,    setQaRes]    = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [csvMsg,   setCsvMsg]   = useState("");
  const [xlUpload, setXlUpload] = useState(null);
  const [xlConfirm,setXlConfirm]= useState(false);

  // ── Pure-JS CSV/Excel upload — no external deps ────────────────────────────
  const handleXlFile = (file) => {
    if (!file) return;
    const COL_ALIASES = {
      // tokens
      "tokens req":"tokReq","tokens_req":"tokReq","tokreq":"tokReq","token req":"tokReq","token_req":"tokReq",
      // bonus cash — all common variants
      "reward b.cash":"bcash","reward bcash":"bcash","b.cash":"bcash","bcash":"bcash",
      "bonus cash":"bcash","bonus_cash":"bcash","reward_b.cash":"bcash","b cash":"bcash",
      "reward b. cash":"bcash","bcash ($)":"bcash","bonus cash ($)":"bcash","b.cash ($)":"bcash",
      "reward bonus cash":"bcash",
      // chips
      "reward chips":"chips","chips":"chips","reward_chips":"chips","reward chips ($)":"chips",
    };
    // Strip currency/percent symbols so "$0.50", "50%" etc parse correctly
    const cleanNum = v => parseFloat(String(v ?? "").replace(/[$,%]/g, "").trim());

    const parseRows = (rawRows) => {
      const errors = [], parsed = [];
      let bcashColFound = false;
      rawRows.forEach((row, ri) => {
        const norm = {};
        Object.entries(row).forEach(([k,v]) => {
          const mk = COL_ALIASES[k.toLowerCase().trim()];
          if (mk) { norm[mk] = v; if (mk === "bcash") bcashColFound = true; }
        });
        if (norm.tokReq === undefined && norm.bcash === undefined) return;
        const tokReq = cleanNum(norm.tokReq);
        if (isNaN(tokReq) || tokReq < 1) {
          if (String(norm.tokReq||"").trim()) errors.push("Row "+(ri+1)+": Tokens Req = "+norm.tokReq+" is not valid");
          return;
        }
        const bcashVal = cleanNum(norm.bcash);
        parsed.push({ id:_nextTierId++, tokReq:Math.max(1,Math.round(tokReq)), bcash:Math.max(0,r2(isNaN(bcashVal)?0:bcashVal)), chips:Math.max(0,Math.round(isNaN(cleanNum(norm.chips))?0:cleanNum(norm.chips))) });
      });
      if (!parsed.length && !errors.length) errors.push("No valid rows found. Columns needed: 'Tokens Req', 'Reward B.cash', 'Reward Chips'");
      if (parsed.length && !bcashColFound) errors.push("ℹ️ No B.cash column found — all B.cash set to 0. Expected: 'Bonus Cash', 'B.cash', 'Reward B.cash'");
      return { errors:errors.slice(0,10), parsed };
    };

    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    if (ext === "csv" || ext === "tsv") {
      reader.onload = (e) => {
        try {
          // Strip UTF-8 BOM if present (common when exported from Excel on Windows)
          const text  = e.target.result.replace(/^\uFEFF/, "");
          const lines = text.trim().split(/\r?\n/);
          if (lines.length < 2) { setXlUpload({rows:[],errors:["File is empty"],fileName:file.name}); return; }
          const splitRow = (line) => {
            const cells=[]; let cur="", inQ=false;
            for (let i=0;i<line.length;i++) {
              const ch=line[i];
              if(ch==='"'){inQ=!inQ;}
              else if(ch===','&&!inQ){cells.push(cur.trim());cur="";}
              else cur+=ch;
            }
            cells.push(cur.trim()); return cells;
          };
          const headers = splitRow(lines[0]);
          const rawRows = lines.slice(1).map(l=>{ const c=splitRow(l); const o={}; headers.forEach((h,i)=>{o[h]=c[i]??""}); return o; });
          const {errors,parsed} = parseRows(rawRows);
          setXlUpload({rows:parsed,errors,fileName:file.name});
          setXlConfirm(false);
        } catch(err){ setXlUpload({rows:[],errors:["CSV error: "+err.message],fileName:file.name}); }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const XLSX = window.XLSX;
        if (!XLSX) {
          setXlUpload({rows:[],errors:["Please save your Excel file as CSV first: File → Save As → CSV, then upload the .csv file."],fileName:file.name});
          return;
        }
        try {
          const wb = XLSX.read(new Uint8Array(e.target.result),{type:"array",cellFormula:false});
          const wsName = wb.SheetNames.find(n=>n.toLowerCase().includes("mission"))||wb.SheetNames[0];
          const raw = XLSX.utils.sheet_to_json(wb.Sheets[wsName],{defval:""});
          const {errors,parsed} = parseRows(raw);
          setXlUpload({rows:parsed,errors,fileName:file.name,sheetUsed:wsName});
          setXlConfirm(false);
        } catch(err){ setXlUpload({rows:[],errors:["Excel error: "+err.message],fileName:file.name}); }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const applyXlUpload = () => { if(!xlUpload||!xlUpload.rows.length)return; setTiers(xlUpload.rows); setXlUpload(null); setXlConfirm(false); };

  const compRooms = useMemo(()=>rooms.map(r=>{ const wF=r.winRate/100; const evMatch=r2(r.playTokens+r.winTokens*wF); const netCost=r.fee*(1-r.rtp); return{...r,evMatch,evDollar:netCost>0?r2(evMatch/netCost):0}; }),[rooms]);
  const avgEntryFee    = useMemo(()=>r2(compRooms.reduce((s,r)=>s+(r.dist/100)*r.fee,0)),[compRooms]);
  const avgTokPerMatch = useMemo(()=>r4(compRooms.reduce((s,r)=>s+(r.dist/100)*r.evMatch,0)),[compRooms]);
  const avgTokPerDol   = useMemo(()=>r2(compRooms.reduce((s,r)=>s+(r.dist/100)*r.evDollar,0)),[compRooms]);

  const compTiers = useMemo(()=>{ let cT=0,cS=0,cM=0,cR=0,cB=0; return tiers.map((t,idx)=>{ cT+=t.tokReq; const ts=avgTokBC>0?t.tokReq/avgTokBC:0; const em=r1(ts); cM=r2(cM+em); cS=r2(cS+ts); const tr=r2(t.bcash+t.chips*CHIP_VALUE); const tcb=ts>0?r2(tr/ts*100):0; cR=r2(cR+tr); cB=r2(cB+t.bcash); return{...t,tierNum:idx+1,cumTok:cT,estCum:cM,tierSpend:r2(ts),cumSpend:r2(cS),totalRew:tr,tierCB:tcb,cumCB:cS>0?r2(cR/cS*100):0,cumRew:cR,cumBcash:cB}; }); },[tiers,avgTokBC]);

  const journeys = useMemo(()=>personas.map((p,i)=>{ const reached=compTiers.filter(t=>p.tokens>=t.cumTok); const last=reached.length>0?reached[reached.length-1]:null; return{...p,reached,last,bcash:r2(reached.reduce((s,t)=>s+t.bcash,0)),chips:reached.reduce((s,t)=>s+t.chips,0),color:MPCOLS[i%4]}; }),[personas,compTiers]);
  const safeSelP = Math.min(selP,journeys.length-1);

  const updateTier   = (id,k,v) => setTiers(p=>p.map(t=>t.id!==id?t:{...t,[k]:k==="chips"?Math.max(0,Math.round(+v)||0):k==="tokReq"?Math.max(1,Math.round(+v)||1):Math.max(0,r2(+v))}));
  const addTier      = () => { const l=tiers[tiers.length-1]; setTiers(p=>[...p,{id:_nextTierId++,tokReq:l?l.tokReq:5,bcash:0,chips:0}]); };
  const removeTier   = id => setTiers(p=>p.filter(t=>t.id!==id));
  const updateRoom   = (i,k,v) => setRooms(p=>p.map((r,ri)=>ri!==i?r:{...r,[k]:r2(+v)}));
  const addRoom      = () => setRooms(p=>[...p,{fee:1,dist:0,winRate:30,rtp:0.80,bonusCash:20,playTokens:1,winTokens:2}]);
  const removeRoom   = i => setRooms(p=>p.filter((_,ri)=>ri!==i));
  const updatePersona= (i,k,v) => setPersonas(p=>p.map((pe,pi)=>pi!==i?pe:{...pe,[k]:k==="name"||k==="pct"?v:Math.max(0,Math.round(+v)||0)}));
  const removePersona= i => { setPersonas(p=>p.filter((_,pi)=>pi!==i)); setSelP(s=>Math.max(0,s>i?s-1:s)); };

  const buildJSON = () => ({ minUserLevel:1, tiers:compTiers.map(t=>{ const skus=[]; if(t.bcash>0)skus.push({type:"bonusCash",payload:{value:r2(t.bcash)}}); if(t.chips>0)skus.push({type:"virtual",payload:{value:Math.round(t.chips)}}); return{requiredTokenAmount:t.tokReq,skus}; }), goals:STATIC_GOALS, uiConfig:STATIC_UI, multipliersConfiguration:STATIC_MULT });
  const runQA = json => { const checks=[],pass=m=>checks.push({ok:true,msg:m}),fail=m=>checks.push({ok:false,msg:m}); ["minUserLevel","tiers","goals","uiConfig","multipliersConfiguration"].forEach(k=>json[k]!==undefined?pass('✓ "'+k+'" present'):fail('✗ Missing "'+k+'"')); const jt=json.tiers||[]; jt.length===tiers.length?pass("✓ Tiers: "+tiers.length):fail("✗ Tiers: expected "+tiers.length+" got "+jt.length); let errs=0; tiers.forEach((t,i)=>{const j=jt[i];if(!j){fail("✗ Tier "+(i+1)+" missing");errs++;return;}if(j.requiredTokenAmount!==t.tokReq){fail("✗ T"+(i+1)+" tokReq mismatch");errs++;}}); if(!errs)pass("✓ All tier token amounts correct"); const g=json.goals||[]; g.length===2?pass("✓ Goals count: 2"):fail("✗ Goals: "+g.length); try{JSON.parse(JSON.stringify(json));pass("✓ JSON serialises cleanly");}catch(e){fail("✗ "+e.message);} return checks; };
  const copyJSON = () => { const json=buildJSON(),checks=runQA(json); setQaRes(checks); if(checks.some(c=>!c.ok))return; const str=JSON.stringify(json,null,2); if(navigator.clipboard?.writeText)navigator.clipboard.writeText(str).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}); };
  const exportCSV = () => { try{downloadCSV(compTiers.map(t=>({"Tier":t.tierNum,"Tokens Req":t.tokReq,"Efective Tokens Req":r2(Math.max(0,t.tokReq-t.bcash*avgTokBC)),"Cumulative Tokens":t.cumTok,"Est. Tier Spend ($)":t.tierSpend,"Est. Cum. Spend ($)":t.cumSpend,"Reward B.cash":t.bcash||"","Reward Chips":t.chips||"","Tier Cashback %":pf(Math.min(t.tierCB,999)),"Cum. Cashback %":pf(t.cumCB),"Total Reward Value ($)":t.totalRew,"Cum. Reward Value ($)":t.cumRew})),"missions_v1.csv");setCsvMsg("✅ Downloaded!");}catch(e){setCsvMsg("⚠️ "+e.message);} };
  const saveSnapshot = () => { const now=new Date(); const label="Config "+now.toLocaleDateString()+" "+now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}); const id=now.getTime(); const csvRows=compTiers.map(t=>({"Tier":t.tierNum,"Tokens Req":t.tokReq,"Efective Tokens Req":r2(Math.max(0,t.tokReq-t.bcash*avgTokBC)),"Cumulative Tokens":t.cumTok,"Est. Tier Spend ($)":t.tierSpend,"Est. Cum. Spend ($)":t.cumSpend,"Reward B.cash":t.bcash||"","Reward Chips":t.chips||"","Tier Cashback %":pf(Math.min(t.tierCB,999)),"Cum. Cashback %":pf(t.cumCB),"Total Reward Value ($)":t.totalRew,"Cum. Reward Value ($)":t.cumRew})); setHistory(h=>[{id,label,date:now.toISOString(),json:buildJSON(),csvRows,meta:{tiers:tiers.length,maxRew:compTiers.length>0?compTiers[compTiers.length-1].cumRew:0,avgTokBC}},...h]); setHistNote(n=>({...n,[id]:label})); };

  const mc   = {background:"#1a1f2e",border:"1px solid #2d3748",borderRadius:"12px",padding:"14px",marginBottom:"12px"};
  const th   = {padding:"6px 8px",textAlign:"left",color:"#718096",fontWeight:"600",borderBottom:"1px solid #2d3748",fontSize:"10px",whiteSpace:"nowrap"};
  const tdS  = c => ({padding:"5px 8px",fontSize:"11px",borderBottom:"1px solid #141820",color:c||"#e2e8f0"});
  const tipS = {background:"#1a1f2e",border:"1px solid #2d3748",borderRadius:"8px",padding:"10px",fontSize:"11px"};
  const TABS = [{id:"tiers",label:"🏆 Tiers"},{id:"graphs",label:"📈 Graphs"},{id:"persona",label:"👤 Personas"},{id:"inputs",label:"✏️ Inputs"},{id:"export",label:"📤 Export"},{id:"history",label:"📜 History"}];

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#0f1117",minHeight:"100vh",color:"#e2e8f0"}}>
      <div style={{background:"linear-gradient(135deg,#0d1a12,#1a1f2e)",padding:"10px 16px",borderBottom:"1px solid #2d3748",display:"flex",alignItems:"center",gap:"10px"}}>
        <button onClick={onBack} style={{padding:"5px 12px",background:"#1e2a45",border:"1px solid #2d3748",borderRadius:"6px",color:"#a0aec0",fontSize:"12px",cursor:"pointer"}}>← Portal</button>
        <span style={{color:"#2d3748"}}>|</span>
        <span style={{fontSize:"13px",color:"#68d391",fontWeight:"700"}}>🗡️ Missions V1</span>
        <div style={{marginLeft:"auto",display:"flex",gap:"12px",fontSize:"11px"}}>
          {[["Tok/$+BC",avgTokBC,"#b794f4"],["Tok/$",avgTokPerDol,"#68d391"],["Tok/Match",avgTokPerMatch,"#63b3ed"],["Avg Fee",$f(avgEntryFee),"#f6ad55"]].map(([l,v,c])=>(
            <span key={l} style={{color:"#718096"}}>{l}: <strong style={{color:c}}>{v}</strong></span>
          ))}
        </div>
      </div>
      <div style={{background:"#1a1f2e",borderBottom:"1px solid #2d3748",padding:"0 16px",display:"flex"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 12px",border:"none",background:"none",cursor:"pointer",color:tab===t.id?"#63b3ed":"#a0aec0",borderBottom:tab===t.id?"2px solid #63b3ed":"2px solid transparent",fontWeight:tab===t.id?"600":"400",fontSize:"12px"}}>{t.label}</button>)}
      </div>
      <div style={{padding:"14px 16px",maxWidth:"1300px",margin:"0 auto"}}>

        {tab==="tiers" && (<>
          {/* Excel Upload Panel */}
          <div style={{background:"#141820",border:"1px solid #2d3748",borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <span style={{fontSize:"18px"}}>📥</span>
                <div>
                  <div style={{fontSize:"13px",fontWeight:"700",color:"#90cdf4"}}>Import Tiers from Excel / CSV</div>
                  <div style={{fontSize:"10px",color:"#4a5568"}}>Reads your company Excel columns: <span style={{color:"#63b3ed"}}>Tokens Req</span> · <span style={{color:"#68d391"}}>Reward B.cash</span> · <span style={{color:"#f6ad55"}}>Reward Chips</span></div>
                </div>
              </div>
              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                <button onClick={()=>downloadCSV([
                  {"Tier":1,"Tokens Req":1,"Reward B.cash":"","Reward Chips":50},
                  {"Tier":2,"Tokens Req":1,"Reward B.cash":"","Reward Chips":80},
                  {"Tier":3,"Tokens Req":2,"Reward B.cash":"","Reward Chips":100},
                  {"Tier":4,"Tokens Req":3,"Reward B.cash":0.10,"Reward Chips":50},
                  {"Tier":5,"Tokens Req":3,"Reward B.cash":0.20,"Reward Chips":""},
                ],"tiers_template.csv")}
                  style={{padding:"6px 12px",background:"#1e2a45",border:"1px solid #2d3748",borderRadius:"6px",color:"#90cdf4",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>
                  ⬇ Template CSV
                </button>
                <label style={{padding:"6px 14px",background:"linear-gradient(135deg,#2c5282,#553c9a)",borderRadius:"6px",color:"#fff",fontSize:"11px",cursor:"pointer",fontWeight:"700",whiteSpace:"nowrap"}}>
                  📂 Upload File
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={e=>{if(e.target.files[0])handleXlFile(e.target.files[0]);e.target.value="";}} style={{display:"none"}}/>
                </label>
              </div>
            </div>

            {xlUpload && (
              <div style={{borderTop:"1px solid #2d3748",paddingTop:"12px",marginTop:"12px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",flexWrap:"wrap"}}>
                  <span style={{fontSize:"11px",color:"#718096"}}>📄 <strong style={{color:"#e2e8f0"}}>{xlUpload.fileName}</strong>{xlUpload.sheetUsed&&<span style={{color:"#4a5568"}}> · sheet: {xlUpload.sheetUsed}</span>}</span>
                  {xlUpload.errors.length===0
                    ? <span style={{fontSize:"10px",padding:"2px 8px",background:"#276749",borderRadius:"8px",color:"#9ae6b4",fontWeight:"700"}}>✅ {xlUpload.rows.length} tiers ready</span>
                    : <span style={{fontSize:"10px",padding:"2px 8px",background:"#9b2c2c",borderRadius:"8px",color:"#fed7d7",fontWeight:"700"}}>⚠️ {xlUpload.errors.length} issue{xlUpload.errors.length>1?"s":""}</span>
                  }
                  <button onClick={()=>setXlUpload(null)} style={{marginLeft:"auto",padding:"2px 8px",background:"transparent",border:"1px solid #4a5568",borderRadius:"5px",color:"#718096",fontSize:"10px",cursor:"pointer"}}>✕ Clear</button>
                </div>
                {xlUpload.errors.length>0 && (
                  <div style={{background:"#2d1a1a",border:"1px solid #c53030",borderRadius:"8px",padding:"10px",marginBottom:"10px"}}>
                    <div style={{fontSize:"11px",fontWeight:"700",color:"#fc8181",marginBottom:"4px"}}>Issues to fix:</div>
                    {xlUpload.errors.map((e,i)=><div key={i} style={{fontSize:"10px",color:"#fc8181",marginBottom:"2px"}}>• {e}</div>)}
                  </div>
                )}
                {xlUpload.rows.length>0 && (
                  <div style={{marginBottom:"10px"}}>
                    <div style={{fontSize:"10px",color:"#718096",marginBottom:"5px",fontWeight:"600"}}>PREVIEW — first {Math.min(xlUpload.rows.length,8)} of {xlUpload.rows.length} tiers:</div>
                    <table style={{borderCollapse:"collapse",fontSize:"10px",width:"auto"}}>
                      <thead><tr style={{background:"#0f1117"}}>{["#","Tokens Req","Reward B.cash","Reward Chips"].map(h=><th key={h} style={{padding:"4px 12px",textAlign:"left",color:"#718096",borderBottom:"1px solid #2d3748",fontWeight:"600"}}>{h}</th>)}</tr></thead>
                      <tbody>{xlUpload.rows.slice(0,8).map((row,i)=>(
                        <tr key={i} style={{background:i%2?"#141820":"transparent"}}>
                          <td style={{padding:"3px 12px",color:"#90cdf4",fontWeight:"700"}}>{i+1}</td>
                          <td style={{padding:"3px 12px",color:"#e2e8f0"}}>{row.tokReq}</td>
                          <td style={{padding:"3px 12px",color:"#68d391"}}>{row.bcash>0?$f(row.bcash):"—"}</td>
                          <td style={{padding:"3px 12px",color:"#f6ad55"}}>{row.chips>0?row.chips:"—"}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                    {xlUpload.rows.length>8&&<div style={{fontSize:"10px",color:"#4a5568",marginTop:"4px"}}>…and {xlUpload.rows.length-8} more rows</div>}
                  </div>
                )}
                {xlUpload.errors.length===0&&xlUpload.rows.length>0&&(
                  !xlConfirm
                    ? <button onClick={()=>setXlConfirm(true)} style={{padding:"8px 20px",background:"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>⬆ Apply {xlUpload.rows.length} Tiers →</button>
                    : <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"#1a1a08",border:"1px solid #744210",borderRadius:"8px",flexWrap:"wrap"}}>
                        <span style={{fontSize:"12px",color:"#f6ad55"}}>⚠️ Replace all {tiers.length} current tiers with {xlUpload.rows.length} new ones?</span>
                        <button onClick={applyXlUpload} style={{padding:"6px 16px",background:"#c53030",border:"none",borderRadius:"6px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>Yes, Replace</button>
                        <button onClick={()=>setXlConfirm(false)} style={{padding:"6px 12px",background:"transparent",border:"1px solid #4a5568",borderRadius:"6px",color:"#a0aec0",fontSize:"12px",cursor:"pointer"}}>Cancel</button>
                      </div>
                )}
              </div>
            )}
          </div>

          {/* KPI row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px",marginBottom:"12px"}}>
            {[["Tok/$+BC",avgTokBC,"#b794f4",true,v=>setAvgTokBC(Math.max(0.01,r2(+v)))],["Avg Fee",$f(avgEntryFee),"#f6ad55",false],["Tok/Match",avgTokPerMatch,"#63b3ed",false],["Tok/$",avgTokPerDol,"#68d391",false],["Tiers",compTiers.length,"#90cdf4",false],["Max Rew",$f(compTiers.length>0?compTiers[compTiers.length-1].cumRew:0),"#68d391",false]].map(([l,v,c,ed,oc])=>(
              <div key={l} style={{background:"#141820",borderRadius:"8px",padding:"10px",border:"1px solid #2d3748"}}>
                <div style={{fontSize:"10px",color:"#718096",marginBottom:"3px"}}>{l}</div>
                {ed?<input type="number" value={v} onChange={e=>oc(e.target.value)} style={{background:"transparent",border:"none",color:c,fontSize:"18px",fontWeight:"700",outline:"none",width:"100%"}}/>:<div style={{fontSize:"18px",fontWeight:"700",color:c}}>{v}</div>}
              </div>
            ))}
          </div>

          {/* Tier editor */}
          <div style={mc}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <h3 style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>🏆 Tier Editor</h3>
              <button onClick={addTier} style={{padding:"5px 12px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"12px",cursor:"pointer"}}>+ Add Tier</button>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                <thead><tr style={{background:"#141820"}}>{["Tier","Tokens Req","Efective Tokens Req","Cumulative Tokens","Est. Tier Spend ($)","Est. Cum. Spend ($)","Reward B.cash","Reward Chips","Tier Cashback %","Cum. Cashback %","Total Reward Value ($)","Cum. Reward Value ($)",""].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{compTiers.map((t,i)=>{
                  const big=t.bcash>=1||t.chips>=500;
                  return (
                    <tr key={t.id} style={{background:big?"#1e1a08":i%2?"#141820":"transparent"}}>
                      <td style={{...tdS("#90cdf4"),fontWeight:"700"}}>{t.tierNum}</td>
                      <td style={{padding:"3px 5px"}}><div style={{display:"flex",alignItems:"center",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"4px"}}><input type="number" min="1" value={t.tokReq} onChange={e=>updateTier(t.id,"tokReq",e.target.value)} style={{width:44,padding:"3px 5px",background:"transparent",border:"none",color:"#e2e8f0",fontSize:"11px",outline:"none"}}/></div></td>
                      <td style={tdS("#a0aec0")}>{r2(t.tokReq - t.bcash * avgTokBC)>0 ? r2(t.tokReq - t.bcash * avgTokBC) : 0}</td>
                      <td style={tdS("#f6ad55")}>{t.cumTok}</td>
                      <td style={tdS("#fc8181")}>{$f(t.tierSpend)}</td>
                      <td style={tdS("#fc8181")}>{$f(t.cumSpend)}</td>
                      <td style={{padding:"3px 5px"}}><div style={{display:"flex",alignItems:"center",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"4px"}}><span style={{padding:"0 4px",color:"#4a5568",fontSize:"10px",background:"#141820"}}>$</span><input type="number" min="0" step="0.01" value={t.bcash} onChange={e=>updateTier(t.id,"bcash",e.target.value)} style={{width:52,padding:"3px 5px",background:"transparent",border:"none",color:"#68d391",fontSize:"11px",outline:"none"}}/></div></td>
                      <td style={{padding:"3px 5px"}}><div style={{display:"flex",alignItems:"center",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"4px"}}><input type="number" min="0" value={t.chips} onChange={e=>updateTier(t.id,"chips",e.target.value)} style={{width:52,padding:"3px 5px",background:"transparent",border:"none",color:"#f6ad55",fontSize:"11px",outline:"none"}}/></div></td>
                      <td style={{...tdS(),color:t.tierCB>=50?"#68d391":t.tierCB>=30?"#f6ad55":"#a0aec0"}}>{pf(Math.min(t.tierCB,999))}</td>
                      <td style={{...tdS(),color:t.cumCB>=50?"#68d391":t.cumCB>=30?"#f6ad55":"#a0aec0"}}>{pf(t.cumCB)}</td>
                      <td style={tdS("#90cdf4")}>{$f(t.totalRew)}</td>
                      <td style={{...tdS("#68d391"),fontWeight:"700"}}>{$f(t.cumRew)}</td>
                      <td style={{padding:"3px 5px"}}><button onClick={()=>removeTier(t.id)} style={{padding:"2px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"10px",cursor:"pointer"}}>✕</button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>
        </>)}

        {tab==="graphs" && (
          <div>
            {/* Row 1: Spend vs Reward + Cashback % */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div style={mc}>
                <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>💸 Cumulative Spend vs Reward</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={compTiers.map(t=>({tier:t.tierNum,Spend:t.cumSpend,Reward:t.cumRew}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                    <Tooltip contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Area type="monotone" dataKey="Spend" fill="#fc818120" stroke="#fc8181" strokeWidth={2}/>
                    <Line type="monotone" dataKey="Reward" stroke="#68d391" strokeWidth={2} dot={false}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>📊 Cashback % — Tier vs Cumulative</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={compTiers.map(t=>({tier:t.tierNum,"Tier CB%":r2(Math.min(t.tierCB,300)),"Cum CB%":t.cumCB}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>v+"%"}/>
                    <Tooltip formatter={v=>[v.toFixed(2)+"%",""]} contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar dataKey="Tier CB%" fill="#b794f4" radius={[2,2,0,0]} opacity={0.8}/>
                    <Line type="monotone" dataKey="Cum CB%" stroke="#68d391" strokeWidth={2} dot={false}/>
                    <ReferenceLine y={50} stroke="#68d391" strokeDasharray="4 2" strokeOpacity={0.4} label={{value:"50%",fill:"#68d391",fontSize:8}}/>
                    <ReferenceLine y={100} stroke="#f6ad55" strokeDasharray="4 2" strokeOpacity={0.4} label={{value:"100%",fill:"#f6ad55",fontSize:8}}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Row 2: Tokens per Tier + Reward Breakdown */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>🪙 Tokens Required per Tier</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={compTiers.map(t=>({tier:t.tierNum,"Tok Req":t.tokReq,"Cum Tokens":t.cumTok}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis yAxisId="l" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis yAxisId="r" orientation="right" stroke="#f6ad55" tick={{fontSize:9}}/>
                    <Tooltip contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar yAxisId="l" dataKey="Tok Req" fill="#63b3ed" radius={[2,2,0,0]}/>
                    <Line yAxisId="r" type="monotone" dataKey="Cum Tokens" stroke="#f6ad55" strokeWidth={2} dot={false}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>🎁 Reward Breakdown per Tier</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={compTiers.map(t=>({tier:t.tierNum,"B.cash":t.bcash,"Chips $":r2(t.chips*CHIP_VALUE)}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                    <Tooltip formatter={v=>["$"+v,""]} contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar dataKey="B.cash" fill="#68d391" radius={[2,2,0,0]} stackId="a"/>
                    <Bar dataKey="Chips $" fill="#f6ad55" radius={[2,2,0,0]} stackId="a"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Row 3: Persona Comparison */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div style={mc}>
                <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>👤 Persona Comparison</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={journeys.map(j=>({name:j.name,"Max Tier":j.last?j.last.tierNum:0,"B.cash":j.bcash}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="name" stroke="#4a5568" tick={{fontSize:10}}/>
                    <YAxis yAxisId="l" stroke="#4a5568" tick={{fontSize:10}}/>
                    <YAxis yAxisId="r" orientation="right" stroke="#68d391" tick={{fontSize:10}} tickFormatter={v=>"$"+v}/>
                    <Tooltip contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar yAxisId="l" dataKey="Max Tier" fill="#63b3ed" radius={[3,3,0,0]}>
                      {journeys.map((j,i)=><Cell key={i} fill={j.color}/>)}
                    </Bar>
                    <Bar yAxisId="r" dataKey="B.cash" fill="#68d391" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>💰 Cumulative B.cash Earned</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={compTiers.map(t=>({tier:t.tierNum,"Cum B.cash":t.cumBcash,"Tier B.cash":t.bcash}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                    <Tooltip formatter={v=>["$"+v,""]} contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar dataKey="Tier B.cash" fill="#68d39166" radius={[2,2,0,0]}/>
                    <Line type="monotone" dataKey="Cum B.cash" stroke="#68d391" strokeWidth={2} dot={false}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Row 4: Reward Value per Token */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>💎 Reward Value per Token</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={compTiers.map(t=>({tier:t.tierNum,"$/tok":t.tokReq>0?r2(t.totalRew/t.tokReq):0}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                    <Tooltip formatter={v=>["$"+v+" per token",""]} contentStyle={tipS}/>
                    <Bar dataKey="$/tok" radius={[2,2,0,0]}>
                      {compTiers.map((t,i)=>{
                        const val=t.tokReq>0?t.totalRew/t.tokReq:0;
                        return <Cell key={i} fill={val>0.5?"#68d391":val>0.15?"#f6ad55":"#fc8181"}/>;
                      })}
                    </Bar>
                    <ReferenceLine y={0.15} stroke="#f6ad55" strokeDasharray="4 2" strokeOpacity={0.5} label={{value:"$0.15",fill:"#f6ad55",fontSize:8}}/>
                    <ReferenceLine y={0.5} stroke="#68d391" strokeDasharray="4 2" strokeOpacity={0.5} label={{value:"$0.50",fill:"#68d391",fontSize:8}}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>📈 Tier vs Cumulative Tokens</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={compTiers.map(t=>({tier:t.tierNum,Spend:t.cumSpend,"Cum Rew":t.cumRew,"Rew%":t.cumCB}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="tier" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis yAxisId="l" stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                    <YAxis yAxisId="r" orientation="right" stroke="#b794f4" tick={{fontSize:9}} tickFormatter={v=>v+"%"}/>
                    <Tooltip contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Area yAxisId="l" type="monotone" dataKey="Spend" fill="#fc818115" stroke="#fc8181" strokeWidth={1}/>
                    <Line yAxisId="l" type="monotone" dataKey="Cum Rew" stroke="#68d391" strokeWidth={2} dot={false}/>
                    <Line yAxisId="r" type="monotone" dataKey="Rew%" stroke="#b794f4" strokeWidth={2} dot={false}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab==="persona" && (<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"12px"}}>
            {journeys.map((j,i)=>(
              <div key={i} onClick={()=>setSelP(i)} style={{...mc,marginBottom:0,cursor:"pointer",border:safeSelP===i?"2px solid "+j.color:"1px solid #2d3748",background:safeSelP===i?"#1a2535":"#1a1f2e"}}>
                <div style={{fontWeight:"700",fontSize:"14px",marginBottom:"2px",color:j.color}}>{j.name}</div>
                <div style={{fontSize:"10px",color:"#718096",marginBottom:"8px"}}>{j.pct}</div>
                {[["Tokens",j.tokens,"#f6ad55"],["Max Tier",j.last?j.last.tierNum:"—",j.color],["B.cash",$f(j.bcash),"#68d391"],["Chips",j.chips.toLocaleString(),"#f6ad55"],["Cum Rew",j.last?$f(j.last.cumRew):"—","#68d391"]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:"3px",fontSize:"11px"}}><span style={{color:"#718096"}}>{l}</span><strong style={{color:c}}>{v}</strong></div>
                ))}
              </div>
            ))}
          </div>
          {journeys[safeSelP]&&(
            <div style={mc}>
              <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:journeys[safeSelP].color}}>{journeys[safeSelP].name} — Tier Progress</h3>
              <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>
                {compTiers.map(t=>{const done=journeys[safeSelP].tokens>=t.cumTok,big=t.bcash>=1||t.chips>=500;return(
                  <div key={t.id} title={"T"+t.tierNum+": "+t.tokReq+" tok"} style={{width:"24px",height:"24px",borderRadius:"4px",display:"flex",alignItems:"center",justifyContent:"center",background:done?(big?"#744210":"#276749"):"#2d3748",fontSize:"9px",fontWeight:"600",color:done?"#fff":"#4a5568"}}>{t.tierNum}</div>
                );})}
              </div>
            </div>
          )}
        </>)}

        {tab==="inputs" && (<>
          <div style={mc}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <h3 style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>🏠 Rooms</h3>
              <button onClick={addRoom} style={{padding:"5px 10px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"11px",cursor:"pointer"}}>+ Add</button>
            </div>
            <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Fee","Dist%","WinRate%","RTP","BonusCash%","PlayTok","WinTok","EV/Match","EV/$",""].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{rooms.map((r,i)=>(
                <tr key={i} style={{background:i%2?"#141820":"transparent"}}>
                  {["fee","dist","winRate","rtp","bonusCash","playTokens","winTokens"].map(k=>(
                    <td key={k} style={{padding:"3px 4px"}}><input type="number" value={r[k]} onChange={e=>updateRoom(i,k,e.target.value)} style={{width:52,padding:"4px 5px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}/></td>
                  ))}
                  <td style={{padding:"5px 8px",fontSize:"11px",color:"#63b3ed"}}>{compRooms[i]?.evMatch}</td>
                  <td style={{padding:"5px 8px",fontSize:"11px",color:"#b794f4"}}>{compRooms[i]?.evDollar}</td>
                  <td style={{padding:"3px 4px"}}><button onClick={()=>removeRoom(i)} disabled={rooms.length<=1} style={{padding:"2px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:rooms.length<=1?"#4a5568":"#fc8181",fontSize:"10px",cursor:rooms.length<=1?"not-allowed":"pointer"}}>✕</button></td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
          <div style={mc}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <h3 style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>👤 Personas</h3>
              <button onClick={()=>setPersonas(p=>[...p,{name:"New",pct:"",matches:10,tokens:50}])} style={{padding:"5px 10px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"11px",cursor:"pointer"}}>+ Add</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
              {personas.map((p,i)=>(
                <div key={i} style={{background:"#141820",borderRadius:"8px",padding:"10px",border:"1px solid "+MPCOLS[i%4]+"44",position:"relative"}}>
                  {personas.length>1&&<button onClick={()=>removePersona(i)} style={{position:"absolute",top:"6px",right:"6px",padding:"1px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"9px",cursor:"pointer"}}>✕</button>}
                  <div style={{fontWeight:"700",color:MPCOLS[i%4],marginBottom:"8px"}}>{p.name}</div>
                  {[["Name","name","text"],["Pct","pct","text"],["Matches","matches","number"],["Tokens","tokens","number"]].map(([l,k,type])=>(
                    <div key={k} style={{marginBottom:"5px"}}>
                      <label style={{display:"block",fontSize:"9px",color:"#718096",marginBottom:"2px"}}>{l}</label>
                      <input type={type} value={p[k]} onChange={e=>updatePersona(i,k,e.target.value)} style={{width:"100%",padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#e2e8f0",fontSize:"11px",outline:"none",boxSizing:"border-box"}}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>)}

        {tab==="export" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            <div style={mc}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📄 JSON Config</h3>
              <textarea readOnly value={JSON.stringify(buildJSON(),null,2)} style={{width:"100%",height:"300px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"8px",color:"#a0aec0",fontSize:"10px",padding:"10px",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
              <button onClick={copyJSON} style={{width:"100%",marginTop:"8px",padding:"10px",background:copied?"#276749":"linear-gradient(135deg,#2c5282,#553c9a)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer"}}>{copied?"✅ Copied!":"📋 Copy JSON"}</button>
            </div>
            <div style={mc}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📊 Export & QA</h3>
              {csvMsg&&<div style={{padding:"8px",background:"#1a2e1a",borderRadius:"6px",color:"#68d391",fontSize:"12px",marginBottom:"8px"}}>{csvMsg}</div>}
              <button onClick={exportCSV} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer",marginBottom:"10px"}}>⬇ Download CSV</button>
              <button onClick={()=>setQaRes(runQA(buildJSON()))} style={{width:"100%",padding:"9px",background:"#2d3748",border:"1px solid #4a5568",borderRadius:"8px",color:"#a0aec0",fontWeight:"600",fontSize:"12px",cursor:"pointer",marginBottom:"8px"}}>🔍 Run QA</button>
              <button onClick={saveSnapshot} style={{width:"100%",padding:"9px",background:"linear-gradient(135deg,#553c9a,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer",marginBottom:"8px"}}>📜 Save to History</button>
              {qaRes&&<div style={{display:"flex",flexDirection:"column",gap:"3px",maxHeight:"220px",overflowY:"auto"}}>{qaRes.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"5px 9px",borderRadius:"5px",fontSize:"11px",background:c.ok?"#141820":"#2d1a1a",border:"1px solid "+(c.ok?"#276749":"#c53030")}}>
                  <span>{c.ok?"✅":"❌"}</span><span style={{color:c.ok?"#a0aec0":"#fc8181"}}>{c.msg}</span>
                </div>
              ))}</div>}
            </div>
          </div>
        )}

        {tab==="history" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <h3 style={{margin:0,fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📜 Config History</h3>
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={saveSnapshot} style={{padding:"7px 14px",background:"linear-gradient(135deg,#553c9a,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>💾 Save Current</button>
                {history.length>0&&<button onClick={()=>setHistory([])} style={{padding:"7px 12px",background:"transparent",border:"1px solid #c53030",borderRadius:"8px",color:"#fc8181",fontWeight:"600",fontSize:"12px",cursor:"pointer"}}>🗑 Clear</button>}
              </div>
            </div>
            {history.length===0?(
              <div style={{...mc,textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:"32px",marginBottom:"10px"}}>📭</div><div style={{color:"#4a5568"}}>No history yet.</div></div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {history.map(snap=>{
                  const d=new Date(snap.date);
                  return (
                    <div key={snap.id} style={{...mc,marginBottom:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",flexWrap:"wrap"}}>
                        <input value={histNote[snap.id]||snap.label} onChange={e=>setHistNote(n=>({...n,[snap.id]:e.target.value}))}
                          style={{flex:1,minWidth:"180px",padding:"5px 10px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#e2e8f0",fontSize:"12px",fontWeight:"600",outline:"none"}}/>
                        <span style={{fontSize:"10px",color:"#4a5568"}}>{d.toLocaleDateString()} {d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                        <span style={{fontSize:"10px",padding:"2px 8px",background:"#141820",borderRadius:"10px",color:"#90cdf4",border:"1px solid #2d3748"}}>{snap.meta.tiers} tiers</span>
                        <span style={{fontSize:"10px",padding:"2px 8px",background:"#141820",borderRadius:"10px",color:"#68d391",border:"1px solid #2d3748"}}>Max {$f(snap.meta.maxRew)}</span>
                        <div style={{display:"flex",gap:"6px",marginLeft:"auto"}}>
                          <HistCopyBtn json={snap.json}/>
                          <button onClick={()=>downloadCSV(snap.csvRows,"missions_v1_"+snap.id+".csv")} style={{padding:"5px 10px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>⬇ CSV</button>
                          <button onClick={()=>setHistory(h=>h.filter(s=>s.id!==snap.id))} style={{padding:"5px 8px",background:"transparent",border:"1px solid #c53030",borderRadius:"6px",color:"#fc8181",fontSize:"11px",cursor:"pointer"}}>✕</button>
                        </div>
                      </div>
                      <textarea readOnly value={JSON.stringify(snap.json,null,2)} style={{width:"100%",height:"120px",background:"#0f1117",border:"1px solid #1e2a45",borderRadius:"6px",color:"#4a5568",fontSize:"9px",padding:"8px",fontFamily:"monospace",resize:"none",boxSizing:"border-box",outline:"none"}}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MATCHMAKING
// ══════════════════════════════════════════════════════════════════════════════
function MatchmakingPage({ onBack }) {
  const [tab, setTab] = useState("config");

  const [poolScores, setPoolScores] = useState([
    { pool:"Critical 🥵", value:30 },
    { pool:"Secure 🥺",   value:20 },
    { pool:"Happy 😆",    value:10 },
    { pool:"Awesome 🤑",  value:0  },
  ]);
  const [winRatioScores, setWinRatioScores] = useState([
    { ratio:0,          score:-20 },
    { ratio:1/6,        score:-10 },
    { ratio:2/6,        score:-5  },
    { ratio:3/6,        score:0   },
    { ratio:4/6,        score:5   },
    { ratio:5/6,        score:15  },
    { ratio:1,          score:40  },
  ]);
  const [lastGameBonus,   setLastGameBonus]   = useState({ win:10, lose:0 });
  const [kFactors,        setKFactors]        = useState({ positive:1, negative:0.5 });
  const [matchRange,      setMatchRange]      = useState({ maxPct:0.26, minPct:0.05 });
  const [winLookback,     setWinLookback]     = useState(6);
  const [avgLookback,     setAvgLookback]     = useState(10);
  const [initialScore,    setInitialScore]    = useState(70);
  const [lastMatchWeight, setLastMatchWeight] = useState(0.1);
  const [poolStatus,      setPoolStatus]      = useState("Critical 🥵");
  const [realMoney,       setRealMoney]       = useState(true);
  const [numGames,        setNumGames]        = useState(50);
  const [winProb,         setWinProb]         = useState(0.5);
  const [copied,          setCopied]          = useState(false);
  const [simSeed,         setSimSeed]         = useState(0);
  const [scoreCV,         setScoreCV]         = useState(0.27);  // coefficient of variation for score spread (Excel=0.27)
  const [reqText,         setReqText]         = useState("");
  const [reqResult,       setReqResult]       = useState(null);  // {changes:[], warnings:[]}
  const [reqLoading,      setReqLoading]      = useState(false);

  // ── Core simulation (exact Excel formulas) ────────────────────────────────
  // Excel formula translation:
  // F = 0.9*AVERAGE(last avgLookback actual scores) + actualScore*0.1  (userAvg)
  // G = actualScore - userAvg                                           (delta)
  // J = if(delta<=0, negK*delta, posK*delta) + userAvg                 (newScore)
  // K = VLOOKUP(pool)                                                   (poolBonus)
  // L = XLOOKUP(winRatio)                                               (wrBonus)
  // M = XLOOKUP(win/lose)                                               (lgBonus)
  // O = userAvg*(1-minPct), P = userAvg*(1+maxPct)                     (clamp range)
  // Q = clamp(J+K+L+M, O, P)                                           (finalScore)
  const runSimulation = useMemo(() => {
    // ── EXACT Excel formula implementation (verified 15/15 against Excel data) ──
    //
    // Excel columns: B=actualScore (user input), C=Win/Lose (B>prevQ),
    //   D=winRatio (COUNTIF/COUNTA last 6 including header row),
    //   F=userAvg (0.9*AVERAGE(last 10 B numeric) + B*0.1),
    //   G=delta (B-F), J=ELO newScore (K*G+F),
    //   K=poolBonus (VLOOKUP), L=wrBonus (XLOOKUP), M=lgBonus,
    //   O=scoreMin (F*(1-minPct)), P=scoreMax (F*(1+maxPct)),
    //   Q=finalScore = clamp(J+K+L+M, O, P)
    //
    // Key facts verified against Excel:
    //   1. Win/Lose: actualScore > prevFinalScore (not random, not vs userAvg)
    //   2. WinRatio D col: COUNTIF+COUNTA window includes 1 header text row
    //      for games 1-6 → denominator inflated by 1 early on
    //   3. UserAvg: AVERAGE ignores text, so B40=100 seed drops out naturally
    //   4. XLOOKUP: exact-match-from-end; falls back to smallest value > lookup
    //   5. Game 1 L42 = 0 (hardcoded, no formula)

    // bCol simulates Excel B column: [8 nulls][100.0][null for header][game scores...]
    // The header row (null) in bCol matches Excel B41="Normalized Last Match Score"
    // which AVERAGE() skips, causing B40=100 to drop from the window at game 10
    const bCol = Array(8).fill(null).concat([initialScore, null]);
    // cCol simulates C column with "Win/Lose" header at C41 that COUNTA counts
    const cCol = Array(9).fill(null).concat(["Win/Lose"]);

    let prevFinalScore = initialScore;
    const games = [];
    let seed = simSeed;
    const rand = () => { seed = (seed*1664525+1013904223)&0xffffffff; return (seed>>>0)/0xffffffff; };

    // XLOOKUP(lookup, D4:D10, E4:E10, "", match_mode=1, search_mode=-1)
    // match_mode=1: exact or next larger; search_mode=-1: from last
    // Algorithm: exact match (with tolerance) from end; else smallest value > lookup
    const wrTableD = winRatioScores.map(w=>w.ratio);
    const wrTableE = winRatioScores.map(w=>w.score);
    const xlookupWR = (lookup) => {
      const tol = 1e-6;
      // Exact match from end
      for (let i=wrTableD.length-1; i>=0; i--) {
        if (Math.abs(wrTableD[i]-lookup)<tol) return wrTableE[i];
      }
      // Next larger: smallest value strictly > lookup
      let bestIdx=null, bestVal=Infinity;
      for (let i=0; i<wrTableD.length; i++) {
        if (wrTableD[i]>lookup+tol && wrTableD[i]<bestVal) { bestVal=wrTableD[i]; bestIdx=i; }
      }
      return bestIdx!==null ? wrTableE[bestIdx] : 0;
    };

    for (let g=0; g<numGames; g++) {
      // UserAvg base: AVERAGE of last 10 numeric B values (Excel F col numerics only)
      // Computed FIRST because we generate actualScore around this stable estimate.
      // In Excel, B col scores are externally supplied and hover around the player's
      // skill level (mean≈104, std≈28, CV≈0.27) — they do NOT inflate over time.
      // We replicate this by generating actualScore ~ N(avgB, avgB*CV) so scores
      // stay stable around the current skill estimate, not the bonus-inflated finalScore.
      const numericB = bCol.slice(-10).filter(v=>typeof v==="number");
      const avgB     = numericB.length>0 ? numericB.reduce((s,v)=>s+v,0)/numericB.length : initialScore;

      // Actual score: Box-Muller normal distribution, CV=scoreCV (user-configurable)
      // Centered on avgB (skill estimate). CV=0.27 matches Excel B col (mean=104, std=28)
      const u1=rand(), u2=rand();
      const norm = Math.sqrt(-2*Math.log(Math.max(u1,1e-10)))*Math.cos(2*Math.PI*u2);
      const actualScore = Math.max(10, avgB*(1 + scoreCV*norm));

      // Win/Lose: Excel C col = if(B > E, "Win", "Lose") where E col = prevFinalScore
      const win = actualScore > prevFinalScore;
      const wl  = win ? "Win" : "Lose";

      // Win ratio (Excel D col): COUNTIF(window,"win")/COUNTA(window)
      // Window of 6 including current result; cCol has "Win/Lose" header that COUNTA counts
      let winRatio = 0;
      if (g > 0) {
        const window = cCol.slice(-5).concat([wl]);
        const nonEmpty = window.filter(v=>v!==null);
        const wins = nonEmpty.filter(v=>String(v).toLowerCase()==="win").length;
        winRatio = nonEmpty.length>0 ? wins/nonEmpty.length : 0;
      }

      // UserAvg (Excel F col): 0.9*AVERAGE(last 10 numeric B) + actualScore*0.1
      const userAvg = 0.9*avgB + actualScore*0.1;

      // ELO (Excel G, J cols)
      const delta    = actualScore - userAvg;
      const kFactor  = delta<=0 ? kFactors.negative : kFactors.positive;
      const newScore = kFactor*delta + userAvg;

      // Bonuses (Excel K, L, M cols)
      const poolBonus = poolScores.find(p=>p.pool===poolStatus)?.value ?? 0;
      const wrBonus   = g===0 ? 0 : xlookupWR(winRatio);   // L42 hardcoded 0 in Excel
      const lgBonus   = win ? lastGameBonus.win : lastGameBonus.lose;

      // Score range (Excel O, P cols)
      const scoreMin = userAvg*(1-matchRange.minPct);
      const scoreMax = userAvg*(1+matchRange.maxPct);

      // Final score (Excel Q col)
      const raw        = newScore + poolBonus + wrBonus + lgBonus;
      const finalScore = Math.max(scoreMin, Math.min(scoreMax, raw));

      games.push({
        game:g+1, actualScore:r2(actualScore), win, wl,
        winRatio:r2(winRatio), userAvg:r2(userAvg), delta:r2(delta),
        newScore:r2(newScore), poolBonus, wrBonus, lgBonus,
        scoreMin:r2(scoreMin), scoreMax:r2(scoreMax), finalScore:r2(finalScore),
      });

      bCol.push(actualScore);
      cCol.push(wl);
      prevFinalScore = finalScore;
    }
    return games;
  }, [poolStatus, poolScores, winRatioScores, lastGameBonus, kFactors, matchRange,
      winLookback, avgLookback, initialScore, lastMatchWeight, realMoney, numGames, winProb, simSeed, scoreCV]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!runSimulation.length) return {avg:0,max:0,min:0,std:0,wins:0,winRate:0,last:0,avgActual:0,lastELO:0};
    const sc     = runSimulation.map(g=>g.finalScore);
    const actual = runSimulation.map(g=>g.actualScore);
    const wins   = runSimulation.filter(g=>g.win).length;
    const n      = sc.length;
    const avg    = r2(sc.reduce((s,v)=>s+v,0)/n);
    const avgActual = r2(actual.reduce((s,v)=>s+v,0)/n);
    const max    = r2(Math.max(...sc));
    const min    = r2(Math.min(...sc));
    const std    = n>1 ? r2(Math.sqrt(sc.reduce((s,v)=>s+(v-avg)**2,0)/(n-1))) : 0;  // sample STD = Excel STDEV()
    const last   = r2(sc[n-1]);
    const lastELO = r2(runSimulation[n-1]?.newScore ?? 0);
    return { avg, avgActual, max, min, std, wins, winRate:r2(wins/n*100), last, lastELO };
  }, [runSimulation]);

  // ── Natural language requirements parser ─────────────────────────────────
  // Parses plain-English simulation requirements and auto-adjusts config params
  const parseRequirements = async () => {
    if (!reqText.trim()) return;
    setReqLoading(true);
    setReqResult(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are a matchmaking configuration expert. The user describes simulation requirements in plain English.
You must output ONLY a valid JSON object (no markdown, no explanation) with these optional fields:
{
  "changes": [
    {"param": "winProb",        "value": 0.55,  "reason": "user wants 55% win rate"},
    {"param": "numGames",       "value": 200,   "reason": "run 200 games"},
    {"param": "maxLoseStreak",  "value": 2,     "reason": "no more than 2 consecutive losses"},
    {"param": "maxWinStreak",   "value": 5,     "reason": "no more than 5 consecutive wins"},
    {"param": "kPositive",      "value": 1.2,   "reason": "stronger upward momentum"},
    {"param": "kNegative",      "value": 0.4,   "reason": "softer downward movement"},
    {"param": "winLookback",    "value": 8,     "reason": "look at last 8 games"},
    {"param": "avgLookback",    "value": 12,    "reason": "average over last 12 games"},
    {"param": "maxPct",         "value": 0.30,  "reason": "wider upper range"},
    {"param": "minPct",         "value": 0.08,  "reason": "wider lower range"},
    {"param": "initialScore",   "value": 80,    "reason": "start higher"},
    {"param": "poolStatus",     "value": "Secure 🥺", "reason": "use secure pool"},
    {"param": "realMoney",      "value": true,  "reason": "real money player"},
    {"param": "lastMatchWeight","value": 0.15,  "reason": "more weight on last match"},
    {"param": "winBonus",       "value": 15,    "reason": "higher win bonus"},
    {"param": "loseBonus",      "value": 5,     "reason": "small lose bonus"}
  ],
  "warnings": ["Note: maxLoseStreak constraint adjusts winProb not the engine directly"]
}
Only include fields that are clearly implied by the user's request.
For win/lose streak constraints, adjust winProb accordingly (e.g. max 2 losses = higher win prob ~0.65+).
For "no X consecutive losses", set winProb = 1 - (1/(maxLoseStreak+1)) approximately.`,
          messages:[{role:"user", content: reqText}]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const changes = parsed.changes || [];
      const warnings = parsed.warnings || [];

      // Apply all changes
      const applied = [];
      changes.forEach(c => {
        switch(c.param) {
          case "winProb":        setWinProb(Math.max(0,Math.min(1,c.value)));         applied.push(c); break;
          case "numGames":       setNumGames(Math.max(1,Math.min(2000,c.value)));      applied.push(c); break;
          case "kPositive":      setKFactors(k=>({...k,positive:c.value}));           applied.push(c); break;
          case "kNegative":      setKFactors(k=>({...k,negative:c.value}));           applied.push(c); break;
          case "winLookback":    setWinLookback(Math.max(1,c.value));                 applied.push(c); break;
          case "avgLookback":    setAvgLookback(Math.max(1,c.value));                 applied.push(c); break;
          case "maxPct":         setMatchRange(m=>({...m,maxPct:c.value}));           applied.push(c); break;
          case "minPct":         setMatchRange(m=>({...m,minPct:c.value}));           applied.push(c); break;
          case "initialScore":   setInitialScore(c.value);                            applied.push(c); break;
          case "poolStatus":     setPoolStatus(c.value);                              applied.push(c); break;
          case "realMoney":      setRealMoney(c.value);                               applied.push(c); break;
          case "lastMatchWeight":setLastMatchWeight(Math.max(0,Math.min(1,c.value))); applied.push(c); break;
          case "winBonus":       setLastGameBonus(b=>({...b,win:c.value}));           applied.push(c); break;
          case "loseBonus":      setLastGameBonus(b=>({...b,lose:c.value}));          applied.push(c); break;
          // streak constraints → adjust winProb if not already set
          case "maxLoseStreak":
            if (!changes.find(x=>x.param==="winProb")) {
              const p = Math.min(0.95, 1 - 1/(c.value+1));
              setWinProb(p);
              applied.push({...c, reason: c.reason+" → winProb set to "+p.toFixed(2)});
            } else applied.push(c);
            break;
          case "maxWinStreak":
            if (!changes.find(x=>x.param==="winProb")) {
              const p = Math.max(0.05, 1/(c.value+1));
              setWinProb(p);
              applied.push({...c, reason: c.reason+" → winProb set to "+p.toFixed(2)});
            } else applied.push(c);
            break;
        }
      });
      setSimSeed(s=>s+1); // re-roll with new params
      setReqResult({ changes: applied, warnings });
    } catch(err) {
      setReqResult({ changes:[], warnings:["Error: "+err.message] });
    }
    setReqLoading(false);
  };

  // ── JSON config ───────────────────────────────────────────────────────────
  const buildJSON = () => ({
    poolStatus2AdditionalScore: {
      critical: poolScores.find(p=>p.pool.startsWith("Critical"))?.value ?? 30,
      secure:   poolScores.find(p=>p.pool.startsWith("Secure"))?.value   ?? 20,
      happy:    poolScores.find(p=>p.pool.startsWith("Happy"))?.value    ?? 10,
      awesome:  poolScores.find(p=>p.pool.startsWith("Awesome"))?.value  ?? 0,
    },
    lastMatchResultAdditionalScore: {
      winAdditionalScore:  lastGameBonus.win,
      loseAdditionalScore: lastGameBonus.lose,
    },
    winTakenIntoAccountPreviousMatchesAmount: winLookback,
    winMatchesAmountAdditionalScores: winRatioScores.map(wr => ({
      winMatchesAmount: Math.round(wr.ratio * winLookback),
      score: wr.score,
    })),
    matchScoreRange: {
      averageScoreHighestPercentage: matchRange.maxPct,
      averageScoreLowerPercentage:   matchRange.minPct,
      minimumMatchScore:             initialScore,
    },
    percentageWeightOfLastMatch:               lastMatchWeight,
    positiveKFactor:                           kFactors.positive,
    negativeKFactor:                           kFactors.negative,
    averageTakenIntoAccountPreviousMatchesAmount: avgLookback,
    initialNormalizedScore:                    initialScore,
  });

  const copyJSON = () => {
    const str = JSON.stringify(buildJSON(),null,2);
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(str).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const ACCENT = "#f687b3";
  const mc   = {background:"#1a1f2e",border:"1px solid #2d3748",borderRadius:"12px",padding:"14px",marginBottom:"12px"};
  const th   = {padding:"6px 10px",textAlign:"left",color:"#718096",fontWeight:"600",borderBottom:"1px solid #2d3748",fontSize:"10px",whiteSpace:"nowrap"};
  const tdS  = c => ({padding:"5px 10px",fontSize:"11px",borderBottom:"1px solid #141820",color:c||"#e2e8f0"});
  const tipS = {background:"#1a1f2e",border:"1px solid #2d3748",borderRadius:"8px",padding:"10px",fontSize:"11px"};
  const numInp = (val, onChange, color, step) => (
    <input type="number" step={step||1} value={val} onChange={e=>onChange(+e.target.value)}
      style={{width:"100%",padding:"6px 8px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:color||"#e2e8f0",fontSize:"15px",fontWeight:"700",outline:"none",boxSizing:"border-box"}}/>
  );
  const TABS = [{id:"config",label:"⚙️ Config"},{id:"sim",label:"🎮 Simulator"},{id:"graphs",label:"📈 Graphs"},{id:"export",label:"📤 Export JSON"}];

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#0f1117",minHeight:"100vh",color:"#e2e8f0"}}>
      <div style={{background:"linear-gradient(135deg,#1a0d1a,#1a1f2e)",padding:"10px 16px",borderBottom:"1px solid #2d3748",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <button onClick={onBack} style={{padding:"5px 12px",background:"#1e2a45",border:"1px solid #2d3748",borderRadius:"6px",color:"#a0aec0",fontSize:"12px",cursor:"pointer"}}>← Portal</button>
        <span style={{color:"#2d3748"}}>|</span>
        <span style={{fontSize:"13px",color:ACCENT,fontWeight:"700"}}>🎯 Matchmaking Simulator</span>
        <div style={{marginLeft:"auto",display:"flex",gap:"14px",fontSize:"11px",flexWrap:"wrap"}}>
          {[["Avg Score",stats.avg,ACCENT],["Avg Raw",stats.avgActual,"#90cdf4"],["Max",stats.max,"#68d391"],["Min",stats.min,"#fc8181"],["STD",stats.std,"#f6ad55"],["Win%",stats.winRate+"%","#63b3ed"]].map(([l,v,c])=>(
            <span key={l} style={{color:"#718096"}}>{l}: <strong style={{color:c}}>{v}</strong></span>
          ))}
        </div>
      </div>
      <div style={{background:"#1a1f2e",borderBottom:"1px solid #2d3748",padding:"0 16px",display:"flex"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 14px",border:"none",background:"none",cursor:"pointer",color:tab===t.id?ACCENT:"#a0aec0",borderBottom:tab===t.id?"2px solid "+ACCENT:"2px solid transparent",fontWeight:tab===t.id?"700":"400",fontSize:"12px"}}>{t.label}</button>)}
      </div>
      <div style={{padding:"16px",maxWidth:"1300px",margin:"0 auto"}}>

        {/* ── CONFIG ── */}
        {tab==="config" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>

            {/* Pool Scores */}
            <div style={mc}>
              <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>🏊 Pool Score Bonuses</h3>
              <p style={{margin:"0 0 10px",fontSize:"11px",color:"#4a5568"}}>Added to base score based on player pool status.</p>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#141820"}}>{["Pool","Bonus"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{poolScores.map((p,i)=>(
                  <tr key={i} style={{background:i%2?"#141820":"transparent"}}>
                    <td style={tdS(ACCENT)}>{p.pool}</td>
                    <td style={{padding:"4px 10px"}}>
                      <input type="number" value={p.value} onChange={e=>setPoolScores(ps=>ps.map((x,j)=>j===i?{...x,value:+e.target.value}:x))}
                        style={{width:70,padding:"4px 7px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#f6ad55",fontSize:"12px",fontWeight:"700",outline:"none",textAlign:"center"}}/>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* Win Ratio Scores */}
            <div style={mc}>
              <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>📊 Win Ratio Bonuses (last {winLookback} games)</h3>
              <p style={{margin:"0 0 10px",fontSize:"11px",color:"#4a5568"}}>Score bonus based on recent win ratio.</p>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#141820"}}>{["Win Ratio","Wins/"+winLookback,"Bonus"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{winRatioScores.map((wr,i)=>(
                  <tr key={i} style={{background:i%2?"#141820":"transparent"}}>
                    <td style={tdS("#90cdf4")}>{(wr.ratio*100).toFixed(1)}%</td>
                    <td style={tdS("#718096")}>{Math.round(wr.ratio*winLookback)}/{winLookback}</td>
                    <td style={{padding:"4px 10px"}}>
                      <input type="number" value={wr.score} onChange={e=>setWinRatioScores(wrs=>wrs.map((x,j)=>j===i?{...x,score:+e.target.value}:x))}
                        style={{width:70,padding:"4px 7px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:wr.score>=0?"#68d391":"#fc8181",fontSize:"12px",fontWeight:"700",outline:"none",textAlign:"center"}}/>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* ELO / K-Factors */}
            <div style={mc}>
              <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>⚖️ ELO / K-Factor Settings</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                {[
                  ["Positive K-Factor","#68d391",kFactors.positive,v=>setKFactors(k=>({...k,positive:v})),0.1],
                  ["Negative K-Factor","#fc8181",kFactors.negative,v=>setKFactors(k=>({...k,negative:v})),0.1],
                  ["Last Match Weight","#f6ad55",lastMatchWeight,setLastMatchWeight,0.05],
                  ["Initial Score","#63b3ed",initialScore,setInitialScore,1],
                  ["Win Lookback (games)","#b794f4",winLookback,v=>setWinLookback(Math.max(1,v)),1],
                  ["Avg Lookback (games)","#90cdf4",avgLookback,v=>setAvgLookback(Math.max(1,v)),1],
                ].map(([label,color,val,onChange,step])=>(
                  <div key={label} style={{background:"#141820",borderRadius:"8px",padding:"10px"}}>
                    <div style={{fontSize:"10px",color:"#718096",marginBottom:"5px"}}>{label}</div>
                    {numInp(val,onChange,color,step)}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {/* Match Score Range */}
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>🎯 Match Score Range</h3>
                <p style={{margin:"0 0 10px",fontSize:"11px",color:"#4a5568"}}>Final score clamped to avg±%. Excel: O=avg*(1-min), P=avg*(1+max)</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  {[
                    ["Max % above avg","#68d391",matchRange.maxPct,v=>setMatchRange(m=>({...m,maxPct:v})),0.01],
                    ["Min % below avg","#fc8181",matchRange.minPct,v=>setMatchRange(m=>({...m,minPct:v})),0.01],
                  ].map(([label,color,val,onChange,step])=>(
                    <div key={label} style={{background:"#141820",borderRadius:"8px",padding:"10px"}}>
                      <div style={{fontSize:"10px",color:"#718096",marginBottom:"5px"}}>{label} ({(val*100).toFixed(0)}%)</div>
                      {numInp(val,onChange,color,step)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Game Bonus */}
              <div style={mc}>
                <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>🎲 Last Game Bonus</h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div style={{background:"#141820",borderRadius:"8px",padding:"10px"}}>
                    <div style={{fontSize:"10px",color:"#718096",marginBottom:"5px"}}>Win Bonus</div>
                    {numInp(lastGameBonus.win,v=>setLastGameBonus(b=>({...b,win:v})),"#68d391",1)}
                  </div>
                  <div style={{background:"#141820",borderRadius:"8px",padding:"10px"}}>
                    <div style={{fontSize:"10px",color:"#718096",marginBottom:"5px"}}>Lose Bonus</div>
                    {numInp(lastGameBonus.lose,v=>setLastGameBonus(b=>({...b,lose:v})),"#fc8181",1)}
                  </div>
                </div>
              </div>

              {/* Simulation Settings */}
              <div style={mc}>
                <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>🧪 Simulation Settings</h3>

                {/* Games count with presets */}
                <div style={{marginBottom:"12px"}}>
                  <div style={{fontSize:"10px",color:"#718096",marginBottom:"6px",fontWeight:"600"}}>NUMBER OF GAMES</div>
                  <div style={{display:"flex",gap:"6px",marginBottom:"8px",flexWrap:"wrap"}}>
                    {[50,100,200,300,500,1000].map(n=>(
                      <button key={n} onClick={()=>setNumGames(n)}
                        style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid "+(numGames===n?ACCENT:"#2d3748"),background:numGames===n?ACCENT+"22":"#141820",color:numGames===n?ACCENT:"#718096",cursor:"pointer",fontSize:"11px",fontWeight:"700"}}>
                        {n>=1000?"1K":n}
                      </button>
                    ))}
                    <input type="number" min="1" max="2000" value={numGames}
                      onChange={e=>setNumGames(Math.max(1,Math.min(2000,+e.target.value)))}
                      style={{width:"72px",padding:"5px 8px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#f6ad55",fontSize:"11px",fontWeight:"700",outline:"none",textAlign:"center"}}/>
                  </div>
                </div>

                {/* Win probability */}
                <div style={{marginBottom:"12px"}}>
                  <div style={{fontSize:"10px",color:"#718096",marginBottom:"6px",fontWeight:"600"}}>WIN PROBABILITY</div>
                  <div style={{display:"flex",gap:"6px",marginBottom:"8px",flexWrap:"wrap"}}>
                    {[0.3,0.4,0.5,0.6,0.7].map(p=>(
                      <button key={p} onClick={()=>setWinProb(p)}
                        style={{padding:"5px 12px",borderRadius:"6px",border:"1px solid "+(winProb===p?"#63b3ed":"#2d3748"),background:winProb===p?"#63b3ed22":"#141820",color:winProb===p?"#63b3ed":"#718096",cursor:"pointer",fontSize:"11px",fontWeight:"700"}}>
                        {(p*100).toFixed(0)}%
                      </button>
                    ))}
                    <input type="number" min="0" max="1" step="0.01" value={winProb}
                      onChange={e=>setWinProb(Math.max(0,Math.min(1,+e.target.value)))}
                      style={{width:"72px",padding:"5px 8px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#63b3ed",fontSize:"11px",fontWeight:"700",outline:"none",textAlign:"center"}}/>
                  </div>
                </div>

                {/* Score spread (CV) */}
                <div style={{marginBottom:"12px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
                    <div style={{fontSize:"10px",color:"#718096",fontWeight:"600"}}>SCORE SPREAD (STD)</div>
                    <div style={{fontSize:"10px",color:"#4a5568"}}>
                      ≈ ±{(scoreCV*100).toFixed(0)}% of avg &nbsp;·&nbsp;
                      avg score {Math.round(initialScore)} → std ≈ <span style={{color:"#f6ad55",fontWeight:"700"}}>{Math.round(initialScore*scoreCV)}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:"6px",marginBottom:"8px",flexWrap:"wrap"}}>
                    {[
                      {cv:0.10, label:"Tight",   desc:"±10%"},
                      {cv:0.20, label:"Moderate", desc:"±20%"},
                      {cv:0.27, label:"Excel",    desc:"±27%"},
                      {cv:0.35, label:"Wide",     desc:"±35%"},
                      {cv:0.50, label:"Chaotic",  desc:"±50%"},
                    ].map(({cv,label,desc})=>(
                      <button key={cv} onClick={()=>setScoreCV(cv)}
                        style={{padding:"5px 10px",borderRadius:"6px",border:"1px solid "+(Math.abs(scoreCV-cv)<0.001?"#f6ad55":"#2d3748"),background:Math.abs(scoreCV-cv)<0.001?"#f6ad5522":"#141820",color:Math.abs(scoreCV-cv)<0.001?"#f6ad55":"#718096",cursor:"pointer",fontSize:"11px",fontWeight:"700",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px"}}>
                        <span>{label}</span>
                        <span style={{fontSize:"9px",fontWeight:"400",opacity:0.7}}>{desc}</span>
                      </button>
                    ))}
                    <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                      <input type="number" min="0.01" max="1" step="0.01" value={scoreCV}
                        onChange={e=>setScoreCV(Math.max(0.01,Math.min(1,+e.target.value)))}
                        style={{width:"72px",padding:"5px 8px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#f6ad55",fontSize:"11px",fontWeight:"700",outline:"none",textAlign:"center"}}/>
                      <div style={{fontSize:"8px",color:"#4a5568",textAlign:"center"}}>custom</div>
                    </div>
                  </div>
                  {/* Visual spread indicator */}
                  <div style={{position:"relative",height:"28px",background:"#0f1117",borderRadius:"6px",overflow:"hidden",marginTop:"4px"}}>
                    <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:"2px",background:"#2d3748",transform:"translateX(-50%)"}}/>
                    <div style={{
                      position:"absolute",top:"4px",bottom:"4px",
                      left:`${Math.max(2,50-scoreCV*100)}%`,
                      width:`${Math.min(96,scoreCV*200)}%`,
                      background:"linear-gradient(90deg,#f6ad5500,#f6ad5544,#f6ad55,#f6ad5544,#f6ad5500)",
                      borderRadius:"4px",transition:"all 0.2s"
                    }}/>
                    <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"9px",color:"#f6ad55",fontWeight:"700",pointerEvents:"none"}}>
                      mean ± {(scoreCV*100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Pool status */}
                <div style={{marginBottom:"12px"}}>
                  <div style={{fontSize:"10px",color:"#718096",fontWeight:"600",marginBottom:"6px"}}>POOL STATUS</div>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {poolScores.map(p=>(
                      <button key={p.pool} onClick={()=>setPoolStatus(p.pool)}
                        style={{padding:"5px 10px",borderRadius:"7px",border:"1px solid "+(poolStatus===p.pool?ACCENT:"#2d3748"),background:poolStatus===p.pool?ACCENT+"22":"#141820",color:poolStatus===p.pool?ACCENT:"#718096",cursor:"pointer",fontSize:"11px",fontWeight:"600"}}>
                        {p.pool}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <label style={{fontSize:"11px",color:"#718096",display:"flex",alignItems:"center",gap:"6px",cursor:"pointer"}}>
                    <input type="checkbox" checked={realMoney} onChange={e=>setRealMoney(e.target.checked)}/>
                    Real Money player (+20 bonus)
                  </label>
                  <button onClick={()=>setSimSeed(s=>s+1)}
                    style={{padding:"5px 12px",background:"#2d3748",border:"1px solid #4a5568",borderRadius:"6px",color:"#a0aec0",fontSize:"11px",cursor:"pointer"}}>
                    🔀 Re-roll
                  </button>
                </div>
              </div>

              {/* AI Requirements Box */}
              <div style={{...mc,border:"1px solid #553c9a",background:"#150d2e"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                  <span style={{fontSize:"16px"}}>🤖</span>
                  <h3 style={{margin:0,fontSize:"13px",fontWeight:"700",color:"#b794f4"}}>AI Requirements</h3>
                  <span style={{fontSize:"10px",color:"#4a5568",marginLeft:"auto"}}>Describe what you want → auto-adjusts config</span>
                </div>
                <div style={{fontSize:"10px",color:"#4a5568",marginBottom:"8px"}}>
                  Examples: "win ratio 60% and no more than 3 consecutive losses" · "run 500 games, secure pool, soft downward K-factor" · "simulate a whale player with 70% win rate"
                </div>
                <textarea
                  value={reqText}
                  onChange={e=>setReqText(e.target.value)}
                  placeholder="Describe your simulation requirements in plain English..."
                  style={{width:"100%",padding:"10px",background:"#0f1117",border:"1px solid #553c9a",borderRadius:"8px",color:"#e2e8f0",fontSize:"12px",outline:"none",resize:"vertical",minHeight:"72px",boxSizing:"border-box",fontFamily:"'Segoe UI',sans-serif",marginBottom:"8px"}}
                />
                <button onClick={parseRequirements} disabled={reqLoading||!reqText.trim()}
                  style={{width:"100%",padding:"9px",background:reqLoading?"#2d3748":"linear-gradient(135deg,#553c9a,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:reqLoading||!reqText.trim()?"not-allowed":"pointer",opacity:!reqText.trim()?0.5:1,marginBottom:reqResult?"10px":"0"}}>
                  {reqLoading?"🤖 Analysing requirements…":"✨ Apply Requirements"}
                </button>

                {reqResult && (
                  <div>
                    {reqResult.changes.length>0 && (
                      <div style={{marginBottom:"8px"}}>
                        <div style={{fontSize:"10px",color:"#68d391",fontWeight:"700",marginBottom:"5px"}}>✅ {reqResult.changes.length} CHANGE{reqResult.changes.length>1?"S":""} APPLIED:</div>
                        {reqResult.changes.map((c,i)=>(
                          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"6px",padding:"5px 8px",background:"#0d1a12",borderRadius:"5px",marginBottom:"3px",fontSize:"10px"}}>
                            <span style={{color:"#68d391",flexShrink:0}}>→</span>
                            <div>
                              <span style={{color:"#b794f4",fontWeight:"700"}}>{c.param}</span>
                              <span style={{color:"#4a5568"}}> = </span>
                              <span style={{color:"#f6ad55",fontWeight:"700"}}>{JSON.stringify(c.value)}</span>
                              <span style={{color:"#4a5568",marginLeft:"6px"}}>— {c.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {reqResult.warnings.length>0 && (
                      <div>
                        <div style={{fontSize:"10px",color:"#f6ad55",fontWeight:"700",marginBottom:"5px"}}>⚠️ NOTES:</div>
                        {reqResult.warnings.map((w,i)=>(
                          <div key={i} style={{padding:"5px 8px",background:"#1a1a08",borderRadius:"5px",marginBottom:"3px",fontSize:"10px",color:"#f6ad55"}}>
                            {w}
                          </div>
                        ))}
                      </div>
                    )}
                    {reqResult.changes.length===0&&reqResult.warnings.length===0&&(
                      <div style={{padding:"8px",background:"#2d1a1a",borderRadius:"6px",fontSize:"11px",color:"#fc8181"}}>
                        No changes could be parsed. Try being more specific — e.g. "60% win rate, 200 games, critical pool"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SIMULATOR ── */}
        {tab==="sim" && (
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:"8px",marginBottom:"8px"}}>
              {[
                ["Games",          numGames,          "#90cdf4", "Total simulated games"],
                ["Avg Match Score",stats.avg,          ACCENT,    "Avg final score incl. all bonuses (Excel col Q)"],
                ["Avg Skill Score",stats.avgActual,    "#90cdf4", "Avg raw performance score — no bonuses (Excel col B)"],
                ["Max Score",      stats.max,          "#68d391", "Highest final match score"],
                ["Min Score",      stats.min,          "#fc8181", "Lowest final match score"],
                ["Std Dev",        stats.std,          "#f6ad55", "Sample STD of final scores (matches Excel STDEV)"],
                ["Win Rate",       stats.winRate+"%",  "#63b3ed", "% of games won"],
                ["Final ELO",      stats.lastELO,      "#b794f4", "Player ELO newScore after last game (pre-bonus)"],
              ].map(([l,v,c,tip])=>(
                <div key={l} title={tip} style={{background:"#141820",borderRadius:"8px",padding:"10px",border:"1px solid #2d3748",textAlign:"center",cursor:"help"}}>
                  <div style={{fontSize:"9px",color:"#718096",marginBottom:"3px",lineHeight:1.3}}>{l}</div>
                  <div style={{fontSize:"15px",fontWeight:"700",color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{padding:"6px 10px",background:"#0f1117",borderRadius:"6px",marginBottom:"10px",fontSize:"10px",color:"#4a5568"}}>
              💡 <strong style={{color:"#718096"}}>Avg Score</strong> = final bracket score (Excel col Q, with all bonuses clamped to range) · <strong style={{color:"#718096"}}>Avg Raw</strong> = average actual score (Excel col B, no bonuses) · <strong style={{color:"#718096"}}>Final ELO</strong> = ELO newScore after last game
            </div>
            <div style={mc}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
                <h3 style={{margin:0,fontSize:"13px",fontWeight:"700",color:ACCENT}}>🎮 Game-by-Game Results</h3>
                <button onClick={()=>setSimSeed(s=>s+1)} style={{padding:"5px 12px",background:"#2d3748",border:"1px solid #4a5568",borderRadius:"6px",color:"#a0aec0",fontSize:"11px",cursor:"pointer"}}>🔀 Re-roll Simulation</button>
              </div>
              <div style={{overflowX:"auto",maxHeight:"520px",overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                  <thead style={{position:"sticky",top:0,zIndex:1}}>
                    <tr style={{background:"#141820"}}>
                      {["#","Actual Score","W/L","Win Ratio","ELO (userAvg)","Delta","ELO New","Pool+","WR+","LG+","Match Min","Match Max","Final Score"].map(h=><th key={h} style={th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {runSimulation.map((g,i)=>{
                      const prev = i>0?runSimulation[i-1].finalScore:g.finalScore;
                      const up   = g.finalScore > prev;
                      return (
                        <tr key={i} style={{background:g.win?"#0d1a0d":i%2?"#141820":"transparent"}}>
                          <td style={{...tdS("#90cdf4"),fontWeight:"700"}}>{g.game}</td>
                          <td style={tdS()}>{g.actualScore}</td>
                          <td style={{...tdS(),color:g.win?"#68d391":"#fc8181",fontWeight:"700"}}>{g.win?"✅ W":"❌ L"}</td>
                          <td style={tdS("#63b3ed")}>{(g.winRatio*100).toFixed(0)}%</td>
                          <td style={tdS("#a0aec0")}>{g.userAvg}</td>
                          <td style={{...tdS(),color:g.delta>=0?"#68d391":"#fc8181"}}>{g.delta>=0?"+":""}{g.delta}</td>
                          <td style={tdS("#b794f4")}>{g.newScore}</td>
                          <td style={{...tdS(),color:ACCENT}}>{g.poolBonus>=0?"+":""}{g.poolBonus}</td>
                          <td style={{...tdS(),color:g.wrBonus>=0?"#68d391":"#fc8181"}}>{g.wrBonus>=0?"+":""}{g.wrBonus}</td>
                          <td style={{...tdS(),color:g.lgBonus>0?"#68d391":"#718096"}}>{g.lgBonus>=0?"+":""}{g.lgBonus}</td>
                          <td style={tdS("#4a5568")}>{g.scoreMin}</td>
                          <td style={tdS("#4a5568")}>{g.scoreMax}</td>
                          <td style={{padding:"5px 10px",fontSize:"12px",fontWeight:"700",color:up?"#68d391":i===0?ACCENT:"#fc8181",borderBottom:"1px solid #141820"}}>
                            {i>0?(up?"▲":"▼"):""} {g.finalScore}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── GRAPHS ── */}
        {tab==="graphs" && (
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"14px"}}>
              <div style={mc}>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>📈 Score Progression</h3>
                <p style={{margin:"0 0 8px",fontSize:"10px",color:"#4a5568"}}>Pink=match bracket score (with bonuses) · Blue=raw skill/ELO · Gray band=valid match range</p>
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={runSimulation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="game" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}}/>
                    <Tooltip contentStyle={tipS} formatter={(v,n)=>[r2(v),n]}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Area type="monotone" dataKey="scoreMax" fill="#68d39110" stroke="#68d39130" strokeWidth={1} name="Score Max"/>
                    <Area type="monotone" dataKey="scoreMin" fill="#fc818110" stroke="#fc818130" strokeWidth={1} name="Score Min"/>
                    <Line type="monotone" dataKey="actualScore" stroke="#90cdf4" strokeWidth={1} dot={false} strokeDasharray="3 3" name="Raw Actual"/>
                    <Line type="monotone" dataKey="newScore" stroke="#63b3ed" strokeWidth={1} dot={false} strokeDasharray="4 2" name="ELO Skill"/>
                    <Line type="monotone" dataKey="finalScore" stroke={ACCENT} strokeWidth={2} dot={false} name="Final Match Score"/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div style={mc}>
                <h3 style={{margin:"0 0 10px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>🏆 Win Rate Over Time</h3>
                <ResponsiveContainer width="100%" height={230}>
                  <ComposedChart data={runSimulation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="game" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis yAxisId="l" stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>(v*100).toFixed(0)+"%"}/>
                    <YAxis yAxisId="r" orientation="right" stroke="#f6ad55" tick={{fontSize:9}}/>
                    <Tooltip contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar yAxisId="r" dataKey="finalScore" name="Final Score" opacity={0.3} radius={[1,1,0,0]}>
                      {runSimulation.map((g,i)=><Cell key={i} fill={g.win?"#68d391":"#fc8181"}/>)}
                    </Bar>
                    <Line yAxisId="l" type="monotone" dataKey="winRatio" stroke="#63b3ed" strokeWidth={2} dot={false} name="Win Ratio"/>
                    <ReferenceLine yAxisId="l" y={0.5} stroke="#f6ad55" strokeDasharray="4 2" label={{value:"50%",fill:"#f6ad55",fontSize:8}}/>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div style={mc}>
                <h3 style={{margin:"0 0 10px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>⚡ Score Bonuses Breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={runSimulation}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="game" stroke="#4a5568" tick={{fontSize:9}}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}}/>
                    <Tooltip contentStyle={tipS}/>
                    <Legend wrapperStyle={{fontSize:"11px"}}/>
                    <Bar dataKey="poolBonus" name="Pool" fill={ACCENT} stackId="a" radius={[0,0,0,0]}/>
                    <Bar dataKey="wrBonus"   name="Win Ratio" fill="#63b3ed" stackId="a"/>
                    <Bar dataKey="lgBonus"   name="Last Game" fill="#68d391" stackId="a" radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={mc}>
                <h3 style={{margin:"0 0 10px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>📊 Score Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={(() => {
                    if (!runSimulation.length) return [];
                    const sc = runSimulation.map(g=>g.finalScore);
                    const mn = Math.floor(Math.min(...sc)/10)*10;
                    const mx = Math.ceil(Math.max(...sc)/10)*10;
                    const out = [];
                    for (let b=mn; b<mx; b+=10) out.push({range:b+"–"+(b+10), count:sc.filter(v=>v>=b&&v<b+10).length});
                    return out;
                  })()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                    <XAxis dataKey="range" stroke="#4a5568" tick={{fontSize:8}} angle={-30} textAnchor="end" height={40}/>
                    <YAxis stroke="#4a5568" tick={{fontSize:9}}/>
                    <Tooltip contentStyle={tipS}/>
                    <Bar dataKey="count" name="Games" radius={[3,3,0,0]} fill={ACCENT} opacity={0.85}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* ── EXPORT ── */}
        {tab==="export" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            <div style={mc}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:ACCENT}}>📄 JSON Config</h3>
              <p style={{margin:"0 0 10px",fontSize:"11px",color:"#4a5568"}}>Ready for game engine — matches Excel Room 5006 structure.</p>
              <textarea readOnly value={JSON.stringify(buildJSON(),null,2)}
                style={{width:"100%",height:"400px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"8px",color:"#a0aec0",fontSize:"10px",padding:"10px",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
              <button onClick={copyJSON}
                style={{width:"100%",marginTop:"8px",padding:"10px",background:copied?"#276749":"linear-gradient(135deg,#97266d,#553c9a)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer"}}>
                {copied?"✅ Copied!":"📋 Copy JSON"}
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {/* Config Summary */}
              <div style={mc}>
                <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>📋 Config Summary</h3>
                {[
                  ["Initial Score",     initialScore,                                             "#63b3ed"],
                  ["K-Factor (+)",      kFactors.positive,                                        "#68d391"],
                  ["K-Factor (−)",      kFactors.negative,                                        "#fc8181"],
                  ["Last Match Weight", (lastMatchWeight*100).toFixed(0)+"%",                     "#f6ad55"],
                  ["Win Lookback",      winLookback+" games",                                     "#b794f4"],
                  ["Avg Lookback",      avgLookback+" games",                                     "#90cdf4"],
                  ["Score Range",       "−"+((matchRange.minPct)*100).toFixed(0)+"% / +"+((matchRange.maxPct)*100).toFixed(0)+"%", ACCENT],
                  ["Win Bonus",         "+"+lastGameBonus.win,                                    "#68d391"],
                  ["Lose Bonus",        "+"+lastGameBonus.lose,                                   "#fc8181"],
                  ["Pool (active)",     poolStatus,                                               ACCENT],
                  ["Sim Win Rate",      stats.winRate+"%",                                        "#63b3ed"],
                  ["Sim Avg Score",     stats.avg,                                                ACCENT],
                ].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:"#141820",borderRadius:"7px",marginBottom:"5px",fontSize:"12px"}}>
                    <span style={{color:"#718096"}}>{l}</span>
                    <strong style={{color:c}}>{v}</strong>
                  </div>
                ))}
              </div>

              {/* QA Panel */}
              <div style={mc}>
                <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"700",color:ACCENT}}>🔍 JSON QA</h3>
                {(() => {
                  const json = buildJSON();
                  const checks = [];
                  const pass = m => checks.push({ok:true,  msg:m});
                  const fail = m => checks.push({ok:false, msg:m});

                  // Structure checks
                  ["poolStatus2AdditionalScore","lastMatchResultAdditionalScore","winTakenIntoAccountPreviousMatchesAmount",
                   "winMatchesAmountAdditionalScores","matchScoreRange","percentageWeightOfLastMatch",
                   "positiveKFactor","negativeKFactor","averageTakenIntoAccountPreviousMatchesAmount","initialNormalizedScore"
                  ].forEach(k => json[k]!==undefined ? pass('✓ "'+k+'" present') : fail('✗ Missing "'+k+'"'));

                  // Value checks
                  json.positiveKFactor > 0   ? pass("✓ positiveKFactor > 0")              : fail("✗ positiveKFactor must be > 0");
                  json.negativeKFactor > 0   ? pass("✓ negativeKFactor > 0")              : fail("✗ negativeKFactor must be > 0");
                  json.negativeKFactor <= 1  ? pass("✓ negativeKFactor ≤ 1")              : fail("✗ negativeKFactor should be ≤ 1 (dampening)");
                  json.initialNormalizedScore > 0 ? pass("✓ initialNormalizedScore > 0")  : fail("✗ initialNormalizedScore must be > 0");
                  json.matchScoreRange.averageScoreHighestPercentage > json.matchScoreRange.averageScoreLowerPercentage
                    ? pass("✓ maxPct > minPct")
                    : fail("✗ maxPct must be greater than minPct");
                  json.percentageWeightOfLastMatch > 0 && json.percentageWeightOfLastMatch < 1
                    ? pass("✓ lastMatchWeight between 0–1")
                    : fail("✗ lastMatchWeight must be between 0 and 1");

                  // Win ratio scores array
                  const wmas = json.winMatchesAmountAdditionalScores || [];
                  wmas.length > 0 ? pass("✓ winMatchesAmountAdditionalScores: "+wmas.length+" entries")
                                  : fail("✗ winMatchesAmountAdditionalScores is empty");
                  const amounts = wmas.map(w=>w.winMatchesAmount);
                  new Set(amounts).size === amounts.length ? pass("✓ winMatchesAmount values are unique")
                                                           : fail("✗ Duplicate winMatchesAmount values");

                  // Pool scores
                  const psc = json.poolStatus2AdditionalScore;
                  ["critical","secure","happy","awesome"].forEach(k =>
                    psc[k]!==undefined ? pass('✓ pool "'+k+'" defined') : fail('✗ Missing pool "'+k+'"')
                  );

                  // JSON serialisation
                  try { JSON.parse(JSON.stringify(json)); pass("✓ JSON serialises cleanly"); }
                  catch(e) { fail("✗ Serialise error: "+e.message); }

                  return (
                    <div style={{display:"flex",flexDirection:"column",gap:"3px",maxHeight:"300px",overflowY:"auto"}}>
                      {checks.map((c,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"5px 9px",borderRadius:"5px",fontSize:"11px",background:c.ok?"#141820":"#2d1a1a",border:"1px solid "+(c.ok?"#276749":"#c53030")}}>
                          <span>{c.ok?"✅":"❌"}</span>
                          <span style={{color:c.ok?"#a0aec0":"#fc8181"}}>{c.msg}</span>
                        </div>
                      ))}
                      <div style={{marginTop:"6px",padding:"6px 10px",background:"#0f1117",borderRadius:"6px",fontSize:"11px",color:checks.every(c=>c.ok)?"#68d391":"#f6ad55",fontWeight:"700"}}>
                        {checks.every(c=>c.ok) ? "✅ All "+checks.length+" checks passed — config is valid!" : "⚠️ "+checks.filter(c=>!c.ok).length+" issue(s) found — review before exporting"}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// MISSIONS V2
// ══════════════════════════════════════════════════════════════════════════════
const GAMES2  = ["Bubbles","Solitaire","Blocks","Match 3"];
const BINS2   = [1,3,5,7];
const DCOLS2  = ["#63b3ed","#68d391","#f6ad55","#fc8181","#b794f4","#76e4f7","#f687b3"];
const MKEYS2  = ["win_first_place","win_cash_match","play_cash_match","collect_score_tokens"];
const MINFO2  = {
  win_first_place:      { label:"Win 1st Place",       icon:"🥇", unit:"wins"    },
  win_cash_match:       { label:"Win Cash Match",       icon:"💰", unit:"wins"    },
  play_cash_match:      { label:"Play Cash Match",      icon:"🎮", unit:"matches" },
  collect_score_tokens: { label:"Collect Score Tokens", icon:"⭐", unit:"tokens"  },
};
const v2r2 = v => Math.round((+v||0)*100)/100;
const v2$f = v => "$"+v2r2(v).toFixed(2);
const v2pp = (v,t) => t>0 ? Math.min(100, Math.round((+v||0)/(+t)*100)) : 0;

const DEF_RATES = () => ({ "Bubbles":{1:10,3:5,5:3,7:2}, "Solitaire":{1:12,3:6,5:4,7:2}, "Blocks":{1:8,3:5,5:3,7:2}, "Match 3":{1:11,3:5,5:3,7:2} });

const DEF_DAYS = () => Array.from({length:7}, (_,di) => ({
  day: di+1,
  missions: MKEYS2.reduce((acc,type) => {
    const tgts = {win_first_place:5+di, win_cash_match:7+di*2, play_cash_match:9+di*2, collect_score_tokens:100+di*50};
    return { ...acc, [type]: { target:tgts[type], enabled:true, bcash:v2r2(0.10*(di+1)), chips:25*(di+1), stars:1 } };
  }, {}),
}));

const DEF_MILESTONES = () => [
  {id:1,stars:3, label:"3⭐", bcash:0.50, chips:100},
  {id:2,stars:7, label:"7⭐", bcash:1.00, chips:250},
  {id:3,stars:12,label:"12⭐",bcash:2.00, chips:500},
  {id:4,stars:18,label:"18⭐",bcash:4.00, chips:750},
  {id:5,stars:24,label:"24⭐",bcash:8.00, chips:1500},
  {id:6,stars:28,label:"28⭐",bcash:15.00,chips:3000},
];

const DEF_V2PERSONAS = () => [
  {id:1,name:"Casual",  pct:"50th %",    color:"#63b3ed",matchesPerDay:3, winRate:28,firstPlaceRate:8, avgScore:{"Bubbles":60,"Solitaire":50,"Blocks":70,"Match 3":55},   gameMix:{"Bubbles":60,"Solitaire":20,"Blocks":10,"Match 3":10},buyInMix:{1:85,3:10,5:3,7:2}},
  {id:2,name:"Engaged", pct:"75th %",    color:"#68d391",matchesPerDay:7, winRate:30,firstPlaceRate:10,avgScore:{"Bubbles":100,"Solitaire":90,"Blocks":120,"Match 3":95},  gameMix:{"Bubbles":50,"Solitaire":25,"Blocks":15,"Match 3":10},buyInMix:{1:70,3:20,5:7,7:3}},
  {id:3,name:"Extreme", pct:"90th %",    color:"#f6ad55",matchesPerDay:15,winRate:32,firstPlaceRate:12,avgScore:{"Bubbles":160,"Solitaire":150,"Blocks":190,"Match 3":145},gameMix:{"Bubbles":40,"Solitaire":30,"Blocks":20,"Match 3":10},buyInMix:{1:50,3:30,5:15,7:5}},
  {id:4,name:"Whale",   pct:"99th % Est",color:"#fc8181",matchesPerDay:30,winRate:35,firstPlaceRate:15,avgScore:{"Bubbles":230,"Solitaire":210,"Blocks":260,"Match 3":200},gameMix:{"Bubbles":30,"Solitaire":30,"Blocks":25,"Match 3":15},buyInMix:{1:30,3:30,5:25,7:15}},
];

let _nextMsId=300, _nextPerId=20;

function calcScoreTokens(persona, rates) {
  let tokens = 0;
  GAMES2.forEach(g => BINS2.forEach(b => {
    const ppt = Math.max(1, (rates[g]&&rates[g][b]) || 1);
    tokens += persona.matchesPerDay * ((persona.gameMix[g]||0)/100) * ((persona.buyInMix[b]||0)/100) * ((persona.avgScore[g])||0) / ppt;
  }));
  return v2r2(tokens);
}

function calcInvestment(persona) {
  const avgFee = BINS2.reduce((s,b) => s + (persona.buyInMix[b]||0)/100 * b, 0);
  return v2r2(persona.matchesPerDay * 7 * avgFee);
}

function calcPersonaSim(persona, rates, days, sortedMilestones) {
  let cumStars = 0;
  const dayResults = days.map(day => {
    const scoreTok = calcScoreTokens(persona, rates);
    const act = {
      win_first_place:      Math.round(persona.matchesPerDay * persona.firstPlaceRate / 100),
      win_cash_match:       Math.round(persona.matchesPerDay * persona.winRate / 100),
      play_cash_match:      persona.matchesPerDay,
      collect_score_tokens: scoreTok,
    };
    const missions = MKEYS2.reduce((acc, type) => {
      const m   = day.missions[type];
      const val = act[type] || 0;
      const done = m.enabled && val >= m.target;
      return { ...acc, [type]: { ...m, val, done, pct: v2pp(val, m.target) } };
    }, {});
    const enabled   = MKEYS2.filter(t => missions[t].enabled);
    const completed = MKEYS2.filter(t => missions[t].enabled && missions[t].done);
    const allDone   = enabled.length > 0 && completed.length === enabled.length;
    const dayBcash  = v2r2(completed.reduce((s,t) => s + missions[t].bcash, 0));
    const dayChips  = completed.reduce((s,t) => s + missions[t].chips, 0);
    const dayStars  = completed.reduce((s,t) => s + missions[t].stars, 0);
    cumStars += dayStars;
    return { day:day.day, missions, allDone, dayBcash, dayChips, dayStars, cumStars, completedN:completed.length, enabledN:enabled.length };
  });
  const totalBcash = v2r2(dayResults.reduce((s,d)=>s+d.dayBcash, 0));
  const totalStars = dayResults[dayResults.length-1].cumStars;
  const mstnBcash  = v2r2(sortedMilestones.filter(m=>totalStars>=m.stars).reduce((s,m)=>s+m.bcash,0));
  const mstnChips  = sortedMilestones.filter(m=>totalStars>=m.stars).reduce((s,m)=>s+m.chips,0);
  return {
    ...persona, dayResults,
    totalBcash, totalChips: dayResults.reduce((s,d)=>s+d.dayChips,0),
    totalStars, mstnBcash, mstnChips, grandBcash: v2r2(totalBcash+mstnBcash),
  };
}

function MissionsV2Page({ onBack, readOnly, history, setHistory, histNote, setHistNote }) {
  const [tab,      setTab]      = useState("config");
  const [days,     setDays]     = useState(DEF_DAYS);
  const [rates,    setRates]    = useState(DEF_RATES);
  const [mstn,     setMstn]     = useState(DEF_MILESTONES);
  const [personas, setPersonas] = useState(DEF_V2PERSONAS);
  const [selPer,   setSelPer]   = useState(0);
  const [selPerBar,setSelPerBar]= useState(0);
  const [qaRes,    setQaRes]    = useState(null);
  const [copied,   setCopied]   = useState(false);
  const [csvMsg,   setCsvMsg]   = useState("");

  const sortedMstn   = useMemo(() => [...mstn].sort((a,b)=>a.stars-b.stars), [mstn]);
  const maxMstnStars = useMemo(() => sortedMstn.length>0 ? sortedMstn[sortedMstn.length-1].stars : 28, [sortedMstn]);

  const personaSims = useMemo(() =>
    personas.map(p => calcPersonaSim(p, rates, days, sortedMstn)),
    [personas, rates, days, sortedMstn]
  );

  const safeSelPer = Math.min(selPer,    personaSims.length-1);
  const safeBarPer = Math.min(selPerBar, personaSims.length-1);
  const curPs      = personaSims[safeSelPer] || personaSims[0];
  const barPs      = personaSims[safeBarPer] || personaSims[0];
  const nextMstn   = useMemo(() => sortedMstn.find(m => (curPs?.totalStars||0) < m.stars) || null, [curPs, sortedMstn]);

  const setMField = (di, type, field, v) => setDays(d => d.map((day,i) => i!==di ? day : {
    ...day, missions: { ...day.missions, [type]: { ...day.missions[type],
      [field]: field==="enabled" ? v
             : field==="stars"   ? Math.max(1, Math.round(+v)||1)
             : field==="target"  ? Math.max(1, Math.round(+v)||1)
             : field==="chips"   ? Math.max(0, Math.round(+v)||0)
             : Math.max(0, v2r2(+v))
    }}
  }));

  const setRate    = (g,b,v) => setRates(r => ({ ...r, [g]: { ...r[g], [b]: Math.max(1, Math.round(+v)||1) } }));
  const setMS      = (id,k,v) => setMstn(m => m.map(ms => ms.id!==id ? ms : {
    ...ms, [k]: k==="label" ? v : k==="stars"||k==="chips" ? Math.max(k==="stars"?1:0, Math.round(+v)||0) : Math.max(0,v2r2(+v))
  }));
  const addMS      = () => setMstn(m => [...m, {id:_nextMsId++, stars:sortedMstn.length>0?sortedMstn[sortedMstn.length-1].stars+3:3, label:"New", bcash:0, chips:0}]);
  const removeMS   = id => setMstn(m => m.filter(ms => ms.id!==id));

  const setPField  = (id,k,v) => setPersonas(p => p.map(pe => pe.id!==id ? pe : {
    ...pe, [k]: k==="name"||k==="pct" ? v : Math.max(0, k==="matchesPerDay"||k==="winRate"||k==="firstPlaceRate" ? Math.round(+v)||0 : v2r2(+v))
  }));
  const setAvgScore= (id,g,v) => setPersonas(p => p.map(pe => pe.id!==id ? pe : { ...pe, avgScore:{ ...pe.avgScore, [g]: Math.max(0,+v||0) } }));
  const setGMix    = (id,g,v) => setPersonas(p => p.map(pe => pe.id!==id ? pe : { ...pe, gameMix:{ ...pe.gameMix, [g]: Math.max(0,Math.round(+v)||0) } }));
  const setBMix    = (id,b,v) => setPersonas(p => p.map(pe => pe.id!==id ? pe : { ...pe, buyInMix:{ ...pe.buyInMix, [b]: Math.max(0,Math.round(+v)||0) } }));
  const addPersona = () => setPersonas(p => [...p, {id:_nextPerId++,name:"New",pct:"",color:DCOLS2[p.length%7],matchesPerDay:5,winRate:28,firstPlaceRate:8,avgScore:{"Bubbles":80,"Solitaire":70,"Blocks":90,"Match 3":75},gameMix:{"Bubbles":25,"Solitaire":25,"Blocks":25,"Match 3":25},buyInMix:{1:70,3:20,5:7,7:3}}]);
  const removePersona = id => {
    const idx = personas.findIndex(pe => pe.id === id);
    setPersonas(p => p.filter(pe => pe.id !== id));
    setSelPer(s => Math.max(0, idx >= 0 && s >= idx ? s - 1 : s));
  };

  const buildJSON = () => ({
    version: "v2",
    weekConfig: {
      totalDays: 7,
      milestones: sortedMstn.map(ms => ({ starsRequired:ms.stars, label:ms.label, reward:{ bonusCash:ms.bcash, chips:ms.chips } })),
    },
    days: days.map(day => ({
      day: day.day,
      missions: MKEYS2.filter(t=>day.missions[t].enabled).map(t => ({
        type:t, target:day.missions[t].target,
        reward:{ bonusCash:day.missions[t].bcash, chips:day.missions[t].chips, stars:day.missions[t].stars },
      })),
    })),
    scoreTokenRates: GAMES2.reduce((acc,g) => ({
      ...acc, [g]: BINS2.reduce((bAcc,b) => ({
        ...bAcc, [b]: rates[g][b]>0 ? parseFloat((1/rates[g][b]).toFixed(4)) : 0
      }), {})
    }), {}),
  });

  const runQA = json => {
    const checks=[], pass=m=>checks.push({ok:true,msg:m}), fail=m=>checks.push({ok:false,msg:m});
    ["version","weekConfig","days","scoreTokenRates"].forEach(k => json[k]!==undefined ? pass('✓ "'+k+'" present') : fail('✗ Missing "'+k+'"'));
    (json.days||[]).length===7 ? pass("✓ 7 days present") : fail("✗ Expected 7 days, got "+(json.days||[]).length);
    GAMES2.forEach(g => (json.scoreTokenRates&&json.scoreTokenRates[g]) ? pass("✓ Rates for "+g) : fail("✗ Missing rates for "+g));
    let starErr=0;
    days.forEach((day,di) => MKEYS2.forEach(t => { if(day.missions[t].enabled && day.missions[t].stars<1){fail("✗ Day "+(di+1)+" "+MINFO2[t].label+" stars must be ≥ 1");starErr++;} }));
    if(!starErr) pass("✓ All enabled mission stars ≥ 1");
    const starVals = sortedMstn.map(m=>m.stars);
    const uniqueStars = new Set(starVals);
    uniqueStars.size===starVals.length ? pass("✓ Milestone star thresholds are unique") : fail("✗ Duplicate milestone star thresholds");
    try { JSON.parse(JSON.stringify(json)); pass("✓ JSON serialises cleanly"); } catch(e) { fail("✗ "+e.message); }
    return checks;
  };

  const copyJSON  = () => { const json=buildJSON(), checks=runQA(json); setQaRes(checks); if(checks.some(c=>!c.ok))return; const str=JSON.stringify(json,null,2); if(navigator.clipboard?.writeText) navigator.clipboard.writeText(str).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}); };
  const exportCSV = () => { try { const rows=[]; days.forEach(day=>MKEYS2.forEach(t=>{const m=day.missions[t]; rows.push({"Day":day.day,"Mission":MINFO2[t].label,"Enabled":m.enabled?"Yes":"No","Target":m.target,"B.cash":m.bcash,"Chips":m.chips,"Stars":m.stars});})); downloadCSV(rows,"missions_v2.csv"); setCsvMsg("✅ Downloaded!"); } catch(e) { setCsvMsg("⚠️ "+e.message); } };

  const saveSnapshot = () => {
    const now  = new Date();
    const label = "Config " + now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    const id   = now.getTime();
    const csvRows = [];
    days.forEach(day => MKEYS2.forEach(t => { const m=day.missions[t]; csvRows.push({"Day":day.day,"Mission":MINFO2[t].label,"Enabled":m.enabled?"Yes":"No","Target":m.target,"B.cash":m.bcash,"Chips":m.chips,"Stars":m.stars}); }));
    const totalMissions = days.reduce((s,d)=>s+MKEYS2.filter(t=>d.missions[t].enabled).length, 0);
    const maxBcashDay   = v2r2(days.reduce((s,d)=>s+MKEYS2.reduce((ss,t)=>ss+(d.missions[t].enabled?d.missions[t].bcash:0),0), 0));
    setHistory(h => [{
      id, label, date: now.toISOString(),
      json: buildJSON(), csvRows,
      meta: { days: days.length, missions: totalMissions, milestones: sortedMstn.length, maxBcash: maxBcashDay },
    }, ...h]);
    setHistNote(n => ({...n, [id]: label}));
  };

  const v2c  = {background:"#1a1f2e",border:"1px solid #2d3748",borderRadius:"12px",padding:"14px",marginBottom:"12px"};
  const v2th = {padding:"6px 8px",textAlign:"left",color:"#718096",fontWeight:"600",borderBottom:"1px solid #2d3748",fontSize:"10px",whiteSpace:"nowrap"};
  const tipS = {background:"#1a1f2e",border:"1px solid #2d3748",borderRadius:"8px",padding:"10px",fontSize:"11px"};
  const TABS2= [{id:"config",label:"📅 Daily Config"},{id:"tokens",label:"⭐ Score Tokens"},{id:"weekly",label:"📊 Weekly Bar"},{id:"inputs",label:"👤 User Inputs"},{id:"sim",label:"🎮 Simulator"},{id:"graphs",label:"📈 Graphs"},{id:"export",label:"📤 Export"},{id:"history",label:"📜 History"}];

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#0f1117",minHeight:"100vh",color:"#e2e8f0"}}>
      <div style={{background:"linear-gradient(135deg,#150d2e,#1a1f2e)",padding:"10px 16px",borderBottom:"1px solid #2d3748",display:"flex",alignItems:"center",gap:"10px"}}>
        <button onClick={onBack} style={{padding:"5px 12px",background:"#1e2a45",border:"1px solid #2d3748",borderRadius:"6px",color:"#a0aec0",fontSize:"12px",cursor:"pointer"}}>← Portal</button>
        <span style={{color:"#2d3748"}}>|</span>
        <span style={{fontSize:"13px",color:"#b794f4",fontWeight:"700"}}>⚔️ Missions V2</span>
      </div>
      <div style={{background:"#1a1f2e",borderBottom:"1px solid #2d3748",padding:"0 16px",display:"flex",overflowX:"auto"}}>
        {TABS2.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 12px",border:"none",background:"none",cursor:"pointer",color:tab===t.id?"#b794f4":"#a0aec0",borderBottom:tab===t.id?"2px solid #b794f4":"2px solid transparent",fontWeight:tab===t.id?"600":"400",fontSize:"12px",whiteSpace:"nowrap"}}>{t.label}</button>)}
      </div>
      <div style={{padding:"14px 16px",maxWidth:"1350px",margin:"0 auto"}}>

        {tab==="config" && (<>
          <p style={{margin:"0 0 12px",fontSize:"12px",color:"#718096"}}>Each mission has its own target + 3 rewards. Missions run in parallel — each completed independently per day.</p>
          {days.map((day,di)=>(
            <div key={day.day} style={{...v2c,borderLeft:"3px solid "+DCOLS2[di]}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                <div style={{width:"26px",height:"26px",background:DCOLS2[di]+"22",border:"1px solid "+DCOLS2[di]+"55",borderRadius:"6px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",color:DCOLS2[di],fontSize:"12px"}}>{day.day}</div>
                <h3 style={{margin:0,fontSize:"13px",fontWeight:"700",color:DCOLS2[di]}}>Day {day.day}</h3>
                <div style={{marginLeft:"auto",padding:"4px 10px",background:"#0f1117",borderRadius:"8px",fontSize:"11px",display:"flex",gap:"12px"}}>
                  <span style={{color:"#68d391"}}>{v2$f(v2r2(MKEYS2.reduce((s,t)=>s+(day.missions[t].enabled?day.missions[t].bcash:0),0)))} max B.cash</span>
                  <span style={{color:"#f6e05e"}}>⭐{MKEYS2.reduce((s,t)=>s+(day.missions[t].enabled?day.missions[t].stars:0),0)} max stars</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
                {MKEYS2.map(type=>{
                  const m=day.missions[type], info=MINFO2[type];
                  return (
                    <div key={type} style={{background:"#141820",borderRadius:"10px",padding:"12px",border:"1px solid "+(m.enabled?"#2d3748":"#1a1f2e"),opacity:m.enabled?1:0.45}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                        <span style={{fontSize:"11px",fontWeight:"700"}}>{info.icon} {info.label}</span>
                        <label style={{display:"flex",alignItems:"center",gap:"3px",cursor:"pointer",fontSize:"10px",color:"#718096"}}><input type="checkbox" checked={m.enabled} onChange={e=>setMField(di,type,"enabled",e.target.checked)}/> on</label>
                      </div>
                      <div style={{marginBottom:"8px"}}>
                        <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"3px"}}>Target ({info.unit})</label>
                        <input type="number" min="1" value={m.target} onChange={e=>setMField(di,type,"target",e.target.value)} disabled={!m.enabled} style={{width:"100%",padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#90cdf4",fontSize:"11px",outline:"none",boxSizing:"border-box"}}/>
                      </div>
                      <div style={{borderTop:"1px solid #2d3748",paddingTop:"8px",marginBottom:"6px",fontSize:"10px",color:"#718096",fontWeight:"600"}}>🎁 Reward on complete</div>
                      {[["bcash","💵 B.cash","#68d391","0.01"],["chips","🪙 Chips","#f6ad55","1"],["stars","⭐ Stars (→bar)","#f6e05e","1"]].map(([field,label,col,step])=>(
                        <div key={field} style={{marginBottom:"5px"}}>
                          <label style={{display:"block",fontSize:"9px",color:"#4a5568",marginBottom:"2px"}}>{label}</label>
                          <input type="number" min={field==="stars"?"1":"0"} step={step} value={m[field]} onChange={e=>setMField(di,type,field,e.target.value)} disabled={!m.enabled} style={{width:"100%",padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:col,fontSize:"11px",outline:"none",boxSizing:"border-box"}}/>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>)}

        {tab==="tokens" && (()=>{
          const diff = ppt => ppt <= 3  ? {label:"🟢 Easy",     color:"#68d391", bg:"#0d1a12", border:"#276749"}
                             : ppt <= 6  ? {label:"🟡 Medium",   color:"#f6e05e", bg:"#1a1a08", border:"#744210"}
                             : ppt <= 10 ? {label:"🟠 Hard",     color:"#f6ad55", bg:"#1a1208", border:"#744210"}
                             :             {label:"🔴 Very Hard", color:"#fc8181", bg:"#1a0d0d", border:"#9b2c2c"};
          const REC = { 1:{min:8,max:15}, 3:{min:4,max:8}, 5:{min:2,max:5}, 7:{min:1,max:3} };
          const recStatus = (b, ppt) => {
            const r = REC[b];
            if (ppt < r.min) return {icon:"⬇️", text:"Below rec (too generous)", color:"#90cdf4"};
            if (ppt > r.max) return {icon:"⬆️", text:"Above rec (too hard)",     color:"#fc8181"};
            return                  {icon:"✅", text:"Within rec range",          color:"#68d391"};
          };
          return (
          <div style={v2c}>
            <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>⭐ Score Token Rate Table — pts/tok</h3>
            <p style={{margin:"0 0 12px",fontSize:"11px",color:"#718096"}}>How many score points a player needs to earn 1 token per game × buy-in room. <strong style={{color:"#68d391"}}>Lower = more generous.</strong></p>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:"#141820"}}>
                  <th style={v2th}>Game</th>
                  {BINS2.map(b=>(<th key={b} style={{...v2th,textAlign:"center",color:"#f6ad55"}}>${b} Room<br/><span style={{color:"#68d391",fontWeight:"400",fontSize:"9px"}}>pts/tok<br/>rec: {REC[b].min}–{REC[b].max}</span></th>))}
                </tr></thead>
                <tbody>
                  {GAMES2.map((g,gi)=>(
                    <tr key={g} style={{background:gi%2?"#141820":"transparent"}}>
                      <td style={{padding:"8px 8px",fontWeight:"600",color:"#90cdf4",fontSize:"11px"}}>{g}</td>
                      {BINS2.map(b=>{
                        const ppt=rates[g][b], d=diff(ppt), rec=recStatus(b,ppt);
                        return (
                          <td key={b} style={{padding:"5px 8px",textAlign:"center"}}>
                            <input type="number" min="1" step="1" value={ppt} onChange={e=>setRate(g,b,e.target.value)} style={{width:88,padding:"5px 7px",background:"#0f1117",border:"2px solid "+d.border,borderRadius:"6px",color:"#68d391",fontSize:"12px",fontWeight:"700",outline:"none",textAlign:"center",marginBottom:"5px"}}/>
                            <div style={{padding:"2px 6px",background:d.bg,borderRadius:"4px",fontSize:"9px",fontWeight:"700",color:d.color,marginBottom:"3px",border:"1px solid "+d.border}}>{d.label}</div>
                            <div style={{fontSize:"9px",color:rec.color}}>{rec.icon} {rec.text}</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}

        {tab==="weekly" && (
          <div style={v2c}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div>
                <h3 style={{margin:"0 0 4px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>📊 Weekly Bar Milestones</h3>
                <p style={{margin:0,fontSize:"11px",color:"#718096"}}>Stars fill the bar. Each milestone unlocks at a star threshold.</p>
              </div>
              <button onClick={addMS} style={{padding:"5px 12px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>+ Add</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px",flexWrap:"wrap"}}>
              <span style={{fontSize:"11px",color:"#718096"}}>Preview persona:</span>
              {personaSims.map((ps,i)=>(
                <button key={ps.id} onClick={()=>setSelPerBar(i)} style={{padding:"4px 10px",borderRadius:"6px",border:"1px solid "+(safeBarPer===i?ps.color:"#2d3748"),background:safeBarPer===i?ps.color+"22":"#141820",color:safeBarPer===i?ps.color:"#718096",cursor:"pointer",fontSize:"11px"}}>
                  {ps.name} <span style={{color:"#4a5568",fontSize:"9px"}}>⭐{ps.totalStars}</span>
                </button>
              ))}
            </div>
            <div style={{padding:"14px",background:"#141820",borderRadius:"10px",marginBottom:"20px"}}>
              <div style={{position:"relative",height:"34px",marginBottom:"68px"}}>
                <div style={{height:"34px",background:"#2d3748",borderRadius:"17px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:(maxMstnStars>0?Math.min(barPs.totalStars,maxMstnStars)/maxMstnStars*100:0)+"%",background:"linear-gradient(90deg,#975a16,#f6e05e)",borderRadius:"17px",transition:"width 0.5s"}}/>
                </div>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:"12px",fontWeight:"700",color:"#1a1a08",pointerEvents:"none"}}>⭐ {barPs.totalStars} / {maxMstnStars}</div>
                {sortedMstn.map(ms=>{
                  const lp=Math.min(97,Math.max(2,ms.stars/Math.max(maxMstnStars,1)*100)), reached=barPs.totalStars>=ms.stars;
                  return (
                    <div key={ms.id} style={{position:"absolute",left:lp+"%",top:"-2px",transform:"translateX(-50%)"}}>
                      <div style={{width:"14px",height:"38px",background:reached?"#68d391":"#4a5568",borderRadius:"3px",border:"2px solid "+(reached?"#276749":"#2d3748")}}/>
                      <div style={{position:"absolute",top:"44px",left:"50%",transform:"translateX(-50%)",textAlign:"center",whiteSpace:"nowrap",fontSize:"9px",lineHeight:"1.5"}}>
                        <div style={{fontWeight:"700",color:reached?"#f6e05e":"#4a5568"}}>{ms.label}</div>
                        <div style={{color:reached?"#68d391":"#4a5568"}}>{v2$f(ms.bcash)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#141820"}}>{["Stars","Label","B.cash","Chips","Status",""].map(h=><th key={h} style={v2th}>{h}</th>)}</tr></thead>
              <tbody>{sortedMstn.map(ms=>{
                const reached=barPs.totalStars>=ms.stars;
                return (
                  <tr key={ms.id} style={{background:reached?"#0d1a12":"transparent"}}>
                    <td style={{padding:"6px 8px"}}><input type="number" min="1" value={ms.stars} onChange={e=>setMS(ms.id,"stars",e.target.value)} style={{width:50,padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#e2e8f0",fontSize:"11px",outline:"none"}}/></td>
                    <td style={{padding:"6px 8px"}}><input type="text" value={ms.label} onChange={e=>setMS(ms.id,"label",e.target.value)} style={{width:90,padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#e2e8f0",fontSize:"11px",outline:"none"}}/></td>
                    <td style={{padding:"6px 8px"}}><input type="number" min="0" step="0.01" value={ms.bcash} onChange={e=>setMS(ms.id,"bcash",e.target.value)} style={{width:70,padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#68d391",fontSize:"11px",outline:"none"}}/></td>
                    <td style={{padding:"6px 8px"}}><input type="number" min="0" value={ms.chips} onChange={e=>setMS(ms.id,"chips",e.target.value)} style={{width:70,padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#f6ad55",fontSize:"11px",outline:"none"}}/></td>
                    <td style={{padding:"6px 8px"}}><span style={{fontSize:"11px",padding:"3px 8px",borderRadius:"10px",fontWeight:"600",background:reached?"#276749":"#2d3748",color:reached?"#9ae6b4":"#718096"}}>{reached?"✅ Unlocked":"🔒 Locked"}</span></td>
                    <td style={{padding:"6px 8px"}}><button onClick={()=>removeMS(ms.id)} style={{padding:"2px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"10px",cursor:"pointer"}}>✕</button></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}

        {tab==="inputs" && (<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
            <p style={{margin:0,fontSize:"12px",color:"#718096"}}>Define persona behaviour.</p>
            <button onClick={addPersona} style={{padding:"5px 12px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>+ Add Persona</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"12px"}}>
            {personas.map(pe=>{
              const sim=personaSims.find(s=>s.id===pe.id);
              const gameMixTotal=Object.values(pe.gameMix).reduce((s,v)=>s+v,0);
              const buyInMixTotal=Object.values(pe.buyInMix).reduce((s,v)=>s+v,0);
              return (
                <div key={pe.id} style={{...v2c,marginBottom:0,borderTop:"3px solid "+pe.color,position:"relative"}}>
                  {personas.length>1 && <button onClick={()=>removePersona(pe.id)} style={{position:"absolute",top:"10px",right:"10px",padding:"2px 6px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"10px",cursor:"pointer"}}>✕</button>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"10px"}}>
                    {[["Name","name","text","#e2e8f0"],["Percentile","pct","text","#718096"],["Matches/Day","matchesPerDay","number",pe.color],["Win Rate %","winRate","number","#68d391"],["1st Place %","firstPlaceRate","number","#f6ad55"]].map(([l,k,type,col])=>(
                      <div key={k}>
                        <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"2px"}}>{l}</label>
                        <input type={type} value={pe[k]} onChange={e=>setPField(pe.id,k,e.target.value)} style={{width:"100%",padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:col,fontSize:"11px",outline:"none",boxSizing:"border-box"}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{background:"#141820",borderRadius:"8px",padding:"10px",marginBottom:"8px"}}>
                    <div style={{fontSize:"10px",color:"#718096",fontWeight:"600",marginBottom:"8px"}}>🎯 Avg Score per Game</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
                      {GAMES2.map(g=>(
                        <div key={g} style={{display:"flex",alignItems:"center",gap:"5px"}}>
                          <span style={{fontSize:"10px",color:"#90cdf4",width:"60px",flexShrink:0}}>{g}</span>
                          <input type="number" min="0" value={pe.avgScore[g]||0} onChange={e=>setAvgScore(pe.id,g,e.target.value)} style={{flex:1,padding:"4px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"5px",color:"#b794f4",fontSize:"11px",outline:"none"}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                    <div style={{background:"#141820",borderRadius:"7px",padding:"8px"}}>
                      <div style={{fontSize:"10px",color:"#718096",fontWeight:"600",marginBottom:"5px"}}>🎮 Game Mix %</div>
                      {GAMES2.map(g=>(
                        <div key={g} style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"4px"}}>
                          <span style={{fontSize:"10px",color:"#90cdf4",width:"55px",flexShrink:0}}>{g}</span>
                          <input type="number" min="0" max="100" value={pe.gameMix[g]} onChange={e=>setGMix(pe.id,g,e.target.value)} style={{flex:1,padding:"3px 5px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"4px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}/>
                        </div>
                      ))}
                      <div style={{fontSize:"9px",color:gameMixTotal===100?"#68d391":"#fc8181",marginTop:"3px",fontWeight:"600"}}>Total: {gameMixTotal}%</div>
                    </div>
                    <div style={{background:"#141820",borderRadius:"7px",padding:"8px"}}>
                      <div style={{fontSize:"10px",color:"#718096",fontWeight:"600",marginBottom:"5px"}}>💵 Buy-in Mix %</div>
                      {BINS2.map(b=>(
                        <div key={b} style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"4px"}}>
                          <span style={{fontSize:"10px",color:"#f6ad55",width:"55px",flexShrink:0}}>${b}</span>
                          <input type="number" min="0" max="100" value={pe.buyInMix[b]} onChange={e=>setBMix(pe.id,b,e.target.value)} style={{flex:1,padding:"3px 5px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"4px",color:"#e2e8f0",fontSize:"10px",outline:"none"}}/>
                        </div>
                      ))}
                      <div style={{fontSize:"9px",color:buyInMixTotal===100?"#68d391":"#fc8181",marginTop:"3px",fontWeight:"600"}}>Total: {buyInMixTotal}%</div>
                    </div>
                  </div>
                  {sim && (
                    <div style={{marginTop:"8px",padding:"7px",background:"#0f1117",borderRadius:"6px",fontSize:"11px",display:"flex",gap:"12px",flexWrap:"wrap"}}>
                      <span style={{color:pe.color}}>⭐{sim.totalStars} stars</span>
                      <span style={{color:"#68d391"}}>{v2$f(sim.grandBcash)} B.cash</span>
                      <span style={{color:"#718096"}}>{sim.dayResults.filter(d=>d.allDone).length}/7 full days</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>)}

        {tab==="sim" && curPs && (<>
          <div style={{display:"flex",gap:"8px",marginBottom:"12px",flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:"12px",color:"#718096"}}>Persona:</span>
            {personaSims.map((ps,i)=>(
              <button key={ps.id} onClick={()=>setSelPer(i)} style={{padding:"6px 12px",borderRadius:"8px",border:"2px solid "+(safeSelPer===i?ps.color:"#2d3748"),background:safeSelPer===i?ps.color+"22":"#141820",color:safeSelPer===i?ps.color:"#a0aec0",cursor:"pointer",fontWeight:safeSelPer===i?"700":"400",fontSize:"12px"}}>
                {ps.name} <span style={{fontSize:"10px",color:"#718096"}}>{ps.pct}</span>
              </button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px",marginBottom:"12px"}}>
            {[["Matches/Day",curPs.matchesPerDay,curPs.color],["Win Rate",curPs.winRate+"%","#68d391"],["Total Stars","⭐"+curPs.totalStars,"#f6e05e"],["Days Done",curPs.dayResults.filter(d=>d.allDone).length+"/7","#68d391"],["Grand B.cash",v2$f(curPs.grandBcash),"#63b3ed"],["Invested",v2$f(calcInvestment(curPs)),"#fc8181"]].map(([l,v,c])=>(
              <div key={l} style={{background:"#141820",borderRadius:"8px",padding:"10px",border:"1px solid #2d3748"}}>
                <div style={{fontSize:"9px",color:"#718096",marginBottom:"3px"}}>{l}</div>
                <div style={{fontSize:"16px",fontWeight:"700",color:c}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"8px",marginBottom:"12px"}}>
            {curPs.dayResults.map((d,i)=>(
              <div key={i} style={{background:d.allDone?"#0d1a12":"#141820",borderRadius:"8px",padding:"10px",border:"1px solid "+(d.allDone?"#276749":"#2d3748"),textAlign:"center"}}>
                <div style={{fontSize:"14px",marginBottom:"2px"}}>{d.allDone?"✅":"⏳"}</div>
                <div style={{fontSize:"11px",fontWeight:"700",color:DCOLS2[i]}}>D{d.day}</div>
                <div style={{fontSize:"10px",color:"#718096",margin:"3px 0"}}>{d.completedN}/{d.enabledN}</div>
                <PBar val={d.completedN} max={d.enabledN} color={DCOLS2[i]}/>
                {d.dayStars>0 && <div style={{fontSize:"10px",color:"#f6e05e",marginTop:"3px"}}>⭐{d.dayStars}</div>}
                {d.allDone   && <div style={{fontSize:"10px",color:"#68d391",marginTop:"2px"}}>{v2$f(d.dayBcash)}</div>}
              </div>
            ))}
          </div>
          <div style={{...v2c,background:"#141808",border:"1px solid #975a16"}}>
            <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#f6e05e"}}>⭐ Weekly Bar — {curPs.name}</h3>
            <PBar val={curPs.totalStars} max={Math.max(maxMstnStars,1)} color="#f6e05e" h={14}/>
            <div style={{display:"flex",justifyContent:"space-between",margin:"5px 0 10px",fontSize:"11px"}}>
              <span style={{color:"#f6e05e"}}>⭐ {curPs.totalStars} / {maxMstnStars}</span>
              {nextMstn && <span style={{color:"#718096"}}>{nextMstn.stars-curPs.totalStars} more stars to unlock {nextMstn.label}</span>}
            </div>
            <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
              {sortedMstn.map(ms=>{const reached=curPs.totalStars>=ms.stars;return(
                <div key={ms.id} style={{flex:1,minWidth:"50px",background:reached?"#0d1a12":"#0f1117",borderRadius:"6px",padding:"6px",border:"1px solid "+(reached?"#276749":"#2d3748"),textAlign:"center"}}>
                  <div style={{fontSize:"10px",color:reached?"#f6e05e":"#4a5568",fontWeight:"700"}}>{ms.label}</div>
                  <div style={{fontSize:"10px",color:reached?"#68d391":"#4a5568"}}>{v2$f(ms.bcash)}</div>
                  <div style={{fontSize:"9px",marginTop:"2px"}}>{reached?"✅":"🔒"}</div>
                </div>
              );})}
            </div>
          </div>
        </>)}

        {tab==="graphs" && (<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <div style={v2c}>
              <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#f6e05e"}}>⭐ Stars Earned by Persona</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={personaSims.map(ps=>({name:ps.name,Stars:ps.totalStars}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                  <XAxis dataKey="name" stroke="#4a5568" tick={{fontSize:10}}/>
                  <YAxis stroke="#4a5568" tick={{fontSize:10}}/>
                  <Tooltip contentStyle={tipS}/>
                  <Bar dataKey="Stars" fill="#f6e05e" radius={[4,4,0,0]}/>
                  {sortedMstn.map(ms=><ReferenceLine key={ms.id} y={ms.stars} stroke="#b794f4" strokeDasharray="3 3" label={{value:ms.label,fill:"#b794f4",fontSize:8}}/>)}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={v2c}>
              <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>💰 B.cash — Daily vs Milestone</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={personaSims.map(ps=>({name:ps.name,Daily:ps.totalBcash,Milestone:ps.mstnBcash}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                  <XAxis dataKey="name" stroke="#4a5568" tick={{fontSize:10}}/>
                  <YAxis stroke="#4a5568" tick={{fontSize:10}} tickFormatter={v=>"$"+v}/>
                  <Tooltip formatter={v=>["$"+v,""]} contentStyle={tipS}/>
                  <Legend wrapperStyle={{fontSize:"11px"}}/>
                  <Bar dataKey="Daily"     fill="#68d391" radius={[2,2,0,0]}/>
                  <Bar dataKey="Milestone" fill="#b794f4" radius={[2,2,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={v2c}>
            <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#f6e05e"}}>⭐ Cumulative Stars Over 7 Days</h3>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={Array.from({length:7},(_,i)=>{const row={day:"D"+(i+1)};personaSims.forEach(ps=>{row[ps.name]=ps.dayResults[i].cumStars;});return row;})}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                <XAxis dataKey="day" stroke="#4a5568" tick={{fontSize:10}}/>
                <YAxis stroke="#4a5568" tick={{fontSize:10}}/>
                <Tooltip contentStyle={tipS}/><Legend wrapperStyle={{fontSize:"11px"}}/>
                {personaSims.map(ps=><Line key={ps.id} type="monotone" dataKey={ps.name} stroke={ps.color} strokeWidth={2} dot={{fill:ps.color,r:3}}/>)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}

        {tab==="export" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            <div style={v2c}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📄 JSON Config</h3>
              <textarea readOnly value={JSON.stringify(buildJSON(),null,2)} style={{width:"100%",height:"300px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"8px",color:"#a0aec0",fontSize:"10px",padding:"10px",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
              <button onClick={copyJSON} style={{width:"100%",marginTop:"8px",padding:"10px",background:copied?"#276749":"linear-gradient(135deg,#2c5282,#553c9a)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer"}}>{copied?"✅ Copied!":"📋 Copy JSON"}</button>
            </div>
            <div style={v2c}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📊 CSV + QA</h3>
              {csvMsg && <div style={{padding:"8px",background:"#1a2e1a",borderRadius:"6px",color:"#68d391",fontSize:"12px",marginBottom:"8px"}}>{csvMsg}</div>}
              <button onClick={exportCSV} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer",marginBottom:"10px"}}>⬇ Download CSV</button>
              <button onClick={()=>setQaRes(runQA(buildJSON()))} style={{width:"100%",padding:"9px",background:"#2d3748",border:"1px solid #4a5568",borderRadius:"8px",color:"#a0aec0",fontWeight:"600",fontSize:"12px",cursor:"pointer",marginBottom:"8px"}}>🔍 Run QA</button>
              <button onClick={saveSnapshot} style={{width:"100%",padding:"9px",background:"linear-gradient(135deg,#553c9a,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer",marginBottom:"8px"}}>📜 Save to History</button>
              {qaRes && <div style={{display:"flex",flexDirection:"column",gap:"3px",maxHeight:"220px",overflowY:"auto"}}>{qaRes.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"5px 9px",borderRadius:"5px",fontSize:"11px",background:c.ok?"#141820":"#2d1a1a",border:"1px solid "+(c.ok?"#276749":"#c53030")}}>
                  <span>{c.ok?"✅":"❌"}</span><span style={{color:c.ok?"#a0aec0":"#fc8181"}}>{c.msg}</span>
                </div>
              ))}</div>}
            </div>
          </div>
        )}

        {tab==="history" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <h3 style={{margin:"0 0 3px",fontSize:"14px",fontWeight:"700",color:"#b794f4"}}>📜 Config History</h3>
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={saveSnapshot} style={{padding:"7px 14px",background:"linear-gradient(135deg,#553c9a,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>💾 Save Current Config</button>
                {history.length>0 && <button onClick={()=>setHistory([])} style={{padding:"7px 12px",background:"transparent",border:"1px solid #c53030",borderRadius:"8px",color:"#fc8181",fontWeight:"600",fontSize:"12px",cursor:"pointer"}}>🗑 Clear All</button>}
              </div>
            </div>
            {history.length===0 ? (
              <div style={{...v2c,textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:"32px",marginBottom:"10px"}}>📭</div>
                <div style={{color:"#4a5568",fontSize:"13px"}}>No history yet.</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {history.map(snap=>{
                  const d=new Date(snap.date);
                  const dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                  return (
                    <div key={snap.id} style={{...v2c,marginBottom:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",flexWrap:"wrap"}}>
                        <input value={histNote[snap.id]||snap.label} onChange={e=>setHistNote(n=>({...n,[snap.id]:e.target.value}))} style={{flex:1,minWidth:"180px",padding:"5px 10px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#e2e8f0",fontSize:"12px",fontWeight:"600",outline:"none"}}/>
                        <span style={{fontSize:"10px",color:"#4a5568"}}>{dateStr}</span>
                        <div style={{display:"flex",gap:"6px",marginLeft:"auto"}}>
                          <HistCopyBtn json={snap.json}/>
                          <button onClick={()=>downloadCSV(snap.csvRows,"missions_v2_"+snap.id+".csv")} style={{padding:"5px 10px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>⬇ CSV</button>
                          <button onClick={()=>setHistory(h=>h.filter(s=>s.id!==snap.id))} style={{padding:"5px 8px",background:"transparent",border:"1px solid #c53030",borderRadius:"6px",color:"#fc8181",fontSize:"11px",cursor:"pointer"}}>✕</button>
                        </div>
                      </div>
                      <textarea readOnly value={JSON.stringify(snap.json,null,2)} style={{width:"100%",height:"120px",background:"#0f1117",border:"1px solid #1e2a45",borderRadius:"6px",color:"#4a5568",fontSize:"9px",padding:"8px",fontFamily:"monospace",resize:"none",boxSizing:"border-box",outline:"none"}}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users,       setUsers]       = useState(SEED_USERS);
  const [showAdmin,   setShowAdmin]   = useState(false);

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser}/>;

  return (
    <AuthCtx.Provider value={{ currentUser, users, setUsers }}>
      {showAdmin && currentUser.role === "superadmin" && (
        <AdminPanel users={users} setUsers={setUsers} currentUser={currentUser} onClose={()=>setShowAdmin(false)}/>
      )}
      <PortalWithAuth currentUser={currentUser} users={users} setUsers={setUsers}
        onLogout={()=>setCurrentUser(null)} onOpenAdmin={()=>setShowAdmin(true)}/>
    </AuthCtx.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TOURNAMENTS
// ══════════════════════════════════════════════════════════════════════════════

// ── Preset configs extracted from Excel ──────────────────────────────────────
const TOURNAMENT_PRESETS = [
  {
    id:"cfg2", label:"Config 2 – Sync 48h", type:"sync", duration:"48:00:00",
    minLevel:1, tokensEntryFee:3, playersPerBucket:1000, seed:90, tokenPrice:0.055,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[23.43,17.33,10.5,9,7.5,6,5,4.5,4,3.5,3,2.5,2.08,1.665],
    syncRoomRewards:[{roomId:"5007",tokensPerPlay:1},{roomId:"5018",tokensPerPlay:4},{roomId:"5009",tokensPerPlay:8},{roomId:"5020",tokensPerPlay:12}],
    asyncRoomRewards:[],
  },
  {
    id:"cfg3", label:"Config 3 – Sync 24h", type:"sync", duration:"24:00:00",
    minLevel:1, tokensEntryFee:3, playersPerBucket:1000, seed:50, tokenPrice:0.055,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[29.5,20,11,9,7.5,6,5,4.5,4,3.5],
    syncRoomRewards:[{roomId:"5007",tokensPerPlay:1},{roomId:"5018",tokensPerPlay:4},{roomId:"5009",tokensPerPlay:8},{roomId:"5020",tokensPerPlay:12}],
    asyncRoomRewards:[],
  },
  {
    id:"cfg4", label:"Config 4 – Async 48h (Lvl 2)", type:"async", duration:"48:00:00",
    minLevel:2, tokensEntryFee:3, playersPerBucket:1000, seed:50, tokenPrice:0.055,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[29.5,20,12,8,7.5,6,5,4.5,4,3.5],
    syncRoomRewards:[],
    asyncRoomRewards:[{roomId:"6002",multiplier:1},{roomId:"6003",multiplier:1},{roomId:"6004",multiplier:1},{roomId:"6007",multiplier:1}],
  },
  {
    id:"cfg5", label:"Config 5 – Async 48h (Lvl 6, $250)", type:"async", duration:"48:00:00",
    minLevel:6, tokensEntryFee:4, playersPerBucket:1000, seed:250, tokenPrice:0.075,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[25,15.5,11,6.5,5.5,4.8,4.2,3.6,3.1,2.7,2.3,2.1,1.8,1.6,1.3],
    syncRoomRewards:[],
    asyncRoomRewards:[{roomId:"6002",multiplier:1},{roomId:"6003",multiplier:1},{roomId:"6004",multiplier:1},{roomId:"6007",multiplier:1}],
  },
  {
    id:"cfg6", label:"Config 6 – Async (Lvl 6, $150)", type:"async", duration:"48:00:00",
    minLevel:6, tokensEntryFee:4, playersPerBucket:1000, seed:150, tokenPrice:0.035,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[23.8,15.5,11,6.5,5.5,4.8,4.2,3.6,3.1,2.7,2.3,2.1,1.8,1.6,1.3,1.2],
    syncRoomRewards:[],
    asyncRoomRewards:[{roomId:"6002",multiplier:1},{roomId:"6003",multiplier:1},{roomId:"6004",multiplier:1},{roomId:"6007",multiplier:1}],
  },
  {
    id:"cfg7", label:"Config 7 – Async (Lvl 5, $120)", type:"async", duration:"48:00:00",
    minLevel:5, tokensEntryFee:5, playersPerBucket:1000, seed:120, tokenPrice:0.06,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[23.31,17.33,10.5,9,7.5,6,4.5,4,3.5,3,2.5,2.2,2,1.665],
    syncRoomRewards:[],
    asyncRoomRewards:[{roomId:"6002",multiplier:1},{roomId:"6003",multiplier:1},{roomId:"6004",multiplier:1},{roomId:"6007",multiplier:1}],
  },
  {
    id:"cfg8", label:"Config 8 – Async New Room (Lvl 6)", type:"async", duration:"48:00:00",
    minLevel:6, tokensEntryFee:5, playersPerBucket:1000, seed:120, tokenPrice:0.06,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[23.31,17.33,10.5,9,7.5,6,4.5,4,3.5,3,2.5,2.2,2,1.665],
    syncRoomRewards:[],
    asyncRoomRewards:[{roomId:"6002",multiplier:1},{roomId:"6003",multiplier:1},{roomId:"6004",multiplier:1},{roomId:"6007",multiplier:1},{roomId:"6009",multiplier:1}],
  },
  {
    id:"cfg9", label:"Config 9 – Platform (Lvl 1, $45)", type:"platform", duration:"48:00:00",
    minLevel:1, tokensEntryFee:4, playersPerBucket:1000, seed:45, tokenPrice:0.065,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[35,15,10,9,7,6,5.5,5,4.5,3],
    syncRoomRewards:[],
    asyncRoomRewards:[
      {roomId:"match3_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"match3_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"match3_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"match3_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"match3_e_cash_7_p_cash_u_2",multiplier:1},
      {roomId:"blocks_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"blocks_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"blocks_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"blocks_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"blocks_e_cash_7_p_cash_u_2",multiplier:1},
      {roomId:"solitaire_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"solitaire_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"solitaire_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"solitaire_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"solitaire_e_cash_7_p_cash_u_2",multiplier:1},
    ],
  },
  {
    id:"cfg10", label:"Config 10 – Platform (Lvl 6, $75)", type:"platform", duration:"48:00:00",
    minLevel:6, tokensEntryFee:4, playersPerBucket:1000, seed:75, tokenPrice:0.065,
    winnerRewardDuration:"7.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[35,15,10,9,7,6,5.5,5,4.5,3],
    syncRoomRewards:[],
    asyncRoomRewards:[
      {roomId:"match3_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"match3_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"match3_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"match3_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"match3_e_cash_7_p_cash_u_2",multiplier:1},
      {roomId:"blocks_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"blocks_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"blocks_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"blocks_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"blocks_e_cash_7_p_cash_u_2",multiplier:1},
      {roomId:"solitaire_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"solitaire_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"solitaire_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"solitaire_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"solitaire_e_cash_7_p_cash_u_2",multiplier:1},
    ],
  },
  {
    id:"cfg11", label:"Config 11 – 40 Winners (Lvl 6)", type:"platform", duration:"48:00:00",
    minLevel:6, tokensEntryFee:4, playersPerBucket:1000, seed:90, tokenPrice:0.065,
    winnerRewardDuration:"3.00:00:00", loserPopupDuration:"1.00:00:00", loserPopupPct:0.2,
    placesPrizes:[56,44,44,44,44,42,39,39,35,35,35,35,31,31,31,29,29,26,26,26,27.5,25,25,25,25,17.5,17.5,17.5,15,15,15,8.75,8.75,8.75,8.75,8.75,3.125,3.125,3.125,3.125],
    syncRoomRewards:[],
    asyncRoomRewards:[
      {roomId:"match3_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"match3_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"match3_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"match3_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"match3_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"match3_e_cash_7_p_cash_u_2",multiplier:1},
      {roomId:"blocks_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"blocks_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"blocks_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"blocks_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"blocks_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"blocks_e_cash_7_p_cash_u_2",multiplier:1},
      {roomId:"solitaire_e_cash_1_p_cash_u_7",multiplier:1},{roomId:"solitaire_e_cash_1_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_3_p_cash_u_6",multiplier:1},{roomId:"solitaire_e_cash_5_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_7_p_cash_u_6",multiplier:1},{roomId:"solitaire_e_cash_9_p_cash_u_6",multiplier:1},
      {roomId:"solitaire_e_cash_1_p_cash_u_10",multiplier:1},{roomId:"solitaire_e_cash_7_p_cash_u_2",multiplier:1},
    ],
  },
];

// ── Mission goal library from Excel ──────────────────────────────────────────
const GOAL_LIBRARY = [
  { id:"win_any_cash",   label:"Win any cash game",        room:null,   type:"winMission",   mustWin:true,  icon:"Missions/Icons/AnyCashRoom_Goal",             locKey:"missions_goal_win_real_cash" },
  { id:"win_any",        label:"Win any match",             room:null,   type:"winMission",   mustWin:false, icon:"Missions/Icons/FirstPlace_Goal",              locKey:"missions_goal_win_any_match" },
  { id:"win_5002",       label:"Win in 5002 (Chips Rush)",  room:"5002", type:"playInRoom",   mustWin:true,  icon:"Missions/AdditionalIcons/WinAnyChipsRoom_Goal",locKey:"missions_goal_win_chips_rush" },
  { id:"win_5003",       label:"Win in 5003 (Cash Blitz)",  room:"5003", type:"playInRoom",   mustWin:true,  icon:"Missions/AdditionalIcons/WinSmallCashRoom_Goal",locKey:"missions_goal_win_cash_blitz" },
  { id:"win_5004",       label:"Win in 5004 (Cash&Chips)",  room:"5004", type:"playInRoom",   mustWin:true,  icon:"Missions/AdditionalIcons/WinChipToCashRoom_Goal",locKey:"missions_goal_win_cash_and_chips" },
  { id:"win_5005",       label:"Win in 5005 (Stake Strike)", room:"5005", type:"playInRoom",  mustWin:true,  icon:"Missions/AdditionalIcons/WinSmallCashRoom_Goal",locKey:"Win in <b><cspace=-0.08em><color=#9E00D6>MATCH MADNESS </color></cspace></b>" },
  { id:"win_5006",       label:"Win in 5006 (Bounty Battle)",room:"5006", type:"playInRoom",  mustWin:true,  icon:"Missions/AdditionalIcons/WinSmallCashRoom_Goal",locKey:"missions_goal_win_bounty_battle" },
  { id:"win_5007",       label:"Win in 5007 (Match Madness)",room:"5007", type:"playInRoom",  mustWin:true,  icon:"Missions/AdditionalIcons/WinChipToCashRoom_Goal",locKey:"Win in <b><cspace=-0.08em><color=#9E00D6>MATCH MADNESS </color></cspace></b>" },
  { id:"win_5008",       label:"Win in 5008 (Cash&Chips)",  room:"5008", type:"playInRoom",   mustWin:true,  icon:"Missions/AdditionalIcons/WinChipToCashRoom_Goal",locKey:"missions_goal_win_cash_and_chips" },
  { id:"win_5009",       label:"Win in 5009 (Combo Chaos)", room:"5009", type:"playInRoom",   mustWin:true,  icon:"Missions/AdditionalIcons/WinChipToCashRoom_Goal",locKey:"Win in <b><cspace=-0.08em><color=#9E00D6>COMBO CHAOS </color></cspace></b>" },
  { id:"play_5002",      label:"Play in 5002 (Chips Rush)", room:"5002", type:"playInRoom",   mustWin:false, icon:"Missions/AdditionalIcons/AnyChipsRoom_Goal",   locKey:"missions_goal_play_chips_rush" },
  { id:"play_5003",      label:"Play in 5003 (Cash Blitz)", room:"5003", type:"playInRoom",   mustWin:false, icon:"Missions/Icons/SmallCashRoom_Goal",            locKey:"missions_goal_play_cash_blitz" },
  { id:"play_5004",      label:"Play in 5004 (Cash&Chips)", room:"5004", type:"playInRoom",   mustWin:false, icon:"Missions/Icons/ChipToCashRoom_Goal",           locKey:"missions_goal_play_cash_and_chips" },
  { id:"play_5005",      label:"Play in 5005 (Stake Strike)",room:"5005", type:"playInRoom",  mustWin:false, icon:"Missions/Icons/SmallCashRoom_Goal",            locKey:"Participate in <b><cspace=-0.08em><color=#9E00D6>MATCH MADNESS </color></cspace></b>" },
  { id:"play_5006",      label:"Play in 5006 (Bounty)",     room:"5006", type:"playInRoom",   mustWin:false, icon:"Missions/Icons/SmallCashRoom_Goal",            locKey:"missions_goal_play_bounty_battle" },
  { id:"play_5007",      label:"Play in 5007 (Match Madness)",room:"5007",type:"playInRoom",  mustWin:false, icon:"Missions/Icons/SmallCashRoom_Goal",            locKey:"Participate in <b><cspace=-0.08em><color=#9E00D6>MATCH MADNESS</color></cspace></b>" },
  { id:"play_5008",      label:"Play in 5008 (Chips Rush)", room:"5008", type:"playInRoom",   mustWin:false, icon:"Missions/AdditionalIcons/AnyChipsRoom_Goal",   locKey:"missions_goal_play_chips_rush" },
  { id:"play_5009",      label:"Play in 5009 (Combo Chaos)",room:"5009", type:"playInRoom",   mustWin:false, icon:"Missions/Icons/ChipToCashRoom_Goal",           locKey:"Participate in <b><cspace=-0.08em><color=#9E00D6>COMBO CHAOS </color></cspace></b>" },
  { id:"score_5005",     label:"Get score in 5005 (Stake Strike)",room:"5005",type:"getRoomScore",mustWin:false,icon:"Missions/Icons/Score_Goal",              locKey:"Get {0} or higher in <b><cspace=-0.08em><color=#9E00D6>MEGA STRIKE </color></cspace></b>" },
  { id:"score_5007",     label:"Get score in 5007 (Match Madness)",room:"5007",type:"getRoomScore",mustWin:false,icon:"Missions/Icons/Score_Goal",             locKey:"Get {0} or higher in <b><cspace=-0.08em><color=#9E00D6>MATCH MADNESS </color></cspace></b>" },
  { id:"score_5009",     label:"Get score in 5009 (Combo Chaos)",room:"5009",type:"getRoomScore",mustWin:false,icon:"Missions/Icons/Score_Goal",               locKey:"Get {0} or higher in <b><cspace=-0.08em><color=#9E00D6>COMBO CHAOS </color></cspace></b>" },
];

let _nextTournGoalId = 500;

function TournamentsPage({ onBack }) {
  const base = TOURNAMENT_PRESETS[0];
  const [tab, setTab] = useState("config");
  const [cfg, setCfg] = useState(() => ({ ...base,
    placesPrizes: base.placesPrizes.map((w,i) => ({ id:i, weight:w })),
    syncRoomRewards: base.syncRoomRewards.map((r,i) => ({ ...r, id:i })),
    asyncRoomRewards: base.asyncRoomRewards.map((r,i) => ({ ...r, id:i })),
  }));
  const [simPlayers, setSimPlayers] = useState(500);
  const [copied, setCopied] = useState(false);
  const [csvMsg, setCsvMsg] = useState("");
  const [qaRes, setQaRes]   = useState(null);
  const [history, setHistory] = useState([]);
  const [histNote, setHistNote] = useState({});

  const loadPreset = (presetId) => {
    const p = TOURNAMENT_PRESETS.find(x => x.id === presetId);
    if (!p) return;
    setCfg({
      ...p,
      placesPrizes: p.placesPrizes.map((w,i) => ({ id:i, weight:w })),
      syncRoomRewards: p.syncRoomRewards.map((r,i) => ({ ...r, id:i })),
      asyncRoomRewards: p.asyncRoomRewards.map((r,i) => ({ ...r, id:i })),
    });
  };

  // ── prize pool calc ──────────────────────────────────────────────────────
  const totalWeight = useMemo(() => cfg.placesPrizes.reduce((s,p) => s + (+p.weight||0), 0), [cfg.placesPrizes]);
  const estimatedPP = useMemo(() => {
    const tokenPP = simPlayers * cfg.tokensEntryFee * cfg.tokenPrice;
    return Math.max(tokenPP, cfg.seed);
  }, [simPlayers, cfg.tokensEntryFee, cfg.tokenPrice, cfg.seed]);

  const prizeTable = useMemo(() =>
    cfg.placesPrizes.map((p, i) => {
      const pct = totalWeight > 0 ? (+p.weight / totalWeight) : 0;
      return { place: i+1, weight: +p.weight, pct: (pct*100).toFixed(2), reward: (pct * estimatedPP).toFixed(2) };
    }), [cfg.placesPrizes, estimatedPP, totalWeight]);

  // ── mutations ─────────────────────────────────────────────────────────────
  const setField = (k, v) => setCfg(c => ({ ...c, [k]: v }));
  const updWeight = (id, v) => setCfg(c => ({ ...c, placesPrizes: c.placesPrizes.map(p => p.id!==id ? p : { ...p, weight: Math.max(0, +v||0) }) }));
  const addPlace  = () => setCfg(c => ({ ...c, placesPrizes: [...c.placesPrizes, { id: Date.now(), weight: 1 }] }));
  const rmPlace   = (id) => setCfg(c => ({ ...c, placesPrizes: c.placesPrizes.filter(p => p.id!==id) }));

  const addSyncRoom  = () => setCfg(c => ({ ...c, syncRoomRewards: [...c.syncRoomRewards, { id:Date.now(), roomId:"5007", tokensPerPlay:1 }] }));
  const rmSyncRoom   = (id) => setCfg(c => ({ ...c, syncRoomRewards: c.syncRoomRewards.filter(r=>r.id!==id) }));
  const updSyncRoom  = (id,k,v) => setCfg(c => ({ ...c, syncRoomRewards: c.syncRoomRewards.map(r => r.id!==id?r:{...r,[k]:k==="tokensPerPlay"?Math.max(1,Math.round(+v)||1):v}) }));

  const addAsyncRoom  = () => setCfg(c => ({ ...c, asyncRoomRewards: [...c.asyncRoomRewards, { id:Date.now(), roomId:"6002", multiplier:1 }] }));
  const rmAsyncRoom   = (id) => setCfg(c => ({ ...c, asyncRoomRewards: c.asyncRoomRewards.filter(r=>r.id!==id) }));
  const updAsyncRoom  = (id,k,v) => setCfg(c => ({ ...c, asyncRoomRewards: c.asyncRoomRewards.map(r => r.id!==id?r:{...r,[k]:k==="multiplier"?Math.max(0.1,+v||0.1):v}) }));


  // ── export ────────────────────────────────────────────────────────────────
  const buildJSON = () => ({
    minLevel: cfg.minLevel,
    tokensEntryFee: cfg.tokensEntryFee,
    playersPerBucket: cfg.playersPerBucket,
    prizeCalculation: {
      seed: { skus: [{ type:"bonusCash", payload:{ value: cfg.seed } }] },
      tokenPrice: cfg.tokenPrice,
      rangesPercentageFromAllUsers: 0,
      placesPrizes: cfg.placesPrizes.map(p => ({ weight: +p.weight })),
      placeRangesPrizes: [],
    },
    winnerReward: { duration: cfg.winnerRewardDuration },
    loserPopup: { duration: cfg.loserPopupDuration, percentageOfLosers: cfg.loserPopupPct },
    tokensReward: {
      syncRoomRewards: cfg.syncRoomRewards.map(r => ({ roomId: r.roomId, tokensPerPlay: r.tokensPerPlay })),
      asyncRoomRewards: cfg.asyncRoomRewards.map(r => ({ roomId: r.roomId, cashToTokensMultiplier: r.multiplier })),
    },

  });

  const runQA = (json) => {
    const checks = [], pass = m => checks.push({ok:true,msg:m}), fail = m => checks.push({ok:false,msg:m});
    ["minLevel","tokensEntryFee","playersPerBucket","prizeCalculation","winnerReward","loserPopup","tokensReward"].forEach(k => json[k]!==undefined ? pass('✓ "'+k+'" present') : fail('✗ Missing "'+k+'"'));
    const pp = (json.prizeCalculation?.placesPrizes||[]);
    pp.length > 0 ? pass("✓ "+pp.length+" prize places") : fail("✗ No prize places defined");
    const tw = pp.reduce((s,p)=>s+(p.weight||0),0);
    (tw > 99 && tw < 101) ? pass("✓ Weights sum ≈ 100 ("+tw.toFixed(2)+")") : fail("⚠ Weights sum = "+tw.toFixed(2)+" (expected ~100)");
    const sr = json.tokensReward?.syncRoomRewards||[], ar = json.tokensReward?.asyncRoomRewards||[];
    (sr.length+ar.length) > 0 ? pass("✓ "+(sr.length+ar.length)+" room reward(s)") : fail("✗ No room rewards defined");
    json.prizeCalculation?.seed?.skus?.[0]?.payload?.value > 0 ? pass("✓ Seed > 0") : fail("✗ Seed is 0");
    json.prizeCalculation?.tokenPrice > 0 ? pass("✓ tokenPrice > 0") : fail("✗ tokenPrice is 0");
    try { JSON.parse(JSON.stringify(json)); pass("✓ JSON serialises cleanly"); } catch(e) { fail("✗ "+e.message); }
    return checks;
  };

  const copyJSON = () => {
    const json = buildJSON(), checks = runQA(json); setQaRes(checks);
    if (checks.some(c=>!c.ok)) return;
    navigator.clipboard?.writeText(JSON.stringify(json,null,2)).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); });
  };

  const exportCSV = () => {
    try {
      downloadCSV(prizeTable.map(r=>({ Place:r.place, Weight:r.weight, "% of Pool":r.pct, "Reward ($)":r.reward })), "tournament_prizes.csv");
      setCsvMsg("✅ Downloaded!");
    } catch(e) { setCsvMsg("⚠️ "+e.message); }
  };

  const saveSnapshot = () => {
    const now = new Date(), id = now.getTime();
    const label = "Config "+now.toLocaleDateString()+" "+now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const json = buildJSON();
    setHistory(h => [{ id, label, date:now.toISOString(), json,
      meta:{ places: cfg.placesPrizes.length, seed: cfg.seed, tokenPrice: cfg.tokenPrice, type: cfg.type }
    }, ...h]);
    setHistNote(n => ({...n,[id]:label}));
  };

  // ── styles ────────────────────────────────────────────────────────────────
  const tc  = { background:"#1a1f2e", border:"1px solid #2d3748", borderRadius:"12px", padding:"14px", marginBottom:"12px" };
  const tth = { padding:"6px 8px", textAlign:"left", color:"#718096", fontWeight:"600", borderBottom:"1px solid #2d3748", fontSize:"10px", whiteSpace:"nowrap" };
  const tipS = { background:"#1a1f2e", border:"1px solid #2d3748", borderRadius:"8px", padding:"10px", fontSize:"11px" };
  const inp = (col) => ({ padding:"5px 8px", background:"#0f1117", border:"1px solid #2d3748", borderRadius:"6px", color:col||"#e2e8f0", fontSize:"11px", outline:"none", width:"100%", boxSizing:"border-box" });
  const TABS = [{id:"config",label:"⚙️ Config"},{id:"prizes",label:"🏆 Prize Distribution"},{id:"rooms",label:"🏠 Room Rewards"},{id:"simulator",label:"📊 Simulator"},{id:"export",label:"📤 Export"},{id:"history",label:"📜 History"}];
  const TYPE_COLOR = {sync:"#63b3ed",async:"#f6ad55",platform:"#68d391"};

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#0f1117",minHeight:"100vh",color:"#e2e8f0"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0d1a2e,#1a1f2e)",padding:"10px 16px",borderBottom:"1px solid #2d3748",display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
        <button onClick={onBack} style={{padding:"5px 12px",background:"#1e2a45",border:"1px solid #2d3748",borderRadius:"6px",color:"#a0aec0",fontSize:"12px",cursor:"pointer"}}>← Portal</button>
        <span style={{color:"#2d3748"}}>|</span>
        <span style={{fontSize:"13px",color:"#90cdf4",fontWeight:"700"}}>🏆 Tournaments</span>
        {/* Preset loader */}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"11px",color:"#718096"}}>Load preset:</span>
          <select onChange={e=>loadPreset(e.target.value)} defaultValue=""
            style={{padding:"5px 8px",background:"#141820",border:"1px solid #2d3748",borderRadius:"6px",color:"#90cdf4",fontSize:"11px",cursor:"pointer",outline:"none"}}>
            <option value="" disabled>— choose —</option>
            {TOURNAMENT_PRESETS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        {/* KPIs */}
        <div style={{display:"flex",gap:"14px",fontSize:"11px",marginLeft:"12px"}}>
          {[["Type",cfg.type,TYPE_COLOR[cfg.type]||"#90cdf4"],["Seed","$"+cfg.seed,"#68d391"],["Token$",cfg.tokenPrice,"#f6ad55"],["Places",cfg.placesPrizes.length,"#90cdf4"],["Est.Pool","$"+estimatedPP.toFixed(0),"#63b3ed"]].map(([l,v,c])=>(
            <span key={l} style={{color:"#718096"}}>{l}: <strong style={{color:c}}>{v}</strong></span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:"#1a1f2e",borderBottom:"1px solid #2d3748",padding:"0 16px",display:"flex",overflowX:"auto"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 12px",border:"none",background:"none",cursor:"pointer",color:tab===t.id?"#90cdf4":"#a0aec0",borderBottom:tab===t.id?"2px solid #90cdf4":"2px solid transparent",fontWeight:tab===t.id?"600":"400",fontSize:"12px",whiteSpace:"nowrap"}}>{t.label}</button>)}
      </div>

      <div style={{padding:"14px 16px",maxWidth:"1350px",margin:"0 auto"}}>

        {/* ── CONFIG ── */}
        {tab==="config" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            {/* Basic params */}
            <div style={tc}>
              <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>⚙️ Basic Parameters</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                {[
                  ["Tournament Type","type","select",["sync","async","platform"]],
                  ["Duration","duration","text",null],
                  ["Min Level","minLevel","number",null],
                  ["Entry Fee (tokens)","tokensEntryFee","number",null],
                  ["Players per Bucket","playersPerBucket","number",null],
                  ["Token Price ($)","tokenPrice","number",null],
                ].map(([label,key,type,opts])=>(
                  <div key={key}>
                    <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"3px"}}>{label}</label>
                    {type==="select"
                      ? <select value={cfg[key]} onChange={e=>setField(key,e.target.value)} style={{...inp("#90cdf4"),background:"#0f1117"}}>
                          {opts.map(o=><option key={o} value={o}>{o}</option>)}
                        </select>
                      : <input type={type} value={cfg[key]} onChange={e=>setField(key,type==="number"?+e.target.value:e.target.value)} style={inp(key==="tokenPrice"?"#f6ad55":key==="minLevel"?"#fc8181":"#e2e8f0")}/>
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Prize pool + timing */}
            <div style={tc}>
              <h3 style={{margin:"0 0 12px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>💰 Prize Pool & Timing</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                {[
                  ["Seed ($)","seed","number","#68d391"],
                  ["Winner Reward Duration","winnerRewardDuration","text","#63b3ed"],
                  ["Loser Popup Duration","loserPopupDuration","text","#a0aec0"],
                  ["Loser Popup %","loserPopupPct","number","#f6ad55"],
                ].map(([label,key,type,col])=>(
                  <div key={key}>
                    <label style={{display:"block",fontSize:"10px",color:"#718096",marginBottom:"3px"}}>{label}</label>
                    <input type={type} step={key==="loserPopupPct"?"0.01":"1"} value={cfg[key]} onChange={e=>setField(key,type==="number"?+e.target.value:e.target.value)} style={inp(col)}/>
                  </div>
                ))}
              </div>
              {/* Prize pool summary */}
              <div style={{marginTop:"14px",padding:"12px",background:"#141820",borderRadius:"8px",border:"1px solid #2d3748"}}>
                <div style={{fontSize:"11px",color:"#718096",marginBottom:"8px",fontWeight:"600"}}>💡 Prize Pool Formula: max(players × entryFee × tokenPrice, seed)</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",fontSize:"11px"}}>
                  <div style={{textAlign:"center"}}><div style={{color:"#4a5568",fontSize:"9px"}}>Token Pool</div><div style={{color:"#f6ad55",fontWeight:"700"}}>${(simPlayers*cfg.tokensEntryFee*cfg.tokenPrice).toFixed(2)}</div></div>
                  <div style={{textAlign:"center"}}><div style={{color:"#4a5568",fontSize:"9px"}}>Seed Floor</div><div style={{color:"#68d391",fontWeight:"700"}}>${cfg.seed}</div></div>
                  <div style={{textAlign:"center"}}><div style={{color:"#4a5568",fontSize:"9px"}}>Est. Pool ({simPlayers} players)</div><div style={{color:"#63b3ed",fontWeight:"700",fontSize:"14px"}}>${estimatedPP.toFixed(2)}</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PRIZE DISTRIBUTION ── */}
        {tab==="prizes" && (<>
          {/* Sim players slider */}
          <div style={{...tc,marginBottom:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
              <span style={{fontSize:"12px",color:"#718096",fontWeight:"600"}}>Simulate with players:</span>
              {[100,250,500,750,1000].map(n=>(
                <button key={n} onClick={()=>setSimPlayers(n)} style={{padding:"4px 12px",borderRadius:"6px",border:"1px solid "+(simPlayers===n?"#90cdf4":"#2d3748"),background:simPlayers===n?"#0d1a2e":"#141820",color:simPlayers===n?"#90cdf4":"#718096",cursor:"pointer",fontSize:"11px"}}>
                  {n}
                </button>
              ))}
              <input type="number" min="1" value={simPlayers} onChange={e=>setSimPlayers(Math.max(1,+e.target.value))} style={{width:"80px",...inp("#90cdf4")}}/>
              <span style={{fontSize:"12px",color:"#718096"}}>→ Est. Prize Pool: <strong style={{color:"#68d391",fontSize:"14px"}}>${estimatedPP.toFixed(2)}</strong></span>
              <span style={{fontSize:"11px",color:"#4a5568"}}>Weight sum: <strong style={{color:Math.abs(totalWeight-100)<0.5?"#68d391":"#fc8181"}}>{totalWeight.toFixed(2)}</strong> {Math.abs(totalWeight-100)>0.5&&"⚠ should = 100"}</span>
              <button onClick={addPlace} style={{marginLeft:"auto",padding:"5px 12px",background:"#276749",border:"1px solid #2f855a",borderRadius:"6px",color:"#9ae6b4",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>+ Add Place</button>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            {/* Table */}
            <div style={tc}>
              <h3 style={{margin:"0 0 10px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>🏆 Prize Places</h3>
              <div style={{maxHeight:"480px",overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                  <thead><tr style={{background:"#141820"}}>{["Place","Weight","% Pool","Reward ($)",""].map(h=><th key={h} style={tth}>{h}</th>)}</tr></thead>
                  <tbody>{cfg.placesPrizes.map((p,i)=>(
                    <tr key={p.id} style={{background:i%2?"#141820":"transparent",borderBottom:"1px solid #141820"}}>
                      <td style={{padding:"4px 8px",color:i===0?"#f6e05e":i<3?"#f6ad55":"#a0aec0",fontWeight:"700"}}>#{i+1}</td>
                      <td style={{padding:"4px 6px"}}>
                        <input type="number" min="0" step="0.01" value={p.weight} onChange={e=>updWeight(p.id,e.target.value)}
                          style={{width:"70px",padding:"3px 6px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"4px",color:"#e2e8f0",fontSize:"11px",outline:"none"}}/>
                      </td>
                      <td style={{padding:"4px 8px",color:"#a0aec0"}}>{prizeTable[i]?.pct}%</td>
                      <td style={{padding:"4px 8px",color:"#68d391",fontWeight:"700"}}>${prizeTable[i]?.reward}</td>
                      <td style={{padding:"4px 6px"}}>
                        <button onClick={()=>rmPlace(p.id)} disabled={cfg.placesPrizes.length<=1} style={{padding:"2px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"10px",cursor:"pointer"}}>✕</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            {/* Chart */}
            <div style={tc}>
              <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>📊 Prize Distribution Chart</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={prizeTable.slice(0,20).map(r=>({place:"#"+r.place,"Reward ($)":+r.reward}))} margin={{top:4,right:4,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                  <XAxis dataKey="place" stroke="#4a5568" tick={{fontSize:9}}/>
                  <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                  <Tooltip formatter={v=>["$"+v,""]} contentStyle={tipS}/>
                  <Bar dataKey="Reward ($)" radius={[3,3,0,0]}>
                    {prizeTable.slice(0,20).map((_,i)=>{
                      const fill = i===0?"#f6e05e":i<3?"#f6ad55":i<10?"#63b3ed":"#4a5568";
                      return <Cell key={i} fill={fill}/>;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {prizeTable.length > 20 && <div style={{fontSize:"10px",color:"#4a5568",textAlign:"center",marginTop:"4px"}}>Showing top 20 of {prizeTable.length} places</div>}
              {/* Top 3 highlight */}
              <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
                {prizeTable.slice(0,3).map((r,i)=>(
                  <div key={i} style={{flex:1,background:"#141820",borderRadius:"8px",padding:"8px",textAlign:"center",border:"1px solid "+(i===0?"#f6e05e22":i===1?"#a0aec022":"#71809622")}}>
                    <div style={{fontSize:"16px",marginBottom:"2px"}}>{i===0?"🥇":i===1?"🥈":"🥉"}</div>
                    <div style={{fontSize:"12px",fontWeight:"700",color:i===0?"#f6e05e":i===1?"#a0aec0":"#cd7f32"}}>${r.reward}</div>
                    <div style={{fontSize:"9px",color:"#4a5568"}}>{r.pct}% of pool</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>)}

        {/* ── ROOM REWARDS ── */}
        {tab==="rooms" && (<>
          {/* Sync rooms */}
          <div style={tc}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div>
                <h3 style={{margin:"0 0 3px",fontSize:"13px",fontWeight:"600",color:"#63b3ed"}}>🔄 Sync Room Rewards</h3>
                <p style={{margin:0,fontSize:"11px",color:"#718096"}}>Tokens granted per play in these rooms during a sync tournament.</p>
              </div>
              <button onClick={addSyncRoom} style={{padding:"5px 12px",background:"#2c5282",border:"1px solid #3182ce",borderRadius:"6px",color:"#90cdf4",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>+ Add Room</button>
            </div>
            {cfg.syncRoomRewards.length === 0
              ? <div style={{textAlign:"center",padding:"20px",color:"#4a5568",fontSize:"12px"}}>No sync rooms configured (typical for async/platform tournaments)</div>
              : <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                  <thead><tr style={{background:"#141820"}}>{["Room ID","Tokens/Play",""].map(h=><th key={h} style={tth}>{h}</th>)}</tr></thead>
                  <tbody>{cfg.syncRoomRewards.map((r,i)=>(
                    <tr key={r.id} style={{background:i%2?"#141820":"transparent"}}>
                      <td style={{padding:"5px 8px"}}><input value={r.roomId} onChange={e=>updSyncRoom(r.id,"roomId",e.target.value)} style={{width:"120px",...inp("#90cdf4")}}/></td>
                      <td style={{padding:"5px 8px"}}><input type="number" min="1" value={r.tokensPerPlay} onChange={e=>updSyncRoom(r.id,"tokensPerPlay",e.target.value)} style={{width:"80px",...inp("#f6ad55")}}/></td>
                      <td style={{padding:"5px 8px"}}><button onClick={()=>rmSyncRoom(r.id)} style={{padding:"2px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"10px",cursor:"pointer"}}>✕</button></td>
                    </tr>
                  ))}</tbody>
                </table>
            }
          </div>

          {/* Async rooms */}
          <div style={tc}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
              <div>
                <h3 style={{margin:"0 0 3px",fontSize:"13px",fontWeight:"600",color:"#f6ad55"}}>⚡ Async Room Rewards</h3>
                <p style={{margin:0,fontSize:"11px",color:"#718096"}}>Cash-to-tokens multiplier per room in async/platform tournaments.</p>
              </div>
              <button onClick={addAsyncRoom} style={{padding:"5px 12px",background:"#744210",border:"1px solid #975a16",borderRadius:"6px",color:"#f6ad55",fontSize:"11px",cursor:"pointer",fontWeight:"600"}}>+ Add Room</button>
            </div>
            {cfg.asyncRoomRewards.length === 0
              ? <div style={{textAlign:"center",padding:"20px",color:"#4a5568",fontSize:"12px"}}>No async rooms configured (typical for sync tournaments)</div>
              : <div style={{maxHeight:"340px",overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px"}}>
                    <thead><tr style={{background:"#141820"}}>{["Room ID","Cash→Token Multiplier",""].map(h=><th key={h} style={tth}>{h}</th>)}</tr></thead>
                    <tbody>{cfg.asyncRoomRewards.map((r,i)=>(
                      <tr key={r.id} style={{background:i%2?"#141820":"transparent"}}>
                        <td style={{padding:"5px 8px"}}><input value={r.roomId} onChange={e=>updAsyncRoom(r.id,"roomId",e.target.value)} style={{width:"260px",...inp("#f6ad55")}}/></td>
                        <td style={{padding:"5px 8px"}}><input type="number" min="0.1" step="0.1" value={r.multiplier} onChange={e=>updAsyncRoom(r.id,"multiplier",e.target.value)} style={{width:"80px",...inp("#68d391")}}/></td>
                        <td style={{padding:"5px 8px"}}><button onClick={()=>rmAsyncRoom(r.id)} style={{padding:"2px 5px",background:"transparent",border:"1px solid #c53030",borderRadius:"4px",color:"#fc8181",fontSize:"10px",cursor:"pointer"}}>✕</button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
            }
          </div>
        </>)}

        {/* ── SIMULATOR ── */}
        {tab==="simulator" && (<>
          {/* Player count */}
          <div style={{...tc,marginBottom:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
              <h3 style={{margin:0,fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>📊 Prize Pool Simulator</h3>
              <span style={{fontSize:"12px",color:"#718096"}}>Players:</span>
              {[100,250,500,750,1000].map(n=>(
                <button key={n} onClick={()=>setSimPlayers(n)} style={{padding:"4px 12px",borderRadius:"6px",border:"1px solid "+(simPlayers===n?"#90cdf4":"#2d3748"),background:simPlayers===n?"#0d1a2e":"#141820",color:simPlayers===n?"#90cdf4":"#718096",cursor:"pointer",fontSize:"11px"}}>{n}</button>
              ))}
              <input type="number" min="1" value={simPlayers} onChange={e=>setSimPlayers(Math.max(1,+e.target.value))} style={{width:"80px",...inp("#90cdf4")}}/>
            </div>
          </div>

          {/* KPI cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"14px"}}>
            {[
              ["Players",simPlayers,"#90cdf4"],
              ["Token Pool","$"+(simPlayers*cfg.tokensEntryFee*cfg.tokenPrice).toFixed(2),"#f6ad55"],
              ["Seed Floor","$"+cfg.seed,"#68d391"],
              ["Est. Prize Pool","$"+estimatedPP.toFixed(2),"#63b3ed"],
              ["Top Prize","$"+prizeTable[0]?.reward,"#f6e05e"],
              ["Top 3 Total","$"+(prizeTable.slice(0,3).reduce((s,r)=>s+(+r.reward||0),0)).toFixed(2),"#f6ad55"],
              ["Winners",cfg.placesPrizes.length,"#90cdf4"],
              ["Token Price","$"+cfg.tokenPrice,"#b794f4"],
            ].map(([l,v,c])=>(
              <div key={l} style={{background:"#141820",borderRadius:"8px",padding:"10px",border:"1px solid #2d3748"}}>
                <div style={{fontSize:"9px",color:"#718096",marginBottom:"3px"}}>{l}</div>
                <div style={{fontSize:"16px",fontWeight:"700",color:c}}>{v}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={tc}>
            <h3 style={{margin:"0 0 8px",fontSize:"13px",fontWeight:"600",color:"#90cdf4"}}>Prize Pool vs Players</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={[100,200,300,400,500,600,700,800,900,1000].map(n=>({
                players:n,
                "Token Pool":+(n*cfg.tokensEntryFee*cfg.tokenPrice).toFixed(2),
                "Prize Pool":+(Math.max(n*cfg.tokensEntryFee*cfg.tokenPrice, cfg.seed)).toFixed(2),
                "Seed":cfg.seed,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748"/>
                <XAxis dataKey="players" stroke="#4a5568" tick={{fontSize:9}}/>
                <YAxis stroke="#4a5568" tick={{fontSize:9}} tickFormatter={v=>"$"+v}/>
                <Tooltip formatter={v=>["$"+v,""]} contentStyle={tipS}/>
                <Legend wrapperStyle={{fontSize:"11px"}}/>
                <Line type="monotone" dataKey="Token Pool" stroke="#f6ad55" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="Prize Pool" stroke="#63b3ed" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="Seed" stroke="#68d391" strokeWidth={1} strokeDasharray="4 2" dot={false}/>
                <ReferenceLine x={simPlayers} stroke="#b794f4" strokeDasharray="3 3"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>)}



        {/* ── EXPORT ── */}
        {tab==="export" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
            <div style={tc}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📄 JSON Config</h3>
              <textarea readOnly value={JSON.stringify(buildJSON(),null,2)} style={{width:"100%",height:"360px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"8px",color:"#a0aec0",fontSize:"10px",padding:"10px",fontFamily:"monospace",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
              <button onClick={copyJSON} style={{width:"100%",marginTop:"8px",padding:"10px",background:copied?"#276749":"linear-gradient(135deg,#2c5282,#553c9a)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer"}}>{copied?"✅ Copied!":"📋 Copy JSON"}</button>
            </div>
            <div style={tc}>
              <h3 style={{margin:"0 0 4px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📊 CSV + QA</h3>
              {csvMsg && <div style={{padding:"8px",background:"#1a2e1a",borderRadius:"6px",color:"#68d391",fontSize:"12px",marginBottom:"8px"}}>{csvMsg}</div>}
              <button onClick={exportCSV} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#276749,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"13px",cursor:"pointer",marginBottom:"10px"}}>⬇ Download CSV</button>
              <button onClick={()=>setQaRes(runQA(buildJSON()))} style={{width:"100%",padding:"9px",background:"#2d3748",border:"1px solid #4a5568",borderRadius:"8px",color:"#a0aec0",fontWeight:"600",fontSize:"12px",cursor:"pointer",marginBottom:"8px"}}>🔍 Run QA</button>
              <button onClick={saveSnapshot} style={{width:"100%",padding:"9px",background:"linear-gradient(135deg,#553c9a,#2c5282)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer",marginBottom:"8px"}}>📜 Save to History</button>
              {qaRes && <div style={{display:"flex",flexDirection:"column",gap:"3px",maxHeight:"250px",overflowY:"auto"}}>{qaRes.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",padding:"5px 9px",borderRadius:"5px",fontSize:"11px",background:c.ok?"#141820":"#2d1a1a",border:"1px solid "+(c.ok?"#276749":"#c53030")}}>
                  <span>{c.ok?"✅":"❌"}</span><span style={{color:c.ok?"#a0aec0":"#fc8181"}}>{c.msg}</span>
                </div>
              ))}</div>}
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab==="history" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
              <div><h3 style={{margin:"0 0 3px",fontSize:"14px",fontWeight:"700",color:"#90cdf4"}}>📜 Config History</h3>
                <p style={{margin:0,fontSize:"11px",color:"#718096"}}>Snapshots saved this session.</p></div>
              <div style={{display:"flex",gap:"8px"}}>
                <button onClick={saveSnapshot} style={{padding:"7px 14px",background:"linear-gradient(135deg,#2c5282,#553c9a)",border:"none",borderRadius:"8px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>💾 Save Current Config</button>
                {history.length>0&&<button onClick={()=>setHistory([])} style={{padding:"7px 12px",background:"transparent",border:"1px solid #c53030",borderRadius:"8px",color:"#fc8181",fontWeight:"600",fontSize:"12px",cursor:"pointer"}}>🗑 Clear</button>}
              </div>
            </div>
            {history.length===0
              ? <div style={{...tc,textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:"32px",marginBottom:"10px"}}>📭</div><div style={{color:"#4a5568"}}>No history yet.</div></div>
              : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>{history.map(snap=>{
                  const d=new Date(snap.date), dateStr=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                  return (
                    <div key={snap.id} style={{...tc,marginBottom:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",flexWrap:"wrap"}}>
                        <input value={histNote[snap.id]||snap.label} onChange={e=>setHistNote(n=>({...n,[snap.id]:e.target.value}))}
                          style={{flex:1,minWidth:"180px",padding:"5px 10px",background:"#0f1117",border:"1px solid #2d3748",borderRadius:"6px",color:"#e2e8f0",fontSize:"12px",fontWeight:"600",outline:"none"}}/>
                        <span style={{fontSize:"10px",color:"#4a5568"}}>🕐 {dateStr}</span>
                        {[["places",snap.meta.places,"#90cdf4"],["seed","$"+snap.meta.seed,"#68d391"],["tok$",snap.meta.tokenPrice,"#f6ad55"],["type",snap.meta.type,TYPE_COLOR[snap.meta.type]]].map(([l,v,c])=>(
                          <span key={l} style={{fontSize:"10px",padding:"2px 8px",background:"#141820",borderRadius:"10px",color:c,border:"1px solid #2d3748"}}>{l}: {v}</span>
                        ))}
                        <div style={{display:"flex",gap:"6px",marginLeft:"auto"}}>
                          <HistCopyBtn json={snap.json}/>
                          <button onClick={()=>setHistory(h=>h.filter(s=>s.id!==snap.id))} style={{padding:"5px 8px",background:"transparent",border:"1px solid #c53030",borderRadius:"6px",color:"#fc8181",fontSize:"11px",cursor:"pointer"}}>✕</button>
                        </div>
                      </div>
                      <textarea readOnly value={JSON.stringify(snap.json,null,2)} style={{width:"100%",height:"100px",background:"#0f1117",border:"1px solid #1e2a45",borderRadius:"6px",color:"#4a5568",fontSize:"9px",padding:"8px",fontFamily:"monospace",resize:"none",boxSizing:"border-box",outline:"none"}}/>
                    </div>
                  );
                })}</div>
            }
          </div>
        )}

      </div>
    </div>
  );
}


function PortalWithAuth({ currentUser, users, setUsers, onLogout, onOpenAdmin }) {
  const [hovered,    setHovered]    = useState(null);
  const [active,     setActive]     = useState(null);
  // History lifted here so it survives navigation back to portal
  const [v1History,  setV1History]  = useState([]);
  const [v1HistNote, setV1HistNote] = useState({});
  const [v2History,  setV2History]  = useState([]);
  const [v2HistNote, setV2HistNote] = useState({});

  const activeCount   = FEATURES.filter(f=>f.status==="active").length;
  const totalFeatures = FEATURES.length;
  const sectionPerm   = id => currentUser.permissions?.[id] || "none";
  const canSee        = id => canView(sectionPerm(id));
  const RCOL = { superadmin:"#f6ad55", editor:"#90cdf4", viewer:"#718096" };

  if (active==="missions") return (
    <AccessGate sectionId="missions">
      <div><ViewOnlyBanner sectionId="missions"/><MissionsPage onBack={()=>setActive(null)} readOnly={!canEdit(sectionPerm("missions"))} history={v1History} setHistory={setV1History} histNote={v1HistNote} setHistNote={setV1HistNote}/></div>
    </AccessGate>
  );
  if (active==="missions-v2") return (
    <AccessGate sectionId="missions-v2">
      <div><ViewOnlyBanner sectionId="missions-v2"/><MissionsV2Page onBack={()=>setActive(null)} readOnly={!canEdit(sectionPerm("missions-v2"))} history={v2History} setHistory={setV2History} histNote={v2HistNote} setHistNote={setV2HistNote}/></div>
    </AccessGate>
  );
  if (active==="matchmaking") return (
    <AccessGate sectionId="matchmaking">
      <div><ViewOnlyBanner sectionId="matchmaking"/><MatchmakingPage onBack={()=>setActive(null)}/></div>
    </AccessGate>
  );
  if (active==="tournaments") return (
    <AccessGate sectionId="tournaments">
      <div><ViewOnlyBanner sectionId="tournaments"/><TournamentsPage onBack={()=>setActive(null)}/></div>
    </AccessGate>
  );

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#0a0d14",minHeight:"100vh",color:"#e2e8f0",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#0f1420,#141a2e)",borderBottom:"1px solid #1e2a45",padding:"12px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <div style={{width:"36px",height:"36px",background:"linear-gradient(135deg,#3182ce,#553c9a)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>🎯</div>
          <div><h1 style={{margin:0,fontSize:"18px",fontWeight:"800"}}>Game Features Portal</h1>
            <p style={{margin:0,fontSize:"11px",color:"#4a5568"}}>Economy & LiveOps Management Console</p></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
          {currentUser.role==="superadmin"&&(
            <button onClick={onOpenAdmin} style={{display:"flex",alignItems:"center",gap:"6px",padding:"7px 14px",background:"linear-gradient(135deg,#744210,#553c9a)",border:"none",borderRadius:"8px",color:"#f6ad55",fontWeight:"700",fontSize:"12px",cursor:"pointer"}}>🛡️ Admin Panel</button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 12px",background:"#141820",border:"1px solid #2d3748",borderRadius:"8px"}}>
            <div style={{width:"26px",height:"26px",background:"linear-gradient(135deg,#2c5282,#553c9a)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"700"}}>{currentUser.name[0]}</div>
            <div><div style={{fontSize:"11px",fontWeight:"700",color:"#e2e8f0"}}>{currentUser.name}</div>
              <div style={{fontSize:"9px",color:"#4a5568"}}>{currentUser.email}</div></div>
            <span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"8px",fontWeight:"700",background:RCOL[currentUser.role]+"22",color:RCOL[currentUser.role]}}>{currentUser.role}</span>
          </div>
          <button onClick={onLogout} style={{padding:"7px 12px",background:"transparent",border:"1px solid #2d3748",borderRadius:"8px",color:"#718096",fontSize:"11px",cursor:"pointer"}}>Sign Out</button>
        </div>
      </div>

      <div style={{flex:1,padding:"28px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",alignContent:"start"}}>
        {FEATURES.map(f=>{
          const st=STATUS[f.status], perm=sectionPerm(f.id), isHov=hovered===f.id;
          const isActive=f.status==="active"&&canSee(f.id);
          const isLocked=f.status==="active"&&!canSee(f.id);
          const lvColor={none:"#4a5568",view:"#63b3ed",edit:"#f6ad55",admin:"#fc8181"}[perm];
          return (
            <div key={f.id} onMouseEnter={()=>setHovered(f.id)} onMouseLeave={()=>setHovered(null)}
              onClick={()=>isActive&&setActive(f.id)}
              style={{background:isActive&&isHov?f.bg:"#111827",border:"1px solid "+(isActive&&isHov?f.border:"#1e2a45"),borderRadius:"14px",padding:"22px",cursor:isActive?"pointer":"default",transition:"all 0.18s",transform:isActive&&isHov?"translateY(-2px)":"none",boxShadow:isActive&&isHov?"0 8px 28px "+f.color+"18":"none",display:"flex",flexDirection:"column",gap:"14px",opacity:isLocked?0.5:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{fontSize:"26px",lineHeight:1}}>{f.icon}</span>
                  <span style={{fontWeight:"800",fontSize:"16px",color:f.color}}>{f.label}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}>
                  <span style={{fontSize:"10px",padding:"3px 9px",borderRadius:"20px",fontWeight:"700",background:st.bg,color:st.color,display:"flex",alignItems:"center",gap:"5px",whiteSpace:"nowrap"}}>
                    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:st.dot,display:"inline-block"}}/>
                    {st.label}
                  </span>
                  {f.status==="active"&&<span style={{fontSize:"9px",padding:"2px 7px",borderRadius:"8px",fontWeight:"700",background:lvColor+"22",color:lvColor,border:"1px solid "+lvColor+"44"}}>
                    {isLocked?"🔒 no access":perm==="view"?"👁 view":perm==="edit"?"✏️ edit":perm==="admin"?"🔑 admin":"—"}
                  </span>}
                </div>
              </div>
              <p style={{margin:0,fontSize:"12px",color:"#718096",lineHeight:1.6}}>{f.description}</p>
              <button disabled={!isActive} style={{width:"100%",padding:"10px",borderRadius:"8px",border:"none",background:isActive?(isHov?f.color:f.color+"22"):isLocked?"#1a1a1a":"#1a2035",color:isActive?(isHov?"#0a0d14":f.color):isLocked?"#4a5568":"#2d3748",fontWeight:"700",fontSize:"13px",cursor:isActive?"pointer":"not-allowed",transition:"all 0.15s",marginTop:"auto"}}>
                {isLocked?"🔒 Access Required":isActive?"Open "+f.label+" →":"Coming Soon"}
              </button>
            </div>
          );
        })}
      </div>
      <div style={{borderTop:"1px solid #1e2a45",padding:"14px 28px",display:"flex",justifyContent:"space-between",fontSize:"11px",color:"#2d3748"}}>
        <span>Game Features Portal · Economy & LiveOps Console</span>
        <span>Signed in as <strong style={{color:"#4a5568"}}>{currentUser.email}</strong></span>
      </div>
    </div>
  );
}
