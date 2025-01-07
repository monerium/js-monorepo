"use strict";(self.webpackChunkdeveloper=self.webpackChunkdeveloper||[]).push([[2263],{1479:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>t,metadata:()=>i,toc:()=>a});var n=s(5723),d=s(3327);const t={},c="Function: useOrder()",i={id:"packages/sdk-react-provider/functions/useOrder",title:"Function: useOrder()",description:"useOrder(params string;query UseQueryResult\\",source:"@site/docs/packages/sdk-react-provider/functions/useOrder.md",sourceDirName:"packages/sdk-react-provider/functions",slug:"/packages/sdk-react-provider/functions/useOrder",permalink:"/js-monorepo/packages/sdk-react-provider/functions/useOrder",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",previous:{title:"useSubmitProfileDetails",permalink:"/js-monorepo/packages/sdk-react-provider/functions/useSubmitProfileDetails"},next:{title:"useOrders",permalink:"/js-monorepo/packages/sdk-react-provider/functions/useOrders"}},o={},a=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Example",id:"example",level:2},{value:"See",id:"see",level:2},{value:"Defined in",id:"defined-in",level:2}];function l(e){const r={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,d.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"function-useorder",children:"Function: useOrder()"})}),"\n",(0,n.jsxs)(r.blockquote,{children:["\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:"useOrder"}),"(",(0,n.jsx)(r.code,{children:"params"}),": {",(0,n.jsx)(r.code,{children:"orderId"}),": ",(0,n.jsx)(r.code,{children:"string"}),";",(0,n.jsx)(r.code,{children:"query"}),": ",(0,n.jsx)(r.code,{children:"{}"}),"; }): ",(0,n.jsx)(r.code,{children:"UseQueryResult"}),"<",(0,n.jsx)(r.a,{href:"/js-monorepo/packages/sdk-react-provider/interfaces/Order",children:(0,n.jsx)(r.code,{children:"Order"})}),", ",(0,n.jsx)(r.code,{children:"Error"}),">"]}),"\n"]}),"\n",(0,n.jsx)(r.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(r.table,{children:[(0,n.jsx)(r.thead,{children:(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.th,{children:"Parameter"}),(0,n.jsx)(r.th,{children:"Type"}),(0,n.jsx)(r.th,{children:"Description"})]})}),(0,n.jsxs)(r.tbody,{children:[(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"params"})}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"object"})}),(0,n.jsx)(r.td,{})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"params.orderId"})}),(0,n.jsx)(r.td,{children:(0,n.jsx)(r.code,{children:"string"})}),(0,n.jsx)(r.td,{children:"The id of the order."})]}),(0,n.jsxs)(r.tr,{children:[(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.code,{children:"params.query"}),"?"]}),(0,n.jsxs)(r.td,{children:[(0,n.jsx)(r.a,{href:"/js-monorepo/packages/sdk-react-provider/type-aliases/QueryOptions",children:(0,n.jsx)(r.code,{children:"QueryOptions"})}),"<",(0,n.jsx)(r.a,{href:"/js-monorepo/packages/sdk-react-provider/interfaces/Order",children:(0,n.jsx)(r.code,{children:"Order"})}),">"]}),(0,n.jsxs)(r.td,{children:["See ",(0,n.jsx)(r.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useQuery",children:"Tanstack Query - useQuery"})," options."]})]})]})]}),"\n",(0,n.jsx)(r.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:"UseQueryResult"}),"<",(0,n.jsx)(r.a,{href:"/js-monorepo/packages/sdk-react-provider/interfaces/Order",children:(0,n.jsx)(r.code,{children:"Order"})}),", ",(0,n.jsx)(r.code,{children:"Error"}),">"]}),"\n",(0,n.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"const {\n   data,\n   isLoading,\n   isError,\n   error,\n   refetch,\n   ...moreUseQueryResults\n} = useOrder();\n"})}),"\n",(0,n.jsx)(r.h2,{id:"see",children:"See"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://monerium.dev/api-docs#operation/order%7C",children:"API Documentation"})}),"\n",(0,n.jsx)(r.h2,{id:"defined-in",children:"Defined in"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L547",children:"sdk-react-provider/src/lib/hooks.tsx:547"})})]})}function h(e={}){const{wrapper:r}={...(0,d.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},3327:(e,r,s)=>{s.d(r,{R:()=>c,x:()=>i});var n=s(2155);const d={},t=n.createContext(d);function c(e){const r=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:c(e.components),n.createElement(t.Provider,{value:r},e.children)}}}]);