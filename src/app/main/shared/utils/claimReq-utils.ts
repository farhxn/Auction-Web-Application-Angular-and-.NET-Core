export const claimReq = {
  adminOnly: (c: any) => c.role === 'Admin',
};
