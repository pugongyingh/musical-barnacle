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
            let id = document.querySelector('[name=_id]').value;
            document.getElementById('editForm').remove()
            
            var xhr = new XMLHttpRequest();
            
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                console.log(this.responseText);
              }
            });
            
            xhr.open("DELETE", `/api/${id}`);
            xhr.send();

            redirect('/admin')
        }
    })
}

if(document.getElementById('editForm')) {
    document.getElementById('editForm').addEventListener('submit', ev => {
        ev.preventDefault();
        if(confirm('Save this post?')) {
            processQuill();
            let obj = {},
                data = new FormData(ev.target).entries();
            [...data].forEach(arr => obj[arr[0]] = arr[1]);

            var xhr = new XMLHttpRequest();
            var urlEncodedData = `title=${obj.title}&content=${obj.content}&author=${obj.author}&pub_date=${obj.pub_date}`;
            
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                console.log(this.responseText);
              }
            });
            
            xhr.open("PUT", `/api/${obj._id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("cache-control", "no-cache");

            xhr.send(urlEncodedData);
            redirect('/admin')
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