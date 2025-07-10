const { Client } = require("@notionhq/client");

exports.handler = async (event) => {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const { name, status } = JSON.parse(event.body);

  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: name } }],
        },
        Status: {
          select: { name: status },
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: response.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};