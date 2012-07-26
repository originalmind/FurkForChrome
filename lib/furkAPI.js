var FurkAPI = (function () {

    /// Privileged methods
    // Create, configure, and send XMLHttpRequest
    this.sendRequest = function (method, url, async, callback) {

        var req = new XMLHttpRequest();

        req.open(method, url, async);
        req.onload = callback;
        req.send(null);

        return req;
    }

    /// Privileged methods
    // Send request to API
    //this.spawnRequest = function(method, url, async, callback) {
    //    return sendRequest(method, url, async, callback);
    //}

    // Build API REST URL
    this.apiUrl = function (endPoint) {
        var furkApiKey = localStorage["furkForChrome_apiKey"];
        if (!furkApiKey) {
            return "http://api.furk.net/api/" + endPoint + "?";
        } else {
            return "http://api.furk.net/api/" + endPoint + "?api_key=" + furkApiKey;
        }
    }

    // Add param to API URL
    this.appendApiParam = function (originalApiUrl, paramKey, paramValue) {
        if (originalApiUrl.substr(originalApiUrl.length - 1) === "?") {
            return originalApiUrl += paramKey + "=" + paramValue;
        } else {
            return originalApiUrl += "&" + paramKey + "=" + paramValue;
        }
    }


    /// Public methods
    return {
        FurkLoginUrl: function () {
            return "https://www.furk.net/login";
        },
        FurkApiPage: function () {
            return "https://www.furk.net/t/api";
        },
        searchFurk: function (query, cachedOnly, onLoadCallBack, limit) {
            var req = new XMLHttpRequest();

            var apiCall = apiUrl("search");

            apiCall = appendApiParam(apiCall, "q", query);

            if (limit !== undefined) {
                //apiCall += "&limit=" + limit;
                apiCall = appendApiParam(apiCall, "limit", limit);
            }

            if (cachedOnly) {
                //apiCall += "&filter=cached";
                apiCall = appendApiParam(apiCall, "filter", "cached");
            }

            req.open(
                "GET",
                apiCall,
                true);

            req.onload = onLoadCallBack;
            req.send(null);

            return req;
        },
        addToFurk: function (link, onLoadCallBack) {
            var req = new XMLHttpRequest();

            var apiCall = apiUrl("add_tor");

            if (link.hash === undefined) {
                //apiCall += "url=" + link.url;
                apiCall = appendApiParam(apiCall, "url", link.url);
            } else {
//                apiCall += "info_hash=" + link.hash;
                apiCall = appendApiParam(apiCall, "info_hash", link.hash);
            }

            req.open(
                "GET",
                apiCall,
                true);

            req.onload = onLoadCallBack;
            req.send(null);
        },
        getFinished: function (ids, hash, onLoadCallBack, limit, sort_col, sort_direction) {

            var apiCall = apiUrl("get_files");

            if (ids !== null) {
                // TODO: fix this
//                apiCall += "id=" + ids;
                apiCall = appendApiParam(apiCall, "id", ids);
            }

            if (hash !== null) {
//                apiCall += "info_hash=" + hash;
                apiCall = appendApiParam(apiCall, "info_hash", hash);
            }

            if (limit !== undefined) {
                //                apiCall += "&offset=" + limit;
                apiCall = appendApiParam(apiCall, "offset", limit);
            }

            if (sort_col !== undefined) {
                //                apiCall += "&sort_col=" + sort_col;
                apiCall = appendApiParam(apiCall, "sort_col", sort_col);
            }

            if (sort_direction !== undefined) {
//                apiCall += "&sort_typ=" + sort_direction;
                apiCall = appendApiParam(apiCall, "sort_direction", sort_direction);
            }

            var req = sendRequest("GET",
                                    apiCall,
                                    true,
                                    onLoadCallBack);

        },
        getTorrents: function (id, finishedDate, onLoadCallBack) {

            var apiCall = apiUrl("get_tors");

            if (id !== null) {
                // TODO: fix this
//                apiCall += "id=" + id;
                apiCall = appendApiParam(apiCall, "id", id);
            }

            if (finishedDate !== null) {
                //                apiCall += "finish_dt_gt=" + hash;
                apiCall = appendApiParam(apiCall, "finish_dt_gt", finishedDate);
            }

            var req = sendRequest("GET",
                                    apiCall,
                                    true,
                                    onLoadCallBack);

        }
    };
} ());
