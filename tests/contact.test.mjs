import test from 'node:test';
import assert from 'node:assert/strict';
import {submitRequest,validateContact,createEmailDraft} from '../js/form.js';
const valid={name:'Nguyễn Văn A',email:'test@example.com',phone:'0388 279 279',position:'Kỹ sư',service_type:'Thí nghiệm',message:'Cần tư vấn kiểm định công trình & báo giá.',consent:true};
const recipient='DSTCC.JSC@gmail.com';
test('unchecked consent prevents transmission even with a configured key',async()=>{
  let requests=0;await assert.rejects(submitRequest({values:{...valid,consent:false},key:'configured',recipient},{fetchImpl:async()=>{requests++;}}));assert.equal(requests,0);
});
test('missing key creates an email draft and never calls the form API',async()=>{
  let requests=0;const result=await submitRequest({values:valid,recipient},{fetchImpl:async()=>{requests++;}});
  assert.equal(requests,0);assert.equal(result.mode,'email');assert.ok(result.body.includes('công trình & báo giá.'));
  const url=new URL(result.href);assert.equal(decodeURIComponent(url.pathname),recipient);assert.equal(url.searchParams.get('body'),result.body);
});
test('placeholder keys cannot report a successful submission',async()=>{
  const result=await submitRequest({values:valid,key:'YOUR_WEB3FORMS_ACCESS_KEY',recipient},{fetchImpl:()=>assert.fail('Unexpected network request')});assert.equal(result.mode,'email');
});
test('invalid contact fields and bot submissions do not reach the API',async()=>{
  assert.deepEqual(Object.keys(validateContact({name:' ',email:'invalid',phone:'123',message:'short',consent:false})).sort(),['consent','email','message','name','phone']);
  await assert.rejects(submitRequest({values:valid,key:'configured',recipient,botcheck:true},{fetchImpl:()=>assert.fail('Unexpected network request')}));
});
test('API errors must not produce the sent state',async()=>{
  for(const response of [{ok:true,json:async()=>({success:false})},{ok:false,json:async()=>({success:true})}])await assert.rejects(submitRequest({values:valid,key:'configured',recipient},{fetchImpl:async()=>response}));
});
test('only an HTTP success and explicit API success confirm delivery',async()=>{
  const result=await submitRequest({values:valid,key:'configured',recipient},{fetchImpl:async(url,options)=>{
    assert.equal(url,'https://api.web3forms.com/submit');const body=JSON.parse(options.body);assert.equal(body.email,valid.email);assert.equal(body.access_key,'configured');return {ok:true,json:async()=>({success:true})};
  }});assert.equal(result.mode,'sent');
});
test('email draft preserves Vietnamese, newlines and reserved URL characters',()=>{
  const draft=createEmailDraft({...valid,message:'Kiểm định A&B?\nHồ sơ #1 + bản vẽ'},recipient);assert.equal(new URL(draft.href).searchParams.get('body'),draft.body);assert.ok(draft.body.includes('Hồ sơ #1 + bản vẽ'));
});

test('document links and selected capability reach both contact delivery modes', async () => {
  const values = {...valid, lab_group:'Nhựa đường & bê tông nhựa', document_link:'https://example.com/ho-so?a=1&b=2'};
  const draft = await submitRequest({values, recipient});
  assert.ok(draft.body.includes(values.document_link));
  assert.ok(draft.body.includes(values.lab_group));
  await submitRequest({values, key:'configured', recipient}, {fetchImpl:async (url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.lab_group, values.lab_group);
    assert.equal(payload.document_link, values.document_link);
    return {ok:true, json:async () => ({success:true})};
  }});
});

test('invalid document URLs prevent transmission', async () => {
  for (const document_link of ['javascript:alert(1)', 'file:///ho-so.pdf', 'link khong hop le']) {
    const values = {...valid, document_link};
    assert.ok(validateContact(values).document_link);
    await assert.rejects(submitRequest({values, key:'configured', recipient}, {fetchImpl:() => assert.fail('Unexpected network request')}));
  }
});
