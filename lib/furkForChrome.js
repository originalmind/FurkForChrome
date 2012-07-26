var FurkForChrome = (function () {

    return {
        notificationTimeOut: function (seconds) {
            return seconds * 1000;
        },
        torrentSites: function () {
            return [
                    '*://*/*.torrent',
                    '*://*/*.torrent?*',
                    'http://www.bt-chat.com/download*.php?id=*',
                    'http://www.kat.ph/torrents/*/',
                    'http://torrentz.eu/*',
                    'http://www.swarmthehive.com/d/*',
                    'magnet:?xt=urn:btih:*'
                    ];
        },
        buildSuccessNotification: function (apiResult) {

            var notificationMessage = "Download ";

            if (apiResult.status == "ok") {
                notificationMessage += " is " + apiResult.torrent.dl_status;
                if (typeof parseInt(apiResult.torrent.size) === 'number') {
                    notificationMessage += ". Size: " + (apiResult.torrent.size / 1048576).toFixed(2) + " MB";
                }
            } else {
                notificationMessage += "failed: " + apiResult.error;

                if (apiResult.error === "access denied") {
                    notificationMessage += ". Please log in at furk.net";
                }
            }

            return notificationMessage;
        },
        buildErrorNotification: function (xhr) {
            return "Sorry, Furk returned an error. Status code: " + xhr.status +
                                        ". Please try again, or check if furk.net is up.";

        },
        parseUrl: function (info) {
            var parse_url = /([a-fA-F0-9]{40})/;
            var result = parse_url.exec(info.linkUrl);

            var link = {};
            link.url = info.linkUrl;
            if (result !== null) {
                link.hash = result[0] || undefined;
            }
            link.text = info.selectionText || ' ';
            link.pageUrl = info.pageUrl;

            return link;
        },
        furkAPIResponse: function (e) {

            switch (e.target.status) {
                case 500:
                    var notificationMessage = FurkForChrome.buildErrorNotification(e.target);
                    break;
                case 200:
                    var notificationMessage = FurkForChrome.buildSuccessNotification(JSON.parse(e.target.responseText));
                    break;
            }

            var notification = webkitNotifications.createNotification(
                'images/icon48.png', "Furk Result", notificationMessage);

            setTimeout(function () {
                notification.cancel();
            }, FurkForChrome.notificationTimeOut(7));

            notification.show();

            return notification;
        },
        createContextMenu: function () {
            var title = "Add to Furk";

            chrome.contextMenus.create({ title: title, contexts: ['link'],
                targetUrlPatterns: this.torrentSites(),
                onclick: function (info, tab) {
                    var req = FurkAPI.addToFurk(FurkForChrome.parseUrl(info), FurkForChrome.furkAPIResponse);
                }
            });
        },
        /*
        * Initialise extension
        */
        init: function () {
            this.createContextMenu();
        }
    };
}());

window.addEventListener('DOMContentLoaded', function () {
    FurkForChrome.init();
});
