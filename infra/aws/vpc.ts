// USD $ 0.09
export const vpc = new sst.aws.Vpc(`${$app.name}-vpc`, {
  bastion: true,
  nat: 'ec2',
});
