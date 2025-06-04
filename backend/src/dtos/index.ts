// Here we are using Barrel Export Pattern to export all the DTOs from the "dto" folder at once.
export { default as CampaignDto } from './campaign.dto';
export { default as CreateUserDto } from './create-user.dto';
export { default as UpdateUserDto } from './update-user.dto';
export * from './user-pool.dto';
export * from './webhook.dto';
