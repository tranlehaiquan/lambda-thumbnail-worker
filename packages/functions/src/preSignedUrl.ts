// s3 presigned url
const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
    }),
  }
}