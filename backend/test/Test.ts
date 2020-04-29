declare var require: any
const { app, exit } = require('../lib/index');
import actions from './actions';

let T = {
    log:true,
    app:app,
    exit: exit,
    actions: actions,
    globals: {
        USER: {},
        POST: {},
        REPLY: {},
        PLANT: {},
        DEVICE: {}
    },
} as any;

T.globals.ALT = Object.assign({}, T.globals)

//after every integration T
T.finish = () => {
    // console.log(T.globals)
    T.clearVars();
    T.exit();
}

T.set = (key:string, value:any, asAlt:boolean) => {
    if(asAlt) {
        T.globals.ALT[key] = value;
        return
    }
    T.globals[key] = value;
} 

T.get = (key:string, asAlt:boolean) => {
    if(asAlt) {
        return T.globals.ALT[key];
    }
    return T.globals[key];
}

T.clearVars = () => {
    Object.keys(T.globals).forEach(key => {
        T.set(key, undefined);
    })
}
export default T;