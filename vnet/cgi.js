var DEBUG = 1;

function Login(option) {
    if (option == 1) {
        $("#login_user").val("guest");
        $("#login_pwd").val("guest");
        $("#login").submit()
    }
    if ($("#login_user").val() == "" || $("#login_pwd").val() == "") {
        alert($("#error_empty").html());
        return false
    } else {
        var random = Math.random();
        var user = $("#login_user").val();
        var password = hex_md5($("#login_pwd").val());
        var lang = $("#sel_lang").val();
        var flag = 0;
        $.ajax({
            url: "/cgi-bin/login.cgi",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                User: user,
                Pwd: password,
                Random: random
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!DEBUG) {
                    alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                }
            },
            success: function(json) {
                var data = eval(json);
                if (data.State == -5) {
                    alert($("#error_user").html());
                    flag = 0
                } else {
                    if (data.State == -6) {
                        alert($("#error_pwd").html());
                        flag = 0
                    } else {
                        if (data.State == 1) {
                            if (option == 2) {
                                if (data.Auth == "1") {
                                    try {
                                        delCookie("lang");
                                        delCookie("user");
                                        delCookie("auth");
                                        delCookie("random");
                                        setCookie("lang", lang);
                                        setCookie("user", user);
                                        setCookie("auth", data.Auth);
                                        setCookie("random", data.Random)
                                    } catch (e) {
                                        alert("ç™»é™†æ—¶è®¤è¯é”™è¯¯ï¼Œè¯·é‡æ–°ç™»å½•ï¼š" + e)
                                    }
                                    wirteLogCGI("Sign in", 1);
                                    flag = 1
                                } else {
                                    alert($("#error_auth").html());
                                    flag = 0
                                }
                            } else {
                                try {
                                    delCookie("lang");
                                    delCookie("user");
                                    delCookie("auth");
                                    delCookie("random");
                                    setCookie("lang", lang);
                                    setCookie("user", user);
                                    setCookie("auth", data.Auth);
                                    setCookie("random", data.Random)
                                } catch (e) {
                                    alert("ç™»å½•æ—¶è®¤è¯é”™è¯¯ï¼Œè¯·é‡æ–°ç™»å½•ï¼š" + e)
                                }
                                wirteLogCGI("Sign in", 1);
                                flag = 1
                            }
                        }
                    }
                }
            }
        });
        if (flag == 1) {
            return true
        } else {
            return false
        }
    }
}

function signOutCGI() {
    var user = getCookie("user");
    var random = getCookie("random");
    alertify.set({
        labels: {
            ok: $("#signOut").html(),
            cancel: $("#cancel").html()
        },
        delay: 5000,
        buttonReverse: false,
        buttonFocus: "ok"
    });
    alertify.confirm($("#currentUser").html() + getCookie("user"), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/signOut.cgi",
                type: "POST",
                dataType: "JSON",
                data: {
                    User: user,
                    Random: random
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == -1) {
                        wirteLogCGI("Sign out", 1);
                        window.location.href = "/index.html";
                        alertify.success($("#success").html())
                    } else {
                        if (data.State == 1) {
                            try {
                                delCookie("lang");
                                delCookie("user");
                                delCookie("auth");
                                delCookie("random")
                            } catch (e) {
                                wirteLogCGI("Sign out", 0);
                                alert("error sign outï¼š" + e)
                            }
                            wirteLogCGI("Sign out", 1);
                            window.location.href = "/index.html";
                            alertify.success($("#success").html())
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function loadAntType() {
    $.ajax({
        url: "/xml/ant.xml",
        async: false,
        type: "POST",
        dataType: "XML",
        data: {},
        error: function(a, c, b) {
            if (!DEBUG) {
                alert(a.status + ", " + a.readyState + ", " + c)
            }
        },
        success: function(b) {
            var a = "";
            $(b).find("type").each(function() {
                a += '<option value="' + $(this).find("name").text() + "," + $(this).find("la_n").text() + "," + $(this).find("la_e").text() + "," + $(this).find("la_u").text() + '">' + $(this).find("name").text() + "</option>"
            });
            $("#antType").append(a)
        }
    })
}

function loadDifferentialType() {
    var c = getCookie("Type");
    var d = getCookie("BoardUsed");
    var b = c.substr(-3, 1);
    var a = c.substr(-2, 1);
    $.ajax({
        url: "/xml/unicore.xml",
        async: false,
        type: "POST",
        dataType: "XML",
        data: {},
        error: function(e, g, f) {
            if (!DEBUG) {
                alert(e.status + ", " + e.readyState + ", " + g)
            }
        },
        success: function(f) {
            var e = "";
            $(f).find("name").each(function() {
                if ((d == "1" && b == "T") || (d == "2" && a == "T")) {} else {
                    if ((d == "1" && b == "B") || (d == "2" && a == "B")) {
                        if (($(this).text() == "sCMRx") || ($(this).text() == "CMR+") || ($(this).text() == "RTCM2.4(RTK)") || ($(this).text() == "RTCM2.4(RTD)") || ($(this).text() == "RTCM2.3(RTD)") || ($(this).text() == "BINEX")) {
                            return true
                        }
                    } else {
                        if ((d == "1" && b == "U") || (d == "2" && a == "U")) {
                            if (($(this).text() == "sCMRx") || ($(this).text() == "CMR+") || ($(this).text() == "RTCM2.3(RTD)") || ($(this).text() == "RTCM2.4(RTK)") || ($(this).text() == "BINEX")) {
                                return true
                            }
                        } else {
                            if ((d == "1" && b == "N") || (d == "2" && a == "N")) {
                                if (($(this).text() == "sCMRx") || ($(this).text() == "CMR+") || ($(this).text() == "RTCM2.4(RTK)")) {
                                    return true
                                }
                            } else {
                                if ($(this).text() == "sCMRx") {
                                    return true
                                }
                            }
                        }
                    }
                }
                e += '<option value="' + $(this).text() + '">' + $(this).text() + "</option>"
            });
            $("#differentialType").append(e);
            $("#diff2Type").append(e)
        }
    })
}

function setLanguageCGI(b, c) {
    var a = new Array();
    $.ajax({
        type: "GET",
        async: false,
        url: "/xml/" + b,
        dataType: "xml",
        error: function(d, f, e) {
            if (!DEBUG) {
                alert(d.status + ", " + d.readyState + ", " + f)
            }
        },
        success: function(d) {
            $(d).find("text").each(function() {
                var e = $(this).attr("id");
                var f = $(this).find(c).text();
                a[e] = f
            });
            if (b == "main.xml" || b == "index.xml" || b == "update.xml" || b == "UpdateBoard.xml") {
                $.each($("*"), function() {
                    if ($(this).attr("name") != null) {
                        $(this).fadeOut(20).fadeIn(1000).text(a[$(this).attr("name")])
                    }
                })
            } else {
                $.each($("*", (document.getElementById("iframe_main").contentWindow.document.body)), function() {
                    if ($(this).attr("name") != null) {
                        if ($(this).attr("name") == "reset") {
                            $(this).fadeOut(20).fadeIn(1000).val(a[$(this).attr("name")])
                        } else {
                            $(this).fadeOut(20).fadeIn(1000).text(a[$(this).attr("name")])
                        }
                    }
                })
            }
        }
    })
}

function setLanguageCGI2(b, c) {
    var a = new Array();
    $.ajax({
        type: "GET",
        async: false,
        url: "/xml/" + b,
        dataType: "xml",
        error: function(d, f, e) {
            if (!DEBUG) {
                alert(d.status + ", " + d.readyState + ", " + f)
            }
        },
        success: function(d) {
            $(d).find("text").each(function() {
                var e = $(this).attr("id");
                var f = $(this).find(c).text();
                a[e] = f
            });
            $.each($("*"), function() {
                if ($(this).attr("name") != null) {
                    if ($(this).attr("name") == "reset") {
                        $(this).fadeOut(20).fadeIn(1000).val(a[$(this).attr("name")])
                    } else {
                        $(this).fadeOut(20).fadeIn(1000).text(a[$(this).attr("name")])
                    }
                }
            })
        }
    })
}

function checkAuthCGI(user, random, pageType) {
    var auth = 0;
    if ((user == null) && (getCookie("auth") == null) && (random == null)) {
        if (pageType == 0) {
            window.location.href = "/index.html"
        } else {
            if (pageType == 1) {
                window.parent.location.href = "/index.html"
            } else {
                window.location.href = "/update.html"
            }
        }
    }
    $.ajax({
        type: "POST",
        url: "/cgi-bin/read.cgi",
        async: false,
        dataType: "json",
        data: {
            User: user,
            Random: random,
            Options: "checkAuth"
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            var lang = getCookie("lang");
            if (data.State == -1) {
                wirteLogCGI("Check Authentication", 0);
                if (lang == "zh") {
                    alert("è®¤è¯æ–‡ä»¶ä¸å­˜åœ¨ï¼Œè¯·é‡æ–°ç™»å½•")
                } else {
                    alert("Authentication file does not exist, please sign in again")
                }
                if (pageType == 0) {
                    window.location.href = "/index.html"
                } else {
                    if (pageType == 1) {
                        window.parent.location.href = "/index.html"
                    } else {
                        window.location.href = "/update.html"
                    }
                }
            } else {
                if (data.State == -2) {
                    wirteLogCGI("Check Authentication", 0);
                    if (lang == "zh") {
                        alert("IPåœ°å€ä¸å¯¹åº”ï¼Œè¯·é‡æ–°ç™»å½•")
                    } else {
                        alert("The corresponding IP address does not exist, please sign in again")
                    }
                    if (pageType == 0) {
                        window.location.href = "/index.html"
                    } else {
                        if (pageType == 1) {
                            window.parent.location.href = "/index.html"
                        } else {
                            window.location.href = "/update.html"
                        }
                    }
                } else {
                    if (data.State == -3) {
                        wirteLogCGI("Check Authentication", 0);
                        if (lang == "zh") {
                            alert("æµè§ˆå™¨ä¸å¯¹åº”ï¼Œè¯·é‡æ–°ç™»å½•")
                        } else {
                            alert("The corresponding browser does not exist, please sign in again")
                        }
                        if (pageType == 0) {
                            window.location.href = "/index.html"
                        } else {
                            if (pageType == 1) {
                                window.parent.location.href = "/index.html"
                            } else {
                                window.location.href = "/update.html"
                            }
                        }
                    } else {
                        if (data.State == 1) {
                            auth = data.Auth
                        }
                    }
                }
            }
        }
    });
    return auth
}

function setFastCGI() {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        data: {},
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                alert("è¯·æ±‚æˆåŠŸ")
            } else {
                if (data.State == -1) {
                    alert("è®¤è¯æ–‡ä»¶ä¸å­˜åœ¨ï¼Œæˆ–ä½ æ²¡æœ‰æ“ä½œæƒé™")
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        alert("è®¤è¯é”™è¯¯ï¼Œè¯·é‡æ–°ç™»å½•")
                    } else {
                        if (data.State == -5) {
                            alert("å‡ºé”™ï¼Œæ“ä½œæ•°ä¸ºç©º")
                        } else {
                            if (data.State == -100) {
                                alert("å‡ºé”™ï¼Œæ•°æ®åº“å†™å…¥é”™è¯¯")
                            }
                        }
                    }
                }
            }
        }
    })
}

