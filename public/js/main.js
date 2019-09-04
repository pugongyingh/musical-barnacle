if(document.getElementById('addForm')) {
    document.getElementById('addForm').addEventListener('submit', ev => {
        ev.preventDefault();
        processQuill();
        if(!isValid(ev.target)) return;
        if(confirm('Create this post?')) ev.target.submit();
    })
}

if(document.getElementById('deleteBtn')) {
    document.getElementById('deleteBtn').addEventListener('click', ev => {
        ev.preventDefault();
        if(confirm('Delete this post?')) {
            let id = document.querySelector('[name=_id]').value;
            fetch('/api/post_'+id, {method: "DELETE"})
                .then(res => {
                    console.log(res);
                    redirect('/admin/posts');
                })
        }
    })
}

if(document.getElementById('editForm')) {
    document.getElementById('editForm').addEventListener('submit', ev => {
        ev.preventDefault();
        if(!isValid(ev.target)) return;
        if(confirm('Save this post?')) {
            processQuill()
            let formData = new FormData(ev.target);
            fetch(ev.target.action, {method: "PUT", body: formData})
            .then(res => {
                alert('Successfully updated post');
            })
            .catch(e => console.log(e))
        }
    })
}

if(document.querySelector('#quillEditor')) {    
    var editor = new Quill('#quillEditor', {
        modules: {
            toolbar: '#toolbar'
        },
        theme: 'snow',
        placeholder: "Compose an epic..."
    })
}

async function upload(data) {
    let r = await fetch(data);
    let blob = await r.blob();

    let formData = new FormData();
    formData.append('img', blob);

    let res = await fetch('/api/upload', { method: "POST", body: formData })
    let txt = await res.text();
    return txt;
}

async function processQuill() {
    // Process Images
/*     let imgList = document.querySelectorAll('.ql-editor img');
    if(typeof imgList[0] !== 'undefined') {
        let data = imgList[0].src;
        let filename = await upload(data);
        imgList[0].src = "/uploads/"+ filename;
    } */

    // Save content
    let editor = document.querySelector('#quillEditor .ql-editor');
    let value = encodeURIComponent(editor.innerHTML.toString());
    if (value === '') throw new Error('Please fill out all fields');
    document.querySelector('input[name=content]').value = value;
}


function redirect(url) {
    let a = document.createElement('a')
    a.href=url;
    a.click();
}

function isValid(form) {
    let isFormValid = form.reportValidity();
    let hasContent = document.querySelector('#quillEditor .ql-editor').innerText.trim() !== '';
    
    if (!hasContent) return alert('Please fill in the content field.');
    
    return isFormValid && hasContent;
}