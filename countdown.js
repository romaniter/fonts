!function() {
    var n = !1;
    window.JQClass = function() {}
    ,
    JQClass.classes = {},
    JQClass.extend = function t(e) {
        function i() {
            !n && this._init && this._init.apply(this, arguments)
        }
        var o = this.prototype;
        n = !0;
        var s = new this;
        n = !1;
        for (var a in e)
            s[a] = "function" == typeof e[a] && "function" == typeof o[a] ? function(n, t) {
                return function() {
                    var e = this._super;
                    this._super = function(t) {
                        return o[n].apply(this, t)
                    }
                    ;
                    var i = t.apply(this, arguments);
                    return this._super = e,
                    i
                }
            }(a, e[a]) : e[a];
        return i.prototype = s,
        i.prototype.constructor = i,
        i.extend = t,
        i
    }
}(),
function($) {
    function camelCase(n) {
        return n.replace(/-([a-z])/g, function(n, t) {
            return t.toUpperCase()
        })
    }
    JQClass.classes.JQPlugin = JQClass.extend({
        name: "plugin",
        defaultOptions: {},
        regionalOptions: {},
        _getters: [],
        _getMarker: function() {
            return "is-" + this.name
        },
        _init: function() {
            $.extend(this.defaultOptions, this.regionalOptions && this.regionalOptions[""] || {});
            var n = camelCase(this.name);
            $[n] = this,
            $.fn[n] = function(t) {
                var e = Array.prototype.slice.call(arguments, 1);
                return $[n]._isNotChained(t, e) ? $[n][t].apply($[n], [this[0]].concat(e)) : this.each(function() {
                    if ("string" == typeof t) {
                        if ("_" === t[0] || !$[n][t])
                            throw "Unknown method: " + t;
                        $[n][t].apply($[n], [this].concat(e))
                    } else
                        $[n]._attach(this, t)
                })
            }
        },
        setDefaults: function(n) {
            $.extend(this.defaultOptions, n || {})
        },
        _isNotChained: function(n, t) {
            return "option" === n && (0 === t.length || 1 === t.length && "string" == typeof t[0]) || $.inArray(n, this._getters) > -1
        },
        _attach: function(n, t) {
            if (n = $(n),
            !n.hasClass(this._getMarker())) {
                n.addClass(this._getMarker()),
                t = $.extend({}, this.defaultOptions, this._getMetadata(n), t || {});
                var e = $.extend({
                    name: this.name,
                    elem: n,
                    options: t
                }, this._instSettings(n, t));
                n.data(this.name, e),
                this._postAttach(n, e),
                this.option(n, t)
            }
        },
        _instSettings: function(n, t) {
            return {}
        },
        _postAttach: function(n, t) {},
        _getMetadata: function(elem) {
            try {
                var data = elem.data(this.name.toLowerCase()) || "";
                data = data.replace(/'/g, '"'),
                data = data.replace(/([a-zA-Z0-9]+):/g, function(n, t, e) {
                    var i = data.substring(0, e).match(/"/g);
                    return i && i.length % 2 !== 0 ? t + ":" : '"' + t + '":'
                }),
                data = $.parseJSON("{" + data + "}");
                for (var name in data) {
                    var value = data[name];
                    "string" == typeof value && value.match(/^new Date\((.*)\)$/) && (data[name] = eval(value))
                }
                return data
            } catch (e) {
                return {}
            }
        },
        _getInst: function(n) {
            return $(n).data(this.name) || {}
        },
        option: function(n, t, e) {
            n = $(n);
            var i = n.data(this.name);
            if (!t || "string" == typeof t && null == e) {
                var o = (i || {}).options;
                return o && t ? o[t] : o
            }
            if (n.hasClass(this._getMarker())) {
                var o = t || {};
                "string" == typeof t && (o = {},
                o[t] = e),
                this._optionsChanged(n, i, o),
                $.extend(i.options, o)
            }
        },
        _optionsChanged: function(n, t, e) {},
        destroy: function(n) {
            n = $(n),
            n.hasClass(this._getMarker()) && (this._preDestroy(n, this._getInst(n)),
            n.removeData(this.name).removeClass(this._getMarker()))
        },
        _preDestroy: function(n, t) {}
    }),
    $.JQPlugin = {
        createPlugin: function(n, t) {
            "object" == typeof n && (t = n,
            n = "JQPlugin"),
            n = camelCase(n);
            var e = camelCase(t.name);
            JQClass.classes[e] = JQClass.classes[n].extend(t),
            new JQClass.classes[e]
        }
    }
}(jQuery),
function(n) {
    var t = "countdown"
      , e = 0
      , i = 1
      , o = 2
      , s = 3
      , a = 4
      , l = 5
      , r = 6;
    n.JQPlugin.createPlugin({
        name: t,
        defaultOptions: {
            until: null,
            since: null,
            timezone: null,
            serverSync: null,
            format: "dHMS",
            layout: "",
            compact: !1,
            padZeroes: !1,
            significant: 0,
            description: "",
            expiryUrl: "",
            expiryText: "",
            alwaysExpire: !1,
            onExpiry: null,
            onTick: null,
            tickInterval: 1
        },
        regionalOptions: {
            "": {
                labels: ["Years", "Months", "Weeks", "Days", "Hours", "Minutes", "Seconds"],
                labels1: ["Year", "Month", "Week", "Day", "Hour", "Minute", "Second"],
                compactLabels: ["y", "m", "w", "d"],
                whichLabels: null,
                digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                timeSeparator: ":",
                isRTL: !1
            }
        },
        _getters: ["getTimes"],
        _rtlClass: t + "-rtl",
        _sectionClass: t + "-section",
        _amountClass: t + "-amount",
        _periodClass: t + "-period",
        _rowClass: t + "-row",
        _holdingClass: t + "-holding",
        _showClass: t + "-show",
        _descrClass: t + "-descr",
        _timerElems: [],
        _init: function() {
            function t(n) {
                var l = n < 1e12 ? o ? performance.now() + performance.timing.navigationStart : i() : n || i();
                l - a >= 1e3 && (e._updateElems(),
                a = l),
                s(t)
            }
            var e = this;
            this._super(),
            this._serverSyncs = [];
            var i = "function" == typeof Date.now ? Date.now : function() {
                return (new Date).getTime()
            }
              , o = window.performance && "function" == typeof window.performance.now
              , s = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null
              , a = 0;
            !s || n.noRequestAnimationFrame ? (n.noRequestAnimationFrame = null,
            setInterval(function() {
                e._updateElems()
            }, 980)) : (a = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || i(),
            s(t))
        },
        UTCDate: function(n, t, e, i, o, s, a, l) {
            "object" == typeof t && t.constructor == Date && (l = t.getMilliseconds(),
            a = t.getSeconds(),
            s = t.getMinutes(),
            o = t.getHours(),
            i = t.getDate(),
            e = t.getMonth(),
            t = t.getFullYear());
            var r = new Date;
            return r.setUTCFullYear(t),
            r.setUTCDate(1),
            r.setUTCMonth(e || 0),
            r.setUTCDate(i || 1),
            r.setUTCHours(o || 0),
            r.setUTCMinutes((s || 0) - (Math.abs(n) < 30 ? 60 * n : n)),
            r.setUTCSeconds(a || 0),
            r.setUTCMilliseconds(l || 0),
            r
        },
        periodsToSeconds: function(n) {
            return 31557600 * n[0] + 2629800 * n[1] + 604800 * n[2] + 86400 * n[3] + 3600 * n[4] + 60 * n[5] + n[6]
        },
        _instSettings: function(n, t) {
            return {
                _periods: [0, 0, 0, 0, 0, 0, 0]
            }
        },
        _addElem: function(n) {
            this._hasElem(n) || this._timerElems.push(n)
        },
        _hasElem: function(t) {
            return n.inArray(t, this._timerElems) > -1
        },
        _removeElem: function(t) {
            this._timerElems = n.map(this._timerElems, function(n) {
                return n == t ? null : n
            })
        },
        _updateElems: function() {
            for (var n = this._timerElems.length - 1; n >= 0; n--)
                this._updateCountdown(this._timerElems[n])
        },
        _optionsChanged: function(t, e, i) {
            i.layout && (i.layout = i.layout.replace(/&lt;/g, "<").replace(/&gt;/g, ">")),
            this._resetExtraLabels(e.options, i);
            var o = e.options.timezone != i.timezone;
            n.extend(e.options, i),
            this._adjustSettings(t, e, null != i.until || null != i.since || o);
            var s = new Date;
            (e._since && e._since < s || e._until && e._until > s) && this._addElem(t[0]),
            this._updateCountdown(t, e)
        },
        _updateCountdown: function(t, e) {
            if (t = t.jquery ? t : n(t),
            e = e || t.data(this.name)) {
                if (t.html(this._generateHTML(e)).toggleClass(this._rtlClass, e.options.isRTL),
                n.isFunction(e.options.onTick)) {
                    var i = "lap" != e._hold ? e._periods : this._calculatePeriods(e, e._show, e.options.significant, new Date);
                    1 != e.options.tickInterval && this.periodsToSeconds(i) % e.options.tickInterval != 0 || e.options.onTick.apply(t[0], [i])
                }
                var o = "pause" != e._hold && (e._since ? e._now.getTime() < e._since.getTime() : e._now.getTime() >= e._until.getTime());
                if (o && !e._expiring) {
                    if (e._expiring = !0,
                    this._hasElem(t[0]) || e.options.alwaysExpire) {
                        if (this._removeElem(t[0]),
                        n.isFunction(e.options.onExpiry) && e.options.onExpiry.apply(t[0], []),
                        e.options.expiryText) {
                            var s = e.options.layout;
                            e.options.layout = e.options.expiryText,
                            this._updateCountdown(t[0], e),
                            e.options.layout = s
                        }
                        e.options.expiryUrl && (window.location = e.options.expiryUrl)
                    }
                    e._expiring = !1
                } else
                    "pause" == e._hold && this._removeElem(t[0])
            }
        },
        _resetExtraLabels: function(n, t) {
            var e = !1;
            for (var i in t)
                if ("whichLabels" != i && i.match(/[Ll]abels/)) {
                    e = !0;
                    break
                }
            if (e)
                for (var i in n)
                    i.match(/[Ll]abels[02-9]|compactLabels1/) && (n[i] = null)
        },
        _adjustSettings: function(t, e, i) {
            for (var o, s = 0, a = null, l = 0; l < this._serverSyncs.length; l++)
                if (this._serverSyncs[l][0] == e.options.serverSync) {
                    a = this._serverSyncs[l][1];
                    break
                }
            if (null != a)
                s = e.options.serverSync ? a : 0,
                o = new Date;
            else {
                var r = n.isFunction(e.options.serverSync) ? e.options.serverSync.apply(t[0], []) : null;
                o = new Date,
                s = r ? o.getTime() - r.getTime() : 0,
                this._serverSyncs.push([e.options.serverSync, s])
            }
            var u = e.options.timezone;
            u = null == u ? -o.getTimezoneOffset() : u,
            (i || !i && null == e._until && null == e._since) && (e._since = e.options.since,
            null != e._since && (e._since = this.UTCDate(u, this._determineTime(e._since, null)),
            e._since && s && e._since.setMilliseconds(e._since.getMilliseconds() + s)),
            e._until = this.UTCDate(u, this._determineTime(e.options.until, o)),
            s && e._until.setMilliseconds(e._until.getMilliseconds() + s)),
            e._show = this._determineShow(e)
        },
        _preDestroy: function(n, t) {
            this._removeElem(n[0]),
            n.empty()
        },
        pause: function(n) {
            this._hold(n, "pause")
        },
        lap: function(n) {
            this._hold(n, "lap")
        },
        resume: function(n) {
            this._hold(n, null)
        },
        toggle: function(t) {
            var e = n.data(t, this.name) || {};
            this[e._hold ? "resume" : "pause"](t)
        },
        toggleLap: function(t) {
            var e = n.data(t, this.name) || {};
            this[e._hold ? "resume" : "lap"](t)
        },
        _hold: function(t, e) {
            var i = n.data(t, this.name);
            if (i) {
                if ("pause" == i._hold && !e) {
                    i._periods = i._savePeriods;
                    var o = i._since ? "-" : "+";
                    i[i._since ? "_since" : "_until"] = this._determineTime(o + i._periods[0] + "y" + o + i._periods[1] + "o" + o + i._periods[2] + "w" + o + i._periods[3] + "d" + o + i._periods[4] + "h" + o + i._periods[5] + "m" + o + i._periods[6] + "s"),
                    this._addElem(t)
                }
                i._hold = e,
                i._savePeriods = "pause" == e ? i._periods : null,
                n.data(t, this.name, i),
                this._updateCountdown(t, i)
            }
        },
        getTimes: function(t) {
            var e = n.data(t, this.name);
            return e ? "pause" == e._hold ? e._savePeriods : e._hold ? this._calculatePeriods(e, e._show, e.options.significant, new Date) : e._periods : null
        },
        _determineTime: function(n, t) {
            var e = this
              , i = function(n) {
                var t = new Date;
                return t.setTime(t.getTime() + 1e3 * n),
                t
            }
              , o = function(n) {
                n = n.toLowerCase();
                for (var t = new Date, i = t.getFullYear(), o = t.getMonth(), s = t.getDate(), a = t.getHours(), l = t.getMinutes(), r = t.getSeconds(), u = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g, c = u.exec(n); c; ) {
                    switch (c[2] || "s") {
                    case "s":
                        r += parseInt(c[1], 10);
                        break;
                    case "m":
                        l += parseInt(c[1], 10);
                        break;
                    case "h":
                        a += parseInt(c[1], 10);
                        break;
                    case "d":
                        s += parseInt(c[1], 10);
                        break;
                    case "w":
                        s += 7 * parseInt(c[1], 10);
                        break;
                    case "o":
                        o += parseInt(c[1], 10),
                        s = Math.min(s, e._getDaysInMonth(i, o));
                        break;
                    case "y":
                        i += parseInt(c[1], 10),
                        s = Math.min(s, e._getDaysInMonth(i, o))
                    }
                    c = u.exec(n)
                }
                return new Date(i,o,s,a,l,r,0)
            }
              , s = null == n ? t : "string" == typeof n ? o(n) : "number" == typeof n ? i(n) : n;
            return s && s.setMilliseconds(0),
            s
        },
        _getDaysInMonth: function(n, t) {
            return 32 - new Date(n,t,32).getDate()
        },
        _normalLabels: function(n) {
            return n
        },
        _generateHTML: function(t) {
            var u = this;
            t._periods = t._hold ? t._periods : this._calculatePeriods(t, t._show, t.options.significant, new Date);
            for (var c = !1, d = 0, p = t.options.significant, m = n.extend({}, t._show), h = e; h <= r; h++)
                c |= "?" == t._show[h] && t._periods[h] > 0,
                m[h] = "?" != t._show[h] || c ? t._show[h] : null,
                d += m[h] ? 1 : 0,
                p -= t._periods[h] > 0 ? 1 : 0;
            for (var g = [!1, !1, !1, !1, !1, !1, !1], h = r; h >= e; h--)
                t._show[h] && (t._periods[h] ? g[h] = !0 : (g[h] = p > 0,
                p--));
            var w = t.options.compact ? t.options.compactLabels : t.options.labels
              , b = t.options.whichLabels || this._normalLabels
              , _ = function(n) {
                var e = t.options["compactLabels" + b(t._periods[n])];
                return m[n] ? u._translateDigits(t, t._periods[n]) + (e ? e[n] : w[n]) + " " : ""
            }
              , f = t.options.padZeroes ? 2 : 1
              , L = function(n) {
                var e = t.options["labels" + b(t._periods[n])];
                return !t.options.significant && m[n] || t.options.significant && g[n] ? '<span class="' + u._sectionClass + '"><span class="' + u._amountClass + '">' + u._minDigits(t, t._periods[n], f) + '</span><span class="' + u._periodClass + '">' + (e ? e[n] : w[n]) + "</span></span>" : ""
            };
            return t.options.layout ? this._buildLayout(t, m, t.options.layout, t.options.compact, t.options.significant, g) : (t.options.compact ? '<span class="' + this._rowClass + " " + this._amountClass + (t._hold ? " " + this._holdingClass : "") + '">' + _(e) + _(i) + _(o) + _(s) + (m[a] ? this._minDigits(t, t._periods[a], 2) : "") + (m[l] ? (m[a] ? t.options.timeSeparator : "") + this._minDigits(t, t._periods[l], 2) : "") + (m[r] ? (m[a] || m[l] ? t.options.timeSeparator : "") + this._minDigits(t, t._periods[r], 2) : "") : '<span class="' + this._rowClass + " " + this._showClass + (t.options.significant || d) + (t._hold ? " " + this._holdingClass : "") + '">' + L(e) + L(i) + L(o) + L(s) + L(a) + L(l) + L(r)) + "</span>" + (t.options.description ? '<span class="' + this._rowClass + " " + this._descrClass + '">' + t.options.description + "</span>" : "")
        },
        _buildLayout: function(t, u, c, d, p, m) {
            for (var h = t.options[d ? "compactLabels" : "labels"], g = t.options.whichLabels || this._normalLabels, w = function(n) {
                return (t.options[(d ? "compactLabels" : "labels") + g(t._periods[n])] || h)[n]
            }, b = function(n, e) {
                return t.options.digits[Math.floor(n / e) % 10]
            }, _ = {
                desc: t.options.description,
                sep: t.options.timeSeparator,
                yl: w(e),
                yn: this._minDigits(t, t._periods[e], 1),
                ynn: this._minDigits(t, t._periods[e], 2),
                ynnn: this._minDigits(t, t._periods[e], 3),
                y1: b(t._periods[e], 1),
                y10: b(t._periods[e], 10),
                y100: b(t._periods[e], 100),
                y1000: b(t._periods[e], 1e3),
                ol: w(i),
                on: this._minDigits(t, t._periods[i], 1),
                onn: this._minDigits(t, t._periods[i], 2),
                onnn: this._minDigits(t, t._periods[i], 3),
                o1: b(t._periods[i], 1),
                o10: b(t._periods[i], 10),
                o100: b(t._periods[i], 100),
                o1000: b(t._periods[i], 1e3),
                wl: w(o),
                wn: this._minDigits(t, t._periods[o], 1),
                wnn: this._minDigits(t, t._periods[o], 2),
                wnnn: this._minDigits(t, t._periods[o], 3),
                w1: b(t._periods[o], 1),
                w10: b(t._periods[o], 10),
                w100: b(t._periods[o], 100),
                w1000: b(t._periods[o], 1e3),
                dl: w(s),
                dn: this._minDigits(t, t._periods[s], 1),
                dnn: this._minDigits(t, t._periods[s], 2),
                dnnn: this._minDigits(t, t._periods[s], 3),
                d1: b(t._periods[s], 1),
                d10: b(t._periods[s], 10),
                d100: b(t._periods[s], 100),
                d1000: b(t._periods[s], 1e3),
                hl: w(a),
                hn: this._minDigits(t, t._periods[a], 1),
                hnn: this._minDigits(t, t._periods[a], 2),
                hnnn: this._minDigits(t, t._periods[a], 3),
                h1: b(t._periods[a], 1),
                h10: b(t._periods[a], 10),
                h100: b(t._periods[a], 100),
                h1000: b(t._periods[a], 1e3),
                ml: w(l),
                mn: this._minDigits(t, t._periods[l], 1),
                mnn: this._minDigits(t, t._periods[l], 2),
                mnnn: this._minDigits(t, t._periods[l], 3),
                m1: b(t._periods[l], 1),
                m10: b(t._periods[l], 10),
                m100: b(t._periods[l], 100),
                m1000: b(t._periods[l], 1e3),
                sl: w(r),
                sn: this._minDigits(t, t._periods[r], 1),
                snn: this._minDigits(t, t._periods[r], 2),
                snnn: this._minDigits(t, t._periods[r], 3),
                s1: b(t._periods[r], 1),
                s10: b(t._periods[r], 10),
                s100: b(t._periods[r], 100),
                s1000: b(t._periods[r], 1e3)
            }, f = c, L = e; L <= r; L++) {
                var y = "yowdhms".charAt(L)
                  , S = new RegExp("\\{" + y + "<\\}([\\s\\S]*)\\{" + y + ">\\}","g");
                f = f.replace(S, !p && u[L] || p && m[L] ? "$1" : "")
            }
            return n.each(_, function(n, t) {
                var e = new RegExp("\\{" + n + "\\}","g");
                f = f.replace(e, t)
            }),
            f
        },
        _minDigits: function(n, t, e) {
            return t = "" + t,
            t.length >= e ? this._translateDigits(n, t) : (t = "0000000000" + t,
            this._translateDigits(n, t.substr(t.length - e)))
        },
        _translateDigits: function(n, t) {
            return ("" + t).replace(/[0-9]/g, function(t) {
                return n.options.digits[t]
            })
        },
        _determineShow: function(n) {
            var t = n.options.format
              , u = [];
            return u[e] = t.match("y") ? "?" : t.match("Y") ? "!" : null,
            u[i] = t.match("o") ? "?" : t.match("O") ? "!" : null,
            u[o] = t.match("w") ? "?" : t.match("W") ? "!" : null,
            u[s] = t.match("d") ? "?" : t.match("D") ? "!" : null,
            u[a] = t.match("h") ? "?" : t.match("H") ? "!" : null,
            u[l] = t.match("m") ? "?" : t.match("M") ? "!" : null,
            u[r] = t.match("s") ? "?" : t.match("S") ? "!" : null,
            u
        },
        _calculatePeriods: function(n, t, u, c) {
            n._now = c,
            n._now.setMilliseconds(0);
            var d = new Date(n._now.getTime());
            n._since ? c.getTime() < n._since.getTime() ? n._now = c = d : c = n._since : (d.setTime(n._until.getTime()),
            c.getTime() > n._until.getTime() && (n._now = c = d));
            var p = [0, 0, 0, 0, 0, 0, 0];
            if (t[e] || t[i]) {
                var m = this._getDaysInMonth(c.getFullYear(), c.getMonth())
                  , h = this._getDaysInMonth(d.getFullYear(), d.getMonth())
                  , g = d.getDate() == c.getDate() || d.getDate() >= Math.min(m, h) && c.getDate() >= Math.min(m, h)
                  , w = function(n) {
                    return 60 * (60 * n.getHours() + n.getMinutes()) + n.getSeconds()
                }
                  , b = Math.max(0, 12 * (d.getFullYear() - c.getFullYear()) + d.getMonth() - c.getMonth() + (d.getDate() < c.getDate() && !g || g && w(d) < w(c) ? -1 : 0));
                p[e] = t[e] ? Math.floor(b / 12) : 0,
                p[i] = t[i] ? b - 12 * p[e] : 0,
                c = new Date(c.getTime());
                var _ = c.getDate() == m
                  , f = this._getDaysInMonth(c.getFullYear() + p[e], c.getMonth() + p[i]);
                c.getDate() > f && c.setDate(f),
                c.setFullYear(c.getFullYear() + p[e]),
                c.setMonth(c.getMonth() + p[i]),
                _ && c.setDate(f)
            }
            var L = Math.floor((d.getTime() - c.getTime()) / 1e3)
              , y = function(n, e) {
                p[n] = t[n] ? Math.floor(L / e) : 0,
                L -= p[n] * e
            };
            if (y(o, 604800),
            y(s, 86400),
            y(a, 3600),
            y(l, 60),
            y(r, 1),
            L > 0 && !n._since)
                for (var S = [1, 12, 4.3482, 7, 24, 60, 60], D = r, M = 1, T = r; T >= e; T--)
                    t[T] && (p[D] >= M && (p[D] = 0,
                    L = 1),
                    L > 0 && (p[T]++,
                    L = 0,
                    D = T,
                    M = 1)),
                    M *= S[T];
            if (u)
                for (var T = e; T <= r; T++)
                    u && p[T] ? u-- : u || (p[T] = 0);
            return p
        }
    })
}(jQuery),
function(n) {
    n.countdown.regionalOptions.am = {
        labels: ["Տարի", "Ամիս", "Շաբաթ", "Օր", "ժամ", "րոպե", "վարկյան"],
        compactLabels: ["l", "m", "n", "d"],
        compactLabels1: ["g", "m", "n", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.am)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ar = {
        labels: ["سنوات", "أشهر", "أسابيع", "أيام", "ساعات", "دقائق", "ثواني"],
        labels1: ["سنة", "شهر", "أسبوع", "يوم", "ساعة", "دقيقة", "ثانية"],
        compactLabels: ["س", "ش", "أ", "ي"],
        whichLabels: null,
        digits: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
        timeSeparator: ":",
        isRTL: !0
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ar)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.bg = {
        labels: ["Години", "Месеца", "Седмица", "Дни", "Часа", "Минути", "Секунди"],
        labels1: ["Година", "Месец", "Седмица", "Ден", "Час", "Минута", "Секунда"],
        compactLabels: ["l", "m", "n", "d"],
        compactLabels1: ["g", "m", "n", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.bg)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.bn = {
        labels: ["বছর", "মাস", "সপ্তাহ", "দিন", "ঘন্টা", "মিনিট", "সেকেন্ড"],
        labels1: ["বছর", "মাস", "সপ্তাহ", "দিন", "ঘন্টা", "মিনিট", "সেকেন্ড"],
        compactLabels: ["ব", "মা", "স", "দি"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.bn)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.bs = {
        labels: ["Godina", "Mjeseci", "Sedmica", "Dana", "Sati", "Minuta", "Sekundi"],
        labels1: ["Godina", "Mjesec", "Sedmica", "Dan", "Sat", "Minuta", "Sekunda"],
        labels2: ["Godine", "Mjeseca", "Sedmica", "Dana", "Sata", "Minute", "Sekunde"],
        compactLabels: ["g", "m", "t", "d"],
        whichLabels: function(n) {
            return 1 == n ? 1 : n >= 2 && n <= 4 ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.bs)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ca = {
        labels: ["Anys", "Mesos", "Setmanes", "Dies", "Hores", "Minuts", "Segons"],
        labels1: ["Anys", "Mesos", "Setmanes", "Dies", "Hores", "Minuts", "Segons"],
        compactLabels: ["a", "m", "s", "g"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ca)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.cs = {
        labels: ["Roků", "Měsíců", "Týdnů", "Dní", "Hodin", "Minut", "Sekund"],
        labels1: ["Rok", "Měsíc", "Týden", "Den", "Hodina", "Minuta", "Sekunda"],
        labels2: ["Roky", "Měsíce", "Týdny", "Dny", "Hodiny", "Minuty", "Sekundy"],
        compactLabels: ["r", "m", "t", "d"],
        whichLabels: function(n) {
            return 1 == n ? 1 : n >= 2 && n <= 4 ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.cs)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.cy = {
        labels: ["Blynyddoedd", "Mis", "Wythnosau", "Diwrnodau", "Oriau", "Munudau", "Eiliadau"],
        labels1: ["Blwyddyn", "Mis", "Wythnos", "Diwrnod", "Awr", "Munud", "Eiliad"],
        compactLabels: ["b", "m", "w", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.cy)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.da = {
        labels: ["År", "Måneder", "Uger", "Dage", "Timer", "Minutter", "Sekunder"],
        labels1: ["År", "Måned", "Uge", "Dag", "Time", "Minut", "Sekund"],
        compactLabels: ["Å", "M", "U", "D"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.da)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.de = {
        labels: ["Jahre", "Monate", "Wochen", "Tage", "Stunden", "Minuten", "Sekunden"],
        labels1: ["Jahr", "Monat", "Woche", "Tag", "Stunde", "Minute", "Sekunde"],
        compactLabels: ["J", "M", "W", "T"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.de)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.el = {
        labels: ["Χρόνια", "Μήνες", "Εβδομάδες", "Μέρες", "Ώρες", "Λεπτά", "Δευτερόλεπτα"],
        labels1: ["Χρόνος", "Μήνας", "Εβδομάδα", "Ημέρα", "Ώρα", "Λεπτό", "Δευτερόλεπτο"],
        compactLabels: ["Χρ.", "Μην.", "Εβδ.", "Ημ."],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.el)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.es = {
        labels: ["Años", "Meses", "Semanas", "Días", "Horas", "Minutos", "Segundos"],
        labels1: ["Año", "Mes", "Semana", "Día", "Hora", "Minuto", "Segundo"],
        compactLabels: ["a", "m", "s", "g"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.es)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.et = {
        labels: ["Aastat", "Kuud", "Nädalat", "Päeva", "Tundi", "Minutit", "Sekundit"],
        labels1: ["Aasta", "Kuu", "Nädal", "Päev", "Tund", "Minut", "Sekund"],
        compactLabels: ["a", "k", "n", "p"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.et)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.fa = {
        labels: ["‌سال", "ماه", "هفته", "روز", "ساعت", "دقیقه", "ثانیه"],
        labels1: ["سال", "ماه", "هفته", "روز", "ساعت", "دقیقه", "ثانیه"],
        compactLabels: ["س", "م", "ه", "ر"],
        whichLabels: null,
        digits: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        timeSeparator: ":",
        isRTL: !0
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.fa)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.fi = {
        labels: ["vuotta", "kuukautta", "viikkoa", "päivää", "tuntia", "minuuttia", "sekuntia"],
        labels1: ["vuosi", "kuukausi", "viikko", "päivä", "tunti", "minuutti", "sekunti"],
        compactLabels: ["v", "kk", "vk", "pv"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.fi)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.fo = {
        labels: ["Ár", "Mánaðir", "Vikur", "Dagar", "Tímar", "Minuttir", "Sekund"],
        labels1: ["Ár", "Mánaður", "Vika", "Dagur", "Tími", "Minuttur", "Sekund"],
        compactLabels: ["Á", "M", "V", "D"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.fo)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.fr = {
        labels: ["Années", "Mois", "Semaines", "Jours", "Heures", "Minutes", "Secondes"],
        labels1: ["Année", "Mois", "Semaine", "Jour", "Heure", "Minute", "Seconde"],
        compactLabels: ["a", "m", "s", "j"],
        whichLabels: function(n) {
            return n > 1 ? 0 : 1
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.fr)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ge = {
        labels: ["წელი", "თვე", "კვირა", "დღე", "საათი", "წუთი", "წამი"],
        labels1: ["წელი", "თვე", "კვირა", "დღე", "საათი", "წუთი", "წამი"],
        compactLabels: ["y", "m", "w", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ge)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.gl = {
        labels: ["Anos", "Meses", "Semanas", "Días", "Horas", "Minutos", "Segundos"],
        labels1: ["Ano", "Mes", "Semana", "Día", "Hora", "Minuto", "Segundo"],
        compactLabels: ["a", "m", "s", "g"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.gl)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.gu = {
        labels: ["વર્ષ", "મહિનો", "અઠવાડિયા", "દિવસ", "કલાક", "મિનિટ", "સેકન્ડ"],
        labels1: ["વર્ષ", "મહિનો", "અઠવાડિયા", "દિવસ", "કલાક", "મિનિટ", "સેકન્ડ"],
        compactLabels: ["વ", "મ", "અ", "દિ"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.gu)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.he = {
        labels: ["שנים", "חודשים", "שבועות", "ימים", "שעות", "דקות", "שניות"],
        labels1: ["שנה", "חודש", "שבוע", "יום", "שעה", "דקה", "שנייה"],
        compactLabels: ["שנ", "ח", "שב", "י"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !0
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.he)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.hr = {
        labels: ["Godina", "Mjeseci", "Tjedana", "Dana", "Sati", "Minuta", "Sekundi"],
        labels1: ["Godina", "Mjesec", "Tjedan", "Dan", "Sat", "Minutu", "Sekundu"],
        labels2: ["Godine", "Mjeseca", "Tjedana", "Dana", "Sata", "Minute", "Sekunde"],
        compactLabels: ["g", "m", "t", "d"],
        whichLabels: function(n) {
            return n = parseInt(n, 10),
            n % 10 === 1 && n % 100 !== 11 ? 1 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.hr)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.hu = {
        labels: ["Év", "Hónap", "Hét", "Nap", "Óra", "Perc", "Másodperc"],
        labels1: ["Év", "Hónap", "Hét", "Nap", "Óra", "Perc", "Másodperc"],
        compactLabels: ["É", "H", "Hé", "N"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.hu)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.hy = {
        labels: ["Տարի", "Ամիս", "Շաբաթ", "Օր", "Ժամ", "Րոպե", "Վարկյան"],
        labels1: ["Տարի", "Ամիս", "Շաբաթ", "Օր", "Ժամ", "Րոպե", "Վարկյան"],
        compactLabels: ["տ", "ա", "շ", "օ"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.hy)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.id = {
        labels: ["tahun", "bulan", "minggu", "hari", "jam", "menit", "detik"],
        labels1: ["tahun", "bulan", "minggu", "hari", "jam", "menit", "detik"],
        compactLabels: ["t", "b", "m", "h"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.id)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.is = {
        labels: ["Ár", "Mánuðir", "Vikur", "Dagar", "Klukkustundir", "Mínútur", "Sekúndur"],
        labels1: ["Ár", "Mánuður", "Vika", "Dagur", "Klukkustund", "Mínúta", "Sekúnda"],
        compactLabels: ["ár.", "mán.", "vik.", "dag.", "klst.", "mín.", "sek."],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.is)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.it = {
        labels: ["Anni", "Mesi", "Settimane", "Giorni", "Ore", "Minuti", "Secondi"],
        labels1: ["Anno", "Mese", "Settimana", "Giorno", "Ora", "Minuto", "Secondo"],
        compactLabels: ["a", "m", "s", "g"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.it)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ja = {
        labels: ["年", "月", "週", "日", "時", "分", "秒"],
        labels1: ["年", "月", "週", "日", "時", "分", "秒"],
        compactLabels: ["年", "月", "週", "日"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ja)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.kn = {
        labels: ["ವರ್ಷಗಳು", "ತಿಂಗಳು", "ವಾರಗಳು", "ದಿನಗಳು", "ಘಂಟೆಗಳು", "ನಿಮಿಷಗಳು", "ಕ್ಷಣಗಳು"],
        labels1: ["ವರ್ಷ", "ತಿಂಗಳು", "ವಾರ", "ದಿನ", "ಘಂಟೆ", "ನಿಮಿಷ", "ಕ್ಷಣ"],
        compactLabels: ["ವ", "ತಿ", "ವಾ", "ದಿ"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.kn)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ko = {
        labels: ["년", "월", "주", "일", "시", "분", "초"],
        labels1: ["년", "월", "주", "일", "시", "분", "초"],
        compactLabels: ["년", "월", "주", "일"],
        compactLabels1: ["년", "월", "주", "일"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ko)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.lt = {
        labels: ["Metų", "Mėnesių", "Savaičių", "Dienų", "Valandų", "Minučių", "Sekundžių"],
        labels1: ["Metai", "Mėnuo", "Savaitė", "Diena", "Valanda", "Minutė", "Sekundė"],
        compactLabels: ["m", "m", "s", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.lt)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.lv = {
        labels: ["Gadi", "Mēneši", "Nedēļas", "Dienas", "Stundas", "Minūtes", "Sekundes"],
        labels1: ["Gads", "Mēnesis", "Nedēļa", "Diena", "Stunda", "Minūte", "Sekunde"],
        compactLabels: ["l", "m", "n", "d"],
        compactLabels1: ["g", "m", "n", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.lv)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ml = {
        labels: ["വര്‍ഷങ്ങള്‍", "മാസങ്ങള്‍", "ആഴ്ചകള്‍", "ദിവസങ്ങള്‍", "മണിക്കൂറുകള്‍", "മിനിറ്റുകള്‍", "സെക്കന്റുകള്‍"],
        labels1: ["വര്‍ഷം", "മാസം", "ആഴ്ച", "ദിവസം", "മണിക്കൂര്‍", "മിനിറ്റ്", "സെക്കന്റ്"],
        compactLabels: ["വ", "മ", "ആ", "ദി"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ml)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ms = {
        labels: ["Tahun", "Bulan", "Minggu", "Hari", "Jam", "Minit", "Saat"],
        labels1: ["Tahun", "Bulan", "Minggu", "Hari", "Jam", "Minit", "Saat"],
        compactLabels: ["t", "b", "m", "h"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ms)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.my = {
        labels: ["နွစ္", "လ", "ရက္သတဿတပတ္", "ရက္", "နာရီ", "မိနစ္", "စကဿကန့္"],
        labels1: ["နွစ္", "လ", "ရက္သတဿတပတ္", "ရက္", "နာရီ", "မိနစ္", "စကဿကန့္"],
        compactLabels: ["နွစ္", "လ", "ရက္သတဿတပတ္", "ရက္"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.my)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.nb = {
        labels: ["År", "Måneder", "Uker", "Dager", "Timer", "Minutter", "Sekunder"],
        labels1: ["År", "Måned", "Uke", "Dag", "Time", "Minutt", "Sekund"],
        compactLabels: ["Å", "M", "U", "D"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.nb)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.nl = {
        labels: ["Jaren", "Maanden", "Weken", "Dagen", "Uren", "Minuten", "Seconden"],
        labels1: ["Jaar", "Maand", "Week", "Dag", "Uur", "Minuut", "Seconde"],
        compactLabels: ["j", "m", "w", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.nl)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.pl = {
        labels: ["lat", "miesięcy", "tygodni", "dni", "godzin", "minut", "sekund"],
        labels1: ["rok", "miesiąc", "tydzień", "dzień", "godzina", "minuta", "sekunda"],
        labels2: ["lata", "miesiące", "tygodnie", "dni", "godziny", "minuty", "sekundy"],
        compactLabels: ["l", "m", "t", "d"],
        compactLabels1: ["r", "m", "t", "d"],
        whichLabels: function(n) {
            var t = n % 10
              , e = Math.floor(n % 100 / 10);
            return 1 == n ? 1 : t >= 2 && t <= 4 && 1 != e ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.pl)
}(jQuery),
function(n) {
    n.countdown.regionalOptions["pt-BR"] = {
        labels: ["Anos", "Meses", "Semanas", "Dias", "Horas", "Minutos", "Segundos"],
        labels1: ["Ano", "M�s", "Semana", "Dia", "Hora", "Minuto", "Segundo"],
        compactLabels: ["a", "m", "s", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions["pt-BR"])
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ro = {
        labels: ["Ani", "Luni", "Saptamani", "Zile", "Ore", "Minute", "Secunde"],
        labels1: ["An", "Luna", "Saptamana", "Ziua", "Ora", "Minutul", "Secunda"],
        compactLabels: ["A", "L", "S", "Z"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ro)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ru = {
        labels: ["Лет", "Месяцев", "Недель", "Дней", "Часов", "Минут", "Секунд"],
        labels1: ["Год", "Месяц", "Неделя", "День", "Час", "Минута", "Секунда"],
        labels2: ["Года", "Месяца", "Недели", "Дня", "Часа", "Минуты", "Секунды"],
        compactLabels: ["л", "м", "н", "д"],
        compactLabels1: ["г", "м", "н", "д"],
        whichLabels: function(n) {
            var t = n % 10
              , e = Math.floor(n % 100 / 10);
            return 1 == n ? 1 : t >= 2 && t <= 4 && 1 != e ? 2 : 1 == t && 1 != e ? 1 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ru)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.sk = {
        labels: ["Rokov", "Mesiacov", "Týždňov", "Dní", "Hodín", "Minút", "Sekúnd"],
        labels1: ["Rok", "Mesiac", "Týždeň", "Deň", "Hodina", "Minúta", "Sekunda"],
        labels2: ["Roky", "Mesiace", "Týždne", "Dni", "Hodiny", "Minúty", "Sekundy"],
        compactLabels: ["r", "m", "t", "d"],
        whichLabels: function(n) {
            return 1 == n ? 1 : n >= 2 && n <= 4 ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.sk)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.sl = {
        labels: ["Let", "Mesecev", "Tednov", "Dni", "Ur", "Minut", "Sekund"],
        labels1: ["Leto", "Mesec", "Teden", "Dan", "Ura", "Minuta", "Sekunda"],
        compactLabels: ["l", "m", "t", "d"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.sl)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.sq = {
        labels: ["Vite", "Muaj", "Javë", "Ditë", "Orë", "Minuta", "Sekonda"],
        labels1: ["Vit", "Muaj", "Javë", "Dit", "Orë", "Minutë", "Sekond"],
        compactLabels: ["V", "M", "J", "D"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.sq)
}(jQuery),
function(n) {
    n.countdown.regionalOptions["sr-SR"] = {
        labels: ["Godina", "Meseci", "Nedelja", "Dana", "Časova", "Minuta", "Sekundi"],
        labels1: ["Godina", "Mesec", "Nedelja", "Dan", "Čas", "Minut", "Sekunda"],
        labels2: ["Godine", "Meseca", "Nedelje", "Dana", "Časa", "Minuta", "Sekunde"],
        compactLabels: ["g", "m", "n", "d"],
        whichLabels: function(n) {
            return 1 == n ? 1 : n >= 2 && n <= 4 ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions["sr-SR"])
}(jQuery),
function(n) {
    n.countdown.regionalOptions.sr = {
        labels: ["Година", "Месеци", "Недеља", "Дана", "Часова", "Минута", "Секунди"],
        labels1: ["Година", "месец", "Недеља", "Дан", "Час", "Минут", "Секунда"],
        labels2: ["Године", "Месеца", "Недеље", "Дана", "Часа", "Минута", "Секунде"],
        compactLabels: ["г", "м", "н", "д"],
        whichLabels: function(n) {
            return 1 == n ? 1 : n >= 2 && n <= 4 ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.sr)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.sv = {
        labels: ["År", "Månader", "Veckor", "Dagar", "Timmar", "Minuter", "Sekunder"],
        labels1: ["År", "Månad", "Vecka", "Dag", "Timme", "Minut", "Sekund"],
        compactLabels: ["Å", "M", "V", "D"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.sv)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.th = {
        labels: ["ปี", "เดือน", "สัปดาห์", "วัน", "ชั่วโมง", "นาที", "วินาที"],
        labels1: ["ปี", "เดือน", "สัปดาห์", "วัน", "ชั่วโมง", "นาที", "วินาที"],
        compactLabels: ["ปี", "เดือน", "สัปดาห์", "วัน"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.th)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.tr = {
        labels: ["Yıl", "Ay", "Hafta", "Gün", "Saat", "Dakika", "Saniye"],
        labels1: ["Yıl", "Ay", "Hafta", "Gün", "Saat", "Dakika", "Saniye"],
        compactLabels: ["y", "a", "h", "g"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.tr)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.uk = {
        labels: ["Років", "Місяців", "Тижнів", "Днів", "Годин", "Хвилин", "Секунд"],
        labels1: ["Рік", "Місяць", "Тиждень", "День", "Година", "Хвилина", "Секунда"],
        labels2: ["Роки", "Місяці", "Тижні", "Дні", "Години", "Хвилини", "Секунди"],
        compactLabels: ["r", "m", "t", "d"],
        whichLabels: function(n) {
            return 1 == n ? 1 : n >= 2 && n <= 4 ? 2 : 0
        },
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.uk)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.ur = {
        labels: ["سال", "مہينے", "ہفتے", "دن", "گھنٹے", "منٹس", "سيکنڑز"],
        labels1: ["سال", "ماہ", "ہفتہ", "دن", "گھنٹہ", "منٹ", "سیکنڈز"],
        compactLabels: ["(ق)", "سینٹ", "ایک", "J"],
        whichLabels: null,
        digits: ["٠", "١", "٢", "٣", "۴", "۵", "۶", "۷", "٨", "٩"],
        timeSeparator: ":",
        isRTL: !0
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.ur)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.uz = {
        labels: ["Yil", "Oy", "Hafta", "Kun", "Soat", "Daqiqa", "Soniya"],
        labels1: ["Yil", "Oy", "Hafta", "Kun", "Soat", "Daqiqa", "Soniya"],
        compactLabels: ["y", "o", "h", "k"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.uz)
}(jQuery),
function(n) {
    n.countdown.regionalOptions.vi = {
        labels: ["Năm", "Tháng", "Tuần", "Ngày", "Giờ", "Phút", "Giây"],
        labels1: ["Năm", "Tháng", "Tuần", "Ngày", "Giờ", "Phút", "Giây"],
        compactLabels: ["năm", "th", "tu", "ng"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions.vi)
}(jQuery),
function(n) {
    n.countdown.regionalOptions["zh-CN"] = {
        labels: ["年", "月", "周", "天", "时", "分", "秒"],
        labels1: ["年", "月", "周", "天", "时", "分", "秒"],
        compactLabels: ["年", "月", "周", "天"],
        compactLabels1: ["年", "月", "周", "天"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions["zh-CN"])
}(jQuery),
function(n) {
    n.countdown.regionalOptions["zh-TW"] = {
        labels: ["年", "月", "周", "天", "時", "分", "秒"],
        labels1: ["年", "月", "周", "天", "時", "分", "秒"],
        compactLabels: ["年", "月", "周", "天"],
        compactLabels1: ["年", "月", "周", "天"],
        whichLabels: null,
        digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        timeSeparator: ":",
        isRTL: !1
    },
    n.countdown.setDefaults(n.countdown.regionalOptions["zh-TW"])
}(jQuery);
