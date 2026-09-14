const WHATSAPP_NUMBER = "244926163681"; // Troque pelo número real, apenas números.

const products = [
  {id:1, name:"Cabo de Alimentação de Computador", category:"Informática", price:1500, icon:"🔌"},
  {id:2, name:"Notebook ASUS Vivobook 15,6\"", category:"Informática", price:420000, icon:"💻"},
  {id:3, name:"Impressora Epson EcoTank", category:"Informática", price:250000, icon:"🖨️"},
  {id:4, name:"Monitor 22\" Full HD", category:"Informática", price:120000, icon:"🖥️"},
  {id:5, name:"Teclado e Rato Sem Fio", category:"Informática", price:28000, icon:"⌨️"},
  {id:6, name:"Pen Drive 64GB", category:"Informática", price:15000, icon:"💾"},
  {id:7, name:"Papel A4 (resma)", category:"Escritório", price:8500, icon:"📄"},
  {id:8, name:"Agrafador de mesa", category:"Escritório", price:7500, icon:"📎"},
  {id:9, name:"Caneta Esferográfica (caixa)", category:"Escolar", price:6500, icon:"🖊️"},
  {id:10, name:"Caderno A4", category:"Escolar", price:2500, icon:"📒"},
  {id:11, name:"Mochila Escolar", category:"Escolar", price:18000, icon:"🎒"}
];

let cart = JSON.parse(localStorage.getItem("aljust_cart") || "[]");

const money = n => new Intl.NumberFormat("pt-AO").format(n) + " Kz";
const getProduct = id => products.find(p => p.id === id);

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const cat = document.getElementById("categoryFilter").value;
  const filtered = products.filter(p => {
    const textOk = !q || (p.name + " " + p.category).toLowerCase().includes(q);
    const catOk = cat === "Todos" || p.category === cat;
    return textOk && catOk;
  });
  grid.innerHTML = filtered.map(p => `
    <article class="card">
      <div class="card-media">${p.icon}</div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-price">${money(p.price)}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      </div>
    </article>
  `).join("");
  empty.hidden = filtered.length !== 0;
}

function saveCart() {
  localStorage.setItem("aljust_cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({id, qty:1});
  saveCart();
  openCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}

function renderCart() {
  const items = document.getElementById("cartItems");
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);
  items.innerHTML = cart.length ? cart.map(i => {
    const p = getProduct(i.id);
    return `
      <div class="cart-line">
        <div class="cart-thumb">${p.icon}</div>
        <div>
          <strong>${p.name}</strong>
          <div>${money(p.price)}</div>
          <div class="qty">
            <button onclick="updateQty(${p.id},-1)">−</button>
            <span>${i.qty}</span>
            <button onclick="updateQty(${p.id},1)">+</button>
          </div>
        </div>
        <strong>${money(p.price * i.qty)}</strong>
      </div>`;
  }).join("") : "<p style='color:#617184'>O seu carrinho está vazio.</p>";
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","false");
  document.getElementById("overlay").classList.add("show");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
  document.getElementById("overlay").classList.remove("show");
}

function whatsappUrl(message) {
  const num = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

function checkout() {
  if (!cart.length) return alert("Adicione pelo menos um produto ao carrinho.");
  const lines = cart.map(i => {
    const p = getProduct(i.id);
    return `• ${p.name} x${i.qty} — ${money(p.price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);
  const message = `Olá, Al.just! Gostaria de fazer este pedido:%0A${lines.join("%0A")}%0A%0ATotal: ${money(total)}%0A%0ANome:%0ALocal de entrega:`;
  window.open(whatsappUrl(message), "_blank");
}

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("searchBtn").addEventListener("click", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);
document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", checkout);

document.querySelectorAll(".category-card").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("categoryFilter").value = btn.dataset.category;
    renderProducts();
    document.getElementById("produtos").scrollIntoView({behavior:"smooth"});
  });
});

function openWhatsAppHome() {
  const msg = "Olá, Al.just! Vim pelo site e gostaria de saber mais sobre os produtos.";
  window.open(whatsappUrl(msg), "_blank");
}
document.getElementById("heroWhatsappBtn").addEventListener("click", openWhatsAppHome);
document.getElementById("contactWhatsapp").addEventListener("click", e => {
  e.preventDefault();
  openWhatsAppHome();
});

document.getElementById("topWhatsapp").textContent = "+244 926 163 681";
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
