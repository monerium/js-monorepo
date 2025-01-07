"use strict";(self.webpackChunkdeveloper=self.webpackChunkdeveloper||[]).push([[3361],{3735:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>h});var n=i(5723),r=i(3327);const o={},a="Getting started",s={id:"index",title:"Getting started",description:"To allow your application to interact with the Monerium API, you must first register it.",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/js-monorepo/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",next:{title:"Getting started",permalink:"/js-monorepo/"}},c={},h=[{value:"Client Credentials",id:"client-credentials",level:3},{value:"Authorization Code Flow",id:"authorization-code-flow",level:3},{value:"Authorization code flow with proof key for code exchange (PKCE)",id:"authorization-code-flow-with-proof-key-for-code-exchange-pkce",level:4},{value:"@monerium/sdk",id:"moneriumsdk",level:2},{value:"@monerium/sdk-react-provider",id:"moneriumsdk-react-provider",level:2}];function l(e){const t={a:"a",admonition:"admonition",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"getting-started",children:"Getting started"})}),"\n",(0,n.jsx)(t.p,{children:"To allow your application to interact with the Monerium API, you must first register it."}),"\n",(0,n.jsxs)(t.p,{children:["Visit ",(0,n.jsx)(t.a,{href:"https://monerium.app/developers",children:"https://monerium.app/developers"}),' and press "+ Add app". Fill in your application details and click "Save".']}),"\n",(0,n.jsxs)(t.p,{children:["Once registered, you will receive both ",(0,n.jsx)(t.a,{href:"#client-credentials",children:"Client Credentials Authorization"})," client ID and client secret, as well as an ",(0,n.jsx)(t.a,{href:"#authorization-code-flow",children:"Authorization Code Flow"})," client ID. You'll also have a field to register a redirect URI, which is the URI where the ",(0,n.jsx)(t.strong,{children:"Authorization Code Flow"})," will redirect after a user has signed up with Monerium and granted your application access to their profile information."]}),"\n",(0,n.jsx)(t.admonition,{type:"tip",children:(0,n.jsx)(t.p,{children:"Notice that there are two client ID's. Make sure to use the correct one for the grant type you are using."})}),"\n",(0,n.jsxs)("figure",{children:[(0,n.jsx)("img",{src:"https://monerium.dev/images/authScreen.jpg",alt:"The authorization code flow screen."}),(0,n.jsx)("figcaption",{children:"Monerium's authorization code flow screen."})]}),"\n",(0,n.jsx)(t.h3,{id:"client-credentials",children:"Client Credentials"}),"\n",(0,n.jsx)(t.p,{children:"The Client Credentials grant type is used by clients which can hide their credentials, e.g. backend server, to obtain an access token outside of the context of a user."}),"\n",(0,n.jsx)(t.p,{children:"Further reading:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://datatracker.ietf.org/doc/html/rfc6749#section-4.4",children:"The OAuth 2.0 Authorization Framework - Client Credentials Grant"})}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"authorization-code-flow",children:"Authorization Code Flow"}),"\n",(0,n.jsx)(t.p,{children:"The Authorization Code grant type is used by public clients which can not securely store a secret, e.g. native or single-page applications, to obtain an access token for a user."}),"\n",(0,n.jsx)(t.p,{children:"Further reading:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://datatracker.ietf.org/doc/html/rfc6749#section-4.1",children:"The OAuth 2.0 Authorization Framework - Authorization Code Grant"})}),"\n"]}),"\n",(0,n.jsx)(t.h4,{id:"authorization-code-flow-with-proof-key-for-code-exchange-pkce",children:"Authorization code flow with proof key for code exchange (PKCE)"}),"\n",(0,n.jsx)(t.p,{children:"OAuth 2.0 includes an extension of the Authorization Code Flow to safeguard public clients against authorization code interception attacks. This extension is known as Proof Key for Code Exchange (PKCE)."}),"\n",(0,n.jsx)(t.p,{children:"In the PKCE-enhanced authorization code flow, the calling application generates a secret called the code verifier, which is later validated by the authorization server. The application also creates a code challenge by hashing the code verifier and sends this value over HTTPS to obtain an authorization code. This approach ensures that even if a malicious attacker intercepts the authorization code, they cannot exchange it for a token without the code verifier."}),"\n",(0,n.jsx)(t.p,{children:"At a high level, the entire authorization flow for a partner application works as follows:"}),"\n",(0,n.jsxs)("figure",{children:[(0,n.jsx)("img",{src:"https://monerium.dev/images/AuthorizationCodeFlowPKCE.jpg",alt:"Monerium's OAuth PKCE flow diagram."}),(0,n.jsx)("figcaption",{children:"Monerium's OAuth 2.0 PKCE flow diagram."})]}),"\n",(0,n.jsx)(t.p,{children:"Further reading:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"https://datatracker.ietf.org/doc/html/rfc7636",children:"Proof Key for Code Exchange (PKCE) by OAuth Public Clients "})}),"\n"]}),"\n",(0,n.jsx)(t.h1,{id:"packages",children:"Packages"}),"\n",(0,n.jsx)(t.h2,{id:"moneriumsdk",children:(0,n.jsx)(t.a,{href:"/js-monorepo/packages/sdk/",children:"@monerium/sdk"})}),"\n",(0,n.jsx)(t.p,{children:"The goal of the SDK is to provide a simplified way for developers to interact with the Monerium API by abstracting the complexity of the OAuth 2.0 Authorization Framework."}),"\n",(0,n.jsx)(t.p,{children:"TBD"}),"\n",(0,n.jsx)(t.h2,{id:"moneriumsdk-react-provider",children:(0,n.jsx)(t.a,{href:"/js-monorepo/packages/sdk-react-provider/",children:"@monerium/sdk-react-provider"})})]})}function d(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},3327:(e,t,i)=>{i.d(t,{R:()=>a,x:()=>s});var n=i(2155);const r={},o=n.createContext(r);function a(e){const t=n.useContext(o);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),n.createElement(o.Provider,{value:t},e.children)}}}]);