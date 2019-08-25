if(document.getElementById('addForm')) {
    document.getElementById('addForm').addEventListener('submit', ev => {
        ev.preventDefault();
        processQuill();
        if(confirm('Create this post?')) ev.target.submit();
    })
}

if(document.getElementById('deleteBtn')) {
    document.getElementById('deleteBtn').addEventListener('click', ev => {
        if(confirm('Delete this post?')) {
            ev.preventDefault();
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
        if(confirm('Save this post?')) {
            processQuill();
            let data = {},
                formData = new FormData(ev.target).entries();
            [...formData].forEach(arr => data[arr[0]] = arr[1]);

            console.log(data);
            fetch(ev.target.action, {method: "PUT", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})
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


function processQuill() {
    let value = encodeURIComponent(document.querySelector('#quillEditor .ql-editor').innerHTML.toString());
    document.querySelector('input[name=content]').value = value;
}


function redirect(url) {
    let a = document.createElement('a')
    a.href=url;
    a.click();
}