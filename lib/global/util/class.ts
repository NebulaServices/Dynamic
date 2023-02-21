export default function Class(obj: any) {
    try {
        return !Object.getOwnPropertyNames(obj).includes('arguments');
    } catch(e) {
        return false;
    }

    /*const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === 'class'
    if(obj.prototype === undefined) {
      return isCtorClass
    }
    const isPrototypeCtorClass = obj.prototype.constructor 
      && obj.prototype.constructor.toString
      && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isCtorClass || isPrototypeCtorClass*/
};