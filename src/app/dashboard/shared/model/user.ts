export interface User {
  id: number;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  fullName: string;
  role: string;
}

export class User implements User {
  constructor(
    public id: number,
    public email: string,
    public emailConfirmed: boolean,
    public phoneNumber?: string,
    public phoneNumberConfirmed: boolean = false,
    public fullName: string = '',
    public role: string = ''
  ) {}
}
