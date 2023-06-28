# Lambda thumbnail worker

## Description
This is a lambda function that will resize an image and upload it to S3.

## Stack

```stacks/MyStack.ts```

- AWS Lambda -> consumer of SQS and rest API 
- AWS SQS
- AWS S3 -> store images and static website
- Cloudfront -> CDN for static website

## Overview
<!-- show image public/S3, SQS, Lambda resize.jpeg -->
![S3, SQS, Lambda resize](./public/S3,%20SQS,%20Lambda%20resize.jpeg)
