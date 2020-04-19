import config from '../config';
import Neode from 'neode';

const instance = Neode.fromEnv();
instance.with({
    User: require('../models/User.model').User,
    Post: require('../models/Post.model').Post,
    Comment: require('../models/Comment.model').Comment
})

export default {
    instance: instance,
    close: () => instance.close()
}