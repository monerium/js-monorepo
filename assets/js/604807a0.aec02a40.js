"use strict";(self.webpackChunkdeveloper=self.webpackChunkdeveloper||[]).push([[1125],{7427:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>d,metadata:()=>o,toc:()=>t});var s=r(5723),i=r(3327);const d={},c="Migration Guide.",o={id:"MigrationGuide",title:"Migration Guide.",description:"SDK to v3.0.0",source:"@site/docs/MigrationGuide.md",sourceDirName:".",slug:"/MigrationGuide",permalink:"/js-monorepo/MigrationGuide",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",previous:{title:"UseAuthReturn",permalink:"/js-monorepo/packages/sdk-react-provider/type-aliases/UseAuthReturn"}},l={},t=[{value:"SDK to v3.0.0",id:"sdk-to-v300",level:2},{value:"React Provider to v1.0.0",id:"react-provider-to-v100",level:2}];function a(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"migration-guide",children:"Migration Guide."})}),"\n",(0,s.jsx)(n.h2,{id:"sdk-to-v300",children:"SDK to v3.0.0"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Due to security concerns, the refresh token is no longer automatically kept in localStorage. You must manage it yourself. It can be accessed from ",(0,s.jsx)(n.code,{children:"bearerProfile"})," through the ",(0,s.jsx)(n.code,{children:"MoneriumClient"})," instance. You must then provide it to the ",(0,s.jsx)(n.code,{children:"getAccess"})," method."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"getAccess"})," no longer accepts ",(0,s.jsx)(n.code,{children:"clientId"})," nor ",(0,s.jsx)(n.code,{children:"redirectUri"})," as parameters. These are now set in the ",(0,s.jsx)(n.code,{children:"MoneriumClient"})," constructor."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"getBalances"})," now only returns the balance for a specified address+chain. Defaults to only 'eur' currency, optional parameter accepts a list of currency codes."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"getOrders"})," now returns an ",(0,s.jsx)(n.code,{children:"orders"})," object which contains a list of orders. Preparing for pagination."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"getAuthContext"})," removed, use ",(0,s.jsx)(n.code,{children:"getProfiles"})," instead."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Use ",(0,s.jsx)(n.code,{children:"redirectUri"})," instead of ",(0,s.jsx)(n.code,{children:"redirectUrl"})," for consistency with OAuth 2.0."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Network"})," interface has been completely removed. You will find occasional ",(0,s.jsx)(n.code,{children:"network"})," in responses, but it's in the process of being removed."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"arbitrum"}),"\xa0and ",(0,s.jsx)(n.code,{children:"noble"})," support added."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"placeOrderMessage"})," now has a shortened IBAN format."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"linkAddress"})," now only creates an account for a single specified chain and has been simplified to:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:' {\n   profile: "profile-id-that-owns-address", // optional\n   address: "0x1234...7890",\n   signature: "0x12341234...78907890",\n   chain: "ethereum"\n }\n'})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"skipCreateAccount"}),"\xa0added to ",(0,s.jsx)(n.code,{children:"authorize"})," method to skip the account creation step in the auth flow."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"skipKyc"}),"\xa0added to ",(0,s.jsx)(n.code,{children:"authorize"})," method to skip KYC in the auth flow.Ye"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Simplified websockets"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Renamed ",(0,s.jsx)(n.code,{children:"subscribeToOrderNotifications"}),"to ",(0,s.jsx)(n.code,{children:"subscribeOrderNotifications"})," and ",(0,s.jsx)(n.code,{children:"unsubscribeFromOrderNotifications"})," to ",(0,s.jsx)(n.code,{children:"unsubscribeOrderNotifications"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const monerium = new MoneriumClient({...});\n// Subscribe to all order events\nmonerium.subscribeOrderNotifications();\n\n// Subscribe to specific order events\nmonerium.subscribeOrderNotifications({\xa0\n  filter: {\n    state: OrderState.pending,\n    profile: 'my-profile-id',\n  },\n  // optional callback functions\n  onMessage: (order) => console.log(order)\n  onError: (error) => console.error(error)\n});\n\n// Unsubscribe from specific order events\nmonerium.unsubscribeOrderNotifications({\xa0\n  state: OrderState.pending,\n  profile: 'my-profile-id'\n});\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"ClientCredentialsRequest"})," renamed to ",(0,s.jsx)(n.code,{children:"ClientCredentialsPayload"})]}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"AuthCodeRequest"})," renamed to ",(0,s.jsx)(n.code,{children:"AuthCodePayload"})]}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"RefreshTokenRequest"})," renamed to ",(0,s.jsx)(n.code,{children:"RefreshTokenPayload"})]}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"Balance"})," renamed to ",(0,s.jsx)(n.code,{children:"CurrencyBalance"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"IBAN"})," renamed to ",(0,s.jsx)(n.code,{children:"IBANIdentifier"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"SCAN"})," renamed to ",(0,s.jsx)(n.code,{children:"SCANIdentifier"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["Interface ",(0,s.jsx)(n.code,{children:"CrossChain"})," renamed to ",(0,s.jsx)(n.code,{children:"CrossChainIdentifier"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.h1,{id:"new",children:"New"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"getAddresses"}),"\n",(0,s.jsx)(n.li,{children:"getAddress"}),"\n",(0,s.jsx)(n.li,{children:"getProfile"}),"\n",(0,s.jsx)(n.li,{children:"getProfiles"}),"\n",(0,s.jsx)(n.li,{children:"getIban"}),"\n",(0,s.jsx)(n.li,{children:"getIbans"}),"\n",(0,s.jsx)(n.li,{children:"moveIban"}),"\n",(0,s.jsx)(n.li,{children:"requestIban"}),"\n",(0,s.jsx)(n.li,{children:"CurrencyCode type"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Beta:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"submitProfileDetails"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"react-provider-to-v100",children:"React Provider to v1.0.0"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Due to security concerns, the refresh token is no longer automatically kept in localStorage. You must manage it yourself. It can be accessed from accessed and provided through the ",(0,s.jsx)(n.code,{children:"MoneriumProvider"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:'<MoneriumProvider\n    clientId="f99e629b-6dca-11ee-8aa6-5273f65ed03b"\n    redirectUri={\'http://example.com\'}\n    environment="sandbox"\n    debug={true}\n    refreshToken={refreshToken}\n    onRefreshTokenUpdate={(token) => storeToken(token)}>\n    {children}\n</MoneriumProvider>\n'})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["All query hooks now return the data response as ",(0,s.jsx)(n.code,{children:"data"}),":"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"const { data, isLoading, isError } = useProfile();\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"useAuthContext"})," removed, use ",(0,s.jsx)(n.code,{children:"useProfile"})," instead."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"useBalances"})," now only returns the balance for a specified address+chain. Defaults to only 'eur' currency, optional parameter accepts a list of currency codes."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"useLinkAddress"})," mutation, ",(0,s.jsx)(n.code,{children:"linkAddress"})," now only creates an account for a single specified chain and has been simplified to:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:' {\n   profile: "profile-id-that-owns-address", // optional\n   address: "0x1234...7890",\n   signature: "0x12341234...78907890",\n   chain: "ethereum"\n }\n'})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"New:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"useAddress"}),"\n",(0,s.jsx)(n.li,{children:"useAddresses"}),"\n",(0,s.jsx)(n.li,{children:"useIban"}),"\n",(0,s.jsx)(n.li,{children:"useIbans"}),"\n",(0,s.jsx)(n.li,{children:"useRequestIban"}),"\n",(0,s.jsx)(n.li,{children:"useMoveIban"}),"\n",(0,s.jsx)(n.li,{children:"useSubscribeOrderNotification"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Beta:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"useSubmitProfileDetails"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},3327:(e,n,r)=>{r.d(n,{R:()=>c,x:()=>o});var s=r(2155);const i={},d=s.createContext(i);function c(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),s.createElement(d.Provider,{value:n},e.children)}}}]);