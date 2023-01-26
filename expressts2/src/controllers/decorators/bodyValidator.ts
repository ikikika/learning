import "reflect-metadata";
import { MetadataKeys } from "./MetadataKeys";

export function bodyValidator(...keys: string[]) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
  };
}

// the ...keys is to handle cases where we do not know how many keys are to be passed in
// eg bodyValidator('email', 'password', 'name', 'etc')
