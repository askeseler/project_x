class YtShortsScraper {
    constructor() {
        this.comments = {};
        this.n_comments = {};
        this.subtitles = {};
        this.title;
        this.accountname;
        this.likes;
        this.channel_name;
        this.start_watch_time;
        this.date;
    }

    scrape_account_name() {
        return new Promise(resolve => this.scrape_account_name_rek(true, resolve));
    }

    scrape_account_name_rek(click, callback) {
        if (this.accountname === undefined) {
            if (document.getElementById("avatar-btn") === null) {
                console.log("no avatar button");
                this.accountname = "not signed in";
            }
            if (document.getElementById("account-name")) {
                console.log("Account name found. Closing.");
                this.accountname = document.getElementById("account-name").innerText;
                console.log(this.accountname);
                document.getElementById("avatar-btn").children[0].children[0].click();
                callback();
            }
            else {
                console.log("No account name. Opening panel and trying again.")
                if (click) document.getElementById("avatar-btn").children[0].children[0].click();
                setTimeout(() => this.scrape_account_name(false, callback()), 500);
            }
        }
        else callback();
        //return;
    }

    scrape_likes() {
        let action_container = document.getElementsByClassName("html5-video-container")[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[3].children[0].children[1];
        this.likes = this.text2num(action_container.getElementsByTagName("span")[0].innerText);
    }

    static open_comments() {
        let open_cmt = document.getElementById("comments-button").children[0].children[0].children[0];
        open_cmt.click();
        console.log("click open comments");

        let panels = document.getElementsByClassName("ytd-reel-video-renderer watch-while-engagement-panel ytd-reel-video-renderer");
        //for (let p of Array.from(panels)) { p.style.left = "-10%"; p.style.opacity = 0 };
        panels = document.getElementsByClassName("reel-video-in-sequence style-scope ytd-shorts");
        //for (let p of Array.from(panels)) p.style.right = 0;
    }

    text2num(text) {
        let number;
        if (new RegExp('^([0-9]|\.)+K$').test(text)) {
            number = Math.round(1000 * parseFloat(text.slice(0, -1)));
        }
        else if (new RegExp('^([0-9]|\.)+M$').test(text)) {
            number = Math.round(1000000 * parseFloat(text.slice(0, -1)));
        }
        else if (new RegExp('([0-9]*[.])?[0-9]+').test(text)) {
            number = Math.round(parseFloat(text));
        } else {
            console.log("COULD NOT PARSE NUMBER " + text);
            number = 0;
        }
        return number;
    }

    scrape_comments() {
        return new Promise((resolve, reject) => this.scrape_comments_rek(true, resolve));
    }

    scrape_comments_rek(wait, resolve) {
        console.log("scrape_comments_rek");
        let comments = document.getElementsByTagName("ytd-engagement-panel-section-list-renderer")[0];
        if (comments === undefined){
            console.log("comments not open yet");
            setTimeout(() => this.scrape_comments_rek(wait, resolve), 500);
            return;
        };
        if(wait){
            setTimeout(() => this.scrape_comments_rek(false, resolve), 1000);
            return;
        }
        let n_comments = comments.children[0].children[0].children[2].children[2].children[0].getAttribute("aria-label").slice(9, 20);
        comments = Array.from(comments.querySelectorAll('[id=content-text]')).map((x) => x.innerText);

        n_comments = this.text2num(n_comments);
        this.comments[this.video_id] = JSON.stringify(comments);
        this.n_comments[this.video_id] = n_comments;

        resolve();
    }

    scrape_channel_name() {
        this.channel_name = document.getElementsByClassName("html5-video-container")[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[3].children[0].children[0].children[0].children[2].children[5].children[0].innerText;
        return this.channel_name;
    }

    scrape_title() {
        this.title = document.getElementsByClassName("html5-video-container")[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[3].children[0].children[0].children[0].children[2].children[2].innerText;
        return this.title;
    }

    async send(body) {
        if (body["video_id"] in this.subtitles && body["video_id"] in this.comments && body["video_id"] in this.n_comments) {
            body["subtitles"] = this.subtitles[body["video_id"]];
            body["comments"] = this.comments[body["video_id"]];
            body["n_comments"] = this.n_comments[body["video_id"]];

            body = JSON.stringify(body);

            console.log("Sending now");

            fetch('http://localhost:8081/add_item', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // body: '{\n  "no": 0,\n  "title": "string",\n  "content": "string",\n  "accountname": "string",\n  "video_id": "string",\n  "subtitles": "string",\n  "comments": "string",\n  "n_comments": 0,\n  "n_likes": 0,\n  "channel_name": "string",\n  "date": "string",\n  "time_watched": 0\n}',
                body: body
            }).then(res => {
                if (res.status != 200){console.log("Request complete! response:", res);
                console.log(body);
            };
                delete this.subtitles[this.video_id];
            }).catch(() => {
                console.log("Date not sent.");
                delete this.subtitles[this.video_id];
            }
            );

            delete this.subtitles[body["video_id"]];
            delete this.subtitles[body["video_id"]];
            delete this.subtitles[body["video_id"]];
        }
        else await new Promise(resolve => setTimeout(() => {resolve(this.send(body)) }, 100));
    }

    prepare_data() {
        //console.log("-----------------")
        var currentdate = new Date();
        this.date = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + "T"
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        this.time_watched = new Date() - this.start_watch_time;
        this.scrape_title();
        this.scrape_likes();
        this.scrape_channel_name();

        let body = {
            'title': this.title,
            'accountname': this.accountname,
            'video_id': this.video_id,
            'subtitles': this.subtitles[this.video_id],
            'n_likes': this.likes,
            'channel_name': this.channel_name,
            'date': this.date,
            'time_watched': this.time_watched
        }
        body = JSON.parse(JSON.stringify(body));
        return body;
    }

    async get_subtitles(videoId, languageCode) {
        try {
            let subs = await (async () => {
                const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
                const html = await response.text();
                const ytInitialPlayerResponse = JSON.parse(html.split('ytInitialPlayerResponse = ')[1].split(`;var meta = document.createElement('meta')`)[0]);
                const captionTracks = ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
                const captionTrack = languageCode ? captionTracks.find(c => c.languageCode === languageCode) : captionTracks[0];
                return (await fetch(captionTrack.baseUrl)).text();
            })();

            let xml = new DOMParser().parseFromString(subs, "text/xml");
            let textNodes = [...xml.getElementsByTagName('text')];
            let subsText = textNodes.map(x => x.textContent).join(" ").replaceAll('&#39;', "'");
            return subsText;
        } catch {
            return "";
        }
    }

    next_video() {
        next_video_str = '{"isTrusted":false,"__composedPath":"Object","key":"ArrowDown","code":"ArrowDown","location":0,"ctrlKey":false,"shiftKey":false,"altKey":false,"metaKey":false,"repeat":false,"isComposing":false,"charCode":0,"keyCode":40,"DOM_KEY_LOCATION_STANDARD":0,"DOM_KEY_LOCATION_LEFT":1,"DOM_KEY_LOCATION_RIGHT":2,"DOM_KEY_LOCATION_NUMPAD":3,"getModifierState":"Object","initKeyboardEvent":"Object","detail":0,"which":40,"initUIEvent":"Object","type":"keydown","target":{"id":""},"currentTarget":null,"eventPhase":0,"bubbles":true,"cancelable":true,"defaultPrevented":true,"composed":true,"timeStamp":1010733.7000000477,"srcElement":{"id":""},"returnValue":false,"cancelBubble":false,"NONE":0,"CAPTURING_PHASE":1,"AT_TARGET":2,"BUBBLING_PHASE":3,"composedPath":"Object","initEvent":"Object","preventDefault":"Object","stopImmediatePropagation":"Object","stopPropagation":"Object","__shady_patchedProto":"Object"}'
        next_video = JSON.parse(next_video_str);
        next_video = new KeyboardEvent("keydown", next_video);
        document.getElementsByTagName('body')[0].dispatchEvent(next_video);
    }

    async start_scraping() {
        let self = this;

        let element = document.getElementsByClassName("ytp-title-link")[0];
        self.video_id = element.href.split("/")[4];
        let prev_id = self.video_id;

        YtShortsScraper.open_comments();
        await this.scrape_account_name();
        console.log("account name known")
        await this.scrape_comments();
        console.log("comments known");
        this.start_watch_time = new Date();
        self.subtitles[self.video_id] = await this.get_subtitles(self.video_id);

        var observer = new MutationObserver(async function (mutations) {
            element = document.getElementsByClassName("ytp-title-link")[0];
            self.video_id = element.href.split("/")[4];

            if (prev_id !== self.video_id) {
                this.start_watch_time = new Date();
                prev_id = self.video_id;
                YtShortsScraper.open_comments();
                await self.scrape_comments();
                console.log("comments known 1");

                self.subtitles[self.video_id] = await self.get_subtitles(self.video_id);
                console.log("subtitles known 1")
                let body = self.prepare_data();
                await self.send(body);
            };
        });

        observer.observe(element, {
            attributes: true //configure it to listen to attribute changes
        });
    };
}