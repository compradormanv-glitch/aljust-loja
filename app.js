const STORAGE_KEY = 'aljust_products';
let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let selectedImage = '';

function saveProducts(){localStorage.setItem(STORAGE_KEY, JSON.stringify(products));}
function money(value){return Number(value).toLocaleString('pt-AO') + ' Kz';}
function escapeHTML(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

function renderProducts(){
  const site = document.getElementById('siteProducts');
  const admin = document.getElementById('adminProducts');
  const html = products.length ? products.map(p => `
    <article class="card">
      <img src="${p.image || 'https://via.placeholder.com/400x250?text=AL.JUST'}" alt="${escapeHTML(p.name)}">
      <h3>${escapeHTML(p.name)}</h3>
      <p>${escapeHTML(p.description)}</p>
      <p><strong>Categoria:</strong> ${escapeHTML(p.category)}</p>
      <p class="price">${money(p.price)}</p>
      ${admin ? `<small>Status: ${p.published ? 'Publicado' : 'Não publicado'}</small>
      <div class="actions">
        <button class="edit" onclick="editProduct('${p.id}')">Editar</button>
        <button onclick="togglePublish('${p.id}')">${p.published ? 'Retirar publicação' : 'Publicar'}</button>
        <button class="delete" onclick="deleteProduct('${p.id}')">Eliminar</button>
      </div>` : ''}
    </article>`).join('') : '<p>Nenhum produto cadastrado.</p>';
  if(site) site.innerHTML = products.filter(p=>p.published).map(p => `
    <article class="card"><img src="${p.image || 'https://via.placeholder.com/400x250?text=AL.JUST'}" alt="${escapeHTML(p.name)}">
    <h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description)}</p>
    <p class="price">${money(p.price)}</p></article>`).join('') || '<p>Nenhum produto publicado.</p>';
  if(admin) admin.innerHTML = html;
}

function resetForm(){
  const form=document.getElementById('productForm'); if(!form)return;
  form.reset(); document.getElementById('productId').value='';
  document.getElementById('formTitle').textContent='Cadastrar produto';
  selectedImage=''; document.getElementById('preview').style.display='none';
}
function editProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  document.getElementById('productId').value=p.id;
  document.getElementById('name').value=p.name;
  document.getElementById('category').value=p.category;
  document.getElementById('price').value=p.price;
  document.getElementById('description').value=p.description;
  selectedImage=p.image||'';
  const preview=document.getElementById('preview');
  if(selectedImage){preview.src=selectedImage;preview.style.display='block';}
  document.getElementById('formTitle').textContent='Editar produto';
  window.scrollTo({top:0,behavior:'smooth'});
}
function deleteProduct(id){
  if(confirm('Deseja eliminar este produto?')){
    products=products.filter(p=>p.id!==id);saveProducts();renderProducts();
  }
}
function togglePublish(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  p.published=!p.published;saveProducts();renderProducts();
}

const imageInput=document.getElementById('image');
if(imageInput) imageInput.addEventListener('change',e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{selectedImage=reader.result;const preview=document.getElementById('preview');preview.src=selectedImage;preview.style.display='block';};
  reader.readAsDataURL(file);
});
const form=document.getElementById('productForm');
if(form) form.addEventListener('submit',e=>{
  e.preventDefault();
  const id=document.getElementById('productId').value;
  const data={id:id||Date.now().toString(),name:document.getElementById('name').value.trim(),category:document.getElementById('category').value,price:document.getElementById('price').value,description:document.getElementById('description').value.trim(),image:selectedImage,published:id?(products.find(p=>p.id===id)?.published||false):false};
  if(id) products=products.map(p=>p.id===id?data:p); else products.push(data);
  saveProducts();renderProducts();resetForm();alert('Produto guardado com sucesso!');
});
const cancel=document.getElementById('cancelEdit');if(cancel)cancel.addEventListener('click',resetForm);
renderProducts();
