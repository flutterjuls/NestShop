const products=[
  {id:1,name:"Minimalist Watch",desc:"Japanese movement, sapphire glass, premium leather strap.",price:2450,emoji:"⌚",category:"Accessories",newItem:true},
  {id:2,name:"Ceramic Mug Set",desc:"Set of 4 handcrafted mugs with matte glaze finish.",price:890,emoji:"☕",category:"Home"},
  {id:3,name:"Linen Tote Bag",desc:"100% natural linen, reinforced handles, magnetic closure.",price:650,emoji:"👜",category:"Bags",newItem:true},
  {id:4,name:"Scented Candle",desc:"Soy wax blend, 40-hour burn, bamboo wick.",price:380,emoji:"🕯️",category:"Home"},
  {id:5,name:"Bamboo Notebook",desc:"192 pages, dotted grid, lay-flat binding.",price:420,emoji:"📓",category:"Stationery"},
  {id:6,name:"Wireless Earbuds",desc:"Active noise cancellation, 28-hr battery life.",price:3200,emoji:"🎧",category:"Tech"},
  {id:7,name:"Linen Throw Pillow",desc:"Stone-washed linen, hypoallergenic fill, removable cover.",price:560,emoji:"🛋️",category:"Home"},
  {id:8,name:"Fountain Pen",desc:"Stainless steel nib, converter included, comes in gift box.",price:1100,emoji:"🖊️",category:"Stationery"},
  {id:9,name:"Leather Card Wallet",desc:"Full-grain leather, RFID protection, slim profile.",price:780,emoji:"💳",category:"Accessories"},
  {id:10,name:"Succulent Planter",desc:"Handthrown ceramic, drainage hole, with bamboo saucer.",price:490,emoji:"🌱",category:"Home"},
  {id:11,name:"Portable Charger",desc:"20,000 mAh, dual USB-C, airline approved.",price:1850,emoji:"🔋",category:"Tech"},
  {id:12,name:"Canvas Backpack",desc:"Water-resistant canvas, 25L capacity, padded laptop sleeve.",price:1650,emoji:"🎒",category:"Bags"}
];

let cart={};
let activeFilter='All';

function init(){
  const cats=['All',...new Set(products.map(p=>p.category))];
  const fb=document.getElementById('filterBar');
  cats.forEach(c=>{
    const b=document.createElement('button');
    b.className='filter-btn'+(c==='All'?' active':'');
    b.textContent=c;
    b.onclick=()=>filterProducts(c,b);
    fb.appendChild(b);
  });
  renderProducts();
}

function filterProducts(cat,btn){
  activeFilter=cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function renderProducts(){
  const g=document.getElementById('productsGrid');
  g.innerHTML='';
  const filtered=activeFilter==='All'?products:products.filter(p=>p.category===activeFilter);
  filtered.forEach(p=>{
    const card=document.createElement('div');
    card.className='product-card';
    card.innerHTML=`
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}${p.newItem?'<span class="badge">New</span>':''}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">₱${p.price.toLocaleString()}</div>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to cart</button>
        </div>
      </div>`;
    g.appendChild(card);
  });
}

function addToCart(id){
  cart[id]=(cart[id]||0)+1;
  updateCartUI();
  const p=products.find(x=>x.id===id);
  showToast(p.emoji+' '+p.name+' added!');
}

function updateCartUI(){
  const total=Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent=total;
  const items=document.getElementById('cartItems');
  const footer=document.getElementById('cartFooter');
  if(total===0){
    items.innerHTML='<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p></div>';
    footer.style.display='none';
    return;
  }
  footer.style.display='block';
  items.innerHTML='';
  let sum=0;
  Object.entries(cart).forEach(([id,qty])=>{
    const p=products.find(x=>x.id==id);
    sum+=p.price*qty;
    const item=document.createElement('div');
    item.className='cart-item';
    item.innerHTML=`
      <div class="cart-item-emoji">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">₱${p.price.toLocaleString()} each</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${id},-1)">−</button>
          <span style="font-size:0.85rem;font-weight:500">${qty}</span>
          <button class="qty-btn" onclick="changeQty(${id},1)">+</button>
        </div>
      </div>
      <span style="font-size:0.85rem;font-weight:500;color:var(--accent)">₱${(p.price*qty).toLocaleString()}</span>`;
    items.appendChild(item);
  });
  document.getElementById('cartTotal').textContent='₱'+sum.toLocaleString();
}

function changeQty(id,delta){
  cart[id]=(cart[id]||0)+delta;
  if(cart[id]<=0) delete cart[id];
  updateCartUI();
}

function toggleCart(){
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartPanel').classList.toggle('open');
}

function checkout(){
  cart={};
  updateCartUI();
  toggleCart();
  showToast('🎉 Order placed! Thank you for shopping!');
}

function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2800);
}

init();
