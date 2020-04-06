({
    updateFlowData: function (component, event, helper) {
        if (event.getParam('startTime')) {
            component.set('v.startTime', event.getParam('startTime'));
        } else if (event.getParam('duration')) {
            component.set('v.duration', event.getParam('duration'));
        } else if (event.getParam('addedMsgText')) {
            component.set('v.addedMsgText', event.getParam('addedMsgText'));
            component.set(
                'v.msgText',
                component.get('v.defaultMsg') +
                    ' ' +
                    event.getParam('addedMsgText')
            );
        }
    }
});
