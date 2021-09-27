# 1520-groupD-clicker
Cookie Clicker inspired idle game for cs1520

## Setting Up Git on Gcloud

First, create a Personal Access Token for this repo

[How to](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

Save your github user info via the command line

[Check the "Your Identity" section](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

Save it via GitHub CLI (already installed on the google VMs, skip step 1)

[How to](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git)

"git clone (repository link)" in the gcloud terminal to copy onto the VM.

Once git is set up, make sure you're on the branch you want to be on

[git branch management](https://stackoverflow.com/questions/42820840/how-to-push-changes-to-branch)

use "git checkout (branch name)" to switch branches

## Updating Local GCloud Repo to Reflect Github Changes
First, run these two commands:
"git checkout test"
"git pull"

This switches to and updates the local test branch, which should then be the most up to date stable version of everyone's changes

Then switch back to your personal branch
"git checkout (branch name)"

IF YOU HAVE NO LOCAL CHANGES YOU WANT TO KEEP

"git checkout test -- ./*"  

(Note that the above command doesn't create new folders if they don't exist, so if test has a folder your branch does, create an empty folder with the same name and run the command again)

IF YOU HAVE LOCAL CHANGES YOU WANT TO KEEP

"git merge test"

Above will merge the files from test into the current branch, but there may be some conflicts, which you will have to sort out yourself.
