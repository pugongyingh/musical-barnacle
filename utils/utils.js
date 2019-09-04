const fs = require('fs');
const path = require('path');

const generateId = function() {
    // Generate a semi-unique id
    return '_' + Math.random().toString(36).substr(2, 9);
}

function error(type, obj, title) {
    const errorType = ['invalid', 'missing'];

    let errorMsg;
    switch(type) {
        case 0:
            errorMsg = `invalid type \`${typeof obj}\` for ${title}`
    }

    throw new Error({
        type: errorType[type],
        msg: errorMsg
    });
}

const validatePost = function(post) {
    let errors = [],
        type = ['invalid', 'missing value'];
    if(!post) throw new Error('missing parameter');
    if(typeof post.title !== 'string') throw new Error('Invalid type');
    if(typeof post.author !== 'string') throw new Error('Invalid type');
    if(typeof post.content !== 'string') throw new Error('Invalid type');
    if(typeof post.pub_date !== typeof Date) throw new Error('Invalid type');
    if(typeof post.thumbnail !== 'string') throw new Error('Invalid type');

    var imgExtension = post.thumbnail.split('.')[1];
    var extArray = ['png', 'jpg', 'jpeg'];
    if(!extArray.includes(imgExtension)) throw new Error('Invalid thumbnail');

    // var imgExists = fs.existsSync(path.join(__dirname, '../public/uploads', post.thumbnail));
    // console.log(imgExists);
    return errors;
}

module.exports= {
    generateId,
    validatePost
}