function setElevCGI() {
    var type = getCookie("BoardType").split("-");
    BoardUsed = 1;
    var board_Type1 = type[0];
    var board_Type2 = type[1];
    if ((board_Type1 == "H" && BoardUsed == "1") || (board_Type2 == "H" && BoardUsed == "0")) {
        alert($("#authTip4").html());
        return 0
    }
    if ($("#elev_val").html() == "") {
        alert($("#empty").html());
        return 0
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "Elev",
            User: getCookie("user"),
            Random: getCookie("random"),
            BoardUsed: 1,
            ElevAngle: $("#elev_val").html(),
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P302,setElev", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P302,setElev,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P302,setElev,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P302,setElev,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P302,setElev,sqliteError", 0);
                                alert($("#sqliteError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function setSatelliteCGI() {
    var type = getCookie("BoardType").split("-");
    BoardUsed = 1;
    var board_Type1 = type[0];
    var board_Type2 = type[1];
    if ((board_Type1 == "H" && BoardUsed == "1") || (board_Type2 == "H" && BoardUsed == "0")) {
        alert($("#authTip4").html());
        return 0
    }
    if ($("#elev_val").html() == "" || $("#GPSEnabled").val() == "" || $("#BDSEnabled").val() == "" || $("#GLOEnabled").val() == "" || $("#GALEnabled").val() == "") {
        alert($("#empty").html());
        return 0
    }
    if ($("#GPSEnabled").val() == "0" && $("#BDSEnabled").val() == "0" && $("#GLOEnabled").val() == "0" && $("#GALEnabled").val() == "0") {
        alert($("#gnssempty").html());
        return 0
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "satellite",
            User: getCookie("user"),
            Random: getCookie("random"),
            BoardUsed: 1,
            ElevAngle: $("#elev_val").html(),
            GPSEnabled: $("#GPSEnabled").val(),
            BDSEnabled: $("#BDSEnabled").val(),
            GLOEnabled: $("#GLOEnabled").val(),
            GALEnabled: $("#GALEnabled").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P302,setSatellite", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P302,setSatellite,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P302,setSatellite,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P302,setSatellite,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P302,setSatellite,sqliteError", 0);
                                alert($("#sqliteError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function setStationCGI() {
    var RgxB = /^(?:(?:(?:\d|[0-8]\d):(?:\d|[0-5]\d|60):(?:(?:\d|[0-5]\d|60)(?:\.\d{0,8})?)|(?:90:00?:00?(?:.0{0,8})?))(?:N|S))?$/;
    var RgxL = /^(?:(?:(?:0{0,2}\d|0?\d\d|1[0-7]\d):(?:\d|[0-5]\d|60):(?:(?:\d|[0-5]\d|60)(?:\.\d{0,8})?)|(?:180:00?:00?(?:.0{0,8})?))(?:E|W))?$/;
    var RgxH = /^[+-]?(?:[1-9]\d*|0)(?:\.\d*)?$/;
    var RegAnt = /^\w{4,16}$/;
    if ($("#RTKMode").val() == 1) {
        if ($("#antAttenuation").val() == "" || $("#antType").val() == "" || $("#antHeight").val() == "" || $("#RTKMode").val() == "" || $("#differentialType").val() == "" || $("#ephemerisInterval").val() == "" || $("#differentialInterval").val() == "" || $("#diff2Type").val() == "" || $("#diff2Interval").val() == "" || $("#latitude").val() == "" || $("#longitude").val() == "" || $("#altitude").val() == "") {
            alert($("#empty").html());
            return 0
        }
    } else {
        if ($("#antAttenuation").val() == "" || $("#GGAInterval").val() == "" || $("#antType").val() == "" || $("#antHeight").val() == "" || $("#RTKMode").val() == "" || $("#differentialType").val() == "" || $("#ephemerisInterval").val() == "" || $("#differentialInterval").val() == "" || $("#diff2Type").val() == "") {
            alert($("#empty").html());
            return 0
        }
    }
    if ($("#RTKMode").val() == "1") {
        if (!RgxH.test($("#antHeight").val())) {
            alert($("#stationTip1").html());
            return 0
        }
        if (!RgxB.test($("#latitude").val().trim())) {
            alert($("#stationTip2").html());
            return 0
        }
        if (!RgxL.test($("#longitude").val().trim())) {
            alert($("#stationTip3").html());
            return 0
        }
        if (!RgxH.test($("#altitude").val().trim())) {
            alert($("#stationTip4").html());
            return 0
        }
    }
    if ($("#antHeight").val() < 0) {
        alert($("#stationTip1").html());
        return 0
    }
    var antParameters = $("#antType").val().split(",");
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "station",
            User: getCookie("user"),
            Random: getCookie("random"),
            BoardUsed: 1,
            antAttenuation: $("#antAttenuation").val(),
            ant_name: antParameters[0],
            ant_la_n: antParameters[1],
            ant_la_e: antParameters[2],
            ant_la_u: antParameters[3],
            antHeight: $("#antHeight").val(),
            RTKMode: $("#RTKMode").val(),
            differentialType: $("#differentialType").val(),
            ephemerisInterval: $("#ephemerisInterval").val(),
            differentialInterval: $("#differentialInterval").val(),
            GGAInterval: $("#GGAInterval").val(),
            diff2Type: $("#diff2Type").val(),
            diff2Interval: $("#diff2Interval").val(),
            latitude: $("#latitude").val(),
            longitude: $("#longitude").val(),
            altitude: $("#altitude").val(),
            psrsmooth: $("#psrsmooth").val(),
            baseID: $("#baseID").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P401,setStation", 1);
                alert($("#success").html());
                cancelTables("BXNavigation_content")
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P401,setStation,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P401,setStation,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P401,setStation,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P401,setStation,sqliteError", 0);
                                alert($("#sqliteError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function setCom232CGI() {
    if ($("#com232Enabled").val() == "" || $("#com232Link").val() == "" || $("#com232Baud").val() == "" || $("#com232DataBits").val() == "" || $("#com232StopBits").val() == "" || $("#com232ParityBits").val() == "" || $("#com232DataFormat").val() == "" || $("#com232Interval").val() == "" || $("#com232NMEAoutput").val() == "") {
        alert($("#empty").html());
        return 0
    }
    com232NMEAOutType = "";
    if ("13" == $("#com232DataFormat").val()) {
        arr = $("#com232NMEAoutput").val();
        if (null != arr) {
            for (i = 0; i < arr.length; i++) {
                com232NMEAOutType += arr[i] + ","
            }
        }
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "com232",
            User: getCookie("user"),
            Random: getCookie("random"),
            com232Enabled: $("#com232Enabled").val(),
            com232Link: $("#com232Link").val(),
            com232Baud: $("#com232Baud").val(),
            com232DataBits: $("#com232DataBits").val(),
            com232StopBits: $("#com232StopBits").val(),
            com232ParityBits: $("#com232ParityBits").val(),
            com232DataFormat: $("#com232DataFormat").val(),
            com232Interval: $("#com232Interval").val(),
            com232NMEAOutType: com232NMEAOutType,
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P601,setCom232", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P601,setCom232,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P601,setCom232,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P601,setCom232,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P601,setCom232,sqliteError", 0);
                                alert($("#sqliteError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function setCom485CGI() {
    if ($("#com485Enabled").val() == "" || $("#com485Link").val() == "" || $("#com485Baud").val() == "" || $("#com485DataBits").val() == "" || $("#com485StopBits").val() == "" || $("#com485ParityBits").val() == "" || $("#com485DataFormat").val() == "" || $("#com485Interval").val() == "" || $("#com485NMEAoutput").val() == "") {
        alert($("#empty").html());
        return 0
    }
    com485NMEAOutType = "";
    if ("13" == $("#com485DataFormat").val()) {
        arr = $("#com485NMEAoutput").val();
        if (null != arr) {
            for (i = 0; i < arr.length; i++) {
                com485NMEAOutType += arr[i] + ","
            }
        }
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "com485",
            User: getCookie("user"),
            Random: getCookie("random"),
            com485Enabled: $("#com485Enabled").val(),
            com485Link: $("#com485Link").val(),
            com485Baud: $("#com485Baud").val(),
            com485DataBits: $("#com485DataBits").val(),
            com485StopBits: $("#com485StopBits").val(),
            com485ParityBits: $("#com485ParityBits").val(),
            com485DataFormat: $("#com485DataFormat").val(),
            com485Interval: $("#com485Interval").val(),
            com485NMEAOutType: com485NMEAOutType,
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P601,setCom485", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P601,setCom485,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P601,setCom485,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P601,setCom485,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P601,setCom485,sqliteError", 0);
                                alert($("#sqliteError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function setTransmitCGI(operation) {
    if (isTransmitOperationEmpty(operation, $("#transmitProtocol").val()) == -1) {
        return -1
    } else {
        if ($("#transmitProtocol").val() == 2) {
            $("#transmitGroup").val($("#transmitSource").val().substr(0, 7));
            $("#transmitTeam").val($("#transmitSource").val().substr(7, 3))
        }
        NMEAOutType = "";
        if ("13" == $("#transmitFormat").val()) {
            arr = $("#NMEAoutput").val();
            if (null != arr) {
                for (i = 0; i < arr.length; i++) {
                    NMEAOutType += arr[i] + ","
                }
            }
        }
        $.ajax({
            url: "/cgi-bin/set.elf",
            type: "POST",
            async: false,
            dataType: "JSON",
            data: {
                Options: "Transmit",
                User: getCookie("user"),
                Random: getCookie("random"),
                transmitOperation: operation,
                transmitEnabled: $("#transmitEnabled").val(),
                transmitEncryption: $("#transmitEncryption").val(),
                transmitMethod: $("#transmitMethod").val(),
                transmitProtocol: $("#transmitProtocol").val(),
                transmitFormat: $("#transmitFormat").val(),
                transmitInterval: $("#transmitInterval").val(),
                transmitIP: $("#transmitIP").val(),
                transmitPort: $("#transmitPort").val(),
                transmitGroup: $("#transmitGroup").val(),
                transmitTeam: $("#transmitTeam").val(),
                transmitUser: $("#transmitUser").val(),
                transmitPassword: $("#transmitPassword").val(),
                transmitSource: $("#transmitSource").val(),
                transmitMeteoro: $("#transmitMeteoro").val(),
                transmitMeteoMode: $("#transmitMeteoMode").val(),
                transmitNMEAOutType: NMEAOutType,
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!DEBUG) {
                    alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                }
            },
            success: function(json) {
                var data = eval(json);
                if (data.State == 1) {
                    wirteLogCGI("P602,setTransmit", 1);
                    alert($("#success").html());
                    displayParametersCGI("displayTransmit");
                    cancelTables("set_content")
                } else {
                    if (data.State == -1) {
                        wirteLogCGI("P602,setTransmit,authLost", 0);
                        alert($("#authLost").html())
                    } else {
                        if (data.State == -2 || data.State == -3 || data.State == -4) {
                            wirteLogCGI("P602,setTransmit,authError", 0);
                            alert($("#authError").html())
                        } else {
                            if (data.State == -5) {
                                wirteLogCGI("P602,setTransmit,optionError", 0);
                                alert($("#optionError").html())
                            } else {
                                if (data.State == -100) {
                                    wirteLogCGI("P602,setTransmit,sqliteError", 0);
                                    alert($("#sqliteError").html())
                                } else {
                                    if (data.State == -8) {
                                        wirteLogCGI("P602,setTransmit,sqliteError", 0);
                                        alert($("#Routingconflict").html())
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}

function setRecordCGI(operation) {
    var startDay = $("#startTime").val().split(" ");
    var endDay = $("#endTime").val().split(" ");
    var judge = /[ ]/g;
    if (judge.test($("#recordName").val())) {
        alert($("#recordError3").html());
        return 0
    } else {
        if (!(/^[a-zA-Z0-9_]+$/.test($("#recordName").val()))) {
            alert($("#recordError4").html());
            return 0
        }
    }
    if ($("#recordMethod").val() == 3) {
        if ($("#startTime").val() == "" || $("#endTime").val() == "") {
            alert($("#empty").html());
            return 0
        } else {
            var dayData = startDay[0].split("/");
            var timeData = startDay[1].split(":");
            var startDayData = dayData[0] + dayData[1] + dayData[2] + timeData[0] + timeData[1];
            dayData = endDay[0].split("/");
            timeData = endDay[1].split(":");
            var endDayData = dayData[0] + dayData[1] + dayData[2] + timeData[0] + timeData[1];
            var nowdate = new Date();
            var Month = nowdate.getMonth() + 1;
            var nowDayData = "" + nowdate.getFullYear() + (Month < 10 ? "0" + Month : Month) + (nowdate.getDate() < 10 ? "0" + nowdate.getDate() : nowdate.getDate()) + (nowdate.getHours() < 10 ? "0" + nowdate.getHours() : nowdate.getHours()) + (nowdate.getMinutes() < 10 ? "0" + nowdate.getMinutes() : nowdate.getMinutes());
            if (eval("startDayData - endDayData") > 0) {
                alert($("#dateError").html());
                return 0
            }
        }
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "Record",
            User: getCookie("user"),
            Random: getCookie("random"),
            recordOperation: operation,
            recordEnabled: $("#recordEnabled").val(),
            recordName: $("#recordName").val(),
            recordFormat: $("#recordFormat").val(),
            recordInterval: $("#recordInterval").val(),
            recordMethod: $("#recordMethod").val(),
            recordTimeSelect: $("#recordTimeSelect").val(),
            RecordStartData: startDay[0],
            RecordStartTime: startDay[1],
            RecordEndData: endDay[0],
            RecordEndTime: endDay[1],
            RFBPEnabled: $("#RFBPEnabled").val(),
            FTPEnabled: $("#FtpEnabled").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P501,setRecord", 1);
                alert($("#success").html());
                displayParametersCGI("displayRecord");
                cancelTables("set_content")
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P501,setRecord,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P501,setRecord,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P501,setRecord,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P501,setRecord,sqliteError", 0);
                                alert($("#sqliteError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function setFtpCGI() {
    if ($("#ftpEnabled").val() == "" || $("#ftpAnonymous").val() == "" || $("#ftpIP").val() == "" || $("#ftpUser").val() == "" || $("#ftpPort").val() == "" || $("#ftpPassword").val() == "" || $("#ftpTime").val() == "") {
        alert($("#empty").html());
        return 0
    } else {
        var timeDate = $("#ftpTime").val().split(":")
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "Ftp",
            User: getCookie("user"),
            Random: getCookie("random"),
            ftpEnabled: $("#ftpEnabled").val(),
            ftpAnonymous: $("#ftpAnonymous").val(),
            ftpIP: $("#ftpIP").val(),
            ftpMethod: $("#ftpMethod").val(),
            ftpUser: $("#ftpUser").val(),
            ftpPort: $("#ftpPort").val(),
            ftpPassword: $("#ftpPassword").val(),
            ftpTimeH: timeDate[0],
            ftpTimeM: timeDate[1],
            FTPModel: $("#ftpModel").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P504,setFtp", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P504,setFtp,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P504,setFtp,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P504,setFtp,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P504,setFtp,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P504,setFtp,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function setTimeSwitchCGI() {
    if ($("#systemTimeSwitch") != 1) {
        if ($("#startTime").val() == "" || $("#endTime").val() == "") {
            alert($("#empty").html());
            return 0
        } else {
            var startTimeData = $("#startTime").val().split(":");
            var endTimeData = $("#endTime").val().split(":");
            var startTimeDataI = startTimeData[0] + startTimeData[1];
            var endTimeDataI = endTimeData[0] + endTimeData[1];
            if (eval("startTimeDataI - endTimeDataI") == 0) {
                alert($("#dateError").html());
                return 0
            }
        }
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "TimeSwitch",
            User: getCookie("user"),
            Random: getCookie("random"),
            systemTimeSwitch: $("#systemTimeSwitch").val(),
            startTime: $("#startTime").val(),
            endTime: $("#endTime").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P701,setTimeSwitch", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P701,setTimingSwitch,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P701,setTimingSwitch,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P701,setTimingSwitch,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P701,setTimingSwitch,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P701,setTimingSwitch,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function setSystemCGI(options) {
    setAlertify($("#ok").html(), $("#cancel").html());
    var userAuth = checkAuthCGI(getCookie("user"), getCookie("random"), 1);
    alertify.confirm($("#setTip").html(), function(e) {
        if (e) {
            if (userAuth != 1) {
                alert($("#authLess").html());
                return 0
            } else {
                $.ajax({
                    url: "/cgi-bin/set.elf",
                    type: "POST",
                    dataType: "JSON",
                    async: false,
                    data: {
                        Options: "SystemControl",
                        User: getCookie("user"),
                        Random: getCookie("random"),
                        Method: options
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        if (!DEBUG) {
                            alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                        }
                    },
                    success: function(json) {
                        var data = eval(json);
                        if (data.State == 1) {
                            wirteLogCGI("P701,setSystem", 1);
                            alert($("#success").html());
                            alertify.success($("#success").html())
                        } else {
                            if (data.State == -1) {
                                wirteLogCGI("P701,setSystem,authLost", 0);
                                alert($("#authLost").html())
                            } else {
                                if (data.State == -2 || data.State == -3 || data.State == -4) {
                                    wirteLogCGI("P701,setSystem,authError", 0);
                                    alert($("#authError").html())
                                } else {
                                    if (data.State == -5) {
                                        wirteLogCGI("P701,setSystem,optionError", 0);
                                        alert($("#optionError").html())
                                    } else {
                                        if (data.State == -100) {
                                            wirteLogCGI("P701,setSystem,sqliteError", 0);
                                            alert($("#sqliteError").html())
                                        } else {
                                            if (data.State == -200) {
                                                wirteLogCGI("P701,setSystem,sendSignalError", 0);
                                                alert($("#signalError").html())
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            }
        } else {
            alertify.error($("#return").html())
        }
    })
}

function setPasswordCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip").html(), function(e) {
        if (e) {
            if (isChangePwd() == -1) {
                return 0
            } else {
                var oldPwd = hex_md5($("#oldPwd").val());
                var newPwd = hex_md5($("#newPwd").val());
                $.ajax({
                    url: "/cgi-bin/set.elf",
                    type: "POST",
                    async: false,
                    dataType: "JSON",
                    data: {
                        Options: "ChangePassword",
                        User: getCookie("user"),
                        Random: getCookie("random"),
                        oldPassword: oldPwd,
                        newPassword: newPwd
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        if (!DEBUG) {
                            alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                        }
                    },
                    success: function(json) {
                        var data = eval(json);
                        if (data.State == 1) {
                            wirteLogCGI("P801,setPassword", 1);
                            alert($("#success").html());
                            alertify.success($("#success").html());
                            window.parent.location.href = "/index.html"
                        } else {
                            if (data.State == -1) {
                                wirteLogCGI("P801,setPassword,authLost", 0);
                                alert($("#authLost").html())
                            } else {
                                if (data.State == -2 || data.State == -3 || data.State == -4) {
                                    wirteLogCGI("P801,setPassword,authError", 0);
                                    alert($("#authError").html())
                                } else {
                                    if (data.State == -5) {
                                        wirteLogCGI("P801,setPassword,optionError", 0);
                                        alert($("#optionError").html())
                                    } else {
                                        if (data.State == -100) {
                                            wirteLogCGI("P801,setPassword,sqliteError", 0);
                                            alert($("#sqliteError").html())
                                        } else {
                                            if (data.State == -6) {
                                                wirteLogCGI("P801,setPassword,The old password is wrong", 0);
                                                alert($("#pwdError").html())
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            }
        } else {
            alertify.error($("#return").html())
        }
    })
}

function reclistEnabledCGI(th) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#recordTip2").html(), function(e) {
        if (e) {
            var status;
            if (th.innerHTML == "ç¦ç”¨" || th.innerHTML == "Disabled" || th.innerHTML == "Stop") {
                status = "0"
            } else {
                status = "1"
            }
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "reclistEnabled",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Enabled: status,
                    ID: th.value
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P501,recordingSwitch", 1);
                        alert($("#success").html());
                        displayParametersCGI("displayRecord")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P501,recordingSwitch,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P501,recordingSwitch,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P501,recordingSwitch,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P501,recordingSwitch,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P501,recordingSwitch,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function netlistEnabledCGI(th) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#netTip2").html(), function(e) {
        if (e) {
            var status;
            if (th.innerHTML == "ç¦ç”¨" || th.innerHTML == "Disabled" || th.innerHTML == "Stop") {
                status = "0"
            } else {
                status = "1"
            }
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "netlistEnabled",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Enabled: status,
                    ID: th.value
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P602,transmissionSwitch", 1);
                        alert($("#success").html());
                        displayParametersCGI("displayTransmit")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P602,transmissionSwitch,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P602,transmissionSwitch,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P602,transmissionSwitch,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P602,transmissionSwitch,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P602,transmissionSwitch,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        } else {
                                            if (data.State == -8) {
                                                wirteLogCGI("P602,setTransmit,sqliteError", 0);
                                                alert($("#Routingconflict").html())
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function netlistDeleteCGI(th) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#netTip").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "netlistDelete",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    ID: th.value
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P602,deleteTransmission", 1);
                        alert($("#success").html());
                        displayParametersCGI("displayTransmit")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P602,deleteTransmission,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P602,deleteTransmission,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P602,deleteTransmission,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P602,deleteTransmission,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -6) {
                                            wirteLogCGI("P602,deleteTransmission,deleteTransmissionError", 0);
                                            alert($("#netError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function reclistDeleteCGI(th) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#recordTip").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "reclistDelete",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    ID: th.value
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P501,deleteRecord", 1);
                        alert($("#success").html());
                        displayParametersCGI("displayRecord")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P501,deleteRecord,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P501,deleteRecord,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P501,deleteRecord,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P501,deleteRecord,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -6) {
                                            wirteLogCGI("P501,deleteRecord,deleteRecordError", 0);
                                            alert($("#recordError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function reclistEditCGI(th) {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "reclistEdit",
            User: getCookie("user"),
            Random: getCookie("random"),
            ID: th.value
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            $("#recordEnabled").val(data.Enabled);
            $("#recordName").val(data.Name);
            $("#recordFormat").val(data.Format);
            $("#recordMethod").val(data.Method);
            $("#recordTimeSelect").val(data.Ways);
            $("#startTime").val(data.SDate + " " + data.STime);
            $("#endTime").val(data.EDate + " " + data.ETime);
            var arr = data.elem2.split("");
            $("#RFBPEnabled").val(arr[7]);
            if (data.FTPModel == "1") {
                $("#FtpEnabled").val(arr[6]);
                $("#FtpEnabled").bootstrapSwitch("disabled", false)
            } else {
                $("#FtpEnabled").bootstrapSwitch("state", false);
                $("#FtpEnabled").bootstrapSwitch("disabled", true)
            }
            if ($("#recordFormat").val() == "12") {
                $("#recordInterval").val(data.B1_Com2_Interval)
            } else {
                if ($("#recordFormat").val() == "22") {
                    $("#recordInterval").val(data.B2_Com2_Interval)
                } else {
                    $("#recordInterval").val(data.Interval)
                }
            }
            $("#submit").removeAttr("onclick").unbind("click").click(function() {
                setRecordCGI(data.ID)
            });
            if ($("#recordEnabled").val() == "0") {
                $("#recordEnabled").bootstrapSwitch("state", false)
            } else {
                $("#recordEnabled").bootstrapSwitch("state", true)
            }
            if ($("#RFBPEnabled").val() == "0") {
                $("#RFBPEnabled").bootstrapSwitch("state", false)
            } else {
                $("#RFBPEnabled").bootstrapSwitch("state", true)
            }
            if ($("#FtpEnabled").val() == "0") {
                $("#FtpEnabled").bootstrapSwitch("state", false)
            } else {
                $("#FtpEnabled").bootstrapSwitch("state", true)
            }
            setRecFormatOptions();
            setRecordOptions();
            $("#set_content").slideUp().slideDown()
        }
    })
}

function netlistEditCGI(th) {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "netlistEdit",
            User: getCookie("user"),
            Random: getCookie("random"),
            ID: th.value
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            $("#transmitEnabled").val(data.Enabled);
            $("#transmitEncryption").val(data.Encryption);
            $("#transmitMethod").val(data.Method);
            $("#transmitProtocol").val(data.Protocol);
            $("#transmitFormat").val(data.Format);
            $("#transmitInterval").val(data.Interval);
            $("#transmitIP").val(data.IP);
            $("#transmitPort").val(data.Port);
            $("#transmitGroup").val(data.Group);
            $("#transmitTeam").val(data.Team);
            $("#transmitUser").val(data.User);
            $("#transmitPassword").val(data.Pwd);
            $("#transmitSource").val(data.Source);
            $("#transmitMeteoro").val(data.Elem1);
            $("#transmitMeteoMode").val(data.Elem2);
            $("#submit").removeAttr("onclick").unbind("click").click(function() {
                setTransmitCGI(data.ID)
            });
            if ($("#transmitEnabled").val() == "0") {
                $("#transmitEnabled").bootstrapSwitch("state", false)
            } else {
                $("#transmitEnabled").bootstrapSwitch("state", true)
            }
            if ($("#transmitEncryption").val() == "0") {
                $("#transmitEncryption").bootstrapSwitch("state", false)
            } else {
                $("#transmitEncryption").bootstrapSwitch("state", true)
            }
            if ($("#transmitMeteoro").val() == "0") {
                $("#transmitMeteoro").bootstrapSwitch("state", false)
            } else {
                $("#transmitMeteoro").bootstrapSwitch("state", true)
            }
            setProtocolOptions("edit");
            setDataTypeOptions();
            str = data.NMEAOutType;
            arr = str.split(",");
            $("#NMEAoutput").selectpicker("val", arr);
            $("#NMEAoutput").selectpicker("refresh");
            $("#set_content").slideUp().slideDown()
        }
    })
}

function readRecTimeCGI() {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "readRecTime",
            User: getCookie("user"),
            Random: getCookie("random"),
            Store: $("#storeSelect").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            var innerData = "";
            var filesList = document.getElementById("filesListTable");
            var date = "";
            var year;
            for (var j = 0; j < data.filesVar[0].Count; j++) {
                year = data.filesList[j].year;
                for (var i = 0; i < data.filesList[j].Count; i++) {
                    date = DOYTodate(data.filesList[j].list[i].filesName, year);
                    innerData += "<option value='" + date + "'>" + date + "</option>"
                }
            }
            $("#filesRecTime").html(innerData);
            for (var i = $("#filesListTable tr").length - 1; i >= 0; i--) {
                filesList.deleteRow(i)
            }
            if (data.filesVar[0].Count == 0) {} else {
                $("#filesRecTime").val(DOYTodate(data.filesList[0].list[0].filesName, data.filesList[0].year))
            }
            readStoreFilesCGI()
        }
    })
}

function readStoreFilesCGI(fileList) {
    if ($("#filesRecTime").val() == null) {
        return 0
    } else {
        var DOY = dateToDOY($("#filesRecTime").val());
        var year = $("#filesRecTime").val().split("-")[0];
        $.ajax({
            url: "/cgi-bin/read.elf",
            type: "POST",
            dataType: "JSON",
            data: {
                Options: "readStoreFiles",
                User: getCookie("user"),
                Random: getCookie("random"),
                Store: $("#storeSelect").val(),
                Year: year,
                DOY: DOY
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!DEBUG) {
                    alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                }
            },
            success: function(json) {
                var data = eval(json);
                displayP502(data, fileList)
            }
        })
    }
}

function displayParametersCGI(options) {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: options,
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            switch (data.option[0].State) {
                case "1":
                    displayP201(data);
                    break;
                case "2":
                    displayP501(data);
                    break;
                case "3":
                    displayP602(data);
                    break;
                case "4":
                    displaylocationInfo(data);
                    break;
                case "5":
                    displayP401(data);
                    break;
                case "6":
                    displayP601(data);
                    break;
                case "7":
                    displayP302(data);
                    break;
                case "8":
                    displayP703(data);
                    break;
                case "9":
                    displayP701(data);
                    break;
                case "10":
                    displayRegCode(data);
                    break;
                case "11":
                    displayRemoteCtr(data);
                    break;
                case "12":
                    displaystoreEnabled(data);
                    break;
                case "13":
                    displayFtpPush(data);
                    break;
                case "14":
                    displayBasicInfo(data);
                    break;
                case "16":
                    displayUserList(data);
                    break;
                case "17":
                    displayBoardSetting(data);
                    break;
                case "18":
                    displayBoardInfo(data);
                    break;
                case "19":
                    displaylocationInfo2(data);
                    break;
                case "21":
                    displayDebuggingInfo(data);
                    break;
                case "22":
                    displayBackupList(data);
                    break;
                case "23":
                    displayRemoteUpgrade(data);
                    break;
                default:
                    break
            }
        }
    })
}

function userAddCGI() {
    if (findUser($("#userName").val())) {
        alert($("#setTip5").html());
        return 0
    }
    var judge = /[^a-zA-Z0-9]/g;
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip1").html(), function(e) {
        if (e) {
            if ($("#userName").val() == "" || $("#userPassword").val() == "" || $("#userPassword2").val() == "") {
                alert($("#empty").html());
                return 0
            } else {
                if (judge.test($("#userName").val()) || judge.test($("#userPassword").val())) {
                    alert($("#dataInvalid").html());
                    return 0
                } else {
                    if ($("#userPassword").val() != $("#userPassword2").val()) {
                        alert($("#setTip2").html());
                        return 0
                    } else {
                        if ($("#userPassword").val().length < 6 || $("#userName").val().length < 3) {
                            alert($("#fail").html());
                            return 0
                        } else {}
                    }
                }
            }
            var userPassword = hex_md5($("#userPassword").val());
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "AddUser",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    UserName: $("#userName").val(),
                    UserAuth: $("#userRole").val(),
                    UserPassword: userPassword
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P802,addUser", 1);
                        alert($("#success").html());
                        displayParametersCGI("userList")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P802,addUser,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P802,addUser,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P802,addUser,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P802,addUser,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -6) {
                                            wirteLogCGI("P802,addUser,addUserError", 0);
                                            alert($("#addError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function deleteUser(th, userList) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip3").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "DeleteUser",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    UserName: $(th).val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P802,deleteUser", 1);
                        alert($("#success").html());
                        displayParametersCGI("userList", userList)
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P802,deleteUser,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P802,deleteUser,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P802,deleteUser,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P802,deleteUser,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -6) {
                                            wirteLogCGI("P802,deleteUser,deleteUserError", 0);
                                            alert($("#deleteError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function filesDeleteCGI(th) {
    var DOY = dateToDOY($("#filesRecTime").val());
    var year = $("#filesRecTime").val().split("-")[0];
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#deleteOne").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "filesDelete",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Store: $("#storeSelect").val(),
                    DOY: DOY,
                    year: year,
                    FilesName: th.value
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P502,deleteFile", 1);
                        alert($("#success").html());
                        readStoreFilesCGI()
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P502,deleteFile,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P502,deleteFile,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P502,deleteFile,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P502,deleteFile,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function delAllFilesCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#deleteAll").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "delAllFiles",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Store: $("#storeSelect").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P502,formatting recordFiles", 1);
                        alert($("#success").html());
                        readRecTimeCGI();
                        readStoreFilesCGI()
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P502,formatting recordFiles,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P502,formatting recordFiles,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P502,formatting recordFiles,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P502,formatting recordFiles,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function delSelectedFilesCGI() {
    var i = 0;
    $("section section div table tbody tr td input[type=checkbox]").each(function() {
        if ($(this).is(":checked")) {
            i++
        }
    });
    if (i == 0) {
        alert($("#optionError1").html());
        return 0
    }
    var DOY = dateToDOY($("#filesRecTime").val());
    var year = $("#filesRecTime").val().split("-")[0];
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#deleteSelect").html(), function(e) {
        if (e) {
            var i = 0;
            var selectFilesList = "";
            $("section section div table tbody tr td input[type=checkbox]").each(function() {
                if ($(this).is(":checked")) {
                    selectFilesList += $(this).val() + " ";
                    i++
                }
            });
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "SelectedfilesDelete",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Store: $("#storeSelect").val(),
                    DOY: DOY,
                    year: year,
                    FilesCount: i,
                    FilesName: selectFilesList
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P502,Delete the selected file", 1);
                        alert($("#success").html());
                        readStoreFilesCGI();
                        $("#selectAll").removeAttr("checked")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P502,Delete the selected file,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P502,Delete the selected file,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P502,Delete the selected file,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P502,Delete the selected file,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function setFilesStoreCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#storeChange").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "StoreManagement",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Store: $("#storeEquipment").val(),
                    AutoClear: $("#AutoClear").val(),
                    RinexPack: $("#RinexPack").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P503,setFilesStore", 1);
                        alert($("#success").html());
                        if ($("#storeEquipment").val() == 3) {
                            $("#storeUsed em").html($("#sdisk").html())
                        } else {
                            if ($("#storeEquipment").val() == 2) {
                                $("#storeUsed em").html($("#udisk").html())
                            } else {
                                $("#storeUsed em").html($("#flash").html())
                            }
                        }
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P503,setFilesStore", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P503,setFilesStore,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P503,setFilesStore,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P503,setFilesStore,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#cancel").html())
        }
    })
}

function autoGetCGI() {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "autoGet",
            BoardUsed: 1,
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            $("#latitude").val(data.RS_B);
            $("#longitude").val(data.RS_L);
            $("#altitude").val(data.RS_H);
            $("#div_reg").hide(500);
            $("hideebg").hide()
        }
    })
}

function updateFirmwareCGI() {
    var userAuth = checkAuthCGI(getCookie("user"), getCookie("random"), 1);
    if (userAuth == 1) {
        $.ajax({
            url: "/cgi-bin/set.elf",
            type: "POST",
            async: false,
            dataType: "JSON",
            data: {
                Options: "fileUpload",
                User: getCookie("user"),
                Random: getCookie("random")
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!DEBUG) {
                    alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                }
            },
            success: function(json) {
                var data = eval(json);
                if (data.State == 1) {
                    $("#Tr_Upload").show()
                } else {
                    if (data.State == -1) {
                        alert($("#authLost").html())
                    } else {
                        if (data.State == -2 || data.State == -3 || data.State == -4) {
                            alert($("#authError").html())
                        } else {
                            if (data.State == -5) {
                                alert($("#optionError").html())
                            } else {
                                if (data.State == -100) {
                                    alert($("#sqliteError").html())
                                }
                            }
                        }
                    }
                }
            }
        })
    } else {
        alert($("#authLess").html());
        return 0
    }
}

function fileUploadCGI() {
    if ($("#img").val() == "") {
        alert($("#uploadTip").html());
        return
    } else {
        var suffix = $("#img").val().split("\\");
        if (suffix[suffix.length - 1].search("Update.bin") >= 0) {
            $.ajaxFileUpload({
                url: "/cgi-bin/up_firmware.elf",
                secureuri: false,
                fileElementId: "img",
                dataType: "json",
                success: function(json) {
                    var data = eval(json);
                    if (data.Upload_State == "0") {
                        alert($("#uploadTip2").html())
                    } else {
                        if (data.Upload_State == "1") {
                            wirteLogCGI("P705,updateFirmware", 1);
                            alert($("#uploadTip3").html());
                            $("#buttonUpload").attr("disabled", "disabled")
                        } else {
                            if (data.Upload_State == "3") {
                                wirteLogCGI("P705,updateFirmware,sqliteError", 0);
                                alert($("#uploadTip4").html())
                            }
                        }
                    }
                }
            })
        } else {
            var file = suffix[suffix.length - 1] + "";
            if (file.substr(-3) == "bin") {
                alert($("#uploadTip5").html())
            } else {
                alert($("#uploadTip6").html())
            }
        }
    }
}

function setNetworkCGI() {
    if ($("#IPMode").val() == 1) {
        if ($("#IPAddress").val() == "" || $("#mask").val() == "" || $("#gateway").val() == "" || $("#port").val() == "") {
            alert($("#empty").html());
            return 0
        }
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "Network",
            User: getCookie("user"),
            Random: getCookie("random"),
            IPMode: $("#IPMode").val(),
            IPAddress: $("#IPAddress").val(),
            mask: $("#mask").val(),
            gateway: $("#gateway").val(),
            DNS: $("#DNS").val(),
            DNS1: $("#DNS1").val(),
            MTU: $("#MTU").val(),
            port: $("#port").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P703,setNetwork", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P703,setNetwork,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P703,setNetwork,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P703,setNetwork,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P703,setNetwork,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P703,setNetwork,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function setWifiCGI() {
    if ($("#wifiStatus").val() == "1") {
        if ($("#wifiChannel").val() == "" || $("#wifiSSID").val() == "" || $("#wifiPwd").val() == "" || $("#wifiIP").val() == "") {
            alert($("#empty").html());
            return 0
        }
        $("#wifiIP").val("192.168.9.1");
        if ($("#wifiPwd").val().length < 8) {
            alert($("#wifiPwdError").html());
            return 0
        }
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "WLANhotspot",
            User: getCookie("user"),
            Random: getCookie("random"),
            hotspotStatus: $("#hotspotStatus").val(),
            hotspotSSID: $("#hotspotSSID").val(),
            wifiPwd: $("#wifiPwd").val(),
            wifiIP: $("#wifiIP").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P703,setWifi", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P703,setWifi,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P703,setWifi,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P703,setWifi,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P703,setWifi,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P703,setWifi,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function set3GCGI() {
    if ($("#GPRSMode").val() == "2") {
        if ($("#GPRSMode").val() == "" || $("#GPRS_AP").val() == "") {
            alert($("#empty").html());
            return 0
        } else {
            if ($("#GPRSName").val() == "" || $("#GPRSPwd").val() == "") {
                setAlertify($("#ok").html(), $("#cancel").html());
                alertify.confirm($("#GPRSTip").html(), function(a) {
                    if (a) {
                        set3GAjaxCGI()
                    }
                })
            } else {
                set3GAjaxCGI()
            }
        }
    } else {
        set3GAjaxCGI()
    }
}

function set3GAjaxCGI() {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "GPRS",
            User: getCookie("user"),
            Random: getCookie("random"),
            GPRSMode: $("#GPRSMode").val(),
            GPRS_AP: $("#GPRS_AP").val(),
            GPRSName: $("#GPRSName").val(),
            GPRSPwd: $("#GPRSPwd").val(),
            GPRS2GBand: $("#GPRS2GBand").val(),
            GPRS3GBand: $("#GPRS3GBand").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P703,set3G", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P703,set3G,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P703,set3G,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P703,set3G,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P703,set3G,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P703,set3G,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function skyInitCGI() {
    var CGI_data;
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "SatellitesList",
            BoardUsed: 1,
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            if (json == null) {
                alert(json);
                return
            }
            CGI_data = eval(json)
        }
    });
    if (CGI_data.length == 0) {
        alert(CGI_data);
        return
    }
    $("#SkyPlot").empty();
    var skyPlot;
    skyPlot = new SkyPlot("SkyPlot", "overallDiv");
    var width = $(self).width() * 7 / 10;
    var height = $(self).height() * 7 / 10;
    var tmp_height = window.screen.height;
    var tmp_width = window.screen.width;
    skyPlot.restart(width, height, CGI_data);
    updateskyTable(CGI_data)
}

function runSystemTimeCGI() {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "runSystemTime",
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            $("#runSystemTime").text(data.runDay + $("#days").html() + data.runHour + $("#hours").html() + data.runMinute + $("#min").html() + data.runSecond + $("#sec").html())
        }
    })
}

function stationNameCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip4").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "stationName",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    StationName: $("#stationName").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P701,stationName", 1);
                        alert($("#success").html());
                        $("#station", parent.document).html($("#stationName").val())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P701,stationName,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P701,stationName,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P701,stationName,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P701,stationName,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P701,stationName,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function UTCTimeCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip5").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "UTCTime",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    UTCTime: $("#UTCTime").val(),
                    UTCTimeOffset: $("#UTCTimeOffset").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P701,UTCTime", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P701,UTCTime,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P701,UTCTime,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P701,UTCTime,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P701,UTCTime,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P701,UTCTime,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function starPointCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip3").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "starPoint",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    starPoint: $("#starPoint").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P701,setSerialPoint", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P701,setSerialPoint,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P701,setSerialPoint,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P701,setSerialPoint,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P701,setSerialPoint,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P701,setSerialPoint,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function extPowerCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip6").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "extPower",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    extPowerEnabled: $("#extPowerEnabled").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P701,extPower", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P701,extPower,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P701,extPower,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P701,extPower,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P701,extPower,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P701,extPower,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function regCodeCGI() {
    var status;
    $(".reg_input").each(function() {
        if ($(this).val() == "") {
            status = 1
        }
    });
    if (status == 1) {
        alert($("#empty").html());
        return 0
    }
    if (isNaN($("#0_regcode").val()) || isNaN($("#1_regcode").val()) || isNaN($("#2_regcode").val()) || isNaN($("#3_regcode").val()) || isNaN($("#4_regcode").val()) || isNaN($("#5_regcode").val()) || isNaN($("#6_regcode").val()) || isNaN($("#7_regcode").val())) {
        alert($("#regTip4").html());
        return 0
    }
    var countregCode = $("#0_regcode").val() + $("#1_regcode").val() + $("#2_regcode").val() + $("#3_regcode").val() + $("#4_regcode").val() + $("#5_regcode").val() + $("#6_regcode").val() + $("#7_regcode").val();
    if (countregCode.length < 24) {
        alert($("#regTip4").html());
        return 0
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "regCode",
            User: getCookie("user"),
            Random: getCookie("random"),
            regCode: $("#0_regcode").val() + $("#1_regcode").val() + $("#2_regcode").val() + $("#3_regcode").val() + $("#4_regcode").val() + $("#5_regcode").val() + $("#6_regcode").val() + $("#7_regcode").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P701,regCode", 1);
                var regStatus = regCodeStatusCGI();
                switch (regStatus) {
                    case "1":
                        alert($("#regTip5").html());
                        window.parent.location.href = "/index.html";
                        break;
                    case "-1":
                        alert($("#regTip4").html());
                        break;
                    case "-2":
                        alert($("#regTip3").html());
                        break;
                    default:
                        alert($("#regTip1").html() + regStatus);
                        break
                }
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P701,regCode,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P701,regCode,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P701,regCode,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P701,regCode,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P701,regCode,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function regCodeStatusCGI() {
    var status;
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "regCodeStatus",
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            status = data.option[0].State
        }
    });
    return status
}

function remoteControlCGI() {
    if ($("#remoteCtrEnabled").val() == "" || $("#linkMethod").val() == "" || $("#serverIP").val() == "" || $("#serverPort").val() == "") {
        alert($("#empty").html());
        return 0
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "remoteControl",
            User: getCookie("user"),
            Random: getCookie("random"),
            remoteCtrEnabled: $("#remoteCtrEnabled").val(),
            linkMethod: $("#linkMethod").val(),
            serverIP: $("#serverIP").val(),
            serverPort: $("#serverPort").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P701,remoteControl", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P701,remoteControl,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P701,remoteControl,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P701,remoteControl,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P701,remoteControl,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P701,remoteControl,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function setKeyPwdCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip2").html(), function(e) {
        if (e) {
            if ($("#newPwd").val() == "" || $("#newPwd2").val() == "") {
                alert($("#empty").html());
                return 0
            } else {
                if (!(/^[0-9]+$/.test($("#newPwd").val()))) {
                    alert($("#oledTip").html());
                    return 0
                } else {
                    if ($("#newPwd").val().length != 4) {
                        alert($("#oledTip2").html());
                        return 0
                    } else {
                        if ($("#newPwd").val() != $("#newPwd2").val()) {
                            alert($("#oledTip3").html());
                            return 0
                        }
                    }
                }
            }
            var keyPassword = hex_md5($("#newPwd").val());
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "KeyPassword",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    KeyPassword: keyPassword
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P701,setKeyPwd", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P701,setKeyPwd,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P701,setKeyPwd,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P701,setKeyPwd,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P701,setKeyPwd,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P701,setKeyPwd,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function boardModeCGI() {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "boardMode",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    boardMode: $("#boardMode").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P702,switchBoard", 1);
                        alert($("#success").html());
                        $("#div_switchBoard").show();
                        $("#tab2").hide()
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P702,switchBoard,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P702,switchBoard,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P702,switchBoard,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P702,switchBoard,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P702,switchBoard,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function eventCGI() {
    var type = getCookie("BoardType").split("-");
    BoardUsed = 1;
    var board_Type1 = type[0];
    var board_Type2 = type[1];
    if ((board_Type1 == "H" && BoardUsed == "1") || (board_Type2 == "H" && BoardUsed == "0")) {
        alert($("#authTip4").html());
        return 0
    }
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip2").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "event",
                    BoardUsed: 1,
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    eventEnabled: $("#eventEnabled").val(),
                    eventAttr: $("#eventAttr").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P702,eventInput", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P702,eventInput,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P702,eventInput,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P702,eventInput,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P702,eventInput,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P702,eventInput,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function extClockCGI() {
    var type = getCookie("BoardType").split("-");
    BoardUsed = 1;
    var board_Type1 = type[0];
    var board_Type2 = type[1];
    if ((board_Type1 == "H" && BoardUsed == "1") || (board_Type2 == "H" && BoardUsed == "0")) {
        alert($("#authTip4").html());
        return 0
    }
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip3").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "extClock",
                    BoardUsed: 1,
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    extClock: $("#extClockEnabled").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P702,extClock", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P702,extClock,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P702,extClock,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P702,extClock,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P702,extClock,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P702,extClock,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function PPSCGI() {
    var type = getCookie("BoardType").split("-");
    BoardUsed = 1;
    var board_Type1 = type[0];
    var board_Type2 = type[1];
    if ((board_Type1 == "H" && BoardUsed == "1") || (board_Type2 == "H" && BoardUsed == "0")) {
        alert($("#authTip4").html());
        return 0
    }
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip4").html(), function(e) {
        if (e) {
            var PPSWidth;
            if ($("#PPSWidth").val() == "0") {
                PPSWidth = $("#PPSWidthText").val();
                if (parseInt(PPSWidth) < 1000 || parseInt(PPSWidth) > 500000) {
                    alert($("#PPSTip").html());
                    return 0
                }
            } else {
                PPSWidth = $("#PPSWidth").val()
            }
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                async: false,
                dataType: "JSON",
                data: {
                    Options: "PPS",
                    BoardUsed: 1,
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    PPSEnabled: $("#PPSEnabled").val(),
                    PPSTime: $("#PPSTime").val(),
                    PPSPolar: $("#PPSPolar").val(),
                    PPSWidth: PPSWidth,
                    PPSSystem: $("#PPSSystem").val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P702,PPS", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P702,PPS,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P702,PPS,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P702,PPS,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P702,PPS,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -200) {
                                            wirteLogCGI("P702,PPS,sendSignalError", 0);
                                            alert($("#signalError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function resetBoardCGI(option) {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "resetBoard",
            User: getCookie("user"),
            Random: getCookie("random"),
            BoardOptions: option,
            Board: $("#board").val(),
            BoardMethod: $("#options").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P702,resetBoard", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P702,resetBoard,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P702,resetBoard,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P702,resetBoard,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P702,resetBoard,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P702,resetBoard,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function boardUploadCGI() {
    if ($("#upload").val() == "") {
        alert($("#updateTip1").html());
        return
    } else {
        var suffix = $("#upload").val().split(".");
        if (suffix[suffix.length - 1] == "uc_fw_pkg" || suffix[suffix.length - 1] == "timg" || suffix[suffix.length - 1] == "bin" || suffix[suffix.length - 1] == "pkg" || suffix[suffix.length - 1] == "cyfm" || suffix[suffix.length - 1] == "shex" || suffix[suffix.length - 1] == "BRD" || suffix[suffix.length - 1] == "brd") {
            suffix = $("#upload").val().split("\\");
            setCookie("uploadFiles", suffix[suffix.length - 1]);
            $.ajaxFileUpload({
                url: "/cgi-bin/up_firmware.elf",
                secureuri: false,
                fileElementId: "upload",
                dataType: "json",
                success: function(json) {
                    var data = eval(json);
                    if (data.Upload_State == "0") {
                        alert($("#updateTip2").html())
                    } else {
                        if (data.Upload_State == "1") {
                            $("#uploadButton").removeAttr("disabled");
                            $("#filesButton").attr("disabled", "disabled");
                            alert($("#updateTip3").html())
                        } else {
                            if (data.Upload_State == "3") {
                                alert($("#updateTip4").html() + "1")
                            }
                        }
                    }
                }
            })
        } else {
            alert($("#updateTip5").html())
        }
    }
}

function updateBoardCGI() {
    var filesName = getCookie("uploadFiles");
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "updateBoard",
            User: getCookie("user"),
            Random: getCookie("random"),
            FilesName: filesName,
            Board: $("#board").val(),
            BoardMethod: $("#options").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                $("#uploadButton").attr("disabled", "disabled");
                $("#options").attr("disabled", "disabled");
                $("#BackButton").attr("disabled", "disabled");
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function updateBoardCGI2() {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "updateBoardCom",
            User: getCookie("user"),
            Random: getCookie("random"),
            Board: $("#board").val(),
            BoardMethod: $("#options").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                $("#updateBoard1").hide();
                $("#updateBoard2").show()
            } else {
                if (data.State == -1) {
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function upBoardStatusCGI() {
    $.ajax({
        url: "/cgi-bin/updateBoardStatus.elf",
        type: "POST",
        dataType: "JSON",
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            $("#txt1 textarea").val(data.step + " : " + data.status + "\n\n");
            $("#txt2 textarea").val(data.step + " : " + data.status + "\n\n");
            if (data.step == "7") {
                alert($("#updateTip17").html());
                $("#txt1 textarea").val($("#updateTip18").html() + "\n\n" + $("#updateTip19").html() + "\n\n" + $("#updateTip20").html() + "\n\n" + $("#updateTip21").html())
            } else {
                if (data.step == "6") {
                    alert($("#updateTip16").html());
                    window.location.href = "/index.html"
                } else {
                    if (data.step != "0") {}
                }
            }
        }
    })
}

function setPortCGI() {
    if ($("#port").val() == 1) {
        alert($("#empty").html());
        return 0
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "serverPort",
            User: getCookie("user"),
            Random: getCookie("random"),
            port: $("#port").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P703,serverPort", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P703,serverPort,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P703,serverPort,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P703,serverPort,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P703,serverPort,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P703,serverPort,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function setFireWallCGI() {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "fireWall",
            User: getCookie("user"),
            Random: getCookie("random"),
            fireWall: $("#fireWallEnabled").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P703,setFireWall", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P703,setFireWall,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P703,setFireWall,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P703,setFireWall,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P703,setFireWall,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P703,setFireWall,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function setBluetoothCGI() {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "bluetooth",
            User: getCookie("user"),
            Random: getCookie("random"),
            bluetooth: $("#bluetoothEnabled").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P703,setBluetoothCGI", 1);
                alert($("#success").html())
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P703,setBluetoothCGI,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P703,setBluetoothCGI,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P703,setBluetoothCGI,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P703,setBluetoothCGI,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    wirteLogCGI("P703,setBluetoothCGI,sendSignalError", 0);
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function pingTestCGI() {
    var pingIP = $("#pingIP").val().replace(/\s/g, "");
    var packet = $("#packet").val().replace(/\s/g, "");
    var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var lang = getCookie("lang");
    if ($("#pingIP").val() == "" || $("#packet").val() == "") {
        alert($("#empty").html());
        return 0
    }
    if (pingIP.match(exp) == null) {
        alert($("#ParamFail").html());
        return 0
    }
    if (packet.match(/^[0-9]*$/) == null || parseInt(packet) > 9999) {
        alert($("#ParamFail").html());
        return 0
    }
    if (0 == $("#pingStatus").val()) {
        $("#pingSubmit").text($("#stop").html());
        $("#pingStatus").val("1");
        $("#pingIP").attr("disabled", "disabled");
        $("#packet").attr("disabled", "disabled");
        $("#pingReset").attr("disabled", "disabled")
    } else {
        $("#pingSubmit").text($("#start").html());
        $("#pingStatus").val("0");
        $("#pingIP").removeAttr("disabled");
        $("#packet").removeAttr("disabled");
        $("#pingReset").removeAttr("disabled")
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "pingTest",
            User: getCookie("user"),
            Random: getCookie("random"),
            IP: pingIP,
            Packet: packet,
            PingStatus: $("#pingStatus").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                $("#pingWait").css("display", "inline");
                $("#pingRes").css("display", "none");
                if (data.pingText != "") {
                    $("#pingIP").val(data.pingText.split("_")[0]);
                    $("#packet").val(data.pingText.split("_")[1]);
                    alert($("#pingAlready").html())
                }
            } else {
                if (data.State == 2) {
                    $("#pingWait").css("display", "none");
                    $("#pingRes").css("display", "block");
                    var pingArr = data.pingText.split(";");
                    var pingText = "";
                    for (var i = 1; i < pingArr.length; i++) {
                        pingText = pingText + pingArr[i] + "</br>"
                    }
                    $("#pingRes").html(pingText)
                } else {
                    if (data.State == -1) {
                        wirteLogCGI("P703,pingTestCGI,authLost", 0);
                        alert($("#authLost").html())
                    } else {
                        if (data.State == -2 || data.State == -3 || data.State == -4) {
                            wirteLogCGI("P703,pingTestCGI,authError", 0);
                            alert($("#authError").html())
                        } else {
                            if (data.State == -5) {
                                wirteLogCGI("P703,pingTestCGI,optionError", 0);
                                alert($("#optionError").html())
                            }
                        }
                    }
                }
            }
        }
    })
}

function wirteLogCGI(Event, Stype) {
    var today = new Date();
    var Ndate = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + (today.getDate()) * 1;
    var Ntime = "" + numberConvertToString(today.getHours()) + numberConvertToString(today.getMinutes()) + numberConvertToString(today.getSeconds());
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "wirteLog",
            User: getCookie("user"),
            Random: getCookie("random"),
            date: Ndate,
            time: Ntime,
            event: Event,
            type: Stype
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == -100) {
                alert("log write error")
            }
        }
    })
}

function logListCGI(options) {
    if (options == "1") {
        if ($("#startTime").val() == "" || $("#endTime").val() == "") {
            alert($("#empty").html());
            return 0
        } else {
            var dayData = $("#startTime").val().split("/");
            var startDayData = dayData[0] + dayData[1] + dayData[2];
            dayData = $("#endTime").val().split("/");
            var endDayData = dayData[0] + dayData[1] + dayData[2];
            if (eval("startDayData - endDayData") > 0) {
                alert($("#dateError").html());
                return 0
            }
        }
    } else {
        var today = new Date();
        var startDayData = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + (today.getDate()) * 1;
        var endDayData = startDayData;
        $("#startTime").val(today.getFullYear() + "/" + numberConvertToString(today.getMonth() + 1) + "/" + numberConvertToString(today.getDate()));
        $("#endTime").val(today.getFullYear() + "/" + numberConvertToString(today.getMonth() + 1) + "/" + numberConvertToString(today.getDate()))
    }
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        async: false,
        data: {
            Options: "logList",
            User: getCookie("user"),
            Random: getCookie("random"),
            startTime: startDayData,
            endTime: endDayData
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                displayP901(data)
            } else {
                if (data.State == -1) {
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -200) {
                                    alert($("#signalError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function delLogListCGI() {
    var userAuth = checkAuthCGI(getCookie("user"), getCookie("random"), 1);
    if (userAuth == 1) {
        if ($("#startTime").val() == "" || $("#endTime").val() == "") {
            alert($("#empty").html());
            return 0
        } else {
            var dayData = $("#startTime").val().split("/");
            var startDayData = dayData[0] + dayData[1] + dayData[2];
            dayData = $("#endTime").val().split("/");
            var endDayData = dayData[0] + dayData[1] + dayData[2];
            if (eval("startDayData - endDayData") > 0) {
                alert($("#dateError").html());
                return 0
            }
        }
        $.ajax({
            url: "/cgi-bin/set.elf",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                Options: "delLogList",
                User: getCookie("user"),
                Random: getCookie("random"),
                startTime: startDayData,
                endTime: endDayData
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!DEBUG) {
                    alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                }
            },
            success: function(json) {
                var data = eval(json);
                if (data.State == 1) {
                    alert($("#success").html());
                    logListCGI("1")
                } else {
                    if (data.State == -1) {
                        alert($("#authLost").html())
                    } else {
                        if (data.State == -2 || data.State == -3 || data.State == -4) {
                            alert($("#authError").html())
                        } else {
                            if (data.State == -5) {
                                alert($("#optionError").html())
                            } else {
                                if (data.State == -100) {
                                    alert($("#sqliteError").html())
                                } else {
                                    if (data.State == -200) {
                                        alert($("#signalError").html())
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    } else {
        alert($("#authLess").html());
        return 0
    }
}

function switchBoardCGI(options, status) {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: options,
            Status: status,
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            switch (data.option[0].State) {
                case "1":
                    displayP302(data);
                    break;
                case "2":
                    displayP401(data);
                    break;
                case "3":
                    displayBoardSetting(data);
                    break;
                case "4":
                    displayP301(data);
                    break;
                case "5":
                    recRTCMInterval(data);
                    break;
                default:
                    break
            }
        }
    })
}

function changeInfoCGI() {
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "ChangeInfo",
            BoardUsed: getCookie("BoardUsed"),
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == -300) {
                if (!DEBUG) {
                    alert($("#boardError").html() + $("#boardCookies").html() + getCookie("BoardUsed") + $("#boardUsed").html() + data.Board)
                } else {}
                window.location.href = "/index.html";
                return 0
            }
            displayChangeInfo(data)
        }
    })
}

function ReadWIFIScanCGI(SSIDData) {
    var CGI_data;
    var str = "";
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "ReadWIFIScan",
            BoardUsed: 1,
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            CGI_data = eval(json);
            if ((CGI_data.State != 1) || (CGI_data.Scanresult.length < 2)) {
                if (CGI_data.State == -2) {
                    return
                }
                CGI_data = "";
                return
            }
            WIFIScan = CGI_data;
            $("#wifiSigal").val(WIFIScan.Scanresult[0].RSSI);
            for (var i = 0; i < CGI_data.Scanresult.length; i++) {
                if (SSIDData == CGI_data.Scanresult[i].SSID) {
                    str += '<option selected="selected" value=' + CGI_data.Scanresult[i].SSID + ">" + CGI_data.Scanresult[i].SSID + "</option>";
                    $("#wifiSigal").val(WIFIScan.Scanresult[i].RSSI)
                } else {
                    str += '<option value="' + CGI_data.Scanresult[i].SSID + '">' + CGI_data.Scanresult[i].SSID + "</option>"
                }
            }
            $("#wifiSSIDScan").html(str)
        }
    });
    return CGI_data
}

function SetWIFIScanCGI() {
    var CGI_data;
    var str = "";
    $("#WIFISigal").hide();
    $("#WIFISSIDScan").hide();
    $("#WIFIConPwd").hide();
    $("#WIFIIP2").hide();
    $("#WIFIState").hide();
    $("#scanWait").show();
    $("#scanWaitImg").css("display", "inline");
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "SetWIFIScan",
            BoardUsed: 1,
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            CGI_data = eval(json);
            if ((CGI_data.State != 1) || (CGI_data.Scanresult.length < 2)) {
                if (CGI_data.State == -2) {
                    alert($("#ModeError2").html())
                }
                CGI_data = ""
            } else {
                WIFIScan = CGI_data;
                for (var i = 0; i < CGI_data.Scanresult.length; i++) {
                    str += '<option value="' + CGI_data.Scanresult[i].SSID + '">' + CGI_data.Scanresult[i].SSID + "</option>"
                }
                $("#wifiSigal").val(WIFIScan.Scanresult[0].RSSI);
                $("#wifiSSIDScan").html(str)
            }
            $("#scanWait").hide();
            $("#scanWaitImg").css("display", "none");
            $("#WIFISigal").show();
            $("#WIFISSIDScan").show();
            $("#WIFIConPwd").show();
            $("#WIFIIP2").show();
            $("#WIFIState").show()
        }
    });
    return CGI_data
}

function SetWIFIConnectCGI() {
    if ($("#wifiStatus").val() == 1) {
        $("#wifiConPwd").attr("disabled", "disabled")
    }
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        async: false,
        dataType: "JSON",
        data: {
            Options: "WIFIConncet",
            BoardUsed: 1,
            User: getCookie("user"),
            Random: getCookie("random"),
            wifiStatus: $("#wifiStatus").val(),
            ConSSID: $("#wifiSSIDScan").val(),
            ConPwd: $("#wifiConPwd").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == -200) {
                alert($("#signalError").html())
            } else {
                if (data.State == 1) {
                    alert($("#success").html());
                    if ($("#wifiStatus").val() == 1) {
                        ReadWIFIScanCGI($("#wifiSSIDScan").val())
                    }
                } else {
                    if (data.State == -2) {
                        alert($("#ModeError").html())
                    }
                }
            }
        }
    })
}

function ReadWIFIConnectCGI() {
    var CGIdata;
    $.ajax({
        url: "/cgi-bin/read.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "ReadWIFIConncet",
            BoardUsed: 1,
            User: getCookie("user"),
            Random: getCookie("random"),
            ConSSID: $("#wifiSSIDScan").val(),
            ConPwd: $("#wifiConPwd").val()
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            CGIdata = eval(json);
            if (CGIdata.State < 30) {
                var arr = $("#WIFIState div em");
                if (CGIdata.State == 10) {
                    arr[2].innerHTML = $("#connected").html()
                } else {
                    if (CGIdata.State == 7) {
                        arr[2].innerHTML = $("#error_pwd").html()
                    } else {
                        if (CGIdata.State == 0) {
                            arr[2].innerHTML = $("#connecting").html()
                        } else {
                            if (CGIdata.State == 13) {
                                arr[2].innerHTML = $("#connected2").html()
                            } else {
                                if (CGIdata.State == 23) {
                                    arr[2].innerHTML = $("#Error_SetWIFI").html()
                                } else {
                                    if (CGIdata.State == 22) {
                                        arr[2].innerHTML = $("#GetAPList").html()
                                    } else {
                                        if (CGIdata.State == 25) {
                                            arr[2].innerHTML = $("#GetAPListError").html()
                                        } else {
                                            if (CGIdata.State == 9) {
                                                arr[2].innerHTML = $("#APNotFound").html()
                                            } else {
                                                arr[2].innerHTML = $("#error_connect").html()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (CGIdata.State == 10 || CGIdata.State == 13 || CGIdata.State == 7) {
                    $("#wifiConPwd").removeAttr("disabled")
                }
            }
        }
    })
}

function importBackupCGI(th, method) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip1").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "ImportBackup",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    Method: method,
                    FilesName: th
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P705,ImportBackup", 1);
                        alert($("#success").html())
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P705,ImportBackup,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P705,ImportBackup,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P705,ImportBackup,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P705,ImportBackup,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -6) {
                                            wirteLogCGI("P705,ImportBackup,ImportBackupError", 0);
                                            alert($("#importError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function deleteBackupCGI(th) {
    setAlertify($("#ok").html(), $("#cancel").html());
    alertify.confirm($("#setTip2").html(), function(e) {
        if (e) {
            $.ajax({
                url: "/cgi-bin/set.elf",
                type: "POST",
                dataType: "JSON",
                data: {
                    Options: "DeleteBackup",
                    User: getCookie("user"),
                    Random: getCookie("random"),
                    FilesName: $(th).val()
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    if (!DEBUG) {
                        alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                    }
                },
                success: function(json) {
                    var data = eval(json);
                    if (data.State == 1) {
                        wirteLogCGI("P705,deleteBackup", 1);
                        alert($("#success").html());
                        displayParametersCGI("backupList")
                    } else {
                        if (data.State == -1) {
                            wirteLogCGI("P705,deleteBackup,authLost", 0);
                            alert($("#authLost").html())
                        } else {
                            if (data.State == -2 || data.State == -3 || data.State == -4) {
                                wirteLogCGI("P705,deleteBackup,authError", 0);
                                alert($("#authError").html())
                            } else {
                                if (data.State == -5) {
                                    wirteLogCGI("P705,deleteBackup,optionError", 0);
                                    alert($("#optionError").html())
                                } else {
                                    if (data.State == -100) {
                                        wirteLogCGI("P705,deleteBackup,sqliteError", 0);
                                        alert($("#sqliteError").html())
                                    } else {
                                        if (data.State == -6) {
                                            wirteLogCGI("P705,deleteBackup,deleteBackupError", 0);
                                            alert($("#deleteError").html())
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        } else {
            alertify.error($("#return").html())
        }
    })
}

function createBackupCGI() {
    $.ajax({
        url: "/cgi-bin/set.elf",
        type: "POST",
        dataType: "JSON",
        data: {
            Options: "CreateBackup",
            User: getCookie("user"),
            Random: getCookie("random")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (!DEBUG) {
                alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
            }
        },
        success: function(json) {
            var data = eval(json);
            if (data.State == 1) {
                wirteLogCGI("P705,createBackup", 1);
                alert($("#success").html());
                displayParametersCGI("backupList")
            } else {
                if (data.State == -1) {
                    wirteLogCGI("P705,createBackup,authLost", 0);
                    alert($("#authLost").html())
                } else {
                    if (data.State == -2 || data.State == -3 || data.State == -4) {
                        wirteLogCGI("P705,createBackup,authError", 0);
                        alert($("#authError").html())
                    } else {
                        if (data.State == -5) {
                            wirteLogCGI("P705,createBackup,optionError", 0);
                            alert($("#optionError").html())
                        } else {
                            if (data.State == -100) {
                                wirteLogCGI("P705,createBackup,sqliteError", 0);
                                alert($("#sqliteError").html())
                            } else {
                                if (data.State == -6) {
                                    wirteLogCGI("P705,createBackup,createBackupError", 0);
                                    alert($("#addError").html())
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

function importExternalBackupCGI() {
    if ($("#imgBackup").val() == "") {
        alert($("#uploadTip").html());
        return
    } else {
        var suffix = $("#imgBackup").val().split("\\");
        if (suffix[suffix.length - 1].search(".bin") >= 0) {
            $.ajaxFileUpload({
                url: "/cgi-bin/up_firmware.elf",
                secureuri: false,
                fileElementId: "imgBackup",
                dataType: "json",
                success: function(json) {
                    var data = eval(json);
                    if (data.Upload_State == "0") {
                        alert($("#uploadTip2").html())
                    } else {
                        if (data.Upload_State == "1") {
                            wirteLogCGI("P705,updateBackup", 1);
                            importBackupCGI(suffix[suffix.length - 1], 2)
                        } else {
                            if (data.Upload_State == "3") {
                                wirteLogCGI("P705,updateBackup,sqliteError", 0);
                                alert($("#uploadTip4").html())
                            }
                        }
                    }
                }
            })
        } else {
            alert($("#uploadTip5").html())
        }
    }
}

function remoteUpgradeCGI() {
    var userAuth = checkAuthCGI(getCookie("user"), getCookie("random"), 1);
    if (userAuth == 1) {
        if ($("#RUpgradeIP").val() == "") {
            alert($("#empty").html());
            return 0
        }
        $.ajax({
            url: "/cgi-bin/set.elf",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                Options: "remoteUpgrade",
                User: getCookie("user"),
                Random: getCookie("random"),
                RUpgradeIP: $("#RUpgradeIP").val(),
                RUpgradeON: $("#RUpgradeON").val()
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (!DEBUG) {
                    alert(XMLHttpRequest.status + ", " + XMLHttpRequest.readyState + ", " + textStatus)
                }
            },
            success: function(json) {
                var data = eval(json);
                if (data.State == 1) {
                    alert($("#success").html())
                } else {
                    if (data.State == -1) {
                        alert($("#authLost").html())
                    } else {
                        if (data.State == -2 || data.State == -3 || data.State == -4) {
                            alert($("#authError").html())
                        } else {
                            if (data.State == -5) {
                                alert($("#optionError").html())
                            } else {
                                if (data.State == -100) {
                                    alert($("#sqliteError").html())
                                } else {
                                    if (data.State == -200) {
                                        alert($("#signalError").html())
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    } else {
        alert($("#authLess").html());
        return 0
    }
};