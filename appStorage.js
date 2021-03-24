class AppStorage {
    constructor(appName) {
        var prefix = (appName ? appName + "." : "");
        this.localStorageSupported = (('localStorage' in window) && window['localStorage']);

        this.setValue = function(key, val) {
            if (this.localStorageSupported)
                localStorage.setItem(prefix + key, JSON.stringify(val));
            return this;
        }

        this.getValue = function(key) {
            if (this.localStorageSupported)
                return JSON.parse(localStorage.getItem(prefix + key));
            return null;
        }

        this.removeValue = function(key) {
            if (this.localStorageSupported)
                JSON.parse(localStorage.removeItem(prefix + key));
        }

        this.removeAll = function() {
            var keys = this.getKeys();
            for (var i in keys) {
                this.remove(keys[i]);
            }
            return this;
        }

        this.getKeys = function(filter) {
            var keys = [];
            if (this.localStorageSupported) {
                for (var key in localStorage) {
                    if (isAppKey(key)) {
                        if (prefix) key = key.slice(prefix.length);
                        if (!filter || filter(key)) keys.push(key);
                    }
                }
            }
            return keys;
        }

        this.isAppKey = function(key) {
            if (prefix) return key.indexOf(prefix) == 0;
            return true;
        }

        this.contains = function(key) {
            return this.get(key) != null;
        }
    }
}
