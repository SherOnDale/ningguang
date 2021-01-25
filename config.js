if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

module.exports = {
    botToken: process.env.BOT_TOKEN || '',
    prefix: process.env.PREFIX || 'n!',
    mongoUrl: process.env.MONGO_URL || '',
    ownerId: '361985924571332618',
    retardedId: '407131163958837259'
}