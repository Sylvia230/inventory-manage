import{y as m,F as o,r,j as s,R as J,a as c,I as b,S as G,B as j,M as z,s as l}from"./index-CMZTZRIn.js";import{S as h}from"./index-CYJ1echB.js";import{R as Ce}from"./SearchOutlined-D2-z65ZP.js";import{R as ke}from"./ReloadOutlined-D9mwfiSd.js";import{R as be}from"./PlusOutlined-7uYA3-eC.js";import{F as Te}from"./Table-Cg2wz00u.js";import{T as Le}from"./index-CIpE2H0f.js";import"./Pagination-BY7MwDV5.js";const Ae="_container_agzf4_1",We={container:Ae},H=async n=>m.post("/province/pageQuery",n).then(a=>a.result),U=async n=>m.post("/city/pageQuery",n).then(a=>a.result),X=async n=>m.post("/county/pageQuery",n).then(a=>a.result),Fe=async n=>m.post("/wmsWarehouse/pageQuery",n).then(a=>a),Re=async n=>m.post("/wmsWarehouse/saveWmsWarehouse",n).then(a=>a),De=async n=>m.post("/wmsWarehouse/removeWmsWarehouse",n).then(a=>a),Y=async n=>m.post("/wmsWarehouse/updateStatus",n).then(a=>a),qe=async n=>m.post("/userStaff/pageQuery",n).then(a=>a.result),Ke=()=>{const[n]=o.useForm(),[a]=o.useForm(),[V,E]=r.useState(!1),[Z,F]=r.useState(!1),[f,R]=r.useState(!1),[N,D]=r.useState(null),[g,ee]=r.useState({current:1,pageSize:10,total:0}),[se,te]=r.useState([]),[I,M]=r.useState([]),[Q,T]=r.useState(""),[L,S]=r.useState([]),[ae,A]=r.useState(""),[ze,x]=r.useState([]),[Oe,W]=r.useState(""),[ne,$]=r.useState(!1),[oe,_]=r.useState(!1),[Pe,B]=r.useState(!1),[q,re]=r.useState([]),le=async()=>{$(!0);try{const e=await H({});console.log(e,"response"),M(e||[])}catch(e){console.error("获取省份数据失败:",e),l.error("获取省份数据失败")}finally{$(!1)}},ie=async e=>{_(!0);try{const t=await U({provinceCode:e});console.log(t,"cities response"),S(t||[])}catch(t){console.error("获取城市数据失败:",t),l.error("获取城市数据失败")}finally{_(!1)}},ce=async e=>{B(!0);try{const t=await X({cityId:e,provinceId:Q.split("-")[0]});console.log(t,"districts response"),x(t||[])}catch(t){console.error("获取区域数据失败:",t),l.error("获取区域数据失败")}finally{B(!1)}},de=e=>{if(T(e),a.setFieldsValue({city:void 0,district:void 0}),S([]),x([]),e){let t=I.find(d=>d.id===e);ie(t.code)}},ue=e=>{A(e),a.setFieldsValue({district:void 0}),x([]),W(""),e&&ce(e)},p=async(e={},t=g.current,d=g.pageSize)=>{E(!0);try{const u={...e,pageNo:t,pageSize:d},v=await Fe(u);console.log("仓库列表响应:",v);const{result:C=[],totalCount:y=0}=v||{},k=C.map((i,w)=>({...i,key:i.id||w}));te(k),ee(i=>({...i,current:t,pageSize:d,total:y}))}catch(u){console.error("获取仓库列表失败:",u),l.error("获取仓库列表失败")}finally{E(!1)}};r.useEffect(()=>{le(),p(),he()},[]);const he=async()=>{let e=await qe({});console.log("仓库管理员列表响应:",e),re(e||[])},O=[{label:"自建仓",value:"1"},{label:"合作仓",value:"2"}],P=[{label:"启用",value:"1"},{label:"作废",value:"0"}],pe=[{title:"仓库名称",dataIndex:"name",width:150},{title:"仓库地址",dataIndex:"warehouseAddress",width:200},{title:"仓库类型",dataIndex:"warehouseTypeDesc",width:120},{title:"仓库状态",dataIndex:"warehouseStatusDesc",width:100},{title:"仓库管理员",dataIndex:"keeperName",width:150},{title:"总车位数",dataIndex:"parkingLotCount",width:100},{title:"经纬度",dataIndex:"location",width:150},{title:"是否银行准入",dataIndex:"isCapitalAccess",width:120,render:e=>s.jsx(Le,{color:e?"success":"error",children:e?"是":"否"})},{title:"在库车辆数",dataIndex:"onLotCarCount",width:100},{title:"操作",key:"action",fixed:"right",width:120,render:(e,t)=>s.jsxs(G,{size:"middle",children:[s.jsx(j,{type:"link",onClick:()=>ye(t),children:"编辑"}),s.jsx(j,{type:"link",onClick:()=>we(t),children:"删除"}),t.warehouseStatus=="1"&&s.jsx(j,{type:"link",onClick:()=>je(t),children:"作废"}),t.warehouseStatus=="0"&&s.jsx(j,{type:"link",onClick:()=>fe(t),children:"启用"})]})}],me=e=>{console.log("搜索条件:",e),p(e,1,g.pageSize)},ge=()=>{n.resetFields(),p({},1,g.pageSize)},xe=e=>{const t=n.getFieldsValue();p(t,e.current,e.pageSize)},K=(e,t)=>{const d=t.find(u=>u.label===e);return d?d.value:e},ye=async e=>{console.log("编辑仓库:",e),R(!0),D(e);try{const t=await H({});if(M(t||[]),e.provinceId){T(e.provinceId);let v=I.find(y=>y.id===e.provinceId);const C=await U({provinceCode:v.code});if(S(C||[]),e.cityId){A(e.cityId);const y=await X({cityId:e.cityId,provinceId:e.provinceId});x(y||[]),W(e.districtId||"")}}const d=K(e.warehouseTypeDesc||"",O),u=K(e.warehouseStatusDesc||"",P);a.setFieldsValue({name:e.name,province:e.provinceId,city:e.cityId,warehouseAddress:e.warehouseAddress,warehouseType:d,warehouseStatus:u,keeperId:e.keeperId,parkingLotCount:e.parkingLotCount,longitude:e.longitude,latitude:e.latitude}),F(!0)}catch(t){console.error("获取编辑数据失败:",t),l.error("获取编辑数据失败")}},we=e=>{z.confirm({title:"确认删除",content:`确定要删除仓库"${e.name}"吗？删除后无法恢复。`,okText:"确定",cancelText:"取消",onOk:async()=>{try{console.log("删除仓库:",e);const t=await De({id:e.id});console.log("删除仓库响应:",t),t&&t.code==="00000"?(l.success("删除仓库成功"),p()):l.error((t==null?void 0:t.message)||"删除仓库失败")}catch(t){console.error("删除仓库失败:",t),l.error("删除仓库失败，请重试")}}})},je=e=>{z.confirm({title:"确认作废",content:`确定要作废仓库"${e.name}"吗？`,okText:"确定",cancelText:"取消",onOk:async()=>{try{console.log("作废仓库:",e);const t=await Y({id:e.id,warehouseStatus:"0"});console.log("作废仓库响应:",t),t&&t.code==="00000"?(l.success("作废仓库成功"),p()):l.error((t==null?void 0:t.message)||"作废仓库失败")}catch(t){console.error("作废仓库失败:",t),l.error("作废仓库失败，请重试")}}})},fe=e=>{z.confirm({title:"确认启用",content:`确定要启用仓库"${e.name}"吗？`,okText:"确定",cancelText:"取消",onOk:async()=>{try{console.log("启用仓库:",e);const t=await Y({id:e.id,warehouseStatus:"1"});console.log("启用仓库响应:",t),t&&t.code==="00000"?(l.success("启用仓库成功"),p()):l.error((t==null?void 0:t.message)||"启用仓库失败")}catch(t){console.error("启用仓库失败:",t),l.error("启用仓库失败，请重试")}}})},Ie=()=>{R(!1),D(null),a.resetFields(),T(""),A(""),W(""),S([]),x([]),F(!0)},Se=()=>{F(!1),a.resetFields(),R(!1),D(null),T(""),A(""),W(""),S([]),x([])},ve=async()=>{try{const e=await a.validateFields();console.log("表单数据:",e);const t=I.find(w=>w.id===e.province),d=t?t.name:"",u=L.find(w=>w.id===e.city),v=u?u.name:"",C=q.find(w=>w.id===e.keeperId),y=C?C.personName:"",k={name:e.name,provinceId:e.province?e.province.split("-")[0]:"",provinceName:d,cityId:e.city,cityName:v,warehouseAddress:e.warehouseAddress,warehouseType:e.warehouseType,warehouseStatus:e.warehouseStatus,keeperId:e.keeperId,keeperName:y,parkingLotCount:e.parkingLotCount,longitude:e.longitude,latitude:e.latitude};let i;f&&N?(k.id=N.id,console.log("编辑仓库接口参数:",k),i={code:"00000"}):(console.log("新增仓库接口参数:",k),i=await Re(k)),console.log("接口响应:",i),i&&i.code=="00000"?(l.success(f?"编辑仓库成功":"新增仓库成功"),F(!1),a.resetFields(),R(!1),D(null),T(""),A(""),W(""),S([]),x([]),p()):l.error((i==null?void 0:i.message)||(f?"编辑仓库失败":"新增仓库失败"))}catch(e){console.error(f?"编辑仓库失败:":"新增仓库失败:",e),l.error(f?"编辑仓库失败，请重试":"新增仓库失败，请重试")}};return s.jsxs("div",{className:We.container,children:[s.jsxs(o,{form:n,onFinish:me,layout:"inline",children:[s.jsxs(J,{gutter:24,style:{width:"100%"},children:[s.jsx(c,{span:8,children:s.jsx(o.Item,{name:"name",label:"仓库名称",children:s.jsx(b,{placeholder:"请输入仓库名称",allowClear:!0})})}),s.jsx(c,{span:8,children:s.jsx(o.Item,{name:"warehouseType",label:"仓库类型",children:s.jsx(h,{placeholder:"请选择仓库类型",allowClear:!0,options:O})})}),s.jsx(c,{span:8,children:s.jsx(o.Item,{name:"warehouseStatus",label:"仓库状态",children:s.jsx(h,{placeholder:"请选择仓库状态",allowClear:!0,options:P})})})]}),s.jsx(J,{style:{width:"100%"},children:s.jsx(c,{span:24,children:s.jsxs(G,{children:[s.jsx(j,{icon:s.jsx(Ce,{}),type:"primary",htmlType:"submit",loading:V,children:"查询"}),s.jsx(j,{icon:s.jsx(ke,{}),onClick:ge,children:"重置"}),s.jsx(j,{type:"primary",icon:s.jsx(be,{}),onClick:Ie,children:"新增仓库"})]})})})]}),s.jsx(Te,{columns:pe,dataSource:se,loading:V,pagination:{current:g.current,pageSize:g.pageSize,total:g.total,showSizeChanger:!0,showQuickJumper:!0,showTotal:e=>`共 ${e} 条`},onChange:xe,scroll:{x:1500}}),s.jsx(z,{title:f?"编辑仓库":"新增仓库",open:Z,onOk:ve,onCancel:Se,width:600,okText:"确认",cancelText:"取消",children:s.jsxs(o,{form:a,layout:"inline",requiredMark:!1,children:[s.jsx(c,{span:24,children:s.jsx(o.Item,{name:"name",label:"仓库名称",rules:[{required:!0,message:"请输入仓库名称"}],children:s.jsx(b,{placeholder:"请输入仓库名称"})})}),s.jsxs(c,{span:24,children:[s.jsx(o.Item,{name:"province",label:"省份",rules:[{required:!0,message:"请选择省份"}],children:s.jsx(h,{placeholder:"请选择省份",loading:ne,onChange:de,allowClear:!0,value:Q,children:I==null?void 0:I.map(e=>s.jsx(h.Option,{value:e.id,children:e.name},e.id))})}),s.jsx(o.Item,{name:"city",label:"城市",rules:[{required:!0,message:"请选择城市"}],children:s.jsx(h,{placeholder:"请选择城市",loading:oe,onChange:ue,allowClear:!0,disabled:L.length===0,value:ae,children:L==null?void 0:L.map(e=>s.jsx(h.Option,{value:e.id||e.value,children:e.name||e.label},e.id||e.value))})}),s.jsx(o.Item,{name:"warehouseAddress",label:"详细地址",rules:[{required:!0,message:"请输入详细地址"}],children:s.jsx(b.TextArea,{placeholder:"请输入详细地址",rows:3})})]}),s.jsx(c,{span:24,children:s.jsx(o.Item,{name:"warehouseType",label:"仓库类型",rules:[{required:!0,message:"请选择仓库类型"}],children:s.jsx(h,{placeholder:"请选择仓库类型",options:O})})}),s.jsx(c,{span:24,children:s.jsx(o.Item,{name:"warehouseStatus",label:"仓库状态",rules:[{required:!0,message:"请选择仓库状态"}],children:s.jsx(h,{placeholder:"请选择仓库状态",options:P})})}),s.jsx(c,{span:24,children:s.jsx(o.Item,{name:"keeperId",label:"仓库管理员",rules:[{required:!0,message:"请选择仓库管理员"}],children:s.jsx(h,{placeholder:"请选择仓库管理员",allowClear:!0,children:q==null?void 0:q.map(e=>s.jsx(h.Option,{value:e.id,children:e.personName},e.id))})})}),s.jsx(c,{span:24,children:s.jsx(o.Item,{name:"parkingLotCount",label:"总车位数",rules:[{required:!0,message:"请输入总车位数"}],children:s.jsx(b,{placeholder:"请输入总车位数",type:"number",min:0})})}),s.jsx(c,{span:12,children:s.jsx(o.Item,{name:"longitude",label:"经度",rules:[{required:!0,message:"请输入经度"}],children:s.jsx(b,{placeholder:"请输入经度",type:"number",step:"0.000001"})})}),s.jsx(c,{span:12,children:s.jsx(o.Item,{name:"latitude",label:"纬度",rules:[{required:!0,message:"请输入纬度"}],children:s.jsx(b,{placeholder:"请输入纬度",type:"number",step:"0.000001"})})})]})})]})};export{Ke as default};
