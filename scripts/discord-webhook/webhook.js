import fetch from "node-fetch";

import { getExtensionDetails } from "../common/extensionDetails.js";

function createDiscordEmbed(extension) {
  const embed = {
    color: 0xbb99ff,
    title: extension.title,
    description: extension.description,
    url: encodeURI(`https://extensions.owlbear.rodeo/${extension.id}`),
    image: {
      url: extension.image,
    },
    author: {
      name: extension.author,
    },
    fields: [
      {
        name: "",
        value: `${extension.tags.map((tag) => "`" + tag + "`").join("   ")}`,
        inline: true,
      },
    ],
  };

  return embed;
}

function createDiscordWebhookPayload(extension) {
  const embed = createDiscordEmbed(extension);

  const payload = {
    content: ":flame: New Extension Released :flame:",
    embeds: [embed],
  };

  return payload;
}

export async function sendDiscordWebhook() {
  const { id, data } = await getExtensionDetails();

  const payload = createDiscordWebhookPayload({
    id,
    ...data,
  });

  const response = await fetch(process.env.DISCORD_WEBHOOK, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    console.log("Success!!");
  } else {
    console.log(JSON.stringify(await response.text(), null, 2));
  }
}
