var setNotification = function (req, notify, Type = null, Message = null) {

    var notification = {
        toNotify: false,
        type: null,
        message: null
    }    

    notification.toNotify = notify;
    notification.type = Type;
    notification.message = Message;
    req.session.notification = notification;
}

module.exports = setNotification;