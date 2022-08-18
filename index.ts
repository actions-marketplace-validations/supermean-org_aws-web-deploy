import { getInput, setFailed, setOutput, saveState } from '@actions/core';
import { getOctokit } from '@actions/github';
import { } from 'aws-sdk';

const mainFn = async (): Promise<void> => {
    const github_token = getInput('github_token', { required: true });
    const discord_webhook = getInput('discord_webhook');
    const gchat_webhook = getInput('gchat_webhook');
    const access = getInput('access');
    const octokit = getOctokit(github_token);

};

mainFn()
    .then(() => {
        console.log('Done...');
        setOutput()
    })
    .catch((err: Error) => {
        console.error(err)
        setFailed(err)
    });