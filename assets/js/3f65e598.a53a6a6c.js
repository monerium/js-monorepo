"use strict";(self.webpackChunkapps_docs=self.webpackChunkapps_docs||[]).push([[6894],{1490:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>l,contentTitle:()=>c,default:()=>u,frontMatter:()=>i,metadata:()=>t,toc:()=>a});var n=s(5723),o=s(3327);const i={},c="Function: useProfile()",t={id:"packages/SDK React Provider/functions/useProfile",title:"Function: useProfile()",description:"useProfile(params): QueryResult\\",source:"@site/docs/packages/SDK React Provider/functions/useProfile.md",sourceDirName:"packages/SDK React Provider/functions",slug:"/packages/SDK React Provider/functions/useProfile",permalink:"/js-monorepo/docs/packages/SDK React Provider/functions/useProfile",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Function: usePlaceOrder()",permalink:"/js-monorepo/docs/packages/SDK React Provider/functions/usePlaceOrder"},next:{title:"Function: useProfiles()",permalink:"/js-monorepo/docs/packages/SDK React Provider/functions/useProfiles"}},l={},a=[{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Example",id:"example",level:2},{value:"See",id:"see",level:2},{value:"Defined in",id:"defined-in",level:2}];function d(e){const r={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:"function-useprofile",children:"Function: useProfile()"}),"\n",(0,n.jsxs)(r.blockquote,{children:["\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.strong,{children:"useProfile"}),"(",(0,n.jsx)(r.code,{children:"params"}),"): ",(0,n.jsx)(r.a,{href:"/js-monorepo/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult",children:(0,n.jsx)(r.code,{children:"QueryResult"})}),"<",(0,n.jsx)(r.code,{children:'"profile"'}),", ",(0,n.jsx)(r.code,{children:"Profile"}),">"]}),"\n"]}),"\n",(0,n.jsx)(r.h1,{id:"get-single-profile",children:"Get single profile"}),"\n",(0,n.jsxs)(r.p,{children:["If no ",(0,n.jsx)(r.code,{children:"profileId"})," is provided, the default profile is used."]}),"\n",(0,n.jsx)(r.h2,{id:"parameters",children:"Parameters"}),"\n",(0,n.jsxs)(r.p,{children:["\u2022 ",(0,n.jsx)(r.strong,{children:"params"})," = ",(0,n.jsx)(r.code,{children:"{}"})]}),"\n",(0,n.jsxs)(r.p,{children:["\u2022 ",(0,n.jsx)(r.strong,{children:"params.profileId?"}),": ",(0,n.jsx)(r.code,{children:"string"})]}),"\n",(0,n.jsx)(r.p,{children:"The id of the profile."}),"\n",(0,n.jsxs)(r.p,{children:["\u2022 ",(0,n.jsx)(r.strong,{children:"params.query?"}),": ",(0,n.jsx)(r.a,{href:"/js-monorepo/docs/packages/SDK%20React%20Provider/type-aliases/QueryOptions",children:(0,n.jsx)(r.code,{children:"QueryOptions"})}),"<",(0,n.jsx)(r.code,{children:"Profile"}),">"]}),"\n",(0,n.jsxs)(r.p,{children:["See ",(0,n.jsx)(r.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useQuery",children:"Tanstack Query - useQuery"})," options."]}),"\n",(0,n.jsx)(r.h2,{id:"returns",children:"Returns"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.a,{href:"/js-monorepo/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult",children:(0,n.jsx)(r.code,{children:"QueryResult"})}),"<",(0,n.jsx)(r.code,{children:'"profile"'}),", ",(0,n.jsx)(r.code,{children:"Profile"}),">"]}),"\n",(0,n.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-ts",children:"const {\n   profile, // useQuery's `data` property\n   isLoading,\n   isError,\n   error,\n   refetch,\n   ...moreUseQueryResults\n} = useProfile();\n"})}),"\n",(0,n.jsx)(r.h2,{id:"see",children:"See"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://monerium.dev/api-docs#operation/profile",children:"API Documentation"})}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"/js-monorepo/docs/packages/SDK/interfaces/Profile",children:"Profile interface"})}),"\n",(0,n.jsx)(r.h2,{id:"defined-in",children:"Defined in"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L178",children:"hooks.tsx:178"})})]})}function u(e={}){const{wrapper:r}={...(0,o.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},3327:(e,r,s)=>{s.d(r,{R:()=>c,x:()=>t});var n=s(2155);const o={},i=n.createContext(o);function c(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function t(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:c(e.components),n.createElement(i.Provider,{value:r},e.children)}}}]);