import config from '../config';
import Neode from 'neode';

const instance = Neode.fromEnv();
instance.with({
    User: require('../models/User.model').User
})

export default {
    instance: instance,
    close: () => instance.close()
}