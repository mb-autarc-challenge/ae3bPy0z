# Autarc coding challenge

In this repo you'll find my submission.  
This is a React application developed with the Remix framework.  

To start the application on the development mode, please run:  
```
npm install
npm run dev
```

This will serve the application on `localhost:3000`.  

Included you'll find a simple page where a list of comments is displayed, together with an input to create a new comment.  

After adding a comment you can reply or delete it.  
Child comments will be displayed below.  

The application saves the information locallly with help of IndexedDB.  
This is done with the use of a helper library called IDB.  
The application also accepts comments from separate tabs. For this, it uses a `BroadcastChannel`.  
The application includes a simple vitest setup for unit tests.

There are some tradeoffs related to the data structure and organization.  
The main one is the decision to not keep an array of children for descendent comments, but instead to keep a simple pointer to the parent.  
There are a number of improvements that can be done, such as:  
- Adding E2E tests / integration tests
- Improving the styles

I focused on the main functionality and setup, but I'm happy to discuss possible improvements or different ways of tackling the challenge with the team.  

Thanks!
