# What is this?

During the last 48 hours, we've created 3 main applications: a Renderer [Backend](https://github.com/biharygergo/team-discover-videos-backend), a Video Editor Frontend (this repository) and a Telegram Bot.

The renderer backend is responsible for managing commands coming from the UI and updating Premiere Pro project files based on the input. The backend supports replacing text, video, images and audio. Further, it adds features that build on the basic blocks, such as translating an existing text. The compiled project XML is passed to the "rendering farm" which uses Adobe Media Encoder to render high-quality video files.

The frontend is a React/Next.js application that shows a simple video-editing layout where the controls are "hidden" behind a command-prompt. Users enter prompts, which the UI parses and tries to understand what the editing intention was. For example.: "replace text with Junction2023" would send a request to the backend requesting the currently active text track to be updated with the given value.

The Telegram bot is used to collect materials for a fictional marketing campaign, where Junction could use our automated tool to create hyper-personalized videos for participants. Hackers sent us videos during the weekend and we've used our new API to generate high-quality, "Instagram worthy" videos.

You can check out the flow by visiting our demo website, where a new sandbox project is generated for every visitor. This allows you to edit your own little video and see how each of the commands and the editor interface works. Everything is generated on Gregorio's Macbook Air, so don't get too creative please. :)

[DEMO APP](https://bit.ly/TeamDiscover)

## Team

Good friends from Hungary, having fun at hackathons:)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
