const { Client } = require("@notionhq/client");

exports.handler = async (event) => {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const { id, name, status } = JSON.parse(event.body);

  try {
    const response = await notion.pages.update({
      page_id: id,
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
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};