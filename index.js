"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const webhook_1 = require("@slack/webhook");
const axios_1 = require("axios");
const qs = require("querystring");
(async () => {
    var _a;
    // Validate parameters
    const [productId, scheduleId, seatId, webhookUrl] = [
        "product-id",
        "schedule-id",
        "seat-id",
        "slack-incoming-webhook-url",
    ].map((name) => {
        const value = core.getInput(name);
        if (!value) {
            throw new Error(`melon-ticket-actions: Please set ${name} input parameter`);
        }
        return value;
    });
    const message = (_a = core.getInput("message")) !== null && _a !== void 0 ? _a : "티켓사세요";
    const webhook = new webhook_1.IncomingWebhook(webhookUrl);
    const res = await axios.default({
  method: "POST",
  url: "https://ticket.melon.com/ktapp/product/seatStateInfo.json",
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Referer": "https://ticket.melon.com/performance/index.htm?prodId=212148",
    "Origin": "https://ticket.melon.com",
    "Cookie": "복사한_쿠키값_여기에_붙여넣기"
  },
  params: {
    v: "1",
  },
  data: qs.stringify({
    productId,
    scheduleId,
    seatId,
    selectedGradeVolume: 1,
    volume: 1,
  }),
});

    // tslint:disable-next-line
    console.log("Got response: ", res.data);
    if (res.data.chkResult) {
        const link = `http://ticket.melon.com/performance/index.htm?${qs.stringify({
            prodId: productId,
        })}`;
        await webhook.send(`${message} ${link}`);
    }
})().catch((e) => {
    console.error(e.stack); // tslint:disable-line
    core.setFailed(e.message);
});
