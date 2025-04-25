import FS from "@isomorphic-git/lightning-fs";

export const projectsFS = new FS("projects");
export const projectsFSP = projectsFS.promises;
