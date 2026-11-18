const grid=document.getElementById('projectGrid');
if(grid){
  const projects=[...grid.querySelectorAll('.project-item')];const buttons=[...document.querySelectorAll('[data-filter]')];const count=document.getElementById('project-count');const empty=document.getElementById('projects-empty');
  for(const button of buttons)button.addEventListener('click',()=>{
    let visible=0;for(const project of projects){const match=button.dataset.filter==='all'||project.dataset.category===button.dataset.filter;project.hidden=!match;if(match)visible++;}
    for(const item of buttons){item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));}
    if(count)count.textContent=`Hiển thị ${visible} dự án`;if(empty)empty.hidden=visible>0;
  });
}
