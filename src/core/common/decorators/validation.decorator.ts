import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return typeof value === 'string' && passwordRegex.test(value);
        },
        defaultMessage() {
          return 'Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers, and special characters';
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'isUnique', async: false })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  validate() {
    // Esta é uma validação de exemplo. Na prática, você precisaria injetar um serviço para verificar a unicidade
    return true;
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueConstraint,
    });
  };
}
