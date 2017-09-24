import Nanobar from 'nanobar';

const options = {
    classname: 'my-class',
    id: 'my-id',
    target: document.getElementById('root')
};

let nanobar = null;
const getNanobar = () => {
    if (!nanobar) {
        nanobar = new Nanobar(options);
    }
    return nanobar;
}

export const start = {
    applyMiddleware(req, next) {
        getNanobar().go(10);
        next();
    }
};

export const done = {
    applyAfterware(req, next) {
        getNanobar().go(100);
        next();
    }
}

export default { start, done };
