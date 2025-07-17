import { Documentation } from ".";

export const doc_git: Documentation = {
	id: "git",
	name: "Git in TScript",
	title: "Git in TScript",
	content: `
    <p>
    <a href="https://git-scm.com" target="_blank">Git</a> is a powerful tool for version control and filesharing.
    Whenever multiple people work on one software project, a common problem is that a file can be
    edited by multiple people <i>at the same time</i>.
    </p>
    <p>
    Without Git, the team would have to decide in what order the changes should take effect.
    This can be especially tricky when two users work on the exact same line of code.
    With Git, changes can be tracked and tested individually (in different versions) before combining changes
    or (when working on the same line of code) deciding on which version to use.
    </p>
    <p>
    Another advantage of Git and the main purpose of the current TScript Git integration
    is the ability to save changes remotely (i.e on platforms such as GitHub or GitLab)
    so that the newest version can be downloaded and worked on anywhere.
    </p>
    <p>
    The following pages give a brief introduction to the Git implementation specifically for TScript.
    This implementation is very rudimentary and offers only the basics of the Git toolkit.
    The <a href="https://git-scm.com/docs" target="_blank">official Git documentation</a>
    offers much more in-depth information about Git.
    </p>
    `,
	children: [
		{
			id: "basics",
			name: "Git basics",
			title: "Git basics",
			content: `
            <p>
            In order to understand the following pages, one needs to understand the Git terminology first.
            </p>
            <p>
            A project in Git is called a repository (or repo for short). Changes that were made locally can be pushed ('uploaded')
            to or pulled ('donwloaded') from the remote repository.
            This requires that a copy from the remote repository already exists locally.
            If the project is not yet saved locally, the remote repository can be cloned ('copied') to the local file system.
            </p>
            `,
			children: [],
		},
		{
			id: "start",
			name: "Getting started",
			title: "Getting started with Git",
			content: `
            <p>
            In order to use Git with TScript, either a <a href="https://github.com" target="_blank">GitHub</a>
            or <a href="https://gitlab.ruhr-uni-bochum.de/" target="_blank">RUB GitLab</a> account
            must be linked to TScript.
            </p>
            <p>
            To link a GitHub or GitLab account, press the Git button in the toolbar. If no user is logged in,
            the Git dialog offers the choice to link either a GitHub or GitLab account.
            A new window will open with the respective platform's login page.
            After a successful login, TScript needs permission to access files in private repositories.
            When permission is given, the login page will redirect to the TScript IDE and the account is now linked.
            </p>
            <h3>Cloning</h3>
            <p>
            When opening the Git dialog again with a linked account, the dialog shows a dropdown menu and three buttons.
            All repositories that belong to the user who is currently logged in are listed in the dropdown menu.
            The list also shows if a repository is private (lock icon) or public (no lock icon).
            In addition to the user's repositories, there is also an option to clone a repository from a 3rd party using
            a GitHub or GitLab link ('Custom...').
            </p>
            <p>
            After selecting a remote repository from the dropdown menu (or providing a link to a 3rd party remote repository),
            the remote repository can be cloned into a TScript project by pressing the clone button. If the cloning is successful,
            the Git dialog closes and the file tree shows all folders and files from the repository.
            A file can be opened in the editor window by double clicking on the name in the file tree.
            </p>
            <h3>Pushing</h3>
            <p>
            Changes that were made in TScript can be pushed to the remote repository using the push button.
            Just make sure to save the edited file(s) using the control-s shortcut or the save button before pushing.
            </p>
            <div class="warning">
                Remote changes are discarded when pushing local changes, so make sure to pull from
                the remote repository before making new changes!
		    </div>
            <h3>Pulling</h3>
            <p>
            The TScript IDE will automatically detect if the current project is a valid Git repository.
            If it is valid, the clone button will change into the pull button. When pressing the pull button,
            the newest changes are pulled from the remote repository.
            </p>
            <div class="warning">
                Local changes are discarded when pulling remote changes, so make sure to push before
                pulling from the remote repository!
		    </div>
            `,
			children: [],
		},
	],
};
