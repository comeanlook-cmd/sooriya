
const menu=document.querySelector('.menu'), links=document.querySelector('.navlinks');
if(menu) menu.addEventListener('click',()=>links.classList.toggle('open'));

function sendWhatsApp(message){
  window.open(`https://wa.me/94777400300?text=${encodeURIComponent(message)}`,'_blank');
}
document.querySelectorAll('form[data-whatsapp]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(form), lines=[];
    for(const [k,v] of data.entries()) if(v) lines.push(`${k}: ${v}`);
    sendWhatsApp(`Hello Soori Washing! I would like to request a service.\n\n${lines.join('\n')}`);
    const ok=form.parentElement.querySelector('.success') || form.querySelector('.success');
    if(ok) ok.style.display='block';
  });
});

const cartRows=[...document.querySelectorAll('[data-service-row]')];
function updateCart(){
  let total=0, count=0, items=[];
  cartRows.forEach(row=>{
    const qtyEl=row.querySelector('[data-qty]');
    const qty=Math.max(0,parseInt(qtyEl?.value||0));
    const price=parseFloat(row.dataset.price||0);
    const subtotal=qty*price;
    const subEl=row.querySelector('[data-subtotal]');
    if(subEl) subEl.textContent=subtotal ? `LKR ${subtotal.toLocaleString()}` : '—';
    if(qty){count+=qty;total+=subtotal;items.push(`${row.dataset.service} x ${qty}`);}
  });
  const totalEl=document.querySelector('[data-total]'); if(totalEl) totalEl.textContent=`LKR ${total.toLocaleString()}`;
  const countEl=document.querySelector('[data-count]'); if(countEl) countEl.textContent=count;
  const itemsEl=document.querySelector('[data-items]'); if(itemsEl) itemsEl.value=items.join(', ');
}
document.querySelectorAll('[data-minus]').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement.querySelector('[data-qty]');i.value=Math.max(0,(+i.value||0)-1);updateCart();}));
document.querySelectorAll('[data-plus]').forEach(b=>b.addEventListener('click',()=>{const i=b.parentElement.querySelector('[data-qty]');i.value=(+i.value||0)+1;updateCart();}));
document.querySelectorAll('[data-qty]').forEach(i=>i.addEventListener('input',updateCart));
updateCart();

const orderForm=document.querySelector('#orderForm');
if(orderForm){
 orderForm.addEventListener('submit',e=>{
   e.preventDefault();
   updateCart();
   const data=new FormData(orderForm);
   const items=data.get('Items')||'No items selected';
   const total=document.querySelector('[data-total]')?.textContent||'LKR 0';
   const msg=`SOORI WASHING — ONLINE ORDER REQUEST\n\nName: ${data.get('Name')}\nPhone: ${data.get('Phone')}\nAddress: ${data.get('Address')}\nPickup Date: ${data.get('Date')}\nTime: ${data.get('Time')}\nServices: ${items}\nEstimated total: ${total}\nSpecial instructions: ${data.get('Notes')||'None'}\n\nPlease confirm availability and final price.`;
   sendWhatsApp(msg);
   document.querySelector('#orderSuccess').style.display='block';
 });
}

document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>{
  const lang=btn.dataset.lang;
  document.querySelectorAll('[data-en],[data-si]').forEach(el=>{
    el.textContent=(lang==='si'?el.dataset.si:el.dataset.en)||el.textContent;
  });
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
