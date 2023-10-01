---
title: Pushing Code to cPanel with Git
description: Simplify your development workflow by seamlessly pushing code directly from your local machine to cPanel using Git.
date: 2023-10-02T00:00:00.000Z
image: ./images/pushing-code-to-cpanel-with-git.png
skills:
  - cpanel
  - git
order: 1001
---

In the fast-paced realm of web development, effectively and efficiently deploying code is a common hurdle. Traditional methods of deployment, particularly with vanilla HTML, CSS, and JS, often involve manual processes, FTP transfers, and the potential for human errors. This can consume time, be prone to mistakes, and disrupt a smooth development workflow.

The traditional process of pushing code to cPanel using Git can be laborious. One challenge frequently encountered is integrating cPanel with online Git repositories like GitHub or GitLab. This requires additional SSH logins, managing credentials, and manually pulling changes. These obstacles often impede the seamless progress of projects.

In this article, we will explore a simple method to overcome these challenges and improve your development experience. I will guide you through the process of pushing your code directly to cPanel using Git, streamlining your workflow and optimizing your development journey.

### Prerequisites

To proceed, make sure you have SSH access to your cPanel account.

You should also have Git installed on your local machine.

### Step 1: Creating a Repository on cPanel

The first step is to create a Git repository on your cPanel account.

Log in to your cPanel account via SSH.

Create and navigate to the directory where you want to push your code. For example, let's say you want to push code to the `app` directory.

```bash
mkdir ~/app
cd ~/app
```

Initialize a new git repository using the following command.

```bash
git init --initial-branch=main
```

By default, pushing a branch to a non-bare Git repository in which the branch is currently checked out is not allowed. However, you can enable such a push by setting the `receive.denyCurrentBranch` option. For more detail [click here](https://gist.github.com/mendeza/eaeafb1c0e018ffd472bc8fae2a8462c).

```bash
git config receive.denyCurrentBranch updateInstead
```

### Step 2: Including cPanel Repository as a Remote

Next, you should include the cPanel Git repository as a remote in your local Git repository.

```bash
git remote add cpanel ssh://username@domain_name_or_ip:port/~/app
```

Make sure to replace `username`, `domain_name_or_ip`, and `port` with your own SSH credentials.

### Step 3: Pushing Code to cPanel

Now, you are ready to push your code to the cPanel repository.

```bash
git push cpanel main
```

This command will push the `main` branch of your local repository to the `main` branch of the cPanel repository. If you wish to push your local `master` branch instead, you can use the following command.

```bash
git push cpanel master:main
```

### Conclusion

Utilizing Git for code deployment can greatly improve your workflow, making the process more efficient and manageable. By following these instructions, you can effortlessly push your code to cPanel and ensure a seamless deployment process for your web projects. Happy deployment!
