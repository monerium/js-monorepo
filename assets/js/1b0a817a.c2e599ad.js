"use strict";(self.webpackChunkdeveloper=self.webpackChunkdeveloper||[]).push([[8662],{5943:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var s=t(5723),n=t(3327);const a={},d="Type Alias: QueryResult<TVarName, TData>",i={id:"packages/sdk-react-provider/type-aliases/QueryResult",title:"Type Alias: QueryResult\\<TVarName, TData\\>",description:'QueryResult\\ UseQueryResult["data"] }',source:"@site/docs/packages/sdk-react-provider/type-aliases/QueryResult.md",sourceDirName:"packages/sdk-react-provider/type-aliases",slug:"/packages/sdk-react-provider/type-aliases/QueryResult",permalink:"/js-monorepo/packages/sdk-react-provider/type-aliases/QueryResult",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",previous:{title:"QueryOptions",permalink:"/js-monorepo/packages/sdk-react-provider/type-aliases/QueryOptions"},next:{title:"ResponseStatus",permalink:"/js-monorepo/packages/sdk-react-provider/type-aliases/ResponseStatus"}},c={},l=[{value:"Type Parameters",id:"type-parameters",level:2},{value:"See",id:"see",level:2},{value:"Example",id:"example",level:2},{value:"Defined in",id:"defined-in",level:2}];function o(e){const r={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.header,{children:(0,s.jsx)(r.h1,{id:"type-alias-queryresulttvarname-tdata",children:"Type Alias: QueryResult<TVarName, TData>"})}),"\n",(0,s.jsxs)(r.blockquote,{children:["\n",(0,s.jsxs)(r.p,{children:[(0,s.jsx)(r.strong,{children:"QueryResult"}),"<",(0,s.jsx)(r.code,{children:"TVarName"}),", ",(0,s.jsx)(r.code,{children:"TData"}),">: ",(0,s.jsx)(r.code,{children:"Omit"}),"<",(0,s.jsx)(r.code,{children:"UseQueryResult"}),"<",(0,s.jsx)(r.code,{children:"TData"}),">, ",(0,s.jsx)(r.code,{children:'"data"'}),"> & ",(0,s.jsx)(r.code,{children:'{ [P in TVarName]: UseQueryResult<TData>["data"] }'})]}),"\n"]}),"\n",(0,s.jsxs)(r.p,{children:["See ",(0,s.jsx)(r.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useQuery",children:"Tanstack Query - useQuery"})," returns."]}),"\n",(0,s.jsx)(r.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,s.jsxs)(r.table,{children:[(0,s.jsx)(r.thead,{children:(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.th,{children:"Type Parameter"}),(0,s.jsx)(r.th,{children:"Default type"}),(0,s.jsx)(r.th,{children:"Description"})]})}),(0,s.jsxs)(r.tbody,{children:[(0,s.jsxs)(r.tr,{children:[(0,s.jsxs)(r.td,{children:[(0,s.jsx)(r.code,{children:"TVarName"})," ",(0,s.jsx)(r.em,{children:"extends"})," ",(0,s.jsx)(r.code,{children:"string"})]}),(0,s.jsx)(r.td,{children:"-"}),(0,s.jsx)(r.td,{children:"The name of the variable that returns the data."})]}),(0,s.jsxs)(r.tr,{children:[(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"TData"})}),(0,s.jsx)(r.td,{children:(0,s.jsx)(r.code,{children:"unknown"})}),(0,s.jsx)(r.td,{children:"The data returned."})]})]})]}),"\n",(0,s.jsx)(r.h2,{id:"see",children:"See"}),"\n",(0,s.jsx)(r.h1,{id:"tanstack-query---usequery",children:(0,s.jsx)(r.a,{href:"https://tanstack.com/query/latest/docs/framework/react/reference/useQuery",children:"Tanstack Query - useQuery"})}),"\n",(0,s.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,s.jsxs)(r.blockquote,{children:["\n",(0,s.jsxs)(r.p,{children:[(0,s.jsx)(r.code,{children:"data"})," is renamed according to the ",(0,s.jsx)(r.code,{children:"TVarName"})," and therefore not included in the result."]}),"\n"]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-diff",children:"{\n-   data,\n   dataUpdatedAt,\n   error,\n   errorUpdatedAt,\n   failureCount,\n   failureReason,\n   fetchStatus,\n   isError,\n   isFetched,\n   isFetchedAfterMount,\n   isFetching,\n   isInitialLoading,\n   isLoading,\n   isLoadingError,\n   isPaused,\n   isPending,\n   isPlaceholderData,\n   isRefetchError,\n   isRefetching,\n   isStale,\n   isSuccess,\n   refetch,\n   status,\n}\n"})}),"\n",(0,s.jsx)(r.h2,{id:"defined-in",children:"Defined in"}),"\n",(0,s.jsx)(r.p,{children:(0,s.jsx)(r.a,{href:"https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L126",children:"sdk-react-provider/src/lib/types.ts:126"})})]})}function h(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},3327:(e,r,t)=>{t.d(r,{R:()=>d,x:()=>i});var s=t(2155);const n={},a=s.createContext(n);function d(e){const r=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:d(e.components),s.createElement(a.Provider,{value:r},e.children)}}}]);