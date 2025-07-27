export interface Role {
  id: string;
  name: string;
}

export class Role implements Role {
  constructor(
    public id: string,
    public name: string
  ) {}
}
