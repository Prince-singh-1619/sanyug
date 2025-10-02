const pushNotification = (title, body) =>{
    if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            body: body,
            icon: '/logo.png',
        });

        setTimeout(() => notification.close(), 5000);
    }
}

export default pushNotification