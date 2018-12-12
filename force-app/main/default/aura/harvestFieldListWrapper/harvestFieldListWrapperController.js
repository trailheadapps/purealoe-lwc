({
    subscribe: function(component, event) {
        var empApi = component.find('empApi');
        var channel = component.get('v.channel');
        var replayId = -2;
        empApi.subscribe(
            channel,
            replayId,
            $A.getCallback(function(message) {
                component.set('v.empMessage', message);
            })
        );
    }
});
