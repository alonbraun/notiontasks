const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ID;

exports.handler = async function () {
  try {
    const response = await notion.databases.query({ database_id: databaseId });

    const tasks = response.results.map((page) => {
      return {
        name: page.properties["Project Name"].title?.[0]?.plain_text || "Untitled",
        status: page.properties["Status"].select?.name || null,
        due: page.properties["deadline"].date?.start || null,
        urgency: page.properties["Urgency"].rich_text?.[0]?.plain_text || null,
        gain: page.properties["gain "]?.rich_text?.[0]?.plain_text || null,
        delegate: page.properties["delegte to"]?.rich_text?.[0]?.plain_text || null,
        decision: page.properties["Is decision "]?.checkbox || false,
        aol: page.properties["AOL"]?.rich_text?.[0]?.plain_text || null
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(tasks)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
