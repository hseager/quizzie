# Quizzie

## To Do
### V1.0
- Move to actual hosting
- Picture mode for questions

### V1.1
- Join QR Code/Password
- Email signup & accounts
- Show similar quizzes under quiz info
- Create tag option on create quiz

### Bugs
- Race conditions saving lobby when restarting server + 2 people connect and same time, players get overwritten, maybe await .save()

### Technical improvements
- Instead of getting quiz when starting lobby, load quiz when initialising lobby or updating quiz in memory
    - Merge this.quizId and this.quiz
- Instead of using next api to create lobby, use socket to create lobby then save
- Investigate creating lobby load times
- Improve error logging (save to file, track API urls erroring etc)
- Unify results + lobby API responses (message: 'ok' vs status: 'created')
- Find a way to skip having to do status: 200 in API json response

### UI Improvements
- Show loading when starting quiz

### Extra Features for future versions
- QR Code for joining lobby
- Move question timer to DB/setting rather than hardcoded 10secs
- Sort/Filter quizzes by rating/plays/type
- Estimated time to complete quiz
- Ratings
- Comments
- Lobby Chat room
- Public/Private Quiz option on create 
- Quiz types - Standard/Text type/Fastest finger/Order answers/Freetext
- Rewards(Trophies)
- Microtransactions - Cosmetics, Avatars, Winning animations, quiz packs OR supporter packs OR patrion
- Music round maybe with youtube videos
- Admin panel to manage quizzes better
- Countdown to quiz start
- Show quiz plays on frontend
- Unload quiz after playing to prevent people playing same quiz twice

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
