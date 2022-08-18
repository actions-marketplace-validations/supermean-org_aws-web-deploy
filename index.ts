import { getInput, setFailed, saveState, debug } from '@actions/core';
import { CloudFrontClient, CreateInvalidationCommand, GetDistributionConfigCommand, UpdateDistributionCommand } from '@aws-sdk/client-cloudfront';

const mainFn = async (): Promise<void> => {
    const originPath = getInput('ORIGIN_PATH', { required: true });
    const awsAccessKeyId = getInput('AWS_KEY_ID', { required: true });
    const awsSecretAccessKey = getInput('AWS_SECRET', { required: true });
    const distributionId = getInput('AWS_DISTRIBUTION_ID', { required: true });
    const originPathIndex = parseInt(getInput('ORIGIN_PATH_INDEX') || '0');
    const awsRegion = getInput('AWS_REGION') || 'us-east-1';

    const errorList: string[] = [];
    if (!distributionId) {
        errorList.push('AWS_DISTRIBUTION_ID is required')
    }

    if (!originPath) {
        errorList.push('ORIGIN_PATH is required')
    }

    if (!awsAccessKeyId) {
        errorList.push('AWS_KEY_ID is required')
    }

    if (!awsSecretAccessKey) {
        errorList.push('AWS_SECRET is required')
    }

    if (errorList.length > 0) {
        throw new Error(errorList.join('\n'));
    }

    const client = new CloudFrontClient({
        region: awsRegion,
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey
        }
    });

    const getDistributionConfigCmd = new GetDistributionConfigCommand({ Id: distributionId });
    const { DistributionConfig, ETag } = await client.send(getDistributionConfigCmd);

    const currentOriginPath = DistributionConfig.Origins.Items[originPathIndex].OriginPath;
    debug(`Current OriginPath: ${currentOriginPath}`);
    DistributionConfig.Origins.Items[originPathIndex].OriginPath = originPath
    debug(`New OriginPath: ${originPath}`);

    debug(`Updating Distribution OriginPath of index ${originPathIndex}...`);
    const updateDistributionCmd = new UpdateDistributionCommand({
        DistributionConfig,
        Id: distributionId,
        IfMatch: ETag
    });

    const updateRes = await client.send(updateDistributionCmd);
    debug(`Update Distribution response statusCode: ${updateRes.$metadata.httpStatusCode}`);

    debug(`Requesting distribution invalidation...`);
    const createInvalidationCmd = new CreateInvalidationCommand({
        DistributionId: distributionId,
        InvalidationBatch: {
            CallerReference: new Date().toISOString(),
            Paths: {
                Items: ['/*'],
                Quantity: 1
            }
        }
    });

    const invalidationRes = await client.send(createInvalidationCmd);
    debug(`Invalidation response statusCode: ${invalidationRes.$metadata.httpStatusCode}`);
};

mainFn()
    .then(() => {
        console.log('Done...');
        saveState('done', 'done');
    })
    .catch((err: Error) => {
        console.error(err)
        setFailed(err)
    });