export class CreateUserDto {
  fullName: string;
  email: string;
  role?: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN';
  password?: string;
  pin?: string;
  isActive?: boolean;
}
