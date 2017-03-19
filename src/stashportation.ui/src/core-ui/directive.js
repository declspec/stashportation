export function directive(ctor) {
    var inject = ctor.dependencies || ctor.prototype.dependencies;
    if (!inject) 
        return () => new ctor();

    var factory = function() { return new ctor(...arguments); };
    factory.$inject = inject;
    return factory;
}