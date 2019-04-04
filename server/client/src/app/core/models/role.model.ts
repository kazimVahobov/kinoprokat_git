export class RoleModel {
    _id: string;
    name: string;
    permissions: Permission[];
    typeOfRole: number;
}

export class Permission {
  value: number;
  groupName: string;
}
