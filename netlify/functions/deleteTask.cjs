exports.handler = async () => {
  return {
    statusCode: 501,
    body: JSON.stringify({ error: "Notion API does not support deleting pages via API. You can archive instead." }),
  };
};