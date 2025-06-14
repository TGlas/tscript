import { Documentation } from ".";

export const doc_git: Documentation = {
    id: 'git',
    name: 'git in TScript',
    title: 'git in TScript',
    content: `
    <p>
    <a href="https://git-scm.com" target="_blank">git</a> is a powerful tool for version control and filesharing.
    Whenever multiple people work on one software project, a common problem is that a file can be
    edited by multiple people <i>at the same time</i>.
    </p>
    <p>
    Without git, the team would have to decide in what order the changes should take effect.
    This can be especially tricky when two users work on the exact same line of code.
    With git, changes can be tracked and even individually (in different versions) before combining changes
    or (when working on the same line of code) deciding on which version to use.
    </p>
    <p>
    Another advantage of git is the ability to save changes remotely (i.e on platforms such as GitHub or GitLab)
    so that the newest version can be downloaded and worked on anywhere.
    </p>
    <p>
    The following pages give a brief introduction to the git implementation specifically for TScript.
    This implementation is very rudimentary and offers only the basics of the git toolkit.
    The <a href="https://git-scm.com/docs" target="_blank">official git documentation</a>
    offers much more in-depth information about git.
    </p>
    `,
    children: [
        {
            id: "basics",
            name: "git basics",
            title: "git basics",
            content: `
            <p>
            In order to understand the following pages, one needs to understand the git terminology first.
            [TBD]
            </p>
            `,
            children: [],
        },
        {
            id: "start",
            name: "Getting started",
            title: "Getting started with git",
            content: `
            <p>
            In order to use git with TScript, either a <a href="https://github.com" target="_blank">GitHub</a>
            or <a href="https://gitlab.ruhr-uni-bochum.de/" target="_blank">RUB GitLab</a> account
            must be linked to TScript.
            </p>
            <p>
            To link a GitHub or GitLab account, press the git button in the toolbar. If no user is logged in,
            the git dialog offers the choice to link either a GitHub or GitLab account.
            A new window will open with the respective platform's login page.
            After a successful login, TScript needs permission to access files in private repositories.
            When permission is given, the login page will redirect to the TScript IDE and the account is now linked.
            </p>
            <p>
            When opening the git dialog again with a linked account [TBD]
            </p>
            `,
            children: [],
        },
    ],
};