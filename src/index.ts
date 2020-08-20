import twit from "twit";
import axios from "axios";
import { v4 } from "uuid";
import secrets from "../secrets.json";

console.log("starting");

const t: any = new twit({
  ...secrets,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const giraId = "983327756640489473";

const stream = t.stream("statuses/filter", {
  follow: giraId,
});

console.log("working");

stream.on("tweet", async (tweet: any) => {
  if (tweet.user.id_str == giraId) {
    if (tweet.text != "") {
      console.log(tweet);
      let mexicano = await axios({
        method: "POST",
        url: "https://api.cognitive.microsofttranslator.com/translate",
        params: {
          "api-version": "3.0",
          to: ["es"],
        },
        headers: {
          "Ocp-Apim-Subscription-Key": "e4a35a78334048e99820733b7aa62bd8",
          "Content-type": "application/json",
          "X-ClientTraceId": v4().toString(),
          "Ocp-Apim-Subscription-Region": "canadacentral",
        },
        data: [
          {
            text: tweet.text.replace(/@\w*/g, ""),
          },
        ],
      });

      t.post("statuses/update", {
        status: mexicano.data[0].translations[0].text,
        attachment_url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      });
    }
  }
});
