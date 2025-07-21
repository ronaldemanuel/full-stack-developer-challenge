export const email =
  process.env.EMAIL_PROVIDER === 'aws'
    ? new sst.aws.Email('MyEmail', {
        sender: process.env.EMAIL_FROM || '',
      })
    : null;
