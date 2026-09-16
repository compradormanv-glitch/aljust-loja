const sampleProducts=[
 {name:"Cabo de alimentação de computador",category:"Informática",price:"1.500 Kz",icon:"🔌"},
 {name:"Rato USB",category:"Informática",price:"3.500 Kz",icon:"🖱️"},
 {name:"Livro de ponto A4",category:"Escritório",price:"4.500 Kz",icon:"📘"},
 {name:"Caderno escolar A4",category:"Escolar",price:"1.200 Kz",icon:"📓"}
];

function renderProducts(list){
 const root=document.getElementById("products");
 root.innerHTML=list.map((p,i)=>`
 <article class="product">
  <div class="productImg">${p.image?`<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain">`:`${p.icon||"📦"}`}</div>
  <div class="productInfo">
   <div class="category">${p.category||"Al.just"}</div>
   <h3>${escapeHtml(p.name||p.nome)}</h3>
   <div class="price">${p.price||((Number(p.preco)||0).toLocaleString("pt-AO")+" Kz")}</div>
   <button class="buy" data-i="${i}">Adicionar ao carrinho</button>
  </div>
 </article>`).join("");
 document.querySelectorAll(".buy").forEach(btn=>btn.addEventListener("click",()=>{
   let n=Number(document.getElementById("cartCount").textContent)||0;
   document.getElementById("cartCount").textContent=n+1;
 }));
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
renderProducts(sampleProducts);

document.getElementById("search").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase().trim();
 renderProducts(sampleProducts.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)));
});
document.getElementById("menuBtn").addEventListener("click",()=>{
 const nav=document.getElementById("nav"); nav.scrollIntoView({behavior:"smooth"});
});
