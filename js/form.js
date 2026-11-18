export function validateContact(values) {
  const errors={};
  if(String(values.name||'').trim().length<2)errors.name='Vui lòng nhập họ tên có ít nhất 2 ký tự.';
  const phone=String(values.phone||'').replace(/[\s().-]/g,'');
  if(!/^\+?\d{10,15}$/.test(phone))errors.phone='Vui lòng nhập số điện thoại hợp lệ (10–15 chữ số).';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email||'').trim()))errors.email='Vui lòng nhập địa chỉ email hợp lệ.';
  if(String(values.message||'').trim().length<10)errors.message='Vui lòng mô tả yêu cầu bằng ít nhất 10 ký tự.';
  if(values.consent!==true)errors.consent='Vui lòng xác nhận đồng ý để DSTCC liên hệ lại.';
  if(values.document_link?.trim()) {
    try {
      const link = new URL(values.document_link.trim());
      if (!['https:', 'http:'].includes(link.protocol)) throw new Error('Invalid protocol');
    } catch {
      errors.document_link = 'Vui lòng nhập link tài liệu bắt đầu bằng https:// hoặc http://.';
    }
  }
  return errors;
}

export function createEmailDraft(values,recipient) {
  const subject='[DSTCC] Yêu cầu tư vấn từ website';
  const body=['Kính gửi DSTCC,','',`Họ và tên: ${values.name.trim()}`,`Đơn vị / Chức vụ: ${values.position?.trim()||'Chưa cung cấp'}`,`Điện thoại: ${values.phone.trim()}`,`Email: ${values.email.trim()}`,`Dịch vụ: ${values.service_type||'Cần tư vấn'}`,`Nhóm năng lực: ${values.lab_group||'Cần tư vấn lựa chọn'}`,`Link hồ sơ: ${values.document_link?.trim()||'Chưa cung cấp'}`,'','Nội dung yêu cầu:',values.message.trim(),'','Tôi đồng ý để DSTCC sử dụng thông tin trên để phản hồi yêu cầu.'].join('\r\n');
  const address=encodeURIComponent(recipient).replace(/%40/gi,'@');
  return {subject,body,href:`mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
}

export async function submitRequest({values,key='',recipient,botcheck=false},{fetchImpl=globalThis.fetch,signal}={}) {
  if(Object.keys(validateContact(values)).length)throw new Error('Vui lòng kiểm tra các trường bắt buộc.');
  if(botcheck)throw new Error('Không thể xử lý yêu cầu này. Vui lòng liên hệ trực tiếp với DSTCC.');
  if(!key.trim()||/YOUR_|ACCESS_KEY_HERE/.test(key))return {mode:'email',...createEmailDraft(values,recipient)};
  const response=await fetchImpl('https://api.web3forms.com/submit',{
    method:'POST',signal,headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({access_key:key.trim(),subject:'[DSTCC] Yêu cầu tư vấn từ Website',from_name:'Website DSTCC',name:values.name.trim(),email:values.email.trim(),phone:values.phone.trim(),position:values.position?.trim()||'',service_type:values.service_type||'',lab_group:values.lab_group||'',document_link:values.document_link?.trim()||'',message:values.message.trim(),consent:'Đồng ý'})
  });
  const result=await response.json();
  if(!response.ok||result.success!==true)throw new Error('Yêu cầu chưa được gửi. Vui lòng thử lại hoặc dùng email bên dưới.');
  return {mode:'sent'};
}

function initContactForm() {
  const form=document.getElementById('contactForm');if(!form)return;
  const fields=[...form.querySelectorAll('[data-contact-field]')];
  const button=form.querySelector('[type="submit"]');const status=document.getElementById('form-status');
  const draftPanel=document.getElementById('email-draft');const draftLink=document.getElementById('email-draft-link');const draftBody=document.getElementById('email-draft-body');
  const originalText=button.textContent;form.noValidate=true;
  const getValues=()=>Object.fromEntries(fields.map(field=>[
    field.name,
    field.type==='checkbox' ? field.checked : field.name==='lab_group' && field.value ? field.selectedOptions[0].textContent : field.value
  ]));
  const showFieldError=(field,message)=>{
    const error=document.getElementById(`${field.id}-error`);field.classList.toggle('is-invalid',Boolean(message));field.setAttribute('aria-invalid',String(Boolean(message)));
    if(error){error.textContent=message||'';error.hidden=!message;}
  };
  const showStatus=(text,error=false)=>{
    status.textContent=text;status.className=`alert ${error?'alert-danger':'alert-info'} mt-4`;status.setAttribute('role',error?'alert':'status');status.hidden=false;
  };
  for(const field of fields){
    field.addEventListener('blur',()=>showFieldError(field,validateContact(getValues())[field.name]));
    field.addEventListener(field.type==='checkbox'?'change':'input',()=>{if(field.getAttribute('aria-invalid')==='true')showFieldError(field,validateContact(getValues())[field.name]);draftPanel.hidden=true;status.hidden=true;});
  }
  const params = new URL(location.href).searchParams;
  const groupSelect = form.elements.lab_group;
  const selectedGroup = groupSelect && [...groupSelect.options].find(option => option.value && option.value === params.get('service'));
  if (selectedGroup) {
    groupSelect.value = selectedGroup.value;
    form.elements.service_type.value = 'Thí nghiệm & Kiểm định vật liệu';
    form.elements.message.value = 'Tôi cần tư vấn thí nghiệm.\nĐịa điểm công trình: \nVật liệu / hạng mục: \nThời gian dự kiến: ';
  } else {
    const project = params.get('project');
    if (project) form.elements.message.value = `Tôi muốn trao đổi về dự án ${project.slice(0, 1000)}. `;
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();draftPanel.hidden=true;status.hidden=true;
    const values=getValues();const errors=validateContact(values);for(const field of fields)showFieldError(field,errors[field.name]);
    if(Object.keys(errors).length){showStatus('Vui lòng hoàn thiện các trường được đánh dấu bên dưới.',true);fields.find(field=>errors[field.name])?.focus();return;}
    button.disabled=true;button.textContent='Đang xử lý…';
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
    try{
      const result=await submitRequest({values,key:form.elements.access_key.value,recipient:form.dataset.recipient,botcheck:form.elements.botcheck.checked},{signal:controller.signal});
      if(result.mode==='email'){
        draftLink.href=result.href;draftBody.value=result.body;draftPanel.hidden=false;showStatus('Email đã được soạn. Mở ứng dụng email hoặc sao chép nội dung bên dưới để kiểm tra và gửi.');draftPanel.focus();
      }else{form.reset();fields.forEach(field=>showFieldError(field));showStatus('DSTCC đã nhận được yêu cầu. Cảm ơn bạn đã liên hệ!');status.focus();}
    }catch(error){
      const message=error.name==='AbortError'?'Kết nối quá thời gian chờ. Vui lòng thử lại hoặc gửi email trực tiếp.':['TypeError','SyntaxError'].includes(error.name)?'Chưa thể kết nối dịch vụ gửi yêu cầu. Vui lòng thử lại hoặc gửi email trực tiếp.':error.message||'Chưa thể gửi yêu cầu. Vui lòng gửi email trực tiếp.';
      showStatus(message,true);status.focus();
    }
    finally{clearTimeout(timer);button.disabled=false;button.textContent=originalText;}
  });
}
if(typeof document!=='undefined')initContactForm();
