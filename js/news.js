import {normalizeText} from './main.js';
const search=document.getElementById('newsSearch');const category=document.getElementById('newsCategory');const items=[...document.querySelectorAll('.news-item')];
if(search&&category){
  const update=()=>{const query=normalizeText(search.value.trim());let count=0;
    for(const item of items){const match=(category.value==='all'||item.dataset.category===category.value)&&normalizeText(item.dataset.search).includes(query);item.hidden=!match;if(match)count++;}
    document.getElementById('news-count').textContent=`Tìm thấy ${count} bài viết`;document.getElementById('news-empty').hidden=count>0;
  };
  search.value=new URL(location.href).searchParams.get('q')||'';search.addEventListener('input',update);category.addEventListener('change',update);
  document.getElementById('clearNews').addEventListener('click',()=>{search.value='';category.value='all';update();search.focus();});update();
}
