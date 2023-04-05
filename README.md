# React JS Resume Website Template

![alt text](https://github.com/georgekhananaev/resume-website/blob/main/screenshot.png?raw=true)


## Perfect Google PageSpeed Insights Score

![alt text](https://github.com/georgekhananaev/resume-website/blob/main/seo_georgekhananaev_website.png?raw=true)


## Description

This is a React based personal resume website template. It based on Tim Baker's code, however I changed here multiple
things and added matrix effect, contact form, text typing effect, and removed all annoying errors with latest react
versions. Built with typescript on the Next.js framework, styled with
Tailwind css, and populated with data from a single file, you can easily create, customize and host your own personal
website in minutes. Even better, the site is fully mobile-optimized and server-side rendered to ensure fast loading and
a clean UI on any device. Read on to learn how to make it your own.

## Make it Your Own!

### 1. Make sure you have what you need

To build this website, you will need to have the latest stable versions of Node and Yarn downloaded and installed on
your machine. If you don't already have them, you can get Node [here,](https://nodejs.org/en/download/) and
Yarn [here.](https://yarnpkg.com/getting-started/install)

### 2. Fork and download this repo (and star if you like!)

Next, find the `Fork` button in the top right of this page. This will allow you to make your own copy, for more info on
forking repo's see [here.](https://docs.github.com/en/get-started/quickstart/fork-a-repo#forking-a-repository) After
this, download to your development machine using the green `Code` button at the top of the repo page.

### 3. Install dependencies and run

Once you have your own copy of this repo forked and downloaded, open the folder in your favorite terminal and
run `yarn install` to install dependencies. Following this, run `yarn dev` to run the project. In your terminal you
should be given the url of the running instance (usually http://localhost:3000 unless you have something else running).

### 4. Customize the data to make it your own

All of the data for the site is driven via a file at `/src/data/data.tsx`. This is where you'll find the existing
content, and updating the values here will be reflected on the site. If you have the site running as described above,
you should see these changes reflected on save. The data types for all of these items are given in the same folder in
the `dataDef.ts` file. Example images can be found at `src/images/` and are imported in the data file. To change, simply
update these images using the same name and location, or add new images and update the imports.

### 5. Hook up contact form

I added [EmailJS](https://www.emailjs.com/) contact form with [reCaptcha](https://www.google.com/recaptcha).
to use the contact form simply edit the file
ContactForm.tsx

```
1. row 55: insert your serviceID, templateID, publicKey from EmailJS
2. row 119: insert your recaptcha sitekey from reCaptcha
```

### 6. Make any other changes you like

Of course, all of the code is there and nothing is hidden from you so if you would like to make any other styling/data
changes, feel free!

### 7. Deploy to Netlify and enjoy your new Resume Website

After editing the content, deploying your React based static website to **netlify** is simple and free. It takes nearly 2 minutes to push your forked repository to production. You can join [here.](https://www.netlify.com) **Congratulations!**

[![Netlify Status](https://api.netlify.com/api/v1/badges/4e6cdcf5-06db-4e22-9739-cefd33f748b5/deploy-status)](https://app.netlify.com/sites/georgekhananaev/deploys)
