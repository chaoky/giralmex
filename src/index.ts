import twit from "twit";
import axios from "axios";
import { v4 } from "uuid";
import secrets from "../secrets.json";

console.log("starting");

const gira: any = new twit({
  ...secrets.bot,
  ...secrets.gira,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const giraId = "983327756640489473";

const streamGira = gira.stream("statuses/filter", {
  follow: giraId,
});

streamGira.on("tweet", async (tweet: any) => {
  if (tweet.user.id_str == giraId) {
    if (tweet.text != "") {
      console.log(tweet);
      let mexicano = await axios({
        method: "POST",
        url: "https://api.cognitive.microsofttranslator.com/translate",
        params: {
          "api-version": "3.0",
          to: "es",
          profanityAction: "NoAction",
          suggestedFrom: "pt",
        },
        headers: {
          "Ocp-Apim-Subscription-Key": "e4a35a78334048e99820733b7aa62bd8",
          "Content-type": "application/json",
          "X-ClientTraceId": v4().toString(),
          "Ocp-Apim-Subscription-Region": "canadacentral",
        },
        data: [
          {
            text: tweet.text.replace(/@\w*/g, "").replace(/\n/g, "newline"),
          },
        ],
      });

      gira.post("statuses/update", {
        status: mexicano.data[0].translations[0].text.replace(/newline/g, "\n"),
        attachment_url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      });
    }
  }
});

////////////////////////KPOP

const livia: any = new twit({
  ...secrets.bot,
  ...secrets.livia,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const streamLivia = livia.stream("statuses/filter", {
  track: ["@minatozaki_lily"],
});

streamLivia.on("tweet", ({ text }: { text: string }) => {
  const fancam = text.match(/https:\/\/t.co\/\w*/g);
  livia.post("statuses/update", {
    status: fancam,
    attachment_url: fancam,
  });
});

console.log("working");
