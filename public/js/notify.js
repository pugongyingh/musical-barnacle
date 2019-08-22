export default async function Notify(config) {
    let {elem, response} = await init(config);
    this.open = () => open(elem);
    this.close = () => close(elem);
}

function init(param) {
    // Process config object
    if(typeof param === Object){
        let title = param.title;
        let msg = param.msg;
        
        if(!title) throw new Error("Please include a `title`!");
        if(!msg) throw new Error("Please include a `message`!");
    } else if(typeof param === String) {
        let msg = param;
        let title = 'Notification';
    } else {
        throw new Error('Parameter must be an `Object` or a `String`!');
    }

    // Create DOM element
    let cont = document.createElement('div'),
        t = document.createElement('p'),
        m = document.createElement('p'),
        btnFail = document.createElement('button'),
        btnSuccess = document.createElement('button');

    // Container
    cont.classList.add('notify');

    // Title
    t.innerText = title;
    t.classList.add('notify__title');
    cont.appendChild(t);

    // Message
    m.innerHTML = msg;
    m.classList.add('notify__body');
    cont.appendChild(m);

    // Button (Failure)
    btnFail.innerText = "Cancel"
    btnFail.classList.add('notify__btn--failure')
    cont.appendChild(btnFail)

    // Button (success)
    btnSuccess.innerText = "Okay"
    btnSuccess.classList.add('notify__btn--success')
    cont.appendChild(btnSuccess)

    btnFail.addEventListener('click', () => {
        document.body.removeChild(cont);
    });

    btnSuccess.addEventListener('click', () => {
        document.body.removeChild(cont);
    });

    return cont;
}

function open(elem) {
    return new Promise((resolve, reject) => {
        if(!elem) reject(new Error ('Modal was not initialized properly.'));
        document.body.appendChild(elem);
    })
}

function close(elem) {
    if(!elem) throw new Error ('Modal was not initialized properly.')
    document.body.removeChild(elem);
    return true;
}