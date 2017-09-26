import {notification} from "antd";

export function openNotificationWithIcon(obj) {
    if (obj.duration === null) {
        console.log(obj.duration)
    } else if (obj.duration) {
        console.log(obj.duration)
    } else {
        obj.duration = 3
    }
    notification.config({
        placement: obj.placement || 'topRight',
        bottom: obj.bottom || 50,
        duration: obj.duration,
    });
    notification[obj.type || 'success']({
        message: obj.message || '',
        description: obj.description || '',
    });
};