<!-- @format -->

# Contributing to YouTube Downloader

First off, thank you for considering contributing to YouTube Downloader! It's people like you that make YouTube Downloader such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](https://github.com/yourusername/youtube-downloader/issues) page to see if someone else has already created a ticket. If not, go ahead and make one!

## Fork & create a branch

If this is something you think you can fix, then fork YouTube Downloader and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-japanese-translations
```

## Make your changes

Make your changes to the codebase. We follow these coding conventions:

1. Use ESLint and Prettier for code formatting
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

## Test your changes

Before submitting your changes, make sure to test them:

```sh
npm install
npm test
```

## Create a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with the main repository:

```sh
git remote add upstream git@github.com:yourusername/youtube-downloader.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-japanese-translations
git rebase master
git push --set-upstream origin 325-add-japanese-translations
```

Finally, go to GitHub and create a Pull Request.
