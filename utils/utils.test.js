const utils = require('./utils');

describe('checking genereateId function', () => {
    test('generateId function exists', () => {
        expect(utils.generateId()).toBeDefined();
    })

    test('id\'s are unique', () => {
        expect(utils.generateId()).not.toBe(utils.generateId());
    })
})

describe('checking validatePost function', () => {
    let example = {
        title: "Title",
        author: 'Author',
        content: "blah",
        pub_date: Date.now,
        thumbnail: "_nkasdlk.png"
    }

    test('validatePost function exists', () => {
        expect(utils.validatePost).toBeDefined();
    })
    
    test('parameter should be defined', () => {
        expect(utils.validatePost).toThrow('missing parameter');
    })

    test('object param should be include all variables', () => {
        expect(() => utils.validatePost({title: example.title})).toThrow("Invalid type");
    })

    test('valid object should validate', () => {
        expect(() => utils.validatePost(example)).not.toThrow();
    })

    test('invalid thumbnail should not validate', () => {
        expect(() => utils.validatePost({...example, thumbnail: "_naskdlc.md"})).toThrow("Invalid thumbnail");
    })
})
