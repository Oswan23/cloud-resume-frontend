# AWS Cloud Resume Challenge

## Live Website

https://www.osaretinewansiha.com

------------------------------------------------------------------------

## 1. Project Overview

This repository contains my implementation of the **Cloud Resume
Challenge**, a multi-step cloud engineering project designed to
demonstrate practical cloud architecture and full‑stack integration
using AWS.

While originally intended as a tutorial project, this implementation
evolved into a **production‑style serverless portfolio website** that
includes custom frontend features, real-time metrics tracking, and
extensive debugging across AWS services.

The project combines:

-   a static frontend served through a CDN
-   serverless backend APIs
-   persistent storage for visitor metrics
-   frontend interaction tracking
-   a responsive UI with theme support

The development process involved **iterative debugging and architectural
adjustments across AWS and the frontend stack**, making this a realistic
exercise in cloud engineering workflows.

------------------------------------------------------------------------

## 2. Architecture

The application uses a **serverless AWS architecture** with a static
frontend and event-driven backend services.

### Frontend

**Amazon S3**\
Hosts static website assets including HTML, CSS, JavaScript, and
documents.

**Amazon CloudFront**\
Provides CDN delivery with HTTPS and global edge caching.

**Custom Domain**\
The website is served through a custom domain configured through
CloudFront.

------------------------------------------------------------------------

### Backend

**Amazon API Gateway**\
Provides REST endpoints used by the frontend.

**AWS Lambda (Python)**\
Handles requests from API Gateway to:

-   increment visitor counters
-   update interaction metrics
-   return updated values to the UI

**Amazon DynamoDB**\
Stores global metrics for the website using atomic counters.

------------------------------------------------------------------------

### Request Flow

User visits website\
↓\
CloudFront CDN\
↓\
Static assets loaded from S3\
↓\
Frontend JavaScript calls API Gateway\
↓\
Lambda function executes\
↓\
DynamoDB counter updated / retrieved\
↓\
Updated value returned to frontend\
↓\
UI displays updated counter

------------------------------------------------------------------------

## 3. Technologies Used

### Cloud Platform

-   AWS S3
-   AWS CloudFront
-   AWS API Gateway
-   AWS Lambda
-   AWS DynamoDB
-   AWS IAM
-   AWS CloudWatch

### Frontend

-   HTML5
-   CSS3
-   Vanilla JavaScript

### Backend

-   Python
-   Boto3 (AWS SDK)

### Infrastructure / Deployment

-   Terraform
-   AWS SAM
-   GitHub Actions

------------------------------------------------------------------------

## 4. Key Features Implemented

### Global View Counter

Tracks total page views across all visitors.

-   Triggered when the page loads
-   API Gateway + Lambda retrieves and updates the value
-   DynamoDB stores the persistent counter
-   UI caching prevents visible counter flicker

------------------------------------------------------------------------

### Interactive Click Tracker

Tracks user interactions through a clickable button.

Features include:

-   backend counter updates through API Gateway
-   frontend updates UI instantly
-   debounce logic prevents excessive API calls

------------------------------------------------------------------------

### Click Persistence Lock

A hidden interaction feature allowing users to persist click counts
across page refreshes.

Behavior:

-   default: click count resets on refresh
-   locked: click count persists using localStorage
-   unlocking resets behavior again

------------------------------------------------------------------------

### Theme System (Dark / Light Mode)

Responsive theme toggle with persistent user preference.

Features:

-   preference stored in localStorage
-   early theme initialization prevents UI flash
-   smooth switching between modes

------------------------------------------------------------------------

### Resume Hosting

The resume is hosted through S3 and served via CloudFront.

-   accessible through the site
-   opens in browser preview rather than forced download
-   optimized for quick access

------------------------------------------------------------------------

## 5. Engineering Challenges & Debugging

### DynamoDB Data Type Validation Error

During backend integration the API returned:

500 Internal Server Error\
ValidationException: operand in update expression has incorrect data
type

Using **CloudWatch logs**, the issue was traced to the DynamoDB
attribute being stored as a string instead of a number. Correcting the
schema resolved the issue.

------------------------------------------------------------------------

### Duplicate API Calls

The view counter initially incremented twice on page refresh.

Cause: duplicate script blocks triggering the API request.

Fix: removing duplicate script calls.

------------------------------------------------------------------------

### Missing CloudWatch Log Group

An error appeared indicating:

Log group does not exist

This occurred because the Lambda function had not executed successfully
yet. Once the function ran correctly, CloudWatch automatically created
the log group.

------------------------------------------------------------------------

### Counter UI Flicker

Initially the UI displayed `0` before the counter value loaded.

Fix:

-   implement asynchronous loading
-   cache previous counter value
-   display cached value immediately

------------------------------------------------------------------------

### Dark Mode Initialization Bug

Fixing theme flash introduced a JavaScript redeclaration issue. Wrapping
the initialization logic inside an **IIFE** resolved the problem.

------------------------------------------------------------------------

## 6. Security & Performance Considerations

### API Abuse Protection

Frontend includes debounce logic to reduce excessive requests.

Future improvements include:

-   API Gateway rate limiting
-   AWS WAF integration

------------------------------------------------------------------------

### Least Privilege IAM

Lambda functions only receive permissions required for DynamoDB:

-   GetItem
-   UpdateItem

------------------------------------------------------------------------

### CDN Performance

CloudFront improves latency by caching assets at global edge locations.

------------------------------------------------------------------------

## 7. Project Structure

    cloud-resume-frontend/
    │
    ├── index.html
    ├── style.css
    ├── script.js
    ├── resume.pdf
    └── README.md

Backend infrastructure (Lambda, Terraform, SAM templates) is maintained
separately.

------------------------------------------------------------------------

## 8. Future Improvements

Potential upgrades include:

-   API Gateway throttling
-   AWS WAF protection
-   CI/CD deployment pipelines
-   analytics dashboard
-   DynamoDB event logging

------------------------------------------------------------------------

## 9. Lessons Learned

This project provided hands‑on experience with:

-   serverless architecture design
-   frontend ↔ backend integration
-   debugging distributed cloud systems
-   CloudWatch logging and diagnostics
-   managing application state across frontend and backend

It demonstrates the **iterative nature of cloud engineering**, where
infrastructure, application code, and debugging workflows evolve
together.
