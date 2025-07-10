const { Client } = require("@notionhq/client");

exports.handler = async () => {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
    });

    const tasks = response.results.map(page => ({
      id: page.id,
      name: page.properties.Name?.title[0]?.text?.content || "Untitled",
      status: page.properties.Status?.select?.name || "No Status",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};