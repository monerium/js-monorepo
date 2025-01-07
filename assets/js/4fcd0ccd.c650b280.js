"use strict";(self.webpackChunkdeveloper=self.webpackChunkdeveloper||[]).push([[2378],{9410:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>o,contentTitle:()=>t,default:()=>h,frontMatter:()=>d,metadata:()=>i,toc:()=>a});var n=r(5723),c=r(3327);const d={},t="Function: useIBANs()",i={id:"packages/sdk-react-provider/functions/useIBANs",title:"Function: useIBANs()",description:"useIBANs(params? string \\| number;profile {}; \\}): UseQueryResult\\",source:"@site/docs/packages/sdk-react-provider/functions/useIBANs.md",sourceDirName:"packages/sdk-react-provider/functions",slug:"/packages/sdk-react-provider/functions/useIBANs",permalink:"/js-monorepo/packages/sdk-react-provider/functions/useIBANs",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",previous:{title:"useIBAN",permalink:"/js-monorepo/packages/sdk-react-provider/functions/useIBAN"},next:{title:"useMoveIban",permalink:"/js-monorepo/packages/sdk-react-provider/functions/useMoveIban"}},o={},a=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Example",id:"example",level:2},{value:"See",id:"see",level:2},{value:"Defined in",id:"defined-in",level:2}];function l(e){const s={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,c.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"function-useibans",children:"Function: useIBANs()"})}),"\n",(0,n.jsxs)(s.blockquote,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"useIBANs"}),"(",(0,n.jsx)(s.code,{children:"params"}),"?: {",(0,n.jsx)(s.code,{children:"chain"}),": ",(0,n.jsx)(s.code,{children:"string"})," | ",(0,n.jsx)(s.code,{children:"number"}),";",(0,n.jsx)(s.code,{children:"profile"}),": ",(0,n.jsx)(s.code,{children:"string"}),";",(0,n.jsx)(s.code,{children:"query"}),": ",(0,n.jsx)(s.code,{children:"{}"}),"; }): ",(0,n.jsx)(s.code,{children:"UseQueryResult"}),"<",(0,n.jsx)(s.code,{children:"IBANsResponse"}),", ",(0,n.jsx)(s.code,{children:"Error"}),">"]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(s.table,{children:[(0,n.jsx)(s.thead,{children:(0,n.jsxs)(s.tr,{children:[(0,n.jsx)(s.th,{children:"Parameter"}),(0,n.jsx)(s.th,{children:"Type"}),(0,n.jsx)(s.th,{children:"Description"})]})}),(0,n.jsxs)(s.tbody,{children:[(0,n.jsxs)(s.tr,{children:[(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"params"}),"?"]}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"object"})}),(0,n.jsx)(s.td,{children:"No required parameters."})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"params.chain"}),"?"]}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"string"})," | ",(0,n.jsx)(s.code,{children:"number"})]}),(0,n.jsx)(s.td,{children:"Fetch IBANs for a specific chain."})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"params.profile"}),"?"]}),(0,n.jsx)(s.td,{children:(0,n.jsx)(s.code,{children:"string"})}),(0,n.jsx)(s.td,{children:"Fetch IBANs for a specific profile."})]}),(0,n.jsxs)(s.tr,{children:[(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.code,{children:"params.query"}),"?"]}),(0,n.jsxs)(s.td,{children:[(0,n.jsx)(s.a,{href:"/js-monorepo/packages/sdk-react-provider/type-aliases/QueryOptions",children:(0,n.jsx)(s.code,{children:"QueryOptions"})}),"<",(0,n.jsx)(s.code,{children:"IBANsResponse"}),">"]}),(0,n.jsxs)(s.td,{children:["See ",(0,n.jsx)(s.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useQuery",children:"Tanstack Query - useQuery"})," options."]})]})]})]}),"\n",(0,n.jsx)(s.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.code,{children:"UseQueryResult"}),"<",(0,n.jsx)(s.code,{children:"IBANsResponse"}),", ",(0,n.jsx)(s.code,{children:"Error"}),">"]}),"\n",(0,n.jsx)(s.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-ts",children:"const {\n   data,\n   isLoading,\n   isError,\n   error,\n   refetch,\n   ...moreUseQueryResults\n} = useIBANs();\n"})}),"\n",(0,n.jsx)(s.h2,{id:"see",children:"See"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans",children:"API Documentation"})}),"\n",(0,n.jsx)(s.h2,{id:"defined-in",children:"Defined in"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L498",children:"sdk-react-provider/src/lib/hooks.tsx:498"})})]})}function h(e={}){const{wrapper:s}={...(0,c.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},3327:(e,s,r)=>{r.d(s,{R:()=>t,x:()=>i});var n=r(2155);const c={},d=n.createContext(c);function t(e){const s=n.useContext(d);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function i(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:t(e.components),n.createElement(d.Provider,{value:s},e.children)}}}]);