const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ID;

exports.handler = async function (event, context) {
  const propertyMap = {
    name: "Project Name",
    aol: "AOL",
    due: "deadline",
    gain: "gain ",
    urgency: "Urgency",
    status: "Status",
    delegate: "delegte to",
    decision: "Is decision "
  };

  try {
    const payload = JSON.parse(event.body);
    const properties = {};

    for (const [key, value] of Object.entries(payload)) {
      const notionKey = propertyMap[key];
      if (!notionKey) continue;

      if (notionKey === "deadline") {
        properties[notionKey] = {
          date: { start: value }
        };
      } else if (notionKey === "Is decision ") {
        properties[notionKey] = {
          checkbox: value === true || value === "Yes"
        };
      } else if (
        ["Status", "Urgency", "AOL", "delegte to"].includes(notionKey)
      ) {
        properties[notionKey] = {
          select: { name: value }
        };
      } else if (notionKey === "Project Name") {
        properties[notionKey] = {
          title: [{ text: { content: String(value) } }]
        };
      } else {
        properties[notionKey] = {
          rich_text: [{ text: { content: String(value) } }]
        };
      }
    }

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task added successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};