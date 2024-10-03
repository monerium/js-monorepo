"use strict";(self.webpackChunkapps_docs=self.webpackChunkapps_docs||[]).push([[1363],{4134:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>o,toc:()=>d});var s=t(5723),r=t(3327);const a={},i="Type Alias: MutationResult<TFuncName, TData, TError, TVariables, TContext>",o={id:"packages/SDK React Provider/type-aliases/MutationResult",title:"Type Alias: MutationResult\\<TFuncName, TData, TError, TVariables, TContext\\>",description:'MutationResult\\ UseMutationResult["mutateAsync"] }',source:"@site/docs/packages/SDK React Provider/type-aliases/MutationResult.md",sourceDirName:"packages/SDK React Provider/type-aliases",slug:"/packages/SDK React Provider/type-aliases/MutationResult",permalink:"/js-monorepo/docs/packages/SDK React Provider/type-aliases/MutationResult",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Type Alias: MutationOptions\\<TData, TError, TVariables\\>",permalink:"/js-monorepo/docs/packages/SDK React Provider/type-aliases/MutationOptions"},next:{title:"Type Alias: QueryOptions\\<TData\\>",permalink:"/js-monorepo/docs/packages/SDK React Provider/type-aliases/QueryOptions"}},c={},d=[{value:"Type Parameters",id:"type-parameters",level:2},{value:"See",id:"see",level:2},{value:"Example",id:"example",level:2},{value:"Used By",id:"used-by",level:2},{value:"Defined in",id:"defined-in",level:2}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"type-alias-mutationresulttfuncname-tdata-terror-tvariables-tcontext",children:"Type Alias: MutationResult<TFuncName, TData, TError, TVariables, TContext>"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"MutationResult"}),"<",(0,s.jsx)(n.code,{children:"TFuncName"}),", ",(0,s.jsx)(n.code,{children:"TData"}),", ",(0,s.jsx)(n.code,{children:"TError"}),", ",(0,s.jsx)(n.code,{children:"TVariables"}),", ",(0,s.jsx)(n.code,{children:"TContext"}),">: ",(0,s.jsx)(n.code,{children:"Omit"}),"<",(0,s.jsx)(n.code,{children:"UseMutationResult"}),"<",(0,s.jsx)(n.code,{children:"TData"}),", ",(0,s.jsx)(n.code,{children:"TError"}),", ",(0,s.jsx)(n.code,{children:"TVariables"}),", ",(0,s.jsx)(n.code,{children:"TContext"}),">, ",(0,s.jsx)(n.code,{children:'"mutateAsync"'}),"> & ",(0,s.jsx)(n.code,{children:'{ [P in TFuncName]: UseMutationResult<TData, TError, TVariables, TContext>["mutateAsync"] }'})]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["See ",(0,s.jsx)(n.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useMutation",children:"Tanstack Query - useMutation"})," returns."]}),"\n",(0,s.jsx)(n.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,s.jsxs)(n.p,{children:["\u2022 ",(0,s.jsx)(n.strong,{children:"TFuncName"})," ",(0,s.jsx)(n.em,{children:"extends"})," ",(0,s.jsx)(n.code,{children:"string"})]}),"\n",(0,s.jsx)(n.p,{children:"The name of the function that mutates."}),"\n",(0,s.jsxs)(n.p,{children:["\u2022 ",(0,s.jsx)(n.strong,{children:"TData"})]}),"\n",(0,s.jsx)(n.p,{children:"The data returned."}),"\n",(0,s.jsxs)(n.p,{children:["\u2022 ",(0,s.jsx)(n.strong,{children:"TError"})]}),"\n",(0,s.jsx)(n.p,{children:"The error returned."}),"\n",(0,s.jsxs)(n.p,{children:["\u2022 ",(0,s.jsx)(n.strong,{children:"TVariables"})]}),"\n",(0,s.jsx)(n.p,{children:"The variables used in the mutation."}),"\n",(0,s.jsxs)(n.p,{children:["\u2022 ",(0,s.jsx)(n.strong,{children:"TContext"})," = ",(0,s.jsx)(n.code,{children:"unknown"})]}),"\n",(0,s.jsx)(n.p,{children:"The context used in the mutation."}),"\n",(0,s.jsx)(n.h2,{id:"see",children:"See"}),"\n",(0,s.jsx)(n.h1,{id:"tanstack-query---usemutation",children:(0,s.jsx)(n.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useMutation",children:"Tanstack Query - useMutation"})}),"\n",(0,s.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"mutateAsync"})," is renamed according to the ",(0,s.jsx)(n.code,{children:"TFuncName"})," and therefore not included in the result."]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-diff",children:"const {\n   data,\n   error,\n   isError,\n   isIdle,\n   isPending,\n   isPaused,\n   isSuccess,\n   failureCount,\n   failureReason,\n   mutate,\n-  mutateAsync,\n   reset,\n   status,\n   submittedAt,\n   variables,\n} = useMutationHook();\n"})}),"\n",(0,s.jsx)(n.h2,{id:"used-by",children:"Used By"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"/js-monorepo/docs/packages/SDK%20React%20Provider/functions/useLinkAddress",children:"useLinkAddress"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"/js-monorepo/docs/packages/SDK%20React%20Provider/functions/usePlaceOrder",children:"usePlaceOrder"})}),"\n",(0,s.jsx)(n.h2,{id:"defined-in",children:"Defined in"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L247",children:"types.ts:247"})})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},3327:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>o});var s=t(2155);const r={},a=s.createContext(r);function i(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);