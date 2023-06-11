(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function c(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(t){if(t.ep)return;t.ep=!0;const r=c(t);fetch(t.href,r)}})();const p=document.querySelector('input[name="github-name"]'),h=document.querySelector('button[type="submit"]');h.addEventListener("click",async e=>{e.preventDefault();const o=await y(p.value);if(typeof o===null)throw new Error("User not found.");g(o),document.querySelector("section#cardContainer").classList.replace("opacity-0","opacity-100")});async function y(e){if(!e)throw new Error("Please provide an existing GitHub username.");try{const o=`https://api.github.com/users/${e}`;return(await fetch(o,{referrer:"no-referrer",method:"GET"})).json()}catch(o){return console.log(o),null}}function g(e){var u,f,m;const o=document.querySelector("img#cardImg"),c=document.querySelector("a#cardUserName"),n=document.querySelector("q#cardUserBio"),t=document.querySelector("p#cardUserLocation"),r=document.querySelector("p#cardFollowers"),i=r.firstElementChild,s=document.querySelector("p#cardFollowing"),l=s.firstElementChild,a=document.querySelector("p#cardRepositories"),d=a.firstElementChild;o.src=e.avatar_url??null,o.alt=`Profile photo of ${e.login}`,c.innerText=`${e.name} (${e.login})`,c.href=e.html_url,n.innerText=e.bio??"",n.cite=e.name,t.innerHTML=`from <span class="text-neutral-100">${e.location}</span>`,i.innerText=((u=e.followers)==null?void 0:u.toString())??"0",i.href=e.followers_url,l.innerText=((f=e.following)==null?void 0:f.toString())??"0",l.href=e.following_url,d.innerText=((m=e.public_repos)==null?void 0:m.toString())??"0",d.href=e.repos_url,r.classList.remove("hidden"),s.classList.remove("hidden"),a.classList.remove("hidden"),e.bio===null?n.classList.add("hidden"):n.classList.remove("hidden")}
