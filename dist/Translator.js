export const supportedLanguages=["ch_tw","ch","de","en_us","en","es_us","es","fr_us","fr","it","jp","kr","nl","pt_br","pt"];export async function translate(e,t,s,n,a=!0,r=!1){return fetch(`${e}/translate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({source:t,target:s,message:n,...a?{}:{cache:!1},...r?{retry:!0}:{}})}).then(async e=>e.json()).then(e=>e.success&&null!==e.data.message?e.data.message:null)}