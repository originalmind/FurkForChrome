/// <reference path="dev/chrome-api-vsdoc.js"/>
/// <reference path="dev/jquery-1.7.1-vsdoc.js"/>
/*
* Browser action panel
*/

//$("#spinner").show();

//var req = FurkAPI.searchFurk("the office", true, showSearchResults);
//req.onload = showSearchResults;
//req.send(null);

var FurkForChromePanel = (function () {

    /// Private methods
    function showFinishedList(xhr) {

        var response = xhr.target;

        if (response.statusText !== "OK") {
            return;
        }

        var apiResponse = JSON.parse(response.responseText);

        switch (apiResponse.error) {
            case "access denied":
                //$("#finished-list").append("<p>Please <a href=\"https://www.furk.net/login\">log in</a> to Furk.</p>");
                $("#finished-list").append(make(["p", "Please ", 
                    ["a", 
                        {   href: "#" ,
                            onclick: "showURL('" + FurkAPI.FurkLoginUrl + "')" 
                        }, 
                        "log in"], " to Furk."]));
                //                $("#finished-list").append("<p>", 
                //                    "Please ",
                //                    $("<a>").click("showURL('" + FurkAPI.FurkLoginUrl + "')")
                //                {
                //                    text: "Please"
                //                };
                break;
        }

        var sortedFiles = [];

        if (apiResponse.files !== undefined && apiResponse.files.length > 0) {
            //            sortedFiles = apiResponse.files.sort(function (a, b) {
            //                return a.id - b.id;
            //            });
            sortedFiles = apiResponse.files.reverse();

            var list = document.createElement("ol");
            $("#finished-list").append(list);

            for (var i = 0, furkFile; furkFile = sortedFiles[i]; i++) {
                if (i === FurkForChromePanel.finishedDisplayNum()) {
                    break;
                }
                list.appendChild(constructSearchResult(furkFile));
            }
        }

        //list.appendChild(make(["li", "See all ", ["a", { href: "http://furk.net/users/files/finished" }, "finished files"]]));

        $("#spinner").hide();
    }

    function showActiveList(xhr) {

        var response = xhr.target;

        if (response.statusText !== "OK") {
            return;
        }

        var apiResponse = JSON.parse(response.responseText);

        var filteredTorrents = [];

        if (apiResponse.torrents !== undefined && apiResponse.torrents.length > 0) {
            filteredTorrents = $(apiResponse.torrents).filter(
                function (index) {
                    return (this.dl_status === "active");
                });
        }

        var list = document.createElement("ol");
        //document.body.appendChild(list);
        $("#active-list").append(list);

        for (var i = 0, tor; tor = filteredTorrents[i]; i++) {
            list.appendChild(constructActiveTorrent(tor));
        }

        $("#spinner").hide();
    }

    this.constructSearchResult = function (file) {
        return make(["li", "", ["a", { onclick: "showURL('" + file.url_dl + "')" }, file.name]]);
    }

    this.constructActiveTorrent = function (tor) {
        return make(["li", "", tor.name, " - ", tor.have, " %", " - ", tor.active_status]);
    }

    /// Sort files by ID descending
    //this.furkFileCompare = function (a, b) {
    //    if (a.id < b.id) { return 1; }
    //    if (a.id > b.id) { return -1; }
    //    return 0;
    //}

    return {
        finishedDisplayNum: function () {
            return 10;
        },
        showFinished: function () {
            $("#finished-list").empty();
            FurkAPI.getFinished(null, null, showFinishedList, 10, 'ctime', 'desc');
        },
        showActive: function () {
            $("#active-list").empty();
            FurkAPI.getTorrents(null, null, showActiveList);
        },
        show: function () {
            $("#spinner").show();

            $("#finished").toggle();
            $("#active").toggle();

            if ($("#active").is(":visible")) {
                FurkForChromePanel.showActive();
            } else {
                FurkForChromePanel.showFinished();
            }

            return false;
        }
    };
} ());



