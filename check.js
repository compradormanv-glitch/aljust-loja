
(function(){
  'use strict';
  const SUPABASE_URL = 'https://myzlvhpvolpekesibvjz.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_INVV9XjLZN9HAeReMGV-5g_OFjXoB0b';
  const CART='aljust_cart_v4';
  let products=[];
  let cart=[];
  let paymentMethod='BFA';
  let ownerClicks=0, ownerTimer=null;
  const $=id=>document.getElementById(id);
  const money=n=>new Intl.NumberFormat('pt-AO').format(Number(n||0))+' Kz';
  const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

  function safeCartLoad(){
    try{ const raw=localStorage.getItem(CART); cart=raw?JSON.parse(raw):[]; if(!Array.isArray(cart)) cart=[]; }
    catch(_){ cart=[]; }
  }
  function saveCart(){ try{localStorage.setItem(CART,JSON.stringify(cart));}catch(_){} renderCart(); }

  window.handleOwnerLogo=function(e){
    if(e) e.preventDefault();
    ownerClicks++;
    const el=$('ownerLogo');
    if(el){el.style.transform='scale(.96)';setTimeout(()=>el.style.transform='',90)}
    clearTimeout(ownerTimer);
    ownerTimer=setTimeout(()=>ownerClicks=0,2500);
    if(ownerClicks===5){ownerClicks=0;location.href='admin.html';}
  };

  function renderProducts(){
    const grid=$('grid'), empty=$('empty');
    if(!grid) return;
    const q=($('search')?.value||'').trim().toLowerCase();
    const cat=$('filter')?.value||'Todos';
    const list=products.filter(p=>Number(p.stock)>0 && (cat==='Todos'||p.category===cat) && (!q||`${p.name} ${p.category||''} ${p.description||''}`.toLowerCase().includes(q)));
    grid.innerHTML=list.map(p=>`<article class="card"><div class="media">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}">`:'📦'}</div><div class="body"><small>${esc(p.category||'Produto')}</small><h3>${esc(p.name)}</h3>${p.description?`<p>${esc(p.description)}</p>`:''}<strong class="price">${money(p.price)}</strong><span class="stock">${Number(p.stock)} unidade(s) disponíveis</span><button class="add" type="button" onclick="addToCart('${String(p.id)}')">Adicionar ao carrinho</button></div></article>`).join('');
    if(empty) empty.hidden=!!list.length;
  }

  window.addToCart=function(id){
    const p=products.find(x=>String(x.id)===String(id)); if(!p) return;
    const i=cart.find(x=>String(x.id)===String(id));
    if(i){ if(i.qty<Number(p.stock)) i.qty++; }
    else cart.push({id,qty:1});
    saveCart(); openCart();
  };
  window.changeQty=function(id,d){
    const i=cart.find(x=>String(x.id)===String(id)), p=products.find(x=>String(x.id)===String(id));
    if(!i||!p)return; i.qty=Math.max(1,Math.min(Number(p.stock),i.qty+d)); saveCart();
  };
  window.removeItem=function(id){cart=cart.filter(i=>String(i.id)!==String(id));saveCart();};
  function renderCart(){
    const box=$('cartItems'); if(!box)return;
    cart=cart.filter(i=>products.some(p=>String(p.id)===String(i.id)));
    let total=0,count=0;
    box.innerHTML=cart.length?cart.map(i=>{const p=products.find(x=>String(x.id)===String(i.id));const sub=Number(p.price)*i.qty;total+=sub;count+=i.qty;return `<div class="line"><div class="lineInfo">${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:'📦'}<div><strong>${esc(p.name)}</strong><span>${money(p.price)} cada</span></div></div><div class="qty"><button type="button" onclick="changeQty('${p.id}',-1)">−</button><b>${i.qty}</b><button type="button" onclick="changeQty('${p.id}',1)">+</button><button class="remove" type="button" onclick="removeItem('${p.id}')">🗑️</button></div><strong>${money(sub)}</strong></div>`}).join(''):'<p class="muted">O carrinho está vazio.</p>';
    if($('cartCount'))$('cartCount').textContent=count;
    if($('total'))$('total').textContent=money(total);
  }
  window.openCart=function(){if($('drawer'))$('drawer').classList.add('show');if($('overlay'))$('overlay').classList.add('show');};
  window.closeCart=function(){if($('drawer'))$('drawer').classList.remove('show');if($('overlay'))$('overlay').classList.remove('show');};

  window.openCheckout=function(){
    if(!cart.length){alert('O carrinho está vazio.');return;}
    renderCheckoutSummary();
    if($('checkoutModal'))$('checkoutModal').classList.add('show');
    updatePayDetails();
  };
  window.closeCheckout=function(){if($('checkoutModal'))$('checkoutModal').classList.remove('show');};
  function renderCheckoutSummary(){
    let total=0;
    const lines=cart.map(i=>{const p=products.find(x=>String(x.id)===String(i.id)); if(!p)return ''; const sub=Number(p.price)*i.qty; total+=sub; return `${esc(p.name)} x${i.qty} — ${money(sub)}`;}).filter(Boolean).join('<br>');
    if($('orderSummary'))$('orderSummary').innerHTML=`<strong>Resumo do pedido</strong><br>${lines}<br><strong>Total: ${money(total)}</strong>`;
  }
  function updatePayDetails(){
    const details={BFA:`<strong>BFA</strong><br>IBAN: AO06.0000.1556.73.26.3016.1`,BAI:`<strong>BAI</strong><br>IBAN: AO06.0040.0000.2250.3712.1014.2`,Express:`<strong>Multicaixa Express</strong><br>Número: 926 163 681`};
    if($('payDetails'))$('payDetails').innerHTML=details[paymentMethod]||details.BFA;
    document.querySelectorAll('.paymethod').forEach(b=>b.classList.toggle('active',b.dataset.method===paymentMethod));
  }
  function makeInvoiceId(){const d=new Date();const stamp=d.getFullYear().toString()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');return `ALJ-${stamp}-${String(Date.now()).slice(-5)}`;}
  function paymentLabel(){return paymentMethod==='BFA'?'Transferência BFA':paymentMethod==='BAI'?'Transferência BAI':'Multicaixa Express';}
  function paymentDetailsText(){return paymentMethod==='BFA'?'BFA — AO06.0000.1556.73.26.3016.1':paymentMethod==='BAI'?'BAI — AO06.0040.0000.2250.3712.1014.2':'Multicaixa Express — 926 163 681';}
  function buildInvoiceData(){
    const name=($('buyerName')?.value||'').trim(), nif=($('buyerNif')?.value||'').trim(); let total=0;
    const items=cart.map(i=>{const p=products.find(x=>String(x.id)===String(i.id));if(!p)return null;const sub=Number(p.price)*i.qty;total+=sub;return{name:p.name,qty:i.qty,unit:p.price,sub};}).filter(Boolean);
    return {number:makeInvoiceId(),date:new Date(),name,nif:nif||'Não informado',payment:paymentLabel(),paymentDetails:paymentDetailsText(),items,total};
  }
  function showInvoice(inv){
    lastInvoice=inv;
    const map={invoiceNumber:'Nº '+inv.number,invoiceDate:inv.date.toLocaleString('pt-AO'),invoiceName:inv.name,invoiceNif:inv.nif,invoicePayment:inv.payment+' — '+inv.paymentDetails,invoiceTotalSmall:money(inv.total),invoiceTotal:money(inv.total)};
    Object.entries(map).forEach(([id,val])=>{if($(id))$(id).textContent=val;});
    if($('invoiceItems'))$('invoiceItems').innerHTML=`<table class="invoice-table"><thead><tr><th>Produto</th><th>Qtd.</th><th>Preço unit.</th><th>Subtotal</th></tr></thead><tbody>${inv.items.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.qty}</td><td>${money(x.unit)}</td><td>${money(x.sub)}</td></tr>`).join('')}</tbody></table>`;
    const lines=inv.items.map(x=>`• ${x.name} x${x.qty} = ${money(x.sub)}`).join('\n');
    const msg=`Olá, Al.just!\n\nPedido ${inv.number}\nNome: ${inv.name}\nNIF: ${inv.nif}\nPagamento: ${inv.payment} — ${inv.paymentDetails}\n\n${lines}\n\nTotal: ${money(inv.total)}`;
    if($('invoiceWhatsApp')){ $('invoiceWhatsApp').href='#'; $('invoiceWhatsApp').textContent='📲 Enviar PDF no WhatsApp'; $('invoiceWhatsApp').onclick=(e)=>{e.preventDefault();shareInvoiceWhatsApp();}; }
    if($('invoiceModal'))$('invoiceModal').classList.add('show');
  }
  window.confirmCheckout=function(){
    const name=($('buyerName')?.value||'').trim();
    if(!name){alert('Digite o nome.');$('buyerName')?.focus();return;}
    if(!cart.length){alert('O carrinho está vazio.');closeCheckout();return;}
    const inv=buildInvoiceData();
    closeCheckout();showInvoice(inv);
    cart=[];saveCart();
    // A fatura fica aberta; o cliente pode clicar em “Enviar pelo WhatsApp”.
  };
  let lastInvoice=null;

  function buildInvoicePdf(inv){
    if(!window.jspdf?.jsPDF) throw new Error('Biblioteca PDF não carregada.');
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({unit:'mm',format:'a4'});
    const margin=14;
    doc.setTextColor(20,34,52);
    doc.setFontSize(19);
    doc.setFont('helvetica','bold');
    doc.text('Al.just',margin,18);
    doc.setFontSize(14);
    doc.text('Fatura / Confirmação do Pedido',195-margin,18,{align:'right'});
    doc.setFontSize(9);
    doc.setFont('helvetica','normal');
    doc.text(`Nº ${inv.number}`,195-margin,25,{align:'right'});
    doc.text(inv.date.toLocaleString('pt-AO'),195-margin,30,{align:'right'});
    doc.setDrawColor(220,225,230); doc.line(margin,34,195-margin,34);
    doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('Cliente',margin,43); doc.text('NIF',105,43);
    doc.setFont('helvetica','normal');
    doc.text(inv.name||'—',margin,49); doc.text(inv.nif||'Não informado',105,49);
    doc.setFont('helvetica','bold');
    doc.text('Pagamento',margin,58); doc.setFont('helvetica','normal');
    doc.text(inv.payment,margin,64);
    doc.text(inv.paymentDetails,105,64);
    const body=inv.items.map(x=>[x.name,String(x.qty),money(x.unit),money(x.sub)]);
    doc.autoTable({startY:72,head:[['Produto','Qtd.','Preço unit.','Subtotal']],body,theme:'grid',styles:{font:'helvetica',fontSize:9,textColor:[20,34,52],cellPadding:3},headStyles:{fillColor:[20,34,52],textColor:[255,255,255]},columnStyles:{1:{halign:'center'},2:{halign:'right'},3:{halign:'right'}}});
    let y=(doc.lastAutoTable?.finalY||125)+12;
    doc.setFont('helvetica','bold'); doc.setFontSize(13);
    doc.text(`Total: ${money(inv.total)}`,195-margin,y,{align:'right'});
    y+=12; doc.setFont('helvetica','normal'); doc.setFontSize(8);
    const note='Documento gerado automaticamente pela Al.just como confirmação/resumo do pedido. Não substitui documento fiscal quando este for legalmente exigido.';
    const wrapped=doc.splitTextToSize(note,167); doc.text(wrapped,margin,y);
    return doc;
  }

  function invoicePdfBlob(inv){
    const doc=buildInvoicePdf(inv);
    return doc.output('blob');
  }

  window.downloadInvoice=async function(){
    if(!lastInvoice)return;
    try{
      const blob=invoicePdfBlob(lastInvoice);
      const name=`${lastInvoice.number}.pdf`;
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
    }catch(err){alert('Não foi possível gerar o PDF agora.');console.error(err);}
  };

  window.shareInvoiceWhatsApp=async function(){
    if(!lastInvoice)return;
    const lines=lastInvoice.items.map(x=>`• ${x.name} x${x.qty} = ${money(x.sub)}`).join('\n');
    const text=`Olá, Al.just!\n\nPedido ${lastInvoice.number}\nNome: ${lastInvoice.name}\nNIF: ${lastInvoice.nif}\nPagamento: ${lastInvoice.payment} — ${lastInvoice.paymentDetails}\n\n${lines}\n\nTotal: ${money(lastInvoice.total)}`;
    try{
      const blob=invoicePdfBlob(lastInvoice);
      const file=new File([blob],`${lastInvoice.number}.pdf`,{type:'application/pdf'});
      if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({title:`Fatura ${lastInvoice.number}`,text,files:[file]});
        return;
      }
    }catch(err){
      if(err?.name==='AbortError') return;
      console.warn('Partilha do PDF não disponível:',err);
    }
    // Fallback em computador: descarrega o PDF e abre WhatsApp com o texto pronto.
    await window.downloadInvoice();
    window.open(`https://wa.me/244926163681?text=${encodeURIComponent(text+'\n\nO PDF da fatura foi descarregado. Anexe o PDF nesta conversa antes de enviar.')}`,'_blank','noopener');
  };

  async function loadProducts(){
    if($('status'))$('status').textContent='A carregar produtos...';
    try{
      if(typeof supabase==='undefined')throw new Error('Biblioteca Supabase não carregada.');
      const client=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
      const {data,error}=await client.from('produtos').select('id,created_at,name,category,price,stock,image_url,description').order('created_at',{ascending:false});
      if(error)throw error;
      products=(data||[]).filter(p=>Number(p.stock)>0);
      if($('status'))$('status').textContent=products.length?`${products.length} produto(s) disponíveis`:'Ainda não há produtos publicados.';
    }catch(err){console.error(err);products=[];if($('status'))$('status').textContent='Não foi possível carregar os produtos agora.';}
    renderProducts();renderCart();
  }

  function init(){
    safeCartLoad();
    $('year') && ($('year').textContent=new Date().getFullYear());
    $('search')?.addEventListener('input',renderProducts);
    $('searchBtn')?.addEventListener('click',renderProducts);
    $('filter')?.addEventListener('change',renderProducts);
    $('closeCart')?.addEventListener('click',closeCart);
    $('overlay')?.addEventListener('click',()=>{closeCart();closeCheckout();});
    $('closeCheckout')?.addEventListener('click',closeCheckout);
    document.querySelectorAll('.cats button').forEach(b=>b.addEventListener('click',()=>{$('filter').value=b.dataset.cat;renderProducts();$('produtos')?.scrollIntoView({behavior:'smooth'});}));
    document.querySelectorAll('.paymethod').forEach(b=>b.addEventListener('click',()=>{paymentMethod=b.dataset.method||'BFA';updatePayDetails();}));
    $('closeInvoice')?.addEventListener('click',()=>$('invoiceModal')?.classList.remove('show'));
    $('printInvoice')?.addEventListener('click',()=>window.print());
    $('downloadInvoice')?.addEventListener('click',window.downloadInvoice);
    $('invoiceModal')?.addEventListener('click',e=>{if(e.target.id==='invoiceModal')$('invoiceModal').classList.remove('show');});
    updatePayDetails();
    loadProducts();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